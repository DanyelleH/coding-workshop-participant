import json
from database import get_db
import hashlib

db = None

def get_database():
    global db
    if db is None:
        print("Connecting to DB...")
        db = get_db()
    return db

# ---------------- RESPONSE ----------------
def response(status, body):
    return {
        "statusCode": status,
        "headers": {
            "Content-Type": "application/json",
        },
        "body": json.dumps(body)
    }

# ---------------- HELPERS ----------------
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def extract_id(parts):
    """
    Safely extract ID from path.
    Avoid treating 'login' or 'register' as IDs.
    """
    if len(parts) < 2:
        return None

    last = parts[-1]

    if last in ["login", "register", "individuals", "api"]:
        return None

    return last

# ---------------- GET ----------------
def get_individuals():
    db = get_database()
    individuals = list(db.individuals.find())

    for ind in individuals:
        ind["_id"] = str(ind["_id"])

    return response(200, individuals)

def get_individual_by_id(individual_id):
    db = get_database()

    individual = db.individuals.find_one({"_id": individual_id})
    if not individual:
        return response(404, "Individual not found")

    individual["_id"] = str(individual["_id"])
    return response(200, individual)

# ---------------- CREATE ----------------
def create_individual(event):
    try:
        db = get_database()
        data = json.loads(event.get("body") or "{}")

        if not isinstance(data.get("_id"), str):
            return response(400, "Invalid _id")

        if not isinstance(data.get("name"), str):
            return response(400, "Invalid name")

        if not isinstance(data.get("email"), str):
            return response(400, "Invalid email")

        if db.individuals.find_one({"_id": data["_id"]}):
            return response(400, "Individual already exists")

        db.individuals.insert_one(data)
        return response(200, "Individual created")

    except Exception as e:
        print("CREATE ERROR:", str(e))
        return response(500, str(e))

# ---------------- UPDATE ----------------
def update_individual(event, individual_id):
    try:
        db = get_database()
        data = json.loads(event.get("body") or "{}")

        result = db.individuals.update_one(
            {"_id": individual_id},
            {"$set": data}
        )

        if result.matched_count == 0:
            return response(404, "Individual not found")

        return response(200, "Individual updated")

    except Exception as e:
        print("UPDATE ERROR:", str(e))
        return response(500, str(e))

# ---------------- DELETE ----------------
def delete_individual(individual_id):
    try:
        db = get_database()

        result = db.individuals.delete_one({"_id": individual_id})

        if result.deleted_count == 0:
            return response(404, "Individual not found")

        return response(200, "Individual deleted")

    except Exception as e:
        print("DELETE ERROR:", str(e))
        return response(500, str(e))

# ---------------- AUTH ----------------
def register_user(event):
    try:
        db = get_database()
        data = json.loads(event.get("body") or "{}")

        required = ["_id", "name", "email", "username", "password"]
        for field in required:
            if not isinstance(data.get(field), str):
                return response(400, f"Invalid or missing field: {field}")

        if db.individuals.find_one({"username": data["username"]}):
            return response(400, "User already exists")

        data["password"] = hash_password(data["password"])
        data["isLeader"] = False
        data["teamIds"] = []

        db.individuals.insert_one(data)

        return response(200, "User registered successfully")

    except Exception as e:
        print("REGISTER ERROR:", str(e))
        return response(500, str(e))

def login_user(event):
    try:
        db = get_database()
        data = json.loads(event.get("body") or "{}")

        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return response(400, "Missing username or password")

        user = db.individuals.find_one({"username": username})

        if not user:
            return response(401, "Invalid credentials")

        hashed_input = hash_password(password)

        # 🔥 Support both hashed + legacy plain passwords
        if user.get("password") != hashed_input and user.get("password") != password:
            return response(401, "Invalid credentials")

        user["_id"] = str(user["_id"])
        user.pop("password", None)

        return response(200, {
            "message": "Login successful",
            "user": user
        })

    except Exception as e:
        print("LOGIN ERROR:", str(e))
        return response(500, str(e))

# ---------------- HANDLER ----------------
def handler(event=None, context=None):
    print("EVENT:", event)

    try:
        method = event.get("requestContext", {}).get("http", {}).get("method", "").strip().upper()
        raw_path = event.get("rawPath", "")

        print("METHOD:", method)
        print("PATH:", raw_path)

        parts = raw_path.strip("/").split("/")
        last_part = parts[-1] if parts else ""

        # 🔥 AUTH ROUTES FIRST
        if method == "POST" and "register" in raw_path:
            return register_user(event)

        if method == "POST" and "login" in raw_path:
            return login_user(event)

        # 🔥 SAFE ID EXTRACTION
        individual_id = extract_id(parts)
        print("INDIVIDUAL_ID:", individual_id)

        if method == "GET" and individual_id:
            return get_individual_by_id(individual_id)

        elif method == "GET":
            return get_individuals()

        elif method == "POST":
            return create_individual(event)

        elif method == "PUT" and individual_id:
            return update_individual(event, individual_id)

        elif method == "DELETE" and individual_id:
            return delete_individual(individual_id)

        else:
            return response(400, {"message": "Invalid request"})

    except Exception as e:
        print("HANDLER ERROR:", str(e))
        return response(500, {"error": str(e)})

if __name__ == "__main__":
    print(handler())
import json
from database import get_db

# 🔥 Lazy DB initialization (important for Lambda performance)
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

# ---------------- GET ALL ----------------
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

        body = event.get("body") or "{}"
        data = json.loads(body)

        print("CREATE DATA:", data)

        # 🔥 Validation
        if not isinstance(data.get("_id"), str):
            return response(400, "Invalid _id")

        if not isinstance(data.get("name"), str):
            return response(400, "Invalid name")

        if not isinstance(data.get("email"), str):
            return response(400, "Invalid email")

        # Prevent duplicate
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

        body = event.get("body") or "{}"
        data = json.loads(body)

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

# ---------------- HANDLER ----------------
def handler(event=None, context=None):
    print("EVENT:", event)

    try:
        method = event.get("requestContext", {}).get("http", {}).get("method", "").strip().upper()
        print("METHOD:", method)

        raw_path = event.get("rawPath", "")
        print("PATH:", raw_path)

        parts = raw_path.strip("/").split("/")

        individual_id = None
        if len(parts) >= 3:
            individual_id = parts[2]

        print("INDIVIDUAL_ID:", individual_id)

        if method == "GET" and individual_id:
            result = get_individual_by_id(individual_id)

        elif method == "GET":
            result = get_individuals()

        elif method == "POST":
            result = create_individual(event)

        elif method == "PUT" and individual_id:
            result = update_individual(event, individual_id)

        elif method == "DELETE" and individual_id:
            result = delete_individual(individual_id)

        else:
            result = response(400, {"message": "Invalid request"})

        return {
            "statusCode": result["statusCode"],
            "headers": result["headers"],
            "body": result["body"]
        }

    except Exception as e:
        print("HANDLER ERROR:", str(e))
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": str(e)})
        
        }

if __name__ == "__main__":
    print(handler())
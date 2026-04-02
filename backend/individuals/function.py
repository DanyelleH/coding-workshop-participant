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
def update_individual(event):
    try:
        db = get_database()

        body = event.get("body") or "{}"
        data = json.loads(body)

        individual_id = data.get("_id")

        if not individual_id:
            return response(400, "Missing _id")

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
def delete_individual(event):
    try:
        db = get_database()

        body = event.get("body") or "{}"
        data = json.loads(body)

        individual_id = data.get("_id")

        if not individual_id:
            return response(400, "Missing _id")

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
        # ✅ Correct method extraction for Lambda URL
        method = event.get("requestContext", {}).get("http", {}).get("method", "").strip().upper()

        print("METHOD:", method)

        if method == "GET":
            result = get_individuals()

        elif method == "POST":
            result = create_individual(event)

        elif method == "PUT":
            result = update_individual(event)

        elif method == "DELETE":
            result = delete_individual(event)

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
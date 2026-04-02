import json
from database import get_db
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
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps(body)
    }

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
    db = get_database()
    data = json.loads(event.get("body") or "{}")

    if not data.get("name") or not data.get("email"):
        return response(400, "Missing required fields")

    # Optional: prevent duplicates
    if db.individuals.find_one({"_id": data.get("_id")}):
        return response(400, "Individual already exists")

    db.individuals.insert_one(data)
    return response(200, "Individual created")

# ---------------- UPDATE ----------------
def update_individual(event, individual_id):
    db = get_database()
    data = json.loads(event.get("body") or "{}")

    result = db.individuals.update_one(
        {"_id": individual_id},
        {"$set": data}
    )

    if result.matched_count == 0:
        return response(404, "Individual not found")

    return response(200, "Individual updated")

# ---------------- DELETE ----------------
def delete_individual(individual_id):
    db = get_database()
    result = db.individuals.delete_one({"_id": individual_id})

    if result.deleted_count == 0:
        return response(404, "Individual not found")

    return response(200, "Individual deleted")

# ---------------- HANDLER ----------------
def handler(event=None, context=None):
    try:
        method = event.get("httpMethod")
        path = event.get("pathParameters") or {}
        individual_id = path.get("id")

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

        # 🔥 ENSURE FORMAT MATCHES EXACTLY
        return {
            "statusCode": result["statusCode"],
            "headers": result["headers"],
            "body": result["body"]
        }

    except Exception as e:
        print("ERROR:", str(e))
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": str(e)})
        }

# def handler(event=None, context=None):
#     return {
#         "statusCode": 200,
#         "body": "Lambda is working"
    # }
if __name__ == "__main__":
    print(handler())

import json
from urllib import response
from ..database import get_db
db= get_db()

def get_individuals():
    individuals = list(db.individuals.find({}, {"_id": 0}))
    return response(200, individuals)

def get_individual_by_id(individual_id):
    individual = db.individuals.find_one({"_id": individual_id}, {"_id": 0})

    if not individual:
        return response(404, "Individual not found")

    return response(200, individual)

def create_individual(event):
    data = json.loads(event["body"])

    # basic validation
    if not data.get("name") or not data.get("email"):
        return response(400, "Missing required fields")

    db.individuals.insert_one(data)

    return response(200, "Individual created")

def update_individual(event, individual_id):
    data = json.loads(event["body"])

    result = db.individuals.update_one(
        {"_id": individual_id},
        {"$set": data}
    )

    if result.matched_count == 0:
        return response(404, "Individual not found")

    return response(200, "Individual updated")

def delete_individual(individual_id):
    result = db.individuals.delete_one({"_id": individual_id})

    if result.deleted_count == 0:
        return response(404, "Individual not found")

    return response(200, "Individual deleted")

def handler(event = None, context = None):
    """
    AWS Lambda Hello World.
    """
    method = event["httpMethod"]
    path = event.get("pathParameters")
    individual_id = path.get("id") if path else None

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
        return response(400, "Invalid request")

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"message": "Hello, World!"}),
    }

if __name__ == "__main__":
    print(handler())

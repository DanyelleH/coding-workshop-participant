import json
from http import HTTPstatus
from urllib import response
from ..database import get_db

db = get_db()

def handler(event = None, context = None):
    """
    AWS Lambda Hello World.
    """
    method = event["httpMethod"]
    path = event.get("pathParameters")

    if method == "GET":
        def get_all():
            teams = list(db.teams.find({}, {"_id": 0}))
            return response(200, teams)
        return get_all()
    
    elif method == "POST":
        def create(event):
            
            data = json.loads(event["body"])

            # Business rule: max 6 members
            if len(data["members"]) > 6:
                return response(400, "Team cannot exceed 6 members")

            db.teams.insert_one(data)

            return response(200, "Team created")
        return create(event)

    elif method == "PUT":
        def update(event, path):
            team_id = path["id"]
            data = json.loads(event["body"])

            db.teams.update_one(
                {"_id": team_id},
                {"$set": data}
            )

            return response(200, "Updated")
        return update(event, path)

    elif method == "DELETE":
        def delete(path):
            team_id = path["id"]

            db.teams.delete_one({"_id": team_id})

            return response(200, "Deleted")
        return delete(path)

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"message": "Hello, World!"}),
    }

if __name__ == "__main__":
    print(handler())

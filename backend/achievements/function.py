import json
import os
from http import HTTPStatus
from urllib import response
from ..database import get_db
db = get_db()
# GET ALL
def get_achievements():
    data = list(db.achievements.find({}, {"_id": 0}))
    return response(200, data)

# GET ONE
def get_achievement_by_id(achievement_id):
    ach = db.achievements.find_one({"_id": achievement_id}, {"_id": 0})

    if not ach:
        return response(404, "Achievement not found")

    return response(200, ach)

# GET BY TEAM
def get_achievements_by_team(team_id):
    data = list(db.achievements.find({"teamId": team_id}, {"_id": 0}))
    return response(200, data)
#Update achievement
def update_achievement(event, path):
    achievement_id = path["id"]
    data = json.loads(event["body"])

    result = db.achievements.update_one(
        {"_id": achievement_id},
        {"$set": data}
    )

    if result.matched_count == 0:
        return response(404, "Achievement not found")

    return response(200, "Achievement updated")
# CREATE
def create_achievement(event):
    data = json.loads(event["body"])

    # Basic validation
    required = ["_id", "name", "teamId"]
    for field in required:
        if field not in data:
            return response(400, f"Missing field: {field}")

    # Ensure team exists (business rule)
    team = db.teams.find_one({"_id": data["teamId"]})
    if not team:
        return response(400, "Invalid teamId")

    # Prevent duplicate
    existing = db.achievements.find_one({"_id": data["_id"]})
    if existing:
        return response(400, "Achievement already exists")

    db.achievements.insert_one(data)

    return response(200, "Achievement created")

# DELETE
def delete_achievement(achievement_id):
    db = get_db()

    result = db.achievements.delete_one({"_id": achievement_id})

    if result.deleted_count == 0:
        return response(404, "Achievement not found")

    return response(200, "Achievement deleted")

def handler(event = None, context = None):
    """
    AWS Lambda Hello World.
    """
    method = event["httpMethod"]
    path = event.get("pathParameters")

    if method == "GET" and path and "id" in path:
        return get_achievement_by_id(path["id"])

    elif method == "GET":
        return get_achievements()

    elif method == "POST":
        return create_achievement(event)

    elif method == "PUT" and path and "id" in path:
        return update_achievement(event, path)

    elif method == "DELETE" and path and "id" in path:
        return delete_achievement(path["id"])

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"message": "Hello, World!"}),
    }

if __name__ == "__main__":
    print(handler())

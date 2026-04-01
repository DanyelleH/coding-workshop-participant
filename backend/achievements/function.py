import json
from ..database import get_db

db = get_db()

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
def get_achievements():
    data = list(db.achievements.find())
    for ach in data:
        ach["_id"] = str(ach["_id"])
    return response(200, data)

def get_achievement_by_id(achievement_id):
    ach = db.achievements.find_one({"_id": achievement_id})

    if not ach:
        return response(404, "Achievement not found")

    ach["_id"] = str(ach["_id"])
    return response(200, ach)

def get_achievements_by_team(team_id):
    data = list(db.achievements.find({"teamId": team_id}))
    for ach in data:
        ach["_id"] = str(ach["_id"])
    return response(200, data)

# ---------------- CREATE ----------------
def create_achievement(event):
    data = json.loads(event.get("body") or "{}")

    required = ["_id", "name", "teamId"]
    for field in required:
        if field not in data:
            return response(400, f"Missing field: {field}")

    # Validate team exists
    team = db.teams.find_one({"_id": data["teamId"]})
    if not team:
        return response(400, "Invalid teamId")

    # Prevent duplicate
    if db.achievements.find_one({"_id": data["_id"]}):
        return response(400, "Achievement already exists")

    db.achievements.insert_one(data)
    return response(200, "Achievement created")

# ---------------- UPDATE ----------------
def update_achievement(event, achievement_id):
    data = json.loads(event.get("body") or "{}")

    result = db.achievements.update_one(
        {"_id": achievement_id},
        {"$set": data}
    )

    if result.matched_count == 0:
        return response(404, "Achievement not found")

    return response(200, "Achievement updated")

# ---------------- DELETE ----------------
def delete_achievement(achievement_id):
    result = db.achievements.delete_one({"_id": achievement_id})

    if result.deleted_count == 0:
        return response(404, "Achievement not found")

    return response(200, "Achievement deleted")

# ---------------- HANDLER ----------------
def handler(event=None, context=None):
    try:
        method = event.get("httpMethod")
        path = event.get("pathParameters") or {}

        achievement_id = path.get("id")
        team_id = path.get("teamId")  # 👈 for /team/{teamId}

        # GET by team
        if method == "GET" and team_id:
            return get_achievements_by_team(team_id)

        # GET by id
        elif method == "GET" and achievement_id:
            return get_achievement_by_id(achievement_id)

        # GET all
        elif method == "GET":
            return get_achievements()

        elif method == "POST":
            return create_achievement(event)

        elif method == "PUT" and achievement_id:
            return update_achievement(event, achievement_id)

        elif method == "DELETE" and achievement_id:
            return delete_achievement(achievement_id)

        return response(400, {
            "error": "Invalid request",
            "method": method,
            "id": achievement_id,
            "teamId": team_id
        })

    except Exception as e:
        print("ERROR:", str(e))
        return response(500, str(e))
if __name__ == "__main__":
    print(handler())

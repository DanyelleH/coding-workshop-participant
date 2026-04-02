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
def get_achievements():
    db = get_database()

    data = list(db.achievements.find())
    for ach in data:
        ach["_id"] = str(ach["_id"])
    return response(200, data)

def get_achievement_by_id(achievement_id):
    db = get_database()

    ach = db.achievements.find_one({"_id": achievement_id})

    if not ach:
        return response(404, "Achievement not found")

    ach["_id"] = str(ach["_id"])
    return response(200, ach)

def get_achievements_by_team(team_id):
    db = get_database()
    data = list(db.achievements.find({"teamId": team_id}))
    for ach in data:
        ach["_id"] = str(ach["_id"])
    return response(200, data)

# ---------------- CREATE ----------------
def create_achievement(event):
    db = get_database()
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
    db = get_database()
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
    db = get_database()

    result = db.achievements.delete_one({"_id": achievement_id})

    if result.deleted_count == 0:
        return response(404, "Achievement not found")

    return response(200, "Achievement deleted")

def handler(event=None, context=None):
    try:
        method = event.get("httpMethod")
        path = event.get("pathParameters") or {}

        achievement_id = path.get("id")
        team_id = path.get("teamId")

        if method == "GET" and team_id:
            result = get_achievements_by_team(team_id)

        elif method == "GET" and achievement_id:
            result = get_achievement_by_id(achievement_id)

        elif method == "GET":
            result = get_achievements()

        elif method == "POST":
            result = create_achievement(event)

        elif method == "PUT" and achievement_id:
            result = update_achievement(event, achievement_id)

        elif method == "DELETE" and achievement_id:
            result = delete_achievement(achievement_id)

        else:
            result = response(400, {"message": "Invalid request"})

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
#     }


if __name__ == "__main__":
    print(handler())

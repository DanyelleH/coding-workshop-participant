import json
from database import get_db

# 🔥 Lazy DB init
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

# ---------------- GET ALL ----------------
def get_achievements():
    db = get_database()

    data = list(db.achievements.find())
    for ach in data:
        ach["_id"] = str(ach["_id"])

    return response(200, data)

# ---------------- GET BY ID ----------------
def get_achievement_by_id(achievement_id):
    db = get_database()

    ach = db.achievements.find_one({"_id": achievement_id})

    if not ach:
        return response(404, "Achievement not found")

    ach["_id"] = str(ach["_id"])
    return response(200, ach)

# ---------------- GET BY TEAM ----------------
def get_achievements_by_team(team_id):
    db = get_database()

    results = list(db.achievements.find({"teamId": team_id}))

    for ach in results:
        ach["_id"] = str(ach["_id"])

    return response(200, results)

# ---------------- CREATE ----------------
def create_achievement(event):
    try:
        db = get_database()

        body = event.get("body") or "{}"
        data = json.loads(body)

        print("CREATE DATA:", data)

        required = ["_id", "name", "teamId"]
        for field in required:
            if not isinstance(data.get(field), str):
                return response(400, f"Invalid or missing field: {field}")

        # Validate team exists
        if not db.teams.find_one({"_id": data["teamId"]}):
            return response(400, "Invalid teamId")

        # Prevent duplicate
        if db.achievements.find_one({"_id": data["_id"]}):
            return response(400, "Achievement already exists")

        db.achievements.insert_one(data)

        return response(200, "Achievement created")

    except Exception as e:
        print("CREATE ERROR:", str(e))
        return response(500, str(e))

# ---------------- UPDATE ----------------
def update_achievement(event, achievement_id):
    try:
        db = get_database()

        body = event.get("body") or "{}"
        data = json.loads(body)

        result = db.achievements.update_one(
            {"_id": achievement_id},
            {"$set": data}
        )

        if result.matched_count == 0:
            return response(404, "Achievement not found")

        return response(200, "Achievement updated")

    except Exception as e:
        print("UPDATE ERROR:", str(e))
        return response(500, str(e))

# ---------------- DELETE ----------------
def delete_achievement(achievement_id):
    try:
        db = get_database()

        result = db.achievements.delete_one({"_id": achievement_id})

        if result.deleted_count == 0:
            return response(404, "Achievement not found")

        return response(200, "Achievement deleted")

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

        # /api/achievements
        # /api/achievements/{id}
        # /api/achievements/team/{teamId}

        achievement_id = None
        team_id = None

        if len(parts) >= 3:
            if parts[2] == "team" and len(parts) >= 4:
                team_id = parts[3]
            else:
                achievement_id = parts[2]

        print("ACHIEVEMENT_ID:", achievement_id)
        print("TEAM_ID:", team_id)

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
        print("HANDLER ERROR:", str(e))
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": str(e)})
        }

if __name__ == "__main__":
    print(handler())
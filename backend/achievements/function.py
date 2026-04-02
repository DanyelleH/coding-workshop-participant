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
            "Content-Type": "application/json"
            
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

# ---------------- GET BY TEAM (via body) ----------------
def get_achievements_by_team(event):
    db = get_database()

    body = event.get("body") or "{}"
    data = json.loads(body)

    team_id = data.get("teamId")

    if not team_id:
        return response(400, "Missing teamId")

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

        # 🔥 Validation
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
def update_achievement(event):
    try:
        db = get_database()

        body = event.get("body") or "{}"
        data = json.loads(body)

        achievement_id = data.get("_id")

        if not achievement_id:
            return response(400, "Missing _id")

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
def delete_achievement(event):
    try:
        db = get_database()

        body = event.get("body") or "{}"
        data = json.loads(body)

        achievement_id = data.get("_id")

        if not achievement_id:
            return response(400, "Missing _id")

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

        if method == "GET":
            result = get_achievements()

        elif method == "POST":
            result = create_achievement(event)

        elif method == "PUT":
            result = update_achievement(event)

        elif method == "DELETE":
            result = delete_achievement(event)

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
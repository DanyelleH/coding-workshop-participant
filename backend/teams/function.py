import json
from database import get_db
db = None

def get_database():
    global db
    if db is None:
        print("Connecting to DB...") 
        db = get_db()
    return db

def response(status, body):
    return {
        "statusCode": status,
        "headers": {
            "Content-Type": "application/json",
            
        },
        "body": json.dumps(body)
    }
def get_teams():
    db = get_database()

    teams = list(db.teams.find())
    for team in teams:
        team["_id"] = str(team["_id"])
    return response(200, teams)

def get_team_by_id(team_id):
    db = get_database()
    team = db.teams.find_one({"_id": team_id})
    if not team:
        return response(404, "Team not found")
    team["_id"] = str(team["_id"])
    return response(200, team)

def create_team(event):
    try:
        body = event.get("body") or "{}"
        data = json.loads(body)

        print("PARSED DATA:", data)

        if not isinstance(data.get("_id"), str):
            return response(400, "Invalid _id")

        if not isinstance(data.get("name"), str):
            return response(400, "Invalid name")

        if len(data.get("members", [])) > 6:
            return response(400, "Team cannot exceed 6 members")

        db = get_database()
        db.teams.insert_one(data)

        return response(200, "Team created")

    except Exception as e:
        print("ERROR:", str(e))
        return response(500, str(e))


def update_team(event, team_id):
    db = get_database()
    data = json.loads(event.get("body") or "{}")

    # Business rule: max 6 members
    if len(data.get("members", [])) > 6:
        return response(400, "Team cannot exceed 6 members")

    result = db.teams.update_one(
        {"_id": team_id},
        {"$set": data}
    )

    if result.matched_count == 0:
        return response(404, "Team not found")

    return response(200, "Team updated")

def delete_team(team_id):
    db = get_database()
    result = db.teams.delete_one({"_id": team_id})
    if result.deleted_count == 0:
        return response(404, "Team not found")
    return response(200, "Team deleted")


def handler(event=None, context=None):
    try:
        print("EVENT:", event)

        method = event.get("requestContext", {}).get("http", {}).get("method", "").strip().upper()
        print("METHOD:", method)

        if method == "GET":
            result = get_teams()

        elif method == "POST":
            result = create_team(event)

        elif method == "PUT":
            return {
                "statusCode": 400,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"message": "PUT not supported yet"})
            }

        elif method == "DELETE":
            return {
                "statusCode": 400,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"message": "DELETE not supported yet"})
            }

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

if __name__ == "__main__":
    print(handler())

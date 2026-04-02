import os
from pymongo import MongoClient

def get_db():
    is_local = os.getenv("IS_LOCAL") == "true"

    
    host = os.getenv("MONGO_HOST")
    port = int(os.getenv("MONGO_PORT", "27017"))
    user = os.getenv("MONGO_USER")
    password = os.getenv("MONGO_PASS")
    db_name = os.getenv("MONGO_NAME") or "team_management"
    print("ENV CHECK:", host, port, user, password, db_name)
    if is_local:
        client = MongoClient(host, port)
    else:
        client = MongoClient(
            host=host,
            port=port,
            username=user,
            password=password,
            tls=True,
            tlsAllowInvalidCertificates=True,
            retryWrites=False
        )

    return client[db_name]
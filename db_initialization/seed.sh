#!/bin/bash

BASE_URL="https://d1tljgsmgz06fs.cloudfront.net"

echo "Seeding Individuals..."

jq -c '.[]' individuals.json | while read item; do
  curl -s -X POST "$BASE_URL/api/individuals" \
    -H "Content-Type: application/json" \
    -d "$item"
  echo ""
done

echo "Seeding Teams..."

jq -c '.[]' teams.json | while read item; do
  curl -s -X POST "$BASE_URL/api/teams" \
    -H "Content-Type: application/json" \
    -d "$item"
  echo ""
done

echo "Seeding Achievements..."

jq -c '.[]' achievements.json | while read item; do
  curl -s -X POST "$BASE_URL/api/achievements" \
    -H "Content-Type: application/json" \
    -d "$item"
  echo ""
done

echo "Seeding complete!"
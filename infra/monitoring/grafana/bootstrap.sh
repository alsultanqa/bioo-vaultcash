#!/usr/bin/env bash
# Bootstrap Grafana Teams & Permissions
# Requires: GRAFANA_URL, GRAFANA_TOKEN

set -euo pipefail
: "${GRAFANA_URL:?set GRAFANA_URL}"
: "${GRAFANA_TOKEN:?set GRAFANA_TOKEN}"

hdr=(-H "Authorization: Bearer ${GRAFANA_TOKEN}" -H "Content-Type: application/json")

# Create Teams
ONCALL_ID=$(curl -s "${hdr[@]}" -X POST "${GRAFANA_URL}/api/teams" -d '{"name":"Oncall","email":"oncall@example.com"}' | jq -r '.teamId')
FINOPS_ID=$(curl -s "${hdr[@]}" -X POST "${GRAFANA_URL}/api/teams" -d '{"name":"FinOps","email":"finops@example.com"}' | jq -r '.teamId')

# Create folder and set permissions
FOLDER=$(curl -s "${hdr[@]}" -X POST "${GRAFANA_URL}/api/folders" -d '{"uid":"qc","title":"QatarCash"}')
FOLDER_UID=$(echo "$FOLDER" | jq -r '.uid')
FOLDER_ID=$(echo "$FOLDER" | jq -r '.id')

# Oncall: Admin on folder; FinOps: Viewer
curl -s "${hdr[@]}" -X POST "${GRAFANA_URL}/api/folders/${FOLDER_UID}/permissions" -d @- <<JSON
{
  "items": [
    {"teamId": ${ONCALL_ID}, "permission": 4},  // Admin
    {"teamId": ${FINOPS_ID}, "permission": 1}   // View
  ]
}
JSON

echo "Grafana bootstrap complete. Folder ID: ${FOLDER_ID}, Oncall Team: ${ONCALL_ID}, FinOps Team: ${FINOPS_ID}"

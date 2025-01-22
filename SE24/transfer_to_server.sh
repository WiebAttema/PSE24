#!/bin/bash
# This file sends al the files required for production to the remote server. It 
# does required ssh to work, in other words the remote server needs to know 
# your public key.

# If using another server these need to be changed.
FRONTEND_DIR="./frontend"
SERVER="ubuntu@3.89.128.140"
SERVER_PATH="/home/ubuntu/server/"

# Build frontend.
cd "${FRONTEND_DIR}" || { echo "Failed to change directory to ${FRONTEND_DIR}"; exit 1; }
npm ci || { echo "npm ci failed"; exit 1; }
npm run build || { echo "npm run build failed"; exit 1; }
cd - || { echo "Failed to change back to original directory"; exit 1; }

# Ensure that the paths exist.
ssh ${SERVER} "mkdir -p ${SERVER_PATH}frontend ${REMOTE_PATH}backend ${REMOTE_PATH}instance"

# Copy the required files to the server. This could be done in a single 
# command, but this way is simpler.
rsync -avz  \
    ./frontend/nginx.conf \
    ./frontend/build \
    ./frontend/Dockerfile \
    ${SERVER}:${SERVER_PATH}frontend/
rsync -avz --exclude '__pycache__' --exclude 'db_init.py' \
    ./backend \
    ./compose.yaml \
    ./instance \
    ${SERVER}:${SERVER_PATH}

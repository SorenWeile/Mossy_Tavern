#!/bin/sh
set -eu

: "${OLLAMA_URL:=http://localhost:11434}"
: "${SD_URL:=http://localhost:7860}"
export OLLAMA_URL SD_URL

envsubst '${OLLAMA_URL} ${SD_URL}' < /docker/config.js.template > /usr/share/nginx/html/config.js

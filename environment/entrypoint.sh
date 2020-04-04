#!/usr/bin/env sh

node /var/task/delayed-dns-server.js &
node /var/task/delayed-response-header.js &
node /var/task/delayed-response-body.js &

wait

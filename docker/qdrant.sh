#!/bin/bash

# Get the local IP address of the container (assuming it's on eth0)
CONTAINER_IP=$(hostname -I | awk '{print $1}')

export QDRANT__SERVICE__HOST=${CONTAINER_IP}

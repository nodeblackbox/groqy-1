#!/bin/bash

cd /app
pip install virtualenv
virtualenv env
chmod +x env/bin/activate
source ./env/bin/activate
pip install --no-cache-dir -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
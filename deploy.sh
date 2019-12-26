#!/bin/sh

echo "Compressing..."
zip -rq amazonComprehendDemo ./* -x deploy.sh

echo "Deploying..."
aws lambda update-function-code \
    --function-name amazonComprehendDemo \
    --zip-file fileb://amazonComprehendDemo.zip

rm amazonComprehendDemo.zip

echo "Finished!"
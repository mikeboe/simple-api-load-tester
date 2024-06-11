#!/bin/bash

# database migration
npm run migration:push

# start the api
node dist/src/app.js
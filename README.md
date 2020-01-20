# Tristan's App server

![Info Pages Preview](/docs/preview.png)

This project uses docker. To run the server with a database run `docker-compose up tristans-app-server-stage`

## Set up Environment

Make sure you have Node.js installed

Clone the repo (or pull)

Navigate to the repo folder and run

	$ npm install

Duplicate and edit `src/conf/env.sample.ts` into the dev and production files

Download a API tester like postman / swagger

Download the editor config plugin for your associated IDE to sync with the settings located in `.editorconfig`

Read everything in /docs (we are **not** using the graphql implementation)

We are using Trello to manage tasks

## Before Pushing

1. Update all relevant documentation in the JSDoc strings
2. Make sure it works and builds without failing lol
3. run `npm run lint` to check if code is clean
4. run `npm run test` to check if jasmine tests pass

## Misc

When we deploy Tristan want's to use [CloudCraft](https://cloudcraft.co/) to design the AWS servers

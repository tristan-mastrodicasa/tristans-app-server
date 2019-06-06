# Meme App server

## Set up Environment

Make sure you have Node.js installed

Clone the repo (or pull)

Navigate to the repo folder and run

	$ npm install

Download a API tester like postman / swagger

Read everything in /docs

## Before Pushing

1. Update all relevant documentation in the JSDoc strings
2. Make sure it works and builds without failing lol
3. run `npm run lint` to check if code is clean
4. run `npm run test` to check if jasmine tests pass

## Folder Structure

* `docs` Are where we store extra documentation
* `spec` Testing configuration etc
* `src` All the source for the project
* `src/databse` Database specific files
* `src/models` Model's for the data to be stored
* `src/routes` Where all the controllers for the different routes live
* `src/util` Helper functions for the entire server
* `src/server.js` Root server file

Front-end repo: https://github.com/ghostcoder217/meme-app/

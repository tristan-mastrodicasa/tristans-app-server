# Rest API structure + Notes

For all post that resulted in a creation, use a HTTP 201 status code and include a 
Location header that points to the URL of the new resource.

Research User creation

Consider rate limiting every endpoint

Document: A single resource
Collection: A collection of resources
Controller: An action which affects multiple resources (like methods of a class)

GET  /canvases/:id -> Document: Get a canvas
POST /canvases/:id/star -> Controller: "Star" a canvas
POST /canvases/:id/remove-star -> Controller: Remove your "Star" from a canvas if you made one
POST /canvases -> Create a canvas

GET  /canvases/:id/memes ?results ?page -> Collection: Get list of memes for a specific canvas
POST /canvases/:id/memes -> Create a meme

GET  /users/:id -> Document: Get a user
GET  /users/:id/settings -> Document: Settings for a user
PUT  /users/:id/settings -> Update settings for a user
PUT  /users/:id -> Update a user

POST /users/:id/follow -> Controller: Follow a specific user
POST /users/:id/unfollow -> Controller: Unfollow a specific user

GET  /users ?query ?recommended ?results ?page -> Collection: List of users from the database

GET  /users/:id/daily-suggestions ?page ?results -> Controller: Daily recommended content based on network + history

GET  /users/:id/followers ?page ?results -> Collection: Get users following you
GET  /users/:id/following ?page ?results -> Collection: Get users you are following
GET  /users/:id/follow-backs ?page ?results -> Collection: Get users who follow you back

GET  /users/:id/content-cards -> Collection: Recent memes and Canvases

GET  /auth/google -> Controller: Start the google authentication process (web)
POST /auth/google-authcode -> Controller: Create a new user / find existing user -> return access token

GET  /images/canvas/:file -> Document: Image for canvas

## API DOC EXAMPLE

/**
 * @api {post} /authentication/login/ Collect an access token for a registered user
 * @apiName Login
 * @apiGroup Authentication
 *
 * @apiParam {String} access_token The access token for the users Facebook
 *
 * @apiSuccess {String} jwtToken Access token for protected routes
 *
 * @apiError (HTTP Error Codes) 400 Missing Facebook Access Token
 * @apiError (HTTP Error Codes) 404 Facebook ID is not found in the database
 * @apiError (HTTP Error Codes) 500 Communication with facebook servers sucks
 */

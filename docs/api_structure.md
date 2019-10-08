# Rest API structure + Notes

For all post that resulted in a creation, use a HTTP 201 status code and include a 
Location header that points to the URL of the new resource.

Research User creation

Consider rate limiting every endpoint

Document: A single resource
Collection: A collection of resources
Controller: An action which affects multiple resources (like methods of a class)

DELETE /canvas/:id -> Delete canvas
GET  /canvas/:id -> Document: Get a canvas
POST /canvas/:id/star -> Controller: "Star" a canvas
DELETE /canvas/:id/star -> Controller: Remove your "Star" from a canvas if you made one
POST /canvas -> Create a canvas

GET  /canvas/:id/memes ?results ?page -> Collection: Get list of memes for a specific canvas

POST /meme ?canvas_id -> Create a meme
DELETE /meme/:id -> Delete a meme

GET  /user/:id -> Document: Get a user
GET  /user/:id/settings -> Document: Settings for a user
PUT  /user/:id/settings -> Update settings for a user
PUT  /user/:id -> Update a user

POST /user/:id/follow -> Controller: Follow a specific user
POST /user/:id/unfollow -> Controller: Unfollow a specific user

GET  /user ?query ?recommended ?results ?page -> Collection: List of users from the database

GET  /user/:id/daily-suggestions ?page ?results -> Controller: Daily recommended content based on network + history

GET  /user/:id/followers ?page ?results -> Collection: Get users following you
GET  /user/:id/following ?page ?results -> Collection: Get users you are following
GET  /user/:id/follow-backs ?page ?results -> Collection: Get users who follow you back

GET  /user/:id/content-cards -> Collection: Recent memes and Canvases

GET  /auth/google -> Controller: Start the google authentication process (web)
POST /auth/google-authcode -> Controller: Create a new user / find existing user -> return access token

GET  /images/canvas/:file -> Document: Image for canvas

## Pagination

* Enable local pagination with caching, refresh local cache on "refresh" / certain hooks,
* batch of 75 memes for canvas,
* 100 canvases for home,
* all non expired content for users
 
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


/search/users      params query userNetwork?           Data: UserItem[]

/users/:id         params                              Data: UserItem
/users/:id/network params category? results? page?     Data: UserItem[]


/profiles/:id                                          Data: Profile


/content           params target userId results? page? Data: ContentCard[]

/canvases/:id                                          Data: ContentCard[]
/canvases/:id/memes  params results? page?             Data: ContentCard[]

/meme/:id                                              Data: ContentCard[]

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

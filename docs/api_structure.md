
/search/users      params query userNetwork?           Data: UserItem[]

/users/:id         params                              Data: UserItem
/users/:id/network params category? results? page?     Data: UserItem[]


/profiles/:id                                          Data: Profile


/content           params target userId results? page? Data: ContentCard[]

/canvases/:id                                          Data: ContentCard[]
/canvases/:id/memes  params results? page?             Data: ContentCard[]

/meme/:id                                              Data: ContentCard[]

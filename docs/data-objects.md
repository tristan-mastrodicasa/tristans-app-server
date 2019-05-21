# Data Objects

## Users

	user: {
		uid: int,
		fbid: null | string,
		username: string(20),
		first_name: string(20),
		photo_id: int
	}

## Profile Photos

	profile_photos: {
		photo_id: int,
		image_path: string
	}

## User Statistics

	user_stats: {
		uid: int,
		influence: int,
		followers: {
			number: int,
			users: <int>[] // Id's of the users
		},
		following: {
			number: int,
			users: <int>[] // Id's of the users 
		},
		posts: int
	}

## Canvases

	canvases: {
		cid: int, // canvas id (should be a hash (will be used for link))
		uid: int, // User id of host
		
		description: string,
		image_path: string,
		public: boolean, // Is the canvas editable by the public
		invited_users: {
			type: enum(FOLLOW_BACK, FOLLOWERS, SPECIFIC),
			users: <int>[] // ID's of invited users (only if invited_users.type == SPECIFIC)
		}
		points: int,
		utc_time: int, // Time published
		
		head_meme: null | mid,
		active: boolean // Can this canvas still be modified?
	}

## Memes

	memes: {
		mid: int, // id of meme
		cid: int, // id of canvas
		uid: int, // Uid of user
		
		meme_type: enum(), // Select from a specific list of meme types
		data: {}, // Data to render the meme
		points: int,
		utc_time: int // Time published
	}

## User Activity

	user_activity: {
		uid: int,
		id: null | int, // Id of user / canvas / meme
		type: enum(USER, CANVAS, MEME), // Type of entity the user is taking action on (Examples)
		action: enum(UPVOTE, FOLLOW, LOGIN), // The action the user is taking (Examples)
	}

## User Settings

	account_settings: {
		// If it's just FB that is connected then this is the first app with no account settings
	}

	notification_settings: {
		uid: int,
		notification: {
			type: enum(),
			disabled: boolean
		},
		native_app_installed: boolean
	}


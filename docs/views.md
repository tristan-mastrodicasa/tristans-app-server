# Views

The app will consist of a collection of "views", each view will have a corresponding server file which will be dedicated to providing the view with information.

These server files may be accessed by a single access point in the server (a main index.js file which handles all requests using provided query parameters).

Current views include

* _Home_ - Feed of the best content on the website, optimized for the specific user
* _Login_ - Sign into the service using Instagram or Facebook
* _Signup_ - Sign up to the service using Instagram or Facebook
* _Meme Canvas Index_ - A feed of the best meme canvases for users to manipulate
* _Profile_ - A view to display a public or your own profile
* _Meme Focus_ - A view to display finalized meme's or add captions (effects) to new ones
* _Profile Edit_ - A view to edit your profile (mainly image and username)
* _Account Edit_ - A view to edit your account and notification settings
* _Network-Followers_ - A view to list all followers of a user
* _Network-Following_ - A view to list all of the individuals a user is following
* _Notifications_ - A view to list all of the notifications a user has received
* _Find Users_ - A search feature to find friends through Facebook and Instagram
* _Media Upload_ - An important view handling all of the media uploads for meme canvases

### Data Transfers

Rough idea of what data would be sent between the views and server

#### Home

_Uploads_

	{
		new-card-request: true,
		last-card-id: 34118961
	}

_Downloads_

	{
		meme-cards: [
			"Meme cards"
		]
	}


#### Login

_Uploads_

	{
		login-api-requested: "instagram"
	}
	
_Downloads_

	{
		login-successful: true,
		user-id: 123525,
		security-token: FA4320D9BC9293
	}

#### Sign Up

_Uploads_

	{
		username: "ghoststeam217",
		first-name: "Tristan",
		image: "file://bruhhhh.how.doIworkthisfile.upload"
	}
	
_Downloads_

	{
		signup-successful: false,
		error: {
			type: "File upload",
			message: "Bruh seriously? You uploaded a link?"
		}
	}
	
e.t.c

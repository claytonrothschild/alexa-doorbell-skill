# alexa-doorbell
Ask Amazon Echo who is at the door.

<h1>Usage:</h1>
Request: "Alexa, ask doorbell who is at the door?"
Potential responses: 
(Match found) "Your friend Nick is at the front door."
(No match) "A man wearing a red polo that says "HOA" is standing at your door with a clipboard."

<h1>How it works:</h1>
When Alexa receives an intent, she initiates a photo using your front door's security camera.
The photo is uploaded to a server.
The server uses Facebook's facial image recognition software to determine if the person is on your friends list, and who the person is.
If no match is found, the image is sent to CloudSight, where the image is described within 30 seconds by a human.
Alexa tells you who is at the door.

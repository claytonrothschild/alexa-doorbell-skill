# alexa-doorbell
Ask Amazon Echo who is at the door. Uses Facebook Facial Recognition Graph API and Nest Security Camera API.

<h1>Usage:</h1>
Request: "Alexa, ask doorbell who is at the door?"<br />
Potential responses: <br />
(Match found) "Your friend Nick is at the front door."<br />
(No match) "A man wearing a red polo that says "HOA" is standing at your door with a clipboard."<br />

<h1>How it works:</h1>
When Alexa receives an intent, she initiates a photo using your front door's security camera.<br />
The photo is uploaded to a server.<br />
The server uses Facebook's facial image recognition software to determine if the person is on your friends list, and who the person is.<br />
If no match is found, the image is sent to CloudSight, where the image is described within 30 seconds by a human.<br />
Alexa tells you who is at the door.<br />

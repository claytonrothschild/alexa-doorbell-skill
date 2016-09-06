/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * App ID for the skill
 */
var APP_ID = undefined;//replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

var http = require('http');

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * AlexaDoorbell is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var AlexaDoorbell = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
AlexaDoorbell.prototype = Object.create(AlexaSkill.prototype);
AlexaDoorbell.prototype.constructor = AlexaDoorbell;

// ----------------------- Override AlexaSkill request and intent handlers -----------------------

AlexaDoorbell.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

AlexaDoorbell.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleWelcomeRequest(response);
};

AlexaDoorbell.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

/**
 * override intentHandlers to map intent handling functions.
 */
AlexaDoorbell.prototype.intentHandlers = {
    "RecognizeIntent": function (intent, session, response) {
        handleRecognizeRequest(intent, session, response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        handleHelpRequest(response);
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

// -------------------------- AlexaDoorbell Domain Specific Business Logic --------------------------

function handleHelpRequest(response) {
    var repromptText = "Go ahead, ask me.";
    var speechOutput = "Simply say, Who is at the front door. And I will tell you."

    response.ask(speechOutput, repromptText);
}

function handleRecognizeRequest(intent, session, response) {

    //Take photo
    var photoUrl = takePhoto();
    //Upload photo to server for processing
    makePhotoRequest(photoUrl, function photoRequestCallback(err, photoResponse){
        var speechOutput;

        if (err) {
            speechOutput = "Sorry, we had a problem processing the image."
        } else {
            if (photoResponse.match){
                speechOutput = photoResponse.text;
            } else {
                speechOutput = "I dont recognize this person. The description is:" + photoResponse.text;
            }
        }

        response.tellWithCard(speechOutput, "AlexaDoorbell", speechOutput);
    });
}

function takePhoto(){
    //TODO
    var photoUrl = "localhost\\frontDoor" + dateTime.getUtcDate + ".jpg";
    return photoUrl;
}


function makePhotoRequest(photoUrl, photoResponseCallback) {

    var endpoint = 'http://localhost/api/recognize'; //TODO
    var queryString = '?' + photoUrl;
    
    http.get(endpoint + queryString, function (res) {
        var photoResponseString = '';
        console.log('Status Code: ' + res.statusCode);

        if (res.statusCode != 200) {
            photoResponseCallback(new Error("Non 200 Response"));
        }

        res.on('data', function (data) {
            photoResponseString += data;
        });

        res.on('end', function () {
            var photoResponseObject = JSON.parse(photoResponseString);

            if (photoResponseObject.error) {
                console.log("error: " + photoResponseObj.error.message);
                photoResponseCallback(new Error(photoResponseObj.error.message));
            } else {
                photoResponseCallback(null, photoResponseObject.text);
            }
        });
    }).on('error', function (e) {
        console.log("Communications error: " + e.message);
        photoResponseCallback(new Error(e.message));
    });
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    var alexaDoorbell = new AlexaDoorbell();
    alexaDoorbell.execute(event, context);
};
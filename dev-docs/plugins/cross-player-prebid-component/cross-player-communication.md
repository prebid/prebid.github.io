---
layout: page_v2
title: Communication Between Prebid Component and Player
description: Communication between the Cross Player Prebid Component and the Player
top_nav_section: dev_docs
nav_section: plugins
---

# Communication Between Cross Player Prebid Component and Player

{:.no_toc}

The [Cross-Player Prebid Component]({{site.baseurl}}/dev-docs/plugins/cross-player-prebid-component/about-cross-player-prebid-component.html) communicates with the publisher's player using `window.postMessage` as supported by all browsers. The message can be initiated either by the Component or by the Player.

The following rules apply for this communication:

- If the Component is loaded within the same document where the Player is located, either in the header or in the body of the document, the publisher's code has to invoke ‘**postMessage**’ on the Player’s window.
  - Example:  `window.postMessage ('hello', '*');`
- If the Component is loaded in the header of a document that is different from the document where the Player is loaded (for example, in an IFrame), then the publisher's code must invoke the  '**postMessage**' on the '**top**' window.
  - Example:  `top.postMessage ('hello', '*');`
- The publisher's code must listen for a response via '**postMessage**' on the Player's window.
  - Example: `window.addEventLIstener('message', listenerHandler);`

## Message Content

The communication between the Component and the Player uses two messages, one from the Player to request the Prebid results and the other from the Component to respond to the request.

### Player Request for Prebid Results

This message is sent by the Player to request the prebid results from Prebid Component. The message should be constructed as a JSON object with the following fields:

- **command** - Value MUST be `PPCP:prebidUrlRequest`.
- **messageId** - Integer to uniquely identify each request.

The message should be converted to a String using **JSON.stringify** before passing it into the **postMessage**.

### Prebid Component Response

This message is sent by the Component to the Player in response to the Player's request for Prebid results. The message should be constructed as a JSON object with the following fields:

- **command** - Value MUST be `PPCP:prebidResponse`.
- **messageId** - Integer to uniquely identify each request; this value will match the **messageId** of the request message.
- **url** - Value will be a String containing one of the following values:
  - a URL to VAST XML (Prebid successfully selected an ad to play).
  - **'unknown'** - The Prebid process is still pending.
  - **'failed'** - The Prebid process did not return an ad.

The message should be converted to a String using **JSON.stringify** before passing it into the **postMessage**.

### Communication Steps

NOTE: These steps assume that the Component is being loaded in the header and the Player is loaded in an IFrame.

#### Step 1

- **Who:** Prebid Component
- **What:** Adds a listener on the window within the document where it is running
- **Comments:** The Component is listening for the following **command** in a **postMessage**: `PPCP:prebidUrlRequest`.
  Filter the messages looking for this **command** inside the `requestHandler`.

##### Sample Request Handler

```javascript
window.addEventListener('message', requestHandler);
```

Request Handler Sample Code

```javascript
// the component code is written in ES6 Javascript
this.requestHandler = (event) => {
    if (event && event.data) {
        let data;
        try {
            data = JSON.parse(event.data);
        }
        catch (err) {
            // Invalid message data. Ignore it.
            return;
        }
        const frameWnd = event.source;
        // internal function used to send back the response
        const sendResponse = (url) => {
            // send response to source window (iframe)
            Logger.log(this._prefix, 'Post url:', url);
            const response = {
                command: 'PPCP:prebidResponse',
                messageId: data.messageId,
                url: url
            };

            const sendingData = JSON.stringify(response);
            frameWnd.postMessage(sendingData, '*');
        };
        // sync request
        if (data.command === 'PPCP:prebidUrlRequest') {
            if (this.defaultUrl) {
              // we have ad URL to play
                sendResponse(this.defaultUrl);
            }
            else if (this.defaultUrl === null) {
              // failed to get ad URL
                sendResponse('failed');
            }
            else {
              // prebid.js is not ready (not loaded yet)
                sendResponse('unknown');
            }
        }
    }
};
```

#### Step 2

- **Who:** Player
- **What:** Adds a listener on the player window, looking for a message that contains a response from the Component.
- **Comments:** The Player is listening for the following **command** in a **postMessage**: `PPCP:prebidResponse`.
  Filter the messages looking for this **command** inside the `responseHandler`.

##### Sample Response Handler

```javascript
window.addEventListener('message', responseHandler);
```

#### Step 3

- **Who:** Player
- **What:** Sends a **postMessage** to the top window when it is ready for the results of the Prebid process.
- **Comments:** The Player posts a message with the following command: `PPCP:prebidUrlRequest` to request Prebid results from the Component.

##### Sample Code for `PPCP:prebidUrlRequest`

NOTE: The `*` argument indicates post the message to any domain.

```javascript
const msg = {};

msg.command = 'PPCP:prebidUrlRequest';
msg.messageId = 1234;

top.postMessage(JSON.stringify(msg), '*');
```

#### Step 4

- **Who:** Prebid Component
- **What:** The Component will post a response message back to the Player's IFrame, sending the current status of the Prebid process.

  If the Component posts the message, indicating that it does not yet know the results, the Player should be prepared to request the results again.
- **Comments:** When the Component receives a `PPCP:prebidUrlRequest` message, it will post a response message back to the Player’s IFrame, sending the current status of the Prebid process. The URL field of the response will indicate what the Component knows at that time about the Prebid process. Possible values:
  - **unknown**: Prebid results are not yet ready.
  - **failed**: Prebid returned NO ad.
  - **VAST XML**: Prebid has returned back the URL to the XML of the selected ad.

##### Sample Code `PPCP:prebidResponse`

NOTE: The `*` argument indicates post the message to any domain.

```javascript
var msg = {};

msg.command = 'PPCP:prebidResponse';
msg.messageId = 1234;
msg.url = 'http://url-to-vast.xml'

top.postMessage(JSON.stringify(msg), '*');
```

#### Step 5

- **Who:** Player
- **What:** Once the Component has received the Prebid results using the listener for response message, the Player should do one of the following:
  - Render the winning ad (if the results were valid).
  - Skip the ad and start the video content (if Prebid returned a failed response).
  - Send another request for Prebid results (if the results are still unknown to the Component).
- **Comments:** The Player posts a message with the following command: `PPCP:prebidUrlRequest` to request Prebid results from the Component.
  - Once the Player receives a message it should parse the `event.data` in the listener handler using JSON.parse. If `event.data` includes the `event.data.command` `'PPCP:prebidResponse'`, it should examine `event.data.url` and `event.data.messageId`.
  - It should make sure that the `messageId` matches the `messageId` that it used in the request for Prebid response.
  - If the `event.data.url` field contains a valid URL, the Player should use that URL to retrieve the ad to play.
  - If `event.data.url` contains the value `failed`, then Prebid.js was unable to find an ad and, as a result, the Player should continue with its normal content.
  - If `event.data.url` contains the value `unknown`, then the Player should send out another request for the Prebid results after waiting a brief period of time.

##### Sample Code Response Handler (Step 5)

```javascript
var lastMessageId = 12345;

var responseHandler = function(event) {
    if (event && event.data) {
        var data = JSON.parse(event.data);
        if (data.command === ‘PPCP:prebidResponse’ && data.messageId === lastMessageId) {
            if (data.url === ‘unknown’) {
                // the prebid process is still pending
                setTimeout(function () {
                    // request url
                    // ...
                }, 100);
            }
            else if (data.url === ‘failed’) {
                // the prebid process did not return an ad
                // continue main content
                // ...
            }
            else if (typeof data.url === ‘string’ && data.url.length > 0) {
                // prebid successfully selected an ad to play
                // play ad
                // ...
            }
        }
    }
};
```

## Further Reading

- [About the Cross Player Prebid Component]({{site.baseurl}}/dev-docs/plugins/cross-player-prebid-component/about-cross-player-prebid-component.html)
- [Cross Player Prebid Component API]({{site.baseurl}}/dev-docs/plugins/cross-player-prebid-component/cross-player-api.html)
- [Cross Player Prebid Component Configuration]({{site.baseurl}}/dev-docs/plugins/cross-player-prebid-component/cross-player-config.html)
- [Download Cross-Player Prebid Component](https://github.com/prebid/cross-player-prebid-component)

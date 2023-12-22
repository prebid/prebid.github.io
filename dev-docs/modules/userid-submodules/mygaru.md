---
layout: userid
title: MyGaru ID
description: MyGaru User ID sub-module
useridmodule: mygaruIdSystem
---

MyGaru provides single use tokens as a UserId for SSPs and DSP that consume telecom DMP data.

## MyGaru ID Configuration

First, add the AMX ID module to your Prebid.js build:

```shell
gulp build --modules=userId,myGaruIdSystem
```

Then configure the MyGaru id submodule in your `userSync` configuration:

Params configuration is not required.
Mygaru id system is asynchronous and in order to get ids for initial ad auctions you need to add an `auctionDelay` param to your `userSync` config.

```javascript
pbjs.setConfig({
    userSync: {
        auctionDelay: 100,
        userIds: [{
            name: 'mygaru',
        }]
    }
});
```

This will add a `userId.mygaru` property to all bidRequests:

```javascript
{
    mygaru: 'vatfS0UEgXShEqYuQy0lpzWl7rSuKeNs0U8C8841KoYbFUiyvTpS'
}
```

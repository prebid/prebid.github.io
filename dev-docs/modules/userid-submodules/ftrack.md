---
layout: userid
title: FTrack ID from Flashtalking By Mediaocean
description: FTrack ID from Flashtalking By Mediaocean User ID sub-module
useridmodule: ftrackIdSystem
---


The FTrack Identity Framework (["FTrack"](https://www.flashtalking.com/identity-framework#FTrack)) User ID Module allows publishers to take advantage of Flashtalking's FTrack ID during the bidding process.

Flashtalking’s cookieless tracking technology uses probabilistic device recognition to derive a privacy-friendly persistent ID for each device.

Questions? Comments? Bugs? Praise? Please contact FlashTalking's Prebid Support at [prebid-support@flashtalking.com](mailto:prebid-support@flashtalking.com)

Complete information available on the Flashtalking [privacy policy page](https://www.flashtalking.com/privacypolicy).

## FTrack ID from Flashtalking By Mediaocean Configuration

```javascript
pbjs.setConfig({
  userSync: {
    userIds: [{
      name: 'FTrack',
      params: {
        url: 'https://d9.flashtalking.com/d9core', // required, if not populated ftrack will not run
        ids: {
          'device id': true,
          'single device id': true,
          'household id': true
        }
      },
      storage: {
        type: 'html5',           // "html5" is the required storage type
        name: 'FTrackId',        // "FTrackId" is the required storage name
        expires: 90,             // storage lasts for 90 days
        refreshInSeconds: 8*3600 // refresh ID every 8 hours to ensure it's fresh
      }
    }],
    auctionDelay: 50             // 50ms maximum auction delay, applies to all userId modules
  }
});
```

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| :-- | :-- | :-- | :-- | :-- |
| name | Required | String | The name of this module: `"FTrack"` | `"FTrack"` |
| params | Required | Object | The IDs available, if not populated then the defaults "Device ID" and "Single Device ID" will be returned | |
| params.url | Required | String | The URL for the ftrack library reference. If not populated, ftrack will not run. | '<https://d9.flashtalking.com/d9core>' |
| params.ids | Optional | Object | The ftrack IDs available, if not populated then the defaults "Device ID" and "Single Device ID" will be returned | |
| params.ids['device id'] | Optional | Boolean | Should ftrack return "device id". Set to `true` to return it. If set to `undefined` or `false`, ftrack will not return "device id". Default is `false` | `true` |
| params.ids['single device id'] | Optional | Boolean | Should ftrack return "single device id". Set to `true` to return it. If set to `undefined` or `false`, ftrack will not return "single device id". Default is `false` | `true` |
| params.ids['household id'] | Optional; _Requires pairing with either "device id" or "single device id"_ | Boolean | __1.__ Should ftrack return "household id". Set to `true` to attempt to return it. If set to `undefined` or `false`, ftrack will not return "household id". Default is `false`.  __2.__ _This will only return "household id" if value of this field is `true` __AND__ "household id" is defined on the device._ __3.__ _"household id" requires either "device id" or "single device id" to be also set to `true`, otherwise ftrack will not return "household id"._ | `true` |
| storage | Required | Object | Storage settings for how the User ID module will cache the FTrack ID locally | |
| storage.type | Required | String | This is where the results of the user ID will be stored. FTrack __requires__ `"html5"`. | `"html5"` |
| storage.name | Required | String | The name of the local storage where the user ID will be stored. FTrack __requires__ `"FTrackId"`. | `"FTrackId"` |
| storage.expires | Optional | Integer | How long (in days) the user ID information will be stored. FTrack recommends `90`. | `90` |
| storage.refreshInSeconds | Optional | Integer | How many seconds until the FTrack ID will be refreshed. FTrack strongly recommends 8 hours between refreshes | `8*3600` |

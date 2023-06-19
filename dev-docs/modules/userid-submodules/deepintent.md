---
layout: userid
title: Deepintent
description: Deepintent User ID sub-module
useridmodule: deepintentIdSystem
---


The DeepIntent Healthcare Marketing Platform is the first and only DSP that combines real-world health data, premium partnerships, and custom integrations to reach patients and providers across any device.  DeepIntent empowers publishers to maximize their inventory, collaborate and transact directly with advertisers, and grow their business in a safe, controlled, transparent, and privacy-compliant way. Our publisher partners sell inventory on every channel via real-time bidding or conducting one-to-one trading with hundreds of the country’s leading healthcare brands and agencies.

DeepIntent’s DPES ID is a shared user identifier built for healthcare marketers and publishers integrated within DeepIntent’s Healthcare Marketplace. The DPES ID lets users protect and manage their privacy throughout the advertising value chain. User data written and associated with the DPES ID is not stored on DeepIntent’s servers. Instead, this data is stored in a decentralized way on a user’s browser. Users can still opt out of the ads by navigating to https://option.deepintent.com/adchoices

## Deepintent DPES ID Registration

DPES ID is free to use and requires a simple registration with DeepIntent. Please reach out to DeepIntent’s Publisher Development team at prebid@deepintent.com to learn more and get started. Once a publisher registers with DeepIntent’s platform, DeepIntent will provide a simple code snippet to be integrated with the publisher’s website. This code snippet will capture and store information per the publisher’s end user agreement. The DPES User ID module uses the DPES ID by passing it within the DeepIntent Prebid adapter.

## Deepintent DPES ID Configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module: `"deepintentId"` | `"deepintentId"` |
| storage | Required | Object | Storage settings for how the User Id module will cache the Deepintent ID locally | |
| storage.type | Required | String | This is where the results of the user ID will be stored. Deepintent`"html5"` or `"cookie"`. | `"html5"` |
| storage.name | Optional | String | The name of the local storage where the user ID will be stored. Deepintent | `"_dpes_id"` |
| storage.expires | Optional | Integer | How long (in days) the user ID information will be stored. Deepintent recommends `90`. | `90` |

## Deepintent DPES ID Examples

1) Publisher stores the hashed identity from healthcare identity in cookie
```javascript
pbjs.setConfig({
  userSync: {
    userIds: [{
      name: 'deepintentId',
      storage: {
        type: 'cookie',           // "html5" is the required storage type option is "html5"
        name: '_dpes_id',
        expires: 90             // storage lasts for 90 days, optional if storage type is html5
      }
    }],
    auctionDelay: 50             // 50ms maximum auction delay, applies to all userId modules
  }
});
```

2) Publisher stores the hashed identity from healthcare identity in localstorage
```javascript
pbjs.setConfig({
  userSync: {
    userIds: [{
      name: 'deepintentId',
      storage: {
        type: 'html5'           // "html5" is the required storage type option is "html5"
        name: '_dpes_id'
      }
    }],
    auctionDelay: 50             // 50ms maximum auction delay, applies to all userId modules
  }
});
```

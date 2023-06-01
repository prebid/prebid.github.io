---
layout: page_v2
page_type: module
title: Module - Publisher Common ID
description: User ID persisted in first party domain
module_code : pubCommonId
display_name : Publisher Common ID (deprecated)
enable_download : true
sidebarType : 1
---



# Publisher Common ID Module
{:.no_toc}

This module stores a unique user id in the first party domain and makes it accessible to all adapters. Similar to IDFA and AAID, this is a simple UUID that can be utilized to improve user matching, especially for iOS and MacOS browsers, and is compatible with ITP (Intelligent Tracking Prevention). It's lightweight and self contained.  Adapters that support Publisher Common ID will be able to pick up the user ID and return it for additional server-side cross device tracking.

## Page integration

Simply include the module in your build and it's automatically enabled.  Adapters that support this feature will be able to retrieve the ID and incorporate it in their requests.

### Optional configuration

Add a pubcid object in the setConfig() call.

{: .table .table-bordered .table-striped }
| Param | Type | Description | Example |
| --- | --- | --- | --- |
| enable | `boolean` | Enable or disable the module. Setting it to false will disable the module without having to remove it from the bundle.  Default is true. | true |
| expInterval | `decimal` | Expiration interval of the id in minutes.  Default is 525600, or 1 years.  | 525600 |
| type | `string` | Type of storage.  By default, the id is stored both as a cookie and in localStorage.  It's possible to choose just one or the other by setting either 'cookie' or 'html5'.  | 'cookie' |

Example: Changing ID expiration to 1 year

```javascript
     var pbjs = pbjs || {};
     pbjs.que = pbjs.que || [];
     pbjs.que.push(function() {
        pbjs.setConfig({pubcid: {expInterval: 525600}});
        pbjs.addAdUnits(adUnits);
     });
```

### User Opt-Out

Users must be allowed to opt out of targeted advertising. When implementing this module, you are required to place a link in your privacy policy or elsewhere on your website which allows the user to implement this opt-out. User opt-out is supported by setting the `_pubcid_optout` as a cookie in the publisher’s domain, or in local storage. When this flag is set, then Publisher Common ID is neither read nor updated, and it will not be made available to any adapters. The opt-out must also delete the Publisher Common ID value.

* Opt-In - `_pubcid_optout` flag is not present or set to 0
* Opt-Out - `_pubcid_optout` flag is set to 1


### Build the package
 
#### Step 1: Bundle the module code

Follow the basic build instructions on the GitHub repo's main README. To include the module, an additional option must be added to the the gulp build command:
 
```
gulp build --modules=pubCommonId,bidAdapter1,bidAdapter2
```
 
#### Step 2: Publish the package(s) to the CDN

After testing, get your javascript file(s) out to your Content Delivery Network (CDN) as normal.

Note that there are more dynamic ways of combining these components for publishers or integrators ready to build a more advanced infrastructure.

## Adapter integration

Adapters should look for `bid.crumbs.pubcid` in buildRequests() method. 

```javascript
[
   {
      "bidder":"appnexus",
      "params":{
         "placement":"12345"
      },
      "crumbs":{
         "pubcid":"c4a4c843-2368-4b5e-b3b1-6ee4702b9ad6"
      },
      "adUnitCode":"ad-unit-code",
      "transactionId":"b7d0a99d-ceb0-419e-bbd7-6767ab038d9d",
      "sizes":[[300, 250], [300,600]],
      "bidId":"222187f1ef97e6",
      "bidderRequestId":"12088b9bd86f26",
      "auctionId":"a1a98ab2-97c9-4f42-970e-6e03040559f2"
   }
]
```


## Technical Details

- The ID is UUID v4 and stored as a cookie and a local storage item called `_pubcid` in the page's domain.
- This module hooks into the pbjs.requestBids() method.  When invoked, it retrieves the id from cookie and local storage, updates the expiration time, and decorates the adUnits objects.  A new id will be created if one doesn't exist already.  
- The id stored as cookie takes precedence over local storage.
- Beware that if prebid.js is included in an ad server frame, then the ID would have ad server domain instead.



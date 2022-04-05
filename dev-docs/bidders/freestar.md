---
layout: bidder
title: Freestar
description: Prebid Freestar Bidder Adaptor
biddercode: freestar
hide: true
pbjs: true
media_types: banner
gdpr_supported: true
usp_supported: true
schain_supported: true
prebid_member: true
---

**Table of Contents**

- [Bid params](#freestar-bid-params)
- [Banner Ads](#freestar-banner)
- [Configuration](#freestar-configuration)

<a name="freestar-bid-params" />

### Bid params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example |
|------+-------+-------------+---------|
| `tagId` | required | The tag ID from Freestar. | `"test-pb-leaderboard"` |
| `siteId` | optional | Override the global Freestar site ID, [see here](#freestar-configuration). Please reach out to your Freestar Account Manager for more details. | `"example.com"` |
| `floor` | optional | The minumum CPM (in USD) requred to participate | `0.25` |
| `keywords` | optional | Publisher-defined key-value string pairs | `{ "key1": "val1", "key2": "val2" }` |

<a name="freestar-banner" />

### Banner Ads

Freestar supports the banner features described in:

- [The `adUnit` banner documentation](/dev-docs/adunit-reference.html#adUnit-banner-example)
- [Getting Started for Developers](/dev-docs/getting-started.html)


<a name="freestar-configuration" />

### Configuration

The Freestar site ID should be set globally in order to improve user sync. How to do so:

``` javascript
pbjs.setConfig({
   freestar: {
     siteId: "example.com"
   }
});
```

The Freestar adapter has the ability to initiate user-sync requests that will improve DSP user ID match rate,
with the aim of generating higher bid prices. By default, Freestar sync requests are off. Setting the Freestar site ID globally as described above is required for user-sync requests.

``` javascript
pbjs.setConfig({
   userSync: {
    enabledBidders: ['freestar'],
    iframeEnabled: true
 }});
```

Note: these configs should be combined with any other UserSync config calls, as subsequent calls to setConfig for the same attribute overwrite each other.

Note: enabled in Prebid 7 +. 

---
layout: bidder
title: Sortable
description: Prebid Sortable Bidder Adaptor
biddercode: sortable
pbjs: true
media_types: banner, native, video
gdpr_supported: true
usp_supported: true
schain_supported: true
prebid_member: true
gvl_id: 145
getFloor: true
userIds: all
---

**Table of Contents**

- [Bid params](#sortable-bid-params)
- [Banner Ads](#sortable-banner)
- [Configuration](#sortable-configuration)

<a name="sortable-bid-params" />

### Bid params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example |
|------+-------+-------------+---------|
| `tagId` | required | The tag ID from Sortable. | `"test-pb-leaderboard"` |
| `siteId` | optional | Override the global Sortable site ID, [see here](#sortable-configuration). Please reach out to your Sortable Account Manager for more details. | `"example.com"` |
| `floor` | optional | The minumum CPM (in USD) requred to participate | `0.25` |
| `keywords` | optional | Publisher-defined key-value string pairs | `{ "key1": "val1", "key2": "val2" }` |

<a name="sortable-banner" />

### Banner Ads

Sortable supports the banner features described in:

- [The `adUnit` banner documentation](/dev-docs/adunit-reference.html#adUnit-banner-example)
- [Getting Started for Developers](/dev-docs/getting-started.html)


<a name="sortable-configuration" />

### Configuration

The Sortable site ID should be set globally in order to improve user sync. How to do so:

``` javascript
pbjs.setConfig({
   sortable: {
     siteId: "example.com"
   }
});
```

The Sortable adapter has the ability to initiate user-sync requests that will improve DSP user ID match rate,
with the aim of generating higher bid prices. By default, Sortable sync requests are off. Setting the Sortable site ID globally as described above is required for user-sync requests.

``` javascript
pbjs.setConfig({
   userSync: {
    enabledBidders: ['sortable'],
    iframeEnabled: true
 }});
```

Note: these configs should be combined with any other UserSync config calls, as subsequent calls to setConfig for the same attribute overwrite each other.

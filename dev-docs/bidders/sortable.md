---
layout: bidder
title: Sortable
description: Prebid Sortable Bidder Adaptor
top_nav_section: dev_docs
nav_section: reference
biddercode: sortable
biddercode_longer_than_12: false
hide: true
prebid_1_0_supported : true
media_types: banner
gdpr_supported: true
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
| `siteId` | required | The site ID from Sortable. To blanket set the site ID, [see here](#sortable-configuration). Please reach out to your Sortable Account Manager for more details. | `1` or `"example.com"` |
| `keywords` | optional | Publisher-defined key-value string pairs | `{ "key1": "val1", "key2": "val2" }` |

<a name="sortable-banner" />

### Banner Ads

Sortable supports the banner features described in:

- [The `adUnit` banner documentation]({{site.baseurl}}/dev-docs/adunit-reference.html#adUnit-banner-example)
- [Getting Started for Developers]({{site.baseurl}}/dev-docs/getting-started.html)


<a name="sortable-configuration" />

### Configuration

If the Sortable site ID is set globally, `siteId` is not required as a bid param. How to do so:

```javascript
$$PREBID_GLOBAL$$.setConfig({
   sortableId: "example.com"
 }});
 ```

The Sortable adapter has the ability to initiate user-sync requests that will improve DSP user ID match rate,
with the aim of generating higher bid prices. By default, Sortable sync requests are off. Setting the Sortable site ID globally as described above is required for user-sync requests. 

```javascript
$$PREBID_GLOBAL$$.setConfig({
   userSync: {
    enabledBidders: ['sortable'],
    iframeEnabled: true
 }});
```

Note: these configs should be combined with any other UserSync config calls, as subsequent calls to setConfig for the same attribute overwrite each other.

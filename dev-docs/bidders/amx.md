---
layout: bidder
title: AMX RTB
description: AMX RTB Bid Adapter
hide: true
schain_supported: true
tcfeu_supported: true
floors_supported: true
usp_supported: true
coppa_supported: true
userIds: all
biddercode: amx
safeframes_ok: true
media_types: banner, video
pbjs: true
pbs: false
fpd_supported: true
gpp_supported: true
multiformat_supported: true
ortb_blocking_supported: true
gvl_id: 737
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|-------------|----------|-----------------------------------------------------------------|---------------------------------|----------|
| `tagId` | required | Tag ID | `'cHJlYmlkLm9yZw'` | `string` |
| `testMode` | optional | Activate 100% fill ads | `true` | `boolean`|
| `adUnitId` | optional | Ad Unit ID used in reporting. Will default to `bid.adUnitCode` | `'sticky_banner'` | `string` |

### Bidder Settings

The AMX RTB bid adapter uses local storage. Please add `storageAllowed` in your bidder settings.

{% include dev-docs/storageAllowed.md %}

```js
// https://docs.prebid.org/dev-docs/publisher-api-reference/bidderSettings.html
pbjs.bidderSettings = {
  amx: {
    storageAllowed: true,
  },
};
```

### Test Parameters

To enable 100% fill test ads, you can use the following `params`:

```javascript
{
  testMode: true,
  tagId: "cHJlYmlkLm9yZw"
}
```

This will produce a bid at $10 with a test creative.

Note that the `tagId` is case-sensitive. Do not use `cHJlYmlkLm9yZw` in production environments: this ID is for testing only.

### First Party Data

From Prebid.js >= 4.30, publishers can use the `ortb2` configuration parameter to provide First Party Data. We accept all standard OpenRTB fields for both:

- `ortb2.site`
- `ortb2.user`

Note that all fields are optional. For contextual data (e.g. categories), standard IAB taxonomies are supported. We do not support passing first party data via bid parameters.

#### Example - Setting ortb2.site and ortb2.user fields

```javascript
pbjs.setBidderConfig({
  bidders: ["amx"],
  config: {
    ortb2: {
      site: {
        keywords: "kw1,kw2",
        cat: ["IAB2"],
        sectioncat: ["IAB2-1"],
        pagecat: ["IAB2-22"],
        content: {
          context: 5,
        },
      },
      user: {
        yob: 1981,
        keywords: "kw3",
      },
    },
  },
});
```

---
layout: bidder
title: Vidoomy
description: Prebid Vidoomy Bidder Adaptor
pbjs: true
biddercode: vidoomy
media_types: banner, video
gdpr_supported: true
gvl_id: 380
usp_supported: true
coppa_supported: true
pbs: true
sidebarType: 1
schain_supported: true
ortb_blocking_supported: true
userIds: all
floors_supported: true
---

### Note:

[Vidoomy](https://vidoomy.com/), for more info please contact support@vidoomy.com

### Client Side Bid Params

{: .table .table-bordered .table-striped }
| Name             | Scope    | Description      | Example                      | Type     |
|------------------|----------|------------------|------------------------------|----------|
| `id` | required | id  | `'123123'` | `string` |
| `pid`   | required | pid | `'123123'` | `string` |
| `bidfloor`   | optional | CPM bidfloor in USD | `0.08` | `float` |


### Server Side Bid Params (Prebid Server)

{: .table .table-bordered .table-striped }

| Name     | Scope    | Description                                 | Example           | Type           |
|----------|----------|---------------------------------------------|-------------------|----------------|
| `zoneId` | required | Zone Id                                     | `'123123'`          | `string`       |
| `bcat`   | optional | List of blocked advertiser categories (IAB) | `['IAB1-1']`      | `string array` |
| `badv`   | optional | Blocked Advertiser Domains                  | `['example.com']` | `string array` | 
| `bapp`   | optional | blocked advertiser mobile app bundles       | `['app.com']`     | `string array` |
| `btype`  | optional | blocked creative types (e.g. XHTML)         | `[1, 2, 3]`       | `int array`    |
| `battr`  | optional | blocked creative attributes (e.g. audio)    | `[1, 2, 3]`       | `int array`    |

Notes:

- Preferred to provide the `bcat`, `badv`, `bapp`, `btype` and `battr`  within the first party data (above). When both
  methods are provided, first
  party data values will be prioritized.

### First Party Data

Publishers can use the `ortb2` configuration parameter to provide First Party Data.

#### OpenRTB Parameters

The following table contains currently supported parameters we parse.

{: .table .table-bordered .table-striped }

| Name    | Scope    | Description                                 | Example           | Type    |
|---------|----------|---------------------------------------------|-------------------|---------|
| `bcat`  | optional | List of blocked advertiser categories (IAB) | `['IAB1-1']`      | `Array` |
| `badv`  | optional | Blocked Advertiser Domains                  | `['example.com']` | `Array` | 
| `bapp`  | optional | blocked advertiser mobile app bundles       | `['app.com']`     | `Array` |
| `btype` | optional | blocked creative types (e.g. XHTML)         | `[1, 2, 3]`       | `Array` |
| `battr` | optional | blocked creative attributes (e.g. audio)    | `[1, 2, 3]`       | `Array` |

Notes:

- will extract the bcat,badv,bapp,btype,battr if passed within `ortb2`

Example configuration:

```
pbjs.setConfig({
    ortb2: {
      bcat: ['IAB1-1'],
      badv: ['example.com'],
      bapp: ['app.com'],
      btype: [1, 2, 3],
      battr: [1, 2, 3]
    }
});
```
---
layout: bidder
title: Ad Generation
description: Prebid Ad Generation Bidder Adaptor
schain_supported: true
pbjs: true
pbs: no
pbs_app_supported: no
fpd_supported: true
biddercode: adgeneration
userIds: all
media_types: native
sidebarType: 1
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope    | Description | Example  | Type     |
|------|----------|-------------|----------|----------|
| `id` | required | adId        | `'1234'` | `string` |

#### First Party Data

In release 1.6.4 and later, publishers should use the `ortb2` method of setting [First Party Data](https://docs.prebid.org/features/firstPartyData.html). The following fields are supported:

* ortb2.site.content.data[]

If `ad-generation.jp` is specified for ortb2.site.content.data[].name and `546` is specified for ortb2.site.content.data[].ext.segtax,
`ortb2.site.content.data[].segment[].name` and `ortb2.site.content.data[].segment[].value` can be any string value.

Example first party data that's available to all bidders and all adunits:

```javascript
pbjs.setConfig({
    ortb2: {
        site: {
            content: {
                data: [{
                    name: "ad-generation.jp",
                    ext: {
                        segtax: 546
                    },
                    segment: [
                        { name: "news_category", value: "Sports_Sumo" },// name and value must be string types
                        { name: "local_gourmet", value: "sushi" },
                        { name: "location", value: "tokyo" }
                    ]
                }]
            }
        },
    }
});
```

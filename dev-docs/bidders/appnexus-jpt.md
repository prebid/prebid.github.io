---
layout: bidder
title: AppNexus (legacy)
description: Prebid AppNexus Bidder Adaptor
top_nav_section: dev_docs
nav_section: reference
hide: true
biddercode: appnexus
biddercode_longer_than_12: false
prebid_1_0_supported : false
media_types: banner
---

{: .alert.alert-warning :}
Prebid.js 0.x includes two AppNexus Adaptors: `appnexus` and `appnexusAst`. As part of the transition to Prebid 1.0, the AppNexus AST adapter will become the standard (and only) AppNexus adapter (and be renamed to "AppNexus").  From a developer's perspective, the primary change from the legacy adapter is that keywords must be passed using the `keywords` parameter documented below.

### Bid Params

{: .table .table-bordered .table-striped }
| Name             | Scope    | Description                                                                                                                                                                                                          | Example           | Type             |
|------------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------|------------------|
| `placementId`    | required | The placement ID from AppNexus.  You may identify a placement using the `invCode` and `member` instead of a placement ID.                                                                                            | `234234`          | `int`            |
| `"arbitraryKey"` | optional | This key can be *any publisher-defined string*. The value (also a string) maps to a querystring segment for enhanced buy-side targeting. Multiple key-value pairs can be added as shown [below](#appnexus-pub-keys). | `'genre': 'rock'` | `keyValue`       |
| `invCode`        | optional | The inventory code from AppNexus. Must be used with `member`.                                                                                                                                                        | `'abc123'`        | `string`         |
| `member`         | optional | The member ID  from AppNexus. Must be used with `invCode`.                                                                                                                                                           | `'12345'`         | `string`         |

<a name="appnexus-pub-keys" />

#### Support for publisher-defined keys

To pass in a publisher-defined key whose value maps to a querystring segment for buy-side targeting, set up your `params` object as shown below.  For more information, see the [query string targeting documentation](https://wiki.appnexus.com/x/7oCzAQ) (login required).

{% highlight js %}
var adUnits = [{
    code: 'div-gpt-ad-1460505748511-01',
    sizes: [
        [300, 250],
        [300, 50]
    ],
    bids: [{
        bidder: 'appnexus',
        params: {
            placementId: '123456789',
            'playlist': '12345', // <----| Publisher-defined key-values
            'genre': 'rock'      // <----| (key and value must be strings)
        }
    }]
}]
{% endhighlight %}

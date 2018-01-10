---
layout: bidder
title: AppNexus
description: Prebid AppNexus Bidder Adaptor
top_nav_section: dev_docs
nav_section: reference
biddercode: appnexus
biddercode_longer_than_12: false
hide: true
prebid_1_0_supported : true
---

**Table of Contents**

- [Bid params](#appnexus-bid-params)
- [Support for publisher-defined keys](#appnexus-pub-keys)
- [Specify aspect ratios for native images and icons](#appnexus-aspect-ratios)

<a name="appnexus-bid-params" />

### Bid params

{: .table .table-bordered .table-striped }
| Name             | Scope    | Description                                                                                                                                                                                                          | Example           |
|------------------+----------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+-------------------|
| `placementId`    | required | The placement ID from AppNexus.  You may identify a placement using the `invCode` and `member` instead of a placement ID.                                                                                            | `"234234"`        |
| `"arbitraryKey"` | optional | This key can be *any publisher-defined string*. The value (also a string) maps to a querystring segment for enhanced buy-side targeting. Multiple key-value pairs can be added as shown [below](#appnexus-pub-keys). | `'genre': 'rock'` |
| `invCode`        | optional | The inventory code from AppNexus. Must be used with `member`.                                                                                                                                                        | `"abc123"`        |
| `member`         | optional | The member ID  from AppNexus. Must be used with `invCode`.                                                                                                                                                           | `"12345"`         |
| `reserve`        | optional | Sets a floor price for the bid that is returned.                                                                                                                                                                     | `0.90`            |

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

{: .alert.alert-info :}
Sizes set in the `adUnit` object will also apply to the AppNexus bid requests.

<a name="appnexus-aspect-ratios" />

#### Specify aspect ratios for native images and icons

The AppNexus adapter supports specifying aspect ratios for native "image" and "icon" assets. Aspect ratios are defined by the following properties of the `aspect_ratios` array (as shown in the example below):

- `ratio_width`
- `ratio_height`
- `min_width` (optional)

For example:

```javascript
    mediaTypes: {
        native: {
            title: {
                required: true
            },
            body: {
                required: true
            },
            image: {
                required: true,
                aspect_ratios: [{
                    min_width: 100,
                    ratio_width: 2,
                    ratio_height: 3,
                }]
            },
        }
    }
```

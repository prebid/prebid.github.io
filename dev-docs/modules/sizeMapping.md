---
layout: page_v2
page_type: module
title: Module - Size Mapping
description: Display Responsive AdUnits in demanding page environments.
module_code: sizeMapping
display_name: Size Mapping
enable_download: true
sidebarType: 1
---

# Size Mapping Module

{: .no_toc }

* TOC
{: toc }

## Overview

The size mapping module enables the global `sizeConfig` configuration which, together with labels, allows for responsive ad units.  

{% capture tip-choosing %}
As of Prebid.js 3.11.0, the [Advanced SizeMapping module](/dev-docs/modules/sizeMappingV2.html) provides an alternate way to handle responsive AdUnits.
You should consider using that module if any of these scenarios are true:
{::nomarkdown}
<ul>
<li> You need to work with video or native AdUnits</li>
<li> The site needs to alter different AdUnits at different screen widths; e.g., the left-nav changes sizes at 600 pixels, but the footer's size behavior changes at 620 pixels.</li>
<li>The site needs to alter different mediaTypes at different screen widths; e.g., the banner size ranges are 0-400px, 401-700px, and 701+px, but the native ads appear at 500px.</li>
<li>Some bidders or mediaTypes should be included (or removed) at different overlapping size ranges.</li>
</ul>
<br/>
{:/}
If, on the other hand, you're only working with the banner mediaType and the AdUnits all change behavior together at the same viewport width, then the built-in sizeConfig feature is appropriate.
{% endcapture %}
{% include alerts/alert_tip.html content=tip-choosing %}

<a id="configure-responsive-ads"></a>

## Configure Responsive Ads

The `sizeConfig` object passed to `pbjs.setConfig` provides a global way to describe types of devices and screens using [CSS media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries).  See below for an explanation of the feature and examples showing how to use it.

<a name="sizeConfig-How-it-Works"></a>

### How Size Config Works for Banners

* Before `requestBids` sends bid requests to adapters, it will evaluate and pick the appropriate label(s) based on the `sizeConfig.mediaQuery` and device properties.  Once it determines the active label(s), it will then filter the `adUnit.bids` array based on the `labels` defined and whether the `banner` mediaType was included. Ad units that include a `banner` mediaType that don't match the label definition are dropped.
* The required `sizeConfig.mediaQuery` property allows [CSS media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries).  The queries are tested using the [`window.matchMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) API.
* If a label conditional (e.g. `labelAny`) doesn't exist on an ad unit, it is automatically included in all requests for bids.
* If multiple rules match, the sizes will be filtered to the intersection of all matching rules' `sizeConfig.sizesSupported` arrays.
* The `adUnit.mediaTypes.banner.sizes` selected will be filtered based on the `sizesSupported` of the matched `sizeConfig`. So the `adUnit.mediaTypes.banner.sizes` is a subset of the sizes defined from the resulting intersection of `sizesSupported` sizes and `adUnit.mediaTypes.banner.sizes`. (Note: size config will also operate on `adUnit.sizes`, however `adUnit.sizes` is deprecated in favor of `adUnit.mediaTypes`)

### Note on sizeConfig and different mediaTypes

The sizeConfig logic only applies to `adUnits`/`bids` that include the `banner` `mediaType` (regardless of whether the request is single or multi-format).

For example, if a request  contained the `banner` and `video` `mediaTypes` and it failed the label check, then the entire adUnit/bid would be dropped (including the `video` part of the request).  However if the same request passed the label check, then the `adUnit.mediaTypes.banner.sizes` would be filtered as per the matching sizeConfig and the multi-format request would proceed as normal.

If the ad unit does not include `banner` `mediaType` at all, then the sizeConfig logic will not influence that ad Unit; it will automatically be passed into the auction.

<a name="sizeConfig-Example"></a>

### Size Config Example

To set size configuration rules, pass in `sizeConfig` as follows:

```javascript

pbjs.setConfig({
    sizeConfig: [{
        'mediaQuery': '(min-width: 1600px)',
        'sizesSupported': [
            [1000, 300],
            [970, 90],
            [728, 90],
            [300, 250]
        ],
        'labels': ['desktop-hd']
    }, {
        'mediaQuery': '(min-width: 1200px)',
        'sizesSupported': [
            [970, 90],
            [728, 90],
            [300, 250]
        ],
        'labels': ['desktop']
    }, {
        'mediaQuery': '(min-width: 768px) and (max-width: 1199px)',
        'sizesSupported': [
            [728, 90],
            [300, 250]
        ],
        'labels': ['tablet']
    }, {
        'mediaQuery': '(min-width: 0px)',
        'sizesSupported': [
            [300, 250],
            [300, 100]
        ],
        'labels': ['phone']
    }]
});

```

## Labels

There are two parts to defining responsive and conditional ad units with labels:

1. Defining the labels
2. Defining the conditional ad unit targeting for the labels

Labels may be defined in two ways:

1. Through [`sizeConfig`](#configure-responsive-ads)
2. As an argument to [`pbjs.requestBids`](/dev-docs/publisher-api-reference/requestBids.html)

```javascript
pbjs.requestBids({labels: []});
```

Labels may be targeted in the AdUnit structure by two conditional operators: `labelAny` and `labelAll`.

With the `labelAny` operator, just one label has to match for the condition to be true. In the example below, either A or B can be defined in the label array to activate the bid or ad unit:

```javascript
labelAny: ["A", "B"]
```

With the `labelAll` conditional, every element of the target array must match an element of the label array in
order for the condition to be true. In the example below, both A and B must be defined in the label array to activate the bid or ad unit:

```javascript
labelAll: ["A", "B"]
```

{: .alert.alert-warning :}
Only one conditional may be specified on a given AdUnit or bid -- if both `labelAny` and `labelAll` are specified, only the first one will be utilized and an error will be logged to the console. It is allowable for an AdUnit to have one condition and a bid to have another.

{: .alert.alert-warning :}
If either `labeAny` or `labelAll` values is an empty array, it evaluates to `true`.

{: .alert.alert-warning :}
It is important to note that labels do not act as filters for sizeConfig. In the example above, using a screen of 1600px wide and `labelAll:["desktop"]` will *not* filter out sizes defined in the `desktop-hd` sizeConfig. Labels in sizeConfig are only used for selecting or de-selecting AdUnits and AdUnit.bids.

Label targeting on the ad unit looks like the following:

```javascript
pbjs.addAdUnits([{
    code: "ad-slot-1",
    mediaTypes: {
        banner: {
            sizes: [
                [970, 90],
                [728, 90],
                [300, 250],
                [300, 100]
            ]
        }
    },
    labelAny: ["visitor-uk"]
    /* The full set of bids, not all of which are relevant on all devices */
    bids: [{
            bidder: "pulsepoint",
            /* Labels flag this bid as relevant only on these screen sizes. */
            labelAny: ["desktop", "tablet"],
            params: {
                "cf": "728X90",
                "cp": 123456,
                "ct": 123456
            }
        },
        {
            bidder: "pulsepoint",
            labelAny: ["desktop", "phone"],
            params: {
                "cf": "300x250",
                "cp": 123456,
                "ct": 123456
            }
        },
        {
            bidder: "sovrn",
            labelAny: ["desktop", "tablet"],
            params: {
                "tagid": "123456"
            }
        },
        {
            bidder: "sovrn",
            labelAny: ["phone"],
            params: {
                "tagid": "111111"
            }
        }
    ]
}]);

```

See [Conditional Ad Units]({{site.baseurl}}/dev-docs/conditional-ad-units.html) for additional use cases around labels.

<a name="setConfig-coppa"></a>

## Further Reading

* [Advanced size mapping](/dev-docs/modules/sizeMappingV2.html)
* [Conditional Ad Units](/dev-docs/conditional-ad-units.html)

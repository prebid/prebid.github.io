---
layout: page_v2
page_type: module
title: Module - Size Mapping
description: Display Responsive AdUnits in demanding page environments.
module_code: sizeMappingV2
display_name: Advanced Size Mapping
enable_download: true
sidebarType: 1
---

# Advanced Size Mapping Module
{: .no_toc }

* TOC
{: toc }

## Overview

The Advanced Size Mapping module enables configuration of responsive ad units with more flexibility than the [core `sizeConfig`](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Configure-Responsive-Ads) feature. It detects the browser viewport dimensions, and based on that, applies a series of checks on the ad unit to determine:

 - which banner sizes should be active
 - what the playerSize is for a video media type
 - whether the native media type should be active
 - whether a particular bidder should participate in the auction

The module can act on all three media types, **banner**, **video**, and **native**, and can be used to control their behavior. It can also activate/deactivate a particular bidder based on some checks.
<br />
It also has support for *labels* which are used to render ad units conditionally.

{% capture tip-choosing %}
Including the Advanced SizeMapping module in your Prebid.js build adds about 12KB to the package size.
It's meant for publishers that have complex site designs. You should use this module if:
{::nomarkdown}
<ul>
<li>the site needs to alter different AdUnits at different screen widths; e.g., the left-nav changes sizes at 600 pixels, but the footer's size behavior changes at 620 pixels.</li>
<li>the site needs to alter different mediaTypes at different screen widths; e.g., the banner size ranges are 0-400px, 401-700px, and 701+px, but the native ads appear at 500px.</li>
<li>some bidders or mediaTypes should be included (or removed) at different overlapping size ranges.</li>
</ul>
<br/>
{:/}

If, on the other hand, the AdUnits, bidders, and mediaTypes all change behavior together at the same viewport width,
then the built-in [`sizeConfig`](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Configure-Responsive-Ads) feature will work.

Note that the Prebid Server bid adapter does not currently support the scenario where an adUnit has multiple mediaTypes, with different bidders set to different relevantMediaTypes for the same screen size.
{% endcapture %}
{% include alerts/alert_tip.html content=tip-choosing %}

## Differences Between Global and AdUnit Level sizeConfig

If you've used [`sizeConfig`](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Configure-Responsive-Ads) in Prebid.js before, read this section to learn about the differences. If you haven't used sizeConfig before, you can skip to the next section.

- The biggest change to size mapping is the introduction of **AdUnit** and **Bidder** level sizeConfig declarations. Instead of defining a global sizeConfig object configured in [`pbjs.setConfig`](/dev-docs/publisher-api-reference/setConfig.html#module_pbjs.setConfig), each Ad Unit and Bidder can define and control their own set of sizeConfig rules. This process makes it easier to reason which sizes should be active for the current viewport size in complex scenarios.

- A **sizeConfig** parameter may be specified on the AdUnit mediaType or a bidder. In these scenarios, the syntax is a little different than with the global configuration. Here's an example for a sizeConfig object for banner media type:

```javascript
  mediaTypes: {
    banner: {
      sizeConfig: [
        { minViewPort: [0, 0], sizes: [] }, // deactivate if viewport < 750px
        { minViewPort: [750, 0], sizes: [[300, 250], [300, 600]] } // activate viewport > 750px
      ];
    }
  }
```

- **Labels** aren't defined in AdUnit sizeConfig objects. Instead of funneling viewport sizes into a small number of labeled scenarios, the Advanced Size Mapping approach allows each AdUnit and Bidder to define separate size buckets. Labels are still an effective way to do other tasks such as filtering AdUnits and Bidders based on their geo location. For more details on Labels, visit [Conditional Ad Units](/dev-docs/conditional-ad-units.html).

- Likewise, **mediaQuery** is not used in AdUnit sizeConfig objects. Instead, an array of size buckets is defined by just the `minViewPort` property. Only one size bucket activates based on viewport size.

It may be useful to compare the globally-configured sizeConfig with the AdUnit-level sizeConfig. [Here is an example](/dev-docs/publisher-api-reference/setConfig.html#sizeConfig-Example) using global sizeConfig.

Here's that same example using Advanced Size Mapping:

```javascript
  const adUnit = {
    code: "ad-slot-1",
    mediaTypes: {
      banner: {
        sizeConfig: [
          { minViewPort: [0, 0], sizes: [[300, 250], [300, 100]] },
          { minViewPort: [768, 0], sizes: [[728, 90], [300, 250]] },
          { minViewPort: [1200, 0], sizes: [[970, 90], [728, 90], [300, 250]] },
          { minViewPort: [1600, 0], sizes: [[1000, 300], [970, 90], [728, 90], [300, 250]] }
        ]
      }
    }
  }
```

Note the tradeoff here: If you're specifying duplicate sizeConfigs on every AdUnit, you might be better off using the global sizeConfig approach. But if the global approach isn't flexible enough for your site design, the AdUnit-level approach is the right way to go.

{: .alert.alert-warning :}
**WARNING**: If AdUnit level sizeConfigs are found, global sizeConfig will be ignored.

## How to Setup AdUnit-Level sizeConfig

### AdUnit-Level sizeConfig Has Two Parts

I. **Size Bucket** (Declared using *minViewPort*)

As the name suggests, *minViewPort* signifies the minimum viewport size for the size bucket to become active. It's declared as an array of two numbers. The first number indicates the *viewport width*, the second indicates *viewport height*. For example, if *minViewPort* is `[750, 0]`, this size bucket will activate only when viewport width is greater than `750`. If there was any previous size bucket active for a smaller viewport, it'll get deactivated.

{: .alert.alert-info :}
**NOTE**:  Only one size bucket in each array will be active for the current viewport size.

II. **Associated Property**

What happens as a result of each active size bucket changes based on the media type and whether it was defined at the AdUnit or Bidder level. This table summarizes the scenarios:

{: .table .table-bordered .table-striped }
| Where Defined  | Available Property           | Example                                        | Description                                                                                                    |
|--------|--------------------|------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| mediaTypes.banner | sizes              | `[[300, 250],[300, 100]]` or `[]` | Defines banner sizes that will be sent as part of bid requests for this size range. Declaring an empty array turns off banners for this AdUnit when the viewport is in that range.  |
| mediaTypes.video  | playerSize         | `[[640, 400]]` or `[]` | Defines the video player-size that will be sent as part of bid requests. Declaring an empty array turns off the video mediaType for this AdUnit in this size range.   |
| mediaTypes.native | active             | `true`                                         | Indicates whether Native mediaTypes should be active or not for this size bucket in this AdUnit.   |
| bids.bidder | relevantMediaTypes | `['banner', 'video', 'native']` or `['none']`            | An array that defines a list of mediaTypes that a bidder will bid on for this size bucket in this AdUnit. Set to ['none'] if no mediaType of this size bucket. |


### Examples

#### An AdUnit with Banner Media Type, Bidder-Level sizeConfig, and Labels

Note that the labels are assumed to be passed in via [`pbjs.requestBids()`](/dev-docs/publisher-api-reference.html#module_pbjs.requestBids).

```javascript
{
  code: 'ad-code-1',
  mediaTypes: {
    banner: {
      sizeConfig: [
        { minViewPort: [0, 0], sizes: [] },
        { minViewPort: [900, 0], sizes: [[300, 200], [300, 250]] },
        { minViewPort: [1200, 0], sizes: [[970, 400], [300, 200], [300, 250]] },
        { minViewPort: [1600, 0], sizes: [] }
      ]
    }
  },
  labelAny: ['visitor-us', 'visitor-uk'],
  bids: [{
      bidder: 'bidderA',
      params: {
          placementId: '12345'
      },
      labelAny: ['visitor-us']
  }, {
      bidder: 'bidderB',
      params: {
        accountId: 14062,
      },
      sizeConfig: [
        { minViewPort: [0, 0], relevantMediaTypes: ['none'] },
        { minViewPort: [800, 0], relevantMediaTypes: ['banner'] },
        { minViewPort: [1200, 0], relevantMediaTypes: ['none'] }
      ]
  }]
}
```

Here are two requests and how they would be handled in this scenario:

I. A request originating in the US, viewport size: `[1400px, 800px]`
- Steps for **bidderA**:
  1. AdUnit passes label check.
  2. Size bucket `[1200, 0]` gets activated. Sizes: `[[970, 400], [300, 200], [300, 250]]` are active at AdUnit level.
  3. BidderA passes label check.
  4. Request for Banner media type sent to bidderA with sizes: `[[970, 400], [300, 200], [300, 250]]`

- Steps for **bidderB**:
  1. AdUnit passes label check.
  2. Size bucket `[1200, 0]` gets activated. Sizes: `[[970, 400], [300, 200], [300, 250]]` are active at AdUnit level.
  3. At the Bidder level, size bucket, `[1200, 0]` gets activated. Relevant media types is set to `none`. This deactivates the bidder.
  4. No bid request is sent for bidderB.

II. A request originating in the UK, viewport size: `[1700px, 900px]`
- Steps for both bidders:
  1. AdUnit passes label check.
  2. Size bucket `[1600, 0]` gets activated. Sizes is `[]`, and an empty array indicates no sizes for the current viewport, which disables the Ad Unit.
  3. No request will be sent to either bidder.

#### Example of a Multi-Format AdUnit with Bidder-Level sizeConfig

```javascript
{
    code: 'ad-code-2',
    mediaTypes: {
        banner: {
            sizeConfig: [
                { minViewPort: [0, 0], sizes: [] },
                { minViewPort: [900, 0], sizes: [[300, 200], [300, 600]] }
            ]
        },
        video: {
            context: 'instream',
        ... other video params ...
            sizeConfig: [
                { minViewPort: [0, 0], playerSize: [] },
                { minViewPort: [1200, 0], playerSize: [640, 400]}
            ]
        },
        native: {
            type: 'image',
            sizeConfig: [
                { minViewPort: [0, 0], active: false },
                { minViewPort: [600, 0], active: true }
            ]
        }
    },
    bids: [{
        bidder: 'bidderA',
        params: {
            placementId: 123
        },
        sizeConfig: [
            { minViewPort: [0, 0], relevantMediaTypes: ['none'] },
            { minViewPort: [700, 0], relevantMediaTypes: ['banner'] },
            { minViewPort: [1300, 0], relevantMediaTypes: ['video'] }
        ]
    }, {
        bidder: 'bidderB',
        params: {
            pubId: '123456'
        },
        sizeConfig: [
            { minViewPort: [0, 0], relevantMediaTypes: ['none'] },
            { minViewPort: [400, 0], relevantMediaTypes: ['native', 'video'] },
            { minViewPort: [1200, 0], relevantMediaTypes: ['none'] }
        ]
    }]
}
```

Here are two requests and how they would be handled in this scenario:

I. A mobile device with viewport size: `[460px, 300px]`
- Steps for both bidders:
    1. Size bucket `[0, 0]` activates for all three media types. Banner is deactivated due to `sizes: []`. Video is deactivated since `playerSize: []`. Native is deactivated since `active: false`.
    2. Since no media type is active, the AdUnit is deactivated.
    3. No request is sent for either bidder, even though bidderB's minViewPort would have allowed video or native.

II. A tablet with viewport size: `[1100px, 980px]`
- Steps for **bidderA**:
  1. Size bucket `[900, 0]` activates for banner media type, so the associated sizes are active. Size bucket `[0, 0]` activates for video media type. Its associated property is `playerSize: []`, so the video media type gets disabled. Size bucket `[600, 0]` activates for native media type. Its associated property is `active: true`, which keeps native media type active at the AdUnit level.
  2. At the Bidder level, size bucket `[700, 0]` activates. Associated property `relevantMediaTypes` is set to `['banner']`.
  3. Only the banner media type is sent to bidderA even though native was activated at the AdUnit level.

- Steps for **bidderB**:
  1. The AdUnit-level activations are the same as for bidderA.
  2. At the level of bidderB, size bucket `[400, 0]` activates. Associated property `relevantMediaTypes` is set to `['native', 'video']`. Since video media type is already disabled at the AdUnit level, request for video won't be sent to the bidder.
  3. Only a request for native media type is sent to bidderB.

## Building the Package With Advanced Size Mapping Support

Follow the basic build instructions in the GitHub Prebid.js repo's main [README](https://github.com/prebid/Prebid.js/blob/master/README.md). To include the Advanced Size Mapping module, the `sizeMappingV2` module must be added to the **gulp build** command:

```bash
gulp build --modules=sizeMappingV2,bidAdapter1,bidAdapter2
```

## Further Reading

- [Global sizeConfig](/dev-docs/publisher-api-reference.html#setConfig-Configure-Responsive-Ads)
- [Conditional Ad Units](/dev-docs/conditional-ad-units.html)

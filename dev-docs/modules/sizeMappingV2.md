---
layout: page_v2
page_type: module
title: Module - Size Mapping
description: Display Conditional and Responsive Ad Units
module_code: sizeMapping
display_name: Size Mapping
enable_download: true
sidebarType: 1
---

# Size Mapping V2 Module
{: .no_toc }

* TOC
{: toc }

## Overview

Size Mapping V2 helps us configure responsive ad units. It detects the browser viewport dimensions, and based on that, applies a series of checks on the ad unit to determine:

 - Which banner sizes should be active?
 - What is the playerSize for a video media type?
 - Should native media type be active?
 - Should a particular bidder participate in the auction?

It can act on all three media types, **banner**, **video** and **native**, and can be used to control their behaviour. We can also activate/deactivate a particular bidder based on some checks.
<br />
It also has support for *labels* which are used to render ad units conditionally. 

{: .alert.alert-info :}
If you've used sizeMapping feature or **sizeConfig** in prebid.js before, the section below covers things that have changed. If you haven't used sizeConfig before, you can skip to the next section.

## What's Changed

- Biggest change to size mapping is introduction of **Ad Unit** and **Bidder** level sizeConfig declaration. The modules doesn't support a global sizeConfig object configured in `pbjs.setConfig`. Instead, each Ad Unit and Bidder (if need be) can define and control their own set of sizeConfig rules. This process makes it easier to reason which sizes should be active for the current viewport size.

- **sizeConfig** object has changed. Here's an example for a sizeConfig object for banner media type:

{% highlight js %}
  mediaTypes: {
    banner: {
      sizeConfig = [
        { minViewPort: [0, 0], sizes: [] }, // deactivate if viewport < 750px
        { minViewPort: [750, 0], sizes: [[300, 250], [300, 600]] } // activate viewport > 750px
      ];
    }
  }
{% endhighlight %}

- **labels** are no longer defined in sizeConfig object. Only way to define labels is inside `pbjs.setConfig`. Now, **labels** don't need to be associated with a size range defined by the **mediaQuery** property of sizeConfig object because each ad unit/bidder can define their own size buckets and sizes associated with those buckets. **lables** are still an effective way to do other tasks like, filtering ad units/bidders based on their Geo location, etc. For more details how to use labels, visit [Conditional Ad Units](http://prebid.org/dev-docs/conditional-ad-units.html).

{: .alert.alert-info :}
Labels are still fully supported. You can apply `labelAll` or `labelAny` operator on an Ad Unit or a Bidder and it'll behave the same way that is used to earlier.

- **mediaQuery** is not needed. Instead, we need an array of size buckets defined by the `minViewPort` property. Only one size bucket activates based on viewport size.

Here is an [example](http://prebid.org/dev-docs/publisher-api-reference.html#sizeConfig-Example) using global sizeConfig.

If we convert it to use Size Mapping V2, it'll look like this:

{% highlight js %}
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
{% endhighlight %}

{: .alert.alert-warning :}
**WARNING**: You can't use global sizeConfig declaration if you're using ad unit/bidder level sizeConfigs. If ad unit/bidder level sizeConfigs are found, global sizeConfig will be ignored.

## How to setup Ad Units?

### The new sizeConfig has two parts.

I. **Size Bucket** (Declared using *minViewPort*)

As the name suggests, *minViewPort* signifies the minimum viewport size for the size bucket to become active. It's declared as an array of two numbers. The first number indicates the *viewport width*, the second indicates *viewport height*. For example, if *minViewPort* is `[750, 0]`, this size bucket will activate only when viewport width is greater than `750`. If there was any previous size bucket active for a smaller viewport, it'll get deactivated.

{: .alert.alert-info :}
**NOTE**:  Only one size bucket will be active for the current viewport size.

II. **Associated Property**

The name and value of this property changes based on the media type declaring the sizeConfig and also depends on where the sizeConfig is being declared (Ad Unit or Bidder level).

{: .table .table-bordered .table-striped }
| Type   | Property           | Example                                        | Description                                                                                                    |
|--------|--------------------|------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| Banner | sizes              | `[    [300, 250],     [300, 100]  ]`  or  `[]` | Banner sizes that'll be sent as part of bid requests. Declaring an empty array deactivates size bucket.        |
| Video  | playerSize         | `[   [640, 400]  ]` or `[]`                    | Video player-size that'll be sent as part of bid requests. Declaring an empty array deactivates size bucket.   |
| Native | active             | `true`                                         | Indicates if Native mediaTypes should be active or not for this size bucket.                                   |
| Bidder | relevantMediaTypes | `['banner', 'video']` or `['none']`            | Indicates a list of mediaTypes that a bidder will bid on. Set to ['none'] if no mediaType of this size bucket. |


### Examples

#### Example of an Ad Unit with Banner media type and Bidder level sizeConfig and Labels
{% highlight js%}
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
      bidder: 'bidder A',
      params: {
          placementId: '12345'
      },
      labelAny: ['visitor-us']
  }, {
      bidder: 'bidder B',
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
{% endhighlight %}

The series of steps that'll take place:

I. A request originating in US, viewport size: `[1400px, 800px]`
- Steps for **bidder A**
  1. Ad Unit passes label check.
  2. Size bucket `[1200, 0]` gets activated. Sizes: `[[970, 400], [300, 200], [300, 250]]` are active at Ad Unit level.
  3. Bidder Appnexus passes label check.
  4. Request for Banner media type sent to bidder A with sizes: `[[970, 400], [300, 200], [300, 250]]`

- Steps for **bidder B**
  1. Ad Unit passes label check.
  2. Size bucket `[1200, 0]` gets activated. Sizes: `[[970, 400], [300, 200], [300, 250]]` are active at Ad Unit level.
  3. At the Bidder level, size bucket, `[1200, 0]` gets activated. Relevant media types is set to `none`. This deactivates the bidder.
  4. No bid request is sent for bidder B.

II. A request originating in UK, viewport size: `[1700px, 900px]`
- For both bidders.
  1. Ad Unit passes label check.
  2. Size bucket `[1600, 0]` gets activated. Sizes is `[]`. An empty array indicates no sizes for the current viewport and disables the Ad Unit.
  3. No request will be sent to both the bidders.

#### Example of a multi-format Ad Unit with Bidder level sizeConfig
{% highlight js%}
{
    code: 'ad-code-2',
    mediaTypes: {
        banner: {
            sizeConfig: [
                { mediaTypes: [0, 0], sizes: [] },
                { mediaTypes: [900, 0], sizes: [[300, 200], [300, 600]] }
            ]
        },
        video: {
            context: 'instream',
            sizeConfig: [
                { mediaTypes: [0, 0], playerSize: [] },
                { mediaTypes: [1200, 0], playerSize: [640, 400]}
            ]
        },
        native: {
            type: 'image',
            sizeConfig: [
                { mediaTypes: [0, 0], active: false },
                { mediaTypes: [600, 0], active: true }
            ]
        }
    },
    bids: [{
        bidder: 'bidder A',
        params: {
            placementId: 123
        },
        sizeConfig: [
            { minViewPort: [0, 0], relevantMediaTypes: ['none'] },
            { minViewPort: [700, 0], relevantMediaTypes: ['banner'] },
            { minViewPort: [1300, 0], relevantMediaTypes: ['video'] }
        ]
    }, {
        bidder: 'bidder B',
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
{% endhighlight %}

The series of steps that'll take place:

I. A mobile device with viewport size: `[460px, 300px]`
- Steps for both bidders.
    1. Size bucket `[0, 0]` activates for all three media types. Banner is deactivated since `sizes: []`. Video is deactivated since `playerSize: []`. Native is deactivated since `active: false`.
    2. Since no media type is active, the complete Ad Unit deactivates.
    3. No request is sent for both the bidders.

II. A tablet with viewport size: `[1100px, 980px]`
- Steps for **bidder A**
  1. Size bucket `[1200, 0]` activates for banner media type, its associated sizes are active. Size bucket `[0, 0]` activates for video media type. It's associated property is `playerSize: []`, so, video media type gets disabled. Size bucket `[600, 0]` activates for native media type. It's associated property is `active: true`, which keeps native media type active at the Ad Unit level.
  2. At the Bidder level, size bucket `[700, 0]` activates. Associated property `relevantMediaTypes` is set to `['banner']`.
  3. Only a request for Banner media type is sent to bidder A.

- Steps for **bidder B**
  1. Same at bidder A.
  2. At the Bidder level, size bucket `[400, 0]` activates. Associated property `relevantMediaTypes` is set to `['native', 'video']`. Since video media type is already disabled at the Ad Unit level, request for video won't be sent to the bidder.
  3. Only a request for Native media type is sent to bidder B.

## Build the Package

Follow the basic build instructions in the GitHub Prebid.js repo's main [README](https://github.com/prebid/Prebid.js/blob/master/README.md). To include the Size Mapping V2 module, an additional option must be added to the **gulp build** command:

{% highlight bash %}
gulp build --modules=sizeMappingV2,bidAdapter1,bidAdapter2
{% endhighlight %}



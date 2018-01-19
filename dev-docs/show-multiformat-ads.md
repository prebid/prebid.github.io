---
layout: page
title: Show Multi-Format Ads with Prebid.js
description: Show Multi-Format Ads with Prebid.js
pid: 0
is_top_nav: yeah
top_nav_section: dev_docs
nav_section: prebid-multiformat
---

<div class="bs-docs-section" markdown="1">

# Show Multi-Format Ads with Prebid.js
{: .no_toc }

This page has instructions for showing multi-format ads using Prebid.js.

Multi-format ads allow you to declare multiple media types on a single ad unit.

Once declared, any bidder that supports at least one of the media types can participate in the auction for that ad unit.

* TOC
{:toc}

## How Multi-Format Ads Work

Multi-format ads allow you to say that a single ad unit may be filled by any eligible banner, video, or native ad.

At a high level, Prebid.js supports multi-format ads as follows:

1. For each multi-format ad unit, make a list of each of the media types defined for that ad unit
2. Loop through each of the bidders on the ad unit, checking it against the list of media types to see if the bidder is eligible to bid
3. Send bid requests to each bidder that supports at least one of the media types on the ad unit

The following key is added to your ad server targeting, and set to the value of the bid response's `mediaType` property.

+ `hb_mediatype`

The ad ops team will reference this key in the ad server to set targeting.  For ad ops setup instructions, see [Setting up Prebid Multi-Format in DFP]({{site.baseurl}}/adops/setting-up-prebid-multiformat-in-dfp.html).

## Prerequisites

Keep the following prerequisites in mind during the implementation:

+ Make sure to work with bidders that support demand for the media types you want, particularly native and video.  To see which bidders have native and/or video demand, see [Bidders with Video and Native Demand](#bidders-with-video-and-native-demand).

## Implementation

This section describes the implementation using code samples, but ignores some of the details that are common to all Prebid.js setups.

### 1. Add multi-format ad units

In the ad unit below, we define the requirements for each media type that could serve: banner, native, or video.

```javascript

    pbjs.addAdUnits({
        code: 'div-banner-outstream-native',
        mediaTypes: {
            banner: {
                sizes: [
                    [300, 250],
                    [300, 50]
                ]
            },
            native: {
                image: {
                    sizes: [
                        [300, 250],
                        [300, 50]
                    ]
                }
            },
            video: {
                context: 'outstream',
                playerSize: [640, 480]
            },
        },
        bids: [

            {
                bidder: 'bannerBidder',
                params: {
                    placementId: '481'
                }
            },

            {
                bidder: 'nativeBidder',
                params: {
                    titleAsset: '516'
                }
            },

            {
                bidder: 'videoBidder',
                params: {
                    vidId: '234'
                }
            },

        ]
    });
```

### 2. Add your tag to the page body

```html
    <div id='div-banner-outstream-native'>
        <p>No response</p>
        <script type='text/javascript'>
            googletag.cmd.push(function () {
                googletag.display('div-banner-outstream-native');
            });
        </script>
    </div>
```

## Working Examples

+ [Prebid.js Multi-Format Example]({{site.baseurl}}/dev-docs/examples/multiformat-example.html)

## Related Topics

+ [Setting up Prebid Multi-Format in DFP]({{site.baseurl}}/adops/setting-up-prebid-multiformat-in-dfp.html)

</div>

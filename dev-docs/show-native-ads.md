---
layout: page_v2
title: Show Native Ads with Prebid.js
description: Show Native Ads with Prebid.js
pid: 0
is_top_nav: yeah
top_nav_section: dev_docs
nav_section: prebid-native
sidebarType: 1
---



# Show Native Ads with Prebid.js
{: .no_toc }

In this tutorial, we'll set up Prebid.js to show native ads.

We'll use the [AppNexus adapter]({{site.github.url}}/dev-docs/bidders.html#appnexus) since that adapter supports native ads, but the concepts and setup will be largely the same for any bidder adapter that supports the `"native"` media type.

Similarly, we'll use Google Ad Manager as the ad server, but the concept and implementation should be pretty similar to other ad servers.

{: .alert.alert-success :}
For a full working code sample using the techniques described on this page, see the [Prebid Native Example]({{site.github.url}}/examples/native/native-demo.html).

* TOC
{:toc}

## How Native Ads Work

A native ad is made up of *assets* such as a title, description, image URL, that are plugged into a publisher-defined HTML template.  The template includes placeholder macros for those assets, and may be styled to match the form of the surrounding page.

At a high level, Prebid.js' support for native ads works like this:

1. Prebid.js requests native demand from bidder adapters
2. It sends the received assets to a native template defined in your ad server using key-value targeting

The native ad responses get placed on specific keys that are sent into your ad server. For example:

+ `hb_native_title`
+ `hb_native_body`
+ `hb_native_body2`
+ `hb_native_brand`
+ `hb_native_image`
+ `hb_native_icon`
+ `hb_native_linkurl`
+ `hb_native_privacy`
+ `hb_native_privicon`
+ `hb_native_rating`
+ `hb_native_cta`

Note that these keys correspond directly to the `mediaTypes.native` object you define in your ad unit (which is [described in more detail below](#native-ad-keys)).

The ad ops team will then reference these keys in the ad server to set up the title, body, etc.  For ad ops setup instructions, see [Set up Native Ads in your Ad Server]({{site.github.url}}/adops/setting-up-prebid-native-in-dfp.html).

## Prerequisites

Keep the following prerequisites in mind during the implementation:

+ Make sure to work with native-enabled bidders. To see which bidders have native demand, see [Bidders with Video and Native Demand]({{site.baseurl}}/dev-docs/bidders.html#bidders-with-video-and-native-demand).

## Implementation

This section describes the implementation using code samples, but ignores some of the details that are common to all Prebid.js setups.  <!-- For full working example code, see the [Prebid Native example]({{site.github.url}}/dev-docs/examples/show-native-ads.html). -->

### 1. Set up your ad slot

In this example we'll store the ad slot info in a variable for reference throughout the page.  We use a 1x1 static ad slot size since AppNexus (our demand partner in this example) uses that size for native creatives.

{% highlight js %}
const slot = {
    code: '/19968336/prebid_native_adunit',
    div: 'div-prebid-native-test-1',
    size: [1, 1],
};
{% endhighlight %}

<a name="native-ad-keys" />

### 2. Add native ad units

The native object (shown [below](#native-object)) contains the following keys that correspond to the assets of the native ad:

{: .alert.alert-danger :}
Specific bidders may not support all of the fields listed below or may return differing responses for the assets that are requested.

{: .table .table-bordered .table-striped }
| Key           | Description                                                                          | Ad Server Key Value   |
|---------------+--------------------------------------------------------------------------------------|-----------------------|
| `title`       | The title of the ad, usually a call to action or a brand name.                       | `hb_native_title`     |
| `body`        | Text of the ad copy.                                                                 | `hb_native_body`      |
| `body2`       | Additional Text of the ad copy.                                                      | `hb_native_body2`     | 
| `sponsoredBy` | The name of the brand associated with the ad.                                        | `hb_native_brand`     |
| `icon`        | The brand icon that will appear with the ad.                                         | `hb_native_icon`      |
| `image`       | A picture that is associated with the brand, or grabs the user's attention.          | `hb_native_image`     |
| `clickUrl`    | Where the user will end up if they click the ad.                                     | `hb_native_linkurl`   |
| `displayUrl`  | Text that can be displayed instead of the raw click URL. e.g, "Example.com/Specials" | `hb_native_displayUrl`|
| `privacyLink` | Link to the Privacy Policy of the Buyer, e.g. http://example.com/privacy             | `hb_native_privacy`   |
| `privacyIcon` | Icon to display for the privacy link, e.g. http://example.com/privacy_icon.png       | `hb_native_privicon`  |
| `cta`         | *Call to Action* text, e.g., "Click here for more information".                      | `hb_native_cta`       |
| `rating`      | Rating information, e.g., "4" out of 5.                                              | `hb_native_rating`    |
| `downloads`   | The total downloads of the advertised application/product                            | `hb_native_downloads` |
| `likes`       | The total number of individuals who like the advertised application/product          | `hb_native_likes`     |
| `price`       | The non-sale price of the advertised application/product                             | `hb_native_price`     |
| `salePrice`   | The sale price of the advertised application/product                                 | `hb_native_saleprice` |
| `address`     | Address of the Buyer/Store. e.g, "123 Main Street, Anywhere USA"                     | `hb_native_address`   |
| `phone`       | Phone Number of the Buyer/Store. e.g, "(123) 456-7890"                               | `hb_native_phone`     |


Each key's value is an object with several fields.  Most important is the `required` field, which says whether that asset should be filled in by the bid response.  Specifically, bids that do not have all of the native assets marked as required will be dropped from the auction and will not be sent to the ad server.

<div class="alert alert-warning">
  <strong>Prebid Native Ad Validation</strong>
  <p>
   Prebid.js validates the assets on native bid responses like so:
  <ul>
      <li>
       If the asset is marked as "required: true", it checks the bid response to ensure the asset is part of the response. If the asset is marked as "required: false" it will be requested but may not have a value returned.
      </li>
      <li>
       However, Prebid.js does not do any additional checking of a required asset beyond ensuring that it's included in the response; for example, it doesn't validate that the asset has a certain length or file size, just that that key exists in the response JSON
      </li>
      <li>
       Finally, the response is checked to make sure it defines a landing page URL.
      </li>
    </ul>
  </p>
</div>

<a name="native-object" />

{% highlight js %}

pbjs.addAdUnits({
    code: slot.code,
    mediaTypes: {
        native: {
            image: {
                required: true,
                sizes: [150, 50]
            },
            title: {
                required: true,
                len: 80
            },
            sponsoredBy: {
                required: true
            },
            clickUrl: {
                required: true
            },
            privacyLink: {
                required: false
            },
            body: {
                required: true
            },
            icon: {
                required: true,
                sizes: [50, 50]
            }
        }
    },
    bids: [{
        bidder: 'appnexus',
        params: {
            placementId: 13232354
        }
    }, ]
})

{% endhighlight %}

{: .alert.alert-danger :}
For each native ad unit, all of the bidders within that ad unit must have declared native support in their adapter if you want ads to appear.  If there are any bidders without native support in a native ad unit, requests will not be made to those bidders.  For a list of bidders with native support, see [Bidders with Video and Native Demand]({{site.baseurl}}/dev-docs/bidders.html#bidders-with-video-and-native-demand).

#### Pre-defined native types

Prebid.js defines "types" of native ad for you as a convenience. This way you have less code to maintain, that is hopefully more descriptive of your intent.

For now there is only the `image` type, but more will be added.

The image native ad type implies the following required fields:

+ image
+ title
+ sponsoredBy
+ clickUrl

And the following optional fields:

+ body
+ icon
+ cta

A native "image-type" ad unit can be set up as shown in the following example.

```javascript
const adUnits = [{
    code: 'adUnit-code',
    mediaTypes: {
        native: {
            type: 'image'
        }
    }
    bids: [{
        bidder: 'appnexus',
        params: {
            placementId: 13232354
        }
    }]
}];
```

{% include dev-docs/native-image-asset-sizes.md %}

### 3. Add your native ad tag to the page body as usual:

{% highlight html %}
<div id="div-prebid-native-test-1">
    <script>
        googletag.cmd.push(function() {
            googletag.display('div-prebid-native-test-1');
        });
    </script>
</div>
{% endhighlight %}

## Sending Asset Placeholders

Prebid.js sends received asset values to a native template defined in your ad server using key-value targeting. The key-value targeting pairs are passed to the ad server as query string parameters. In some cases, sending native asset values as query string parameters may cause errors. For example, a long `clickUrl` value can exceed an ad request URL limit, or special characters within a `body` can get mangled by URL encoding. In these cases, you can opt to send URL-safe placeholder values to the ad server, and then in the native template, replace the placeholder values with the actual native values through a non-URL request to and response from Prebid.js. Here's how it works:

### 1. Configure which assets to send as placeholders

Within `mediaTypes.native`, add `sendId: true` to any asset object you wish to send as a placeholder. For example, to send `body` and `clickUrl` as placeholders:

```javascript
mediaTypes: {
  native: {
    body: {
      sendId: true
    },
    clickUrl: {
      sendId: true
    },
  },
},
```

### 2. Prebid.js sends placeholder values

For the assets configured with `sendId: true`, Prebid.js sends a placeholder value describing the asset type and the `adId` for the associated ad. In this example, Prebid.js would send the body and clickUrl assets as values like `hb_native_body:38a33cef3e926f` and `hb_native_linkurl:38a33cef3e926f`. The value after the `:` in each of these examples is the `adId` generated by Prebid for that native ad object.

### 3. Native template replaces the placeholders

Finally in the native template on the adserver, search for any expected placeholder values and replace them with their actual values.

Placeholder values will start with the `hb_native_...` key for that asset type, contain a `:` separator, and end with the `adId` for that ad object (available via the Prebid targeting key `hb_adid`). When Prebid.js receives a postmessage request in the form

```json
{
  "message": "Prebid Native",
  "action": "assetRequest",
  "adId": "38a33cef3e926f",
  "assets": [
    "hb_native_body",
    "hb_native_linkurl"
  ]
}
```

it will respond to that request with the actual asset values for that `adId` in the form

```json
{
  "message": "assetResponse",
  "adId": "30655b7d68dc51",
  "assets": [
    {
      "key": "body",
      "value": "This is a Prebid Native Creative"
    },
    {
      "key": "clickUrl",
      "value": "http://prebid.org/dev-docs/show-native-ads.html"
    }
  ]
}
```

A script within the native template can listen for this response and replace the placeholder values with their actual values.

{: .alert.alert-success :}
The `native-trk.js` script from `prebid-universal-creative` can replace native placeholder values with their actual values. If a native template includes a link with a `pbAdId` attribute set to the targeting key `hb_adid`, and a `class` attribute set to `"pb-click"`, the function `pbNativeTag.startTrackers` will replace any placeholders found within the HTML template (but not CSS template) with their actual values automatically. For more on how to set this up in a native template, see [Style your native ad]({{site.github.url}}/adops/setting-up-prebid-native-in-dfp.html#3-style-your-native-ad)

## Working Examples

+ [Prebid Native with two slots]({{site.github.url}}/examples/native/native-demo.html)
+ [Prebid Native Examples]({{site.github.url}}/examples/native)

## Related Topics

+ [Setting up Prebid Native in Google Ad Manager]({{site.github.url}}/adops/setting-up-prebid-native-in-dfp.html) (Ad Ops Setup Instructions)



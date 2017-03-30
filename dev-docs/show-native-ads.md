---
layout: page
title: Show Native Ads with Prebid.js
description: Show Native Ads with Prebid.js
pid: 0
is_top_nav: yeah
top_nav_section: dev_docs
nav_section: prebid-native
---

<div class="bs-docs-section" markdown="1">

# Show Native Ads with Prebid.js
{: .no_toc }

In this tutorial, we'll show how to set up Prebid.js to show native ads.  We'll use the [AppNexus AST adapter]({{site.github.url}}/dev-docs/bidders.html#appnexusAst) since that adapter supports native ads, but the concepts and setup will be largely the same for any bidder adapter that supports the native media type.  Similarly, we'll use DFP as the ad server, but the concept and implementation should be pretty similar to other ad servers.

{: .alert.alert-success :}
For a full working code sample using the techniques described on this page, see the [Prebid Native Example]({{site.github.url}}/dev-docs/examples/prebid-native-example.html).

* TOC
{:toc}

## How Native Ads Work

Native ads provide publishers with ad content, but leave it up to publishers as to how to display the content.  Therefore, the native bid response is a set of assets, such as a *title*, a *body*, and an *image URL*.

The assets are then taken and plugged into a creative template on the ad server.  The template will be a publisher-defined set of HTML and CSS.  There might be an H1 for the title, markup for the body, images, etc.  The assets get plugged into the template, and the template gets rendered to the page.

In the Prebid.js context, when you make a native request, you get a native response.  The responses get placed on specific keys that are sent into your ad server:

+ `hb_native_title`
+ `hb_native_body`
+ `hb_native_brand`
+ `hb_native_image`
+ `hb_native_icon`
+ `hb_native_linkurl`

The ad ops team will then reference these keys in their ad server to set up the title, body, etc.

For ad ops instructions for setting up native ads, see [Set up Native Ads in your Ad Server]({{site.github.url}}/adops/setting-up-prebid-native-in-dfp.html).

## Prerequisites

Keep the following prerequisites in mind during the implementation:

+ Make sure to work with native-enabled bidders (In the file `adapters.json` in the [Prebid.js repo](), the bidder will have `"native"` in their list of supported media types).

## Implementation

This section describes the implementation using code samples, but ignores some of the details that are common to all Prebid.js setups.  For full working example code, see the [Prebid Native example]({{site.github.url}}/dev-docs/examples/show-native-ads.html).

### 1. Set up your ad slot

In this example we'll store the ad slot info in a variable for reference throughout the page.  Note that the size is `"fluid"` because this is a native ad, so the size of the ad will be determined by the creative template in the publisher's ad server.

{% highlight js %}
const slot = {
    code: '/19968336/prebid_native_adunit',
    div: 'div-prebid-native-test-1',
    size: ['fluid'],
};
{% endhighlight %}

### 2. Add native ad units

As usual, we add the ad units to the auction.  This time, in addition to the usual things, we fill out a new `nativeParams` object, with the following keys that correspond to the assets of the native ad:

{: .table .table-bordered .table-striped }
| Key     | Description                                                                 |
|---------+-----------------------------------------------------------------------------|
| `title` | The title of the ad, usually a call to action or a brand name.              |
| `body`  | Text of the ad copy.                                                        |
| `brand` | The name of the brand associated with the ad.                               |
| `image` | A picture that is associated with the brand, or grabs the user's attention. |
| `url`   | Where the user will end up if they click the ad.                            |

Each key's value is an object with several fields.  Most important is the `required` field, which says whether that asset should be filled in by the bid response.

{% highlight js %}
pbjs.addAdUnits({
  code: slot.code,
  sizes: slot.size,
  nativeParams: {
    // type: 'image',
    title: {
      required: true,
      len: 80
    },
    body: {
      required: true
    },
    brand: {
      required: true
    },
    image: {
      required: true
    },
    url: {
      required: true
    },
  },
  bids: [
    {
      bidder: 'appnexusAst',
      params: {
        placementId: '10433394'
      }
    },
  ]
});
{% endhighlight %}

{: .alert.alert-danger :}
For each native ad unit, all of the bidders within that ad unit must have declared native support in `adapters.json`.  If there are any bidders without native support in a native ad unit, the request won't be made.

### 3. Define your native ad slot with `googletag`

Define the native ad slot with `googletag` as shown below.  Note that you need to pass the `"fluid"` size array here as well.

{% highlight js %}
googletag.cmd.push(function() {
    googletag.defineSlot(
        '/19968336/prebid_native_adunit', ['fluid'],
        'div-prebid-native-test-1'
    ).addService(googletag.pubads());
{% endhighlight %}

### 4. Add the native ad slot to the page body

Add your ad tag to the page as usual:

{% highlight html %}
<div id="div-prebid-native-test-1">
    <script>
        googletag.cmd.push(function() {
            googletag.display('div-prebid-native-test-1');
        });
    </script>
</div>
{% endhighlight %}

## Related Topics

+ [Prebid Native example]({{site.github.url}}/dev-docs/examples/show-native-ads.html) (Example Code for Developers)
+ [Setting up Prebid Native in DFP]({{site.github.url}}/adops/setting-up-prebid-native-in-dfp.html) (Ad Ops Setup Instructions)

</div>

---

layout: page_v2
title: Prebid.js Native Implementation Guide
description: Prebid.js Native Implementation Guide
sidebarType: 1

---

# Prebid.js Native Implementation Guide
{: .no_toc}

{% capture version2 %}
This document replaces the [previous native documentation](/prebid/native-implementation-legacy.html) that described how Prebid.js supported native creatives. That documentation is still valid, but the approach described here is better in every way, so we recommend that all new and revised implementations should follow this approach. Here are the key differences between the original approach and the new, preferred approach:
{::nomarkdown}
<ul>
<li>The native approach is compliant with <a href="https://www.iab.com/wp-content/uploads/2018/03/OpenRTB-Native-Ads-Specification-Final-1.2.pdf">the Native OpenRTB spec, version 1.2</a>, with the notable exception of video support.</li>
<li>The request object specified in the AdUnit's `mediatype` object is the plain OpenRTB request.</li>
<li>The OpenRTB response is passed to rendering code in `bid.ortb`.</li>
</ol>
{:/}
{% endcapture %}
{% include alerts/alert_tip.html content=version2 %}

- TOC
{:toc}

## Overview

A native ad is a collection of 'assets' such as title, description, and image that are plugged into a publisher-defined HTML template. The template includes placeholder macros for those assets, and may be styled to match the form of the surrounding page.

At a high level, here's now native ads work in Prebid.js:

- The publisher establishes one or more native rendering templates
- The publisher defines which AdUnits are eligible for native ads and the bidders participating in the auction.
- Prebid.js requests native demand from bidder adapters that support the “native” mediatype.
- Native bids are stored in the Prebid.js memory space.
- The call to the ad server is made as usual.
- If the native ad wins, it’s displayed and any trackers are fired.

{: .alert.alert-info :}
To determine whether a bidder can supply native demand, check the [bidder parameter page](/dev-docs/bidders.html).

## 1. Set up your ad server ad slot and HTML div

Create your ad server in-page implementation as usual. See [Setting Up Prebid Native in GAM](/adops/gam-native.html) for instructions for how to do this with Google Ad Manager.

There's no reason you couldn't use Prebid native ads with other ad servers, but we don't
have any instructions handy. Ad server vendors are welcome to submit documentation.

## 2. Determine where the native template will be defined

There are three options for defining the native template:

- If you want to manage your creative within the ad server (e.g. Google Ad Manager), follow the instructions for [AdServer-Defined Template](#41-implementing-adserver-defined-template).
- If you’d prefer to manage your creative within the Prebid.js AdUnit, follow the instructions for [AdUnit-Defined Template](#42-implementing-adunit-defined-template).
- If you’d prefer to manage your creative from a separate piece of JavaScript, follow the instructions for the [Custom Renderer](#43-implementing-the-custom-renderer-scenario).

This table summarizes how the 3 approaches work:

**Table 1: Native Implementation Approaches**

{: .table .table-bordered .table-striped }
| Component | AdServer-Defined Creative Scenario | AdUnit-Defined Creative Scenario | Custom Renderer Scenario |
| --- | --- |--- | --- |
| Prebid.js | mediaTypes. native.sendTargetingKeys: false | sendTargetingKeys:false and mediaTypes.native.adTemplate contains ##macros## | sendTargetingKeys:false and mediaTypes.native.rendererUrl |
| Ad Server Key Value Pairs | hb_adid | hb_adid | hb_adid |
| Ad Server | Native template loads native.js and calls renderNativeAd(). Uses Prebid ##macro## format. | Native creative loads native.js and calls renderNativeAd() with requestAllAssets: true | Native creative loads native.js and calls renderNativeAd(), with requestAllAssets:true |
| Prebid Universal Creative | renderNativeAd resolves macros in the creative body and CSS. | renderNativeAd resolves ##macros## in adTemplate and CSS, appending the adTemplate to the creative body | renderNativeAd loads javascript from renderUrl, calls the renderAd function, appending the results to the creative body. |
| Javascript rendering function | n/a | n/a | Receives the ortb response into `bid.ortb`, and the renderer is responsible for resolving any macro format and returning an HTML block. |

## 3. Prebid.js Native AdUnit Overview

The Prebid.js AdUnit needs to define a native mediatype object to tell bidders which assets are required. This table defines all attributes that could be included in AdUnit.mediatypes.native.

**Table 2: Prebid.js AdUnit Native MediaType Options**

{: .table .table-bordered .table-striped }
| Attribute | Scope | Description | Example | Type |
| --- | --- | --- | --- | --- |
| adTemplate | optional | Used in the ‘AdUnit-Defined Creative Scenario’, this value will contain the Native template right in the page. | See [example](#42-implementing-adunit-defined-template) below. | escaped ES5 string |
| rendererUrl | optional | Used in the ‘Custom Renderer Scenario’, this points to javascript code that will produce the Native template. | 'https://host/path.js' | string |
| ortb | recommended | OpenRTB configuration of the Native assets. The Native 1.2 specification can be found [here](https://www.iab.com/wp-content/uploads/2018/03/OpenRTB-Native-Ads-Specification-Final-1.2.pdf) | { assets: [], eventtrackers: [] } | object |
| sendTargetingKeys | deprecated | Defines whether or not to send the hb_native_ASSET targeting keys to the ad server. Defaults to `false`. | `false` | boolean |

### 3.1. Prebid.js and the ORTB asset fields

Prebid.js supports most assets defined by the OpenRTB native 1.2 specification. The
exception is 'video', which could be passed through to bidders, but cannot currently
be rendered.

As a gentle introduction to the OpenRTB in Prebid: a request object is a javascript object that contains some well-defined properties, like

```javascript
{
    native: {
        ...
        ortb: {
            assets: [...],
            eventtrackers: [...]
        }
    }
}
```

`assets` are the components of the ad that will assembled using the template. An asset must have an `id`, used for matching the request with the response.

Each asset should have one of the following properties:

#### 3.1.1. Title Asset

This is a regular title and the most important property is `len`, to specify the length. Here's an example: 

```javascript
{
    id: 2,
    required: 1,
    title: {
        len: 80
    }
},
```

#### 3.1.2. Image Asset

Contains an image request. Images can be of type `1` (Icon) or `3` (Main image). There are several ways to specify the image size or aspect ratio; the [OpenRTB spec](https://www.iab.com/wp-content/uploads/2018/03/OpenRTB-Native-Ads-Specification-Final-1.2.pdf) contains all the possibilities. Here's an example: 

```javascript
{
    id: 1,
    required: 1,
    img: {
        type: 3,
        w: 150,
        h: 50
    }
}
```

#### 3.1.3. Data Asset

A 'data' asset is a 'misc' component like "sponsored by", "rating", likes", or other fields that have been standardized in OpenRTB 1.2. Each data asset has a `type`, and based on that type the bidders will respond with the appropriate data. For example, you can request for the name of the sponsoring company by using the type `1`. 

Here's an example: 

```javascript
{
    id: 3,
    required: 1,
    data: {
        type: 1
    }
},
```

For reference, this is the table that specifies all data types: 

{: .table .table-bordered .table-striped }
| Type ID | Name |
| ------- | ---- |
| 1 | sponsored |
| 2 | desc |
| 3 | rating |
| 4 | likes |
| 5 | downloads |
| 6 | price |
| 7 | saleprice |
| 8 | phone |
| 9 | address |
| 10 | desc2 |
| 11 | displayurl |
| 12 | ctatext |
| 500+ | Reserved for exchange specific usage |

Please consult the [OpenRTB Native spec](https://www.iab.com/wp-content/uploads/2018/03/OpenRTB-Native-Ads-Specification-Final-1.2.pdf) for more details.

### 3.2. Custom native assets

In order to fit special bidder requirements, publisher can utilize various `ext` objects provided by OpenRTB specs.

Bid adapters will declare which custom assets they support in their documentation.

{: .alert.alert-success :}
Note: The `native.js::renderNativeAd()` function must be called with `requestAllAssets: true`.

In the native template, simply access the custom value with the normal Prebid `##macro##` format assuming `hb_native_asset_id_` as the prefix. For example, if your custom asset has `id: 7`:

```html
<div id="mytemplate">
  ... render a lovely creative ...
  ... refer to ##hb_native_asset_id_7## when appropriate ...
</div>
```

## 4. Implementing the Native Template

- If you want to manage your creative within the ad server (e.g. Google Ad Manager), follow the instructions for [AdServer-Defined Creative](#41-implementing-adserver-defined-template).
- If you’d prefer to manage your creative within the Prebid.js AdUnit, follow the instructions for [AdUnit-Defined Creative](#42-implementing-an-adunit-defined-template).
- If you’d prefer to manage your creative from a separate piece of JavaScript, follow the instructions for the [Custom Renderer](#43-implementing-the-custom-renderer-scenario).

{: .alert.alert-info :}
For instructions on implementing the native template within Google Ad Manager, see [GAM Step by Step - Native Creative](/adops/gam-native.html)

### 4.1. Implementing AdServer-Defined Template

In this scenario, the body of the native creative template is managed within the ad server and includes special Prebid.js macros.

#### 4.1.1. Turn Targeting Keys off in Prebid.js

When the native AdUnit is defined in the page, declare `sendTargetingKeys: false` in the native Object. This will prevent Prebid.js from sending all the native-related ad server targeting variables.

Example Native AdUnit:

```javascript
pbjs.addAdUnits({
    code: slot.code,
    mediaTypes: {
        native: {
            sendTargetingKeys: false,
            ortb: {
                assets: [{
                    id: 1,
                    required: 1,
                    img: {
                        type: 3,
                        w: 150,
                        h: 50,
                    }
                },
                {
                    id: 2,
                    required: 1,
                    title: {
                        len: 80
                    }
                },
                {
                    id: 3,
                    required: 1,
                    data: {
                        type: 1
                    }
                },
                {
                    id: 4,
                    required: 1,
                    data: {
                        type: 2
                    }
                },
                {
                    id: 6,
                    required: 1,
                    img: {
                        type: 1,
                        w: 50,
                        h: 50,
                    }
                }]
            }
        }
    },
    bids: [{
        ...
    }]
});
```

#### 4.1.2. Create the Native Template in the Ad Server

There are three key aspects of the native template:

1. Build the creative with special Prebid.js macros, e.g. `##hb_native_asset_id_{id}##.` Note that macros can be placed in the body (HTML) and/or head (CSS) of the native creative.
2. Load the Prebid.js native rendering code. You may utilize the jsdelivr version of native.js or host your own copy. If you use the version hosted on jsdelivr, make sure any necessary ad server permissions are established.
3. Invoke the Prebid.js native rendering function with an object containing the following attributes:
    1. adid - used to identify which Prebid.js creative holds the appropriate native assets
    2. pubUrl - the URL of the page, which is needed for the HTML postmessage call
    3. requestAllAssets - tells the renderer to get all the native assets from Prebid.js rather than having to scan the template to find which specific assets are needed.

Example creative HTML:

```html
<div class="sponsored-post">
  <div class="thumbnail" style="background-image: url(##hb_native_asset_id_1##);"></div>
  <div class="content">
    <h1><a href="%%CLICK_URL_UNESC%%##hb_native_linkurl##" target="_blank" class="pb-click" hb_native_asset_id="2">##hb_native_asset_id_2##</a></h1>
    <p>##hb_native_asset_id_4##</p>
    <div class="attribution">##hb_native_asset_id_3##</div>
  </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/prebid-universal-creative@latest/dist/%%PATTERN:hb_format%%.js"></script>
<script>
    var pbNativeTagData = {};
    pbNativeTagData.pubUrl = "%%PATTERN:url%%";     // GAM specific
    pbNativeTagData.adId = "%%PATTERN:hb_adid%%";   // GAM specific
    // if you're using 'Send All Bids' mode, you should use %%PATTERN:hb_adid_BIDDER%%
    pbNativeTagData.requestAllAssets = true;
    window.pbNativeTag.renderNativeAd(pbNativeTagData);
</script>
```

{: .alert.alert-warning :}
When using 'Send All Bids' mode you should update `pbNativeTagData.adId = "%%PATTERN:hb_adid_BIDDERCODE%%";` for each bidder’s creative.

{: .alert.alert-info :}
Note the URL to the [Prebid Universal Creative](/overview/prebid-universal-creative.html) shown in this example uses the format where %%PATTERN:hb_format%% resolves to load native.js instead of banner.js or video.js.

Example CSS:

```css
.sponsored-post {
    background-color: #fffdeb;
    font-family: sans-serif;
    padding: 10px 20px 10px 20px;
}

.content {
    overflow: hidden;
}

.thumbnail {
    width: 120px;
    height: 100px;
    float: left;
    margin: 0 20px 10px 0;
    background-image: url(##native_image##);
    background-size: cover;
}

h1 {
    font-size: 18px;
    margin: 0;
}

a {
    color: #0086b3;
    text-decoration: none;
}

{: .alert.alert-info :}
See [Managing the Native Template in GAM](/adops/gam-native.html#managing-the-native-template-in-gam) for ad server instructions.

.attribution {
    color: #fff;
    font-size: 9px;
    font-weight: bold;
    display: inline-block;
    letter-spacing: 2px;
    background-color: #ffd724;
    border-radius: 2px;
    padding: 4px;
}
```

### 4.2. Implementing an AdUnit-Defined Template

In this scenario, the body of the native creative template is managed within the Prebid.js AdUnit and includes special Prebid.js macros.

#### 4.2.1. Prebid.js AdUnit Setup

When the Native AdUnit is defined in the page:

- Declare `sendTargetingKeys: false` in the native Object. This will prevent Prebid.js from sending all the native-related ad server targeting variables.
- Define the adTemplate as an escaped ES5 string using Prebid.js ##macros##. (See the appendix for an exhaustive list of assets and macros.) Note that this approach only affects the HTML body. Any CSS definitions need to be defined in the body of the template or in the AdServer.

Example AdUnit:

```javascript
var adUnits = [{
      code: 'native-div',
      mediaTypes: {
          native: {
        sendTargetingKeys: false,
            adTemplate: `<div class="sponsored-post">
                <div class="thumbnail" style="background-image: url(##hb_native_asset_id_1##);"></div>
                <div class="content">
                    <h1>
                        <a href="%%CLICK_URL_UNESC%%##hb_native_linkurl##" target="_blank" class="pb-click" hb_native_asset_id="2">##hb_native_asset_id_2##</a>
                    </h1>
                    <p>##hb_native_asset_id_4##</p>
                    <div class="attribution">##hb_native_asset_id_3##</div>
                </div>
            </div>`,
            ortb: {
                assets: [
                    {
                        id: 1,
                        required: 1,
                        img: {
                            type: 3,
                            w: 989,
                            h: 742,
                        }
                    }
                    {
                        id: 2,
                        required: 1,
                        title: {
                            len: 800,
                        }
                    },
                    {
                        id: 3,
                        required: true,
                        data: {
                            type: 1
                        }
                    },
                    {
                        id: 4,
                        required: true,
                        data: {
                            type: 2
                        }
                    }
                ]
            }
          }
        }
    }
}];
```

#### 4.2.2. Define the AdServer Creative

Even though the body of the native creative is defined in the AdUnit, an AdServer creative is still needed. There are two key aspects of the native creative in this scenario:

1. Load the Prebid.js native rendering code. You may utilize the jsdelivr version of native.js or host your own copy. If you use the version hosted on jsdelivr, make sure any necessary ad server permissions are established.
2. Invoke the Prebid.js native rendering function with an object containing the following attributes:
    1. adid - used to identify which Prebid.js creative holds the appropriate native assets
    2. pubUrl - the URL of the page, which is needed for the HTML postmessage call
    3. requestAllAssets - tells the renderer to get all the native assets from Prebid.js. The rendering function cannot currently scan a template defined in the AdUnit.

Example Creative HTML

```html
<script src="https://cdn.jsdelivr.net/npm/prebid-universal-creative@latest/dist//%%PATTERN:hb_format%%.js"></script>
<script>
    var pbNativeTagData = {};
    pbNativeTagData.pubUrl = "%%PATTERN:url%%";     // GAM specific
    pbNativeTagData.adId = "%%PATTERN:hb_adid%%";   // GAM specific
    // if you're using 'Send All Bids' mode, you should use %%PATTERN:hb_adid_BIDDER%%
    pbNativeTagData.requestAllAssets = true;
    // if you want to track clicks in GAM, add the following variable
    pbNativeTagData.clickUrlUnesc = "%%CLICK_URL_UNESC%%";
    window.pbNativeTag.renderNativeAd(pbNativeTagData);
</script>
```

{: .alert.alert-warning :}
When using 'Send All Bids' mode you should update `pbNativeTagData.adId = "%%PATTERN:hb_adid_BIDDERCODE%%";` for each bidder’s creative.

{: .alert.alert-info :}
See [Managing the Native Template Outside of GAM](/adops/gam-native.html#managing-the-native-template-outside-of-gam) for ad server instructions.

### 4.3. Implementing the Custom Renderer Scenario

In this scenario, the body of the native creative is managed from an external JavaScript file.

#### 4.3.1. Prebid.js AdUnit Setup

When the Native AdUnit is defined in the page:

- Declare`sendTargetingKeys: false` in the Native Object. This will prevent Prebid.js from sending all the native-related ad server targeting variables.
- Define the `rendererUrl` as a URL that defines a `window.renderAd` function in the creative iframe. The html returned by the `window.renderAd` function will be attached to the creative's DOM.

Example AdUnit setup:

``` javascript
var adUnits = [{
      code: 'native-div',
      mediaTypes: {
          native: {
        sendTargetingKeys: false,
            rendererUrl: "https://files.prebid.org/creatives/nativeRenderFunction.js",
            ortb: {
                assets: [{
                        id: 1,
                        required: 1,
                        img: {
                            type: 3,
                            w: 989,
                            h: 742,
                        }
                    },
                    {
                        id: 2,
                        required: 1,
                        title: {
                            len: 800,
                        }
                    },
                    {
                        id: 3,
                        required: true,
                        data: {
                            type: 1
                        }
                    },
                    {
                        id: 4,
                        required: true,
                        data: {
                            type: 2
                        }
                    }
                ]
            }
          }
        }
    }
}];
```

#### 4.3.2. Define the AdServer Creative

Even though the body of the native creative is defined in the external JavaScript, an AdServer creative is still needed. There are two key aspects of the native creative in this scenario:

1. Load the Prebid.js native rendering code. You may utilize the jsdelivr version of native.js or host your own copy. If you use the version hosted on jsdelivr, make sure any necessary ad server permissions are established.
2. Invoke the Prebid.js native rendering function with an object containing the following attributes:
    1. adid - used to identify which Prebid.js creative holds the appropriate native assets
    2. pubUrl - the URL of the page, which is needed for the HTML postmessage call
    3. requestAllAssets - tells the renderer to get all the native assets from Prebid.js so they can be passed to the render function.

Example creative HTML:

```html
<script src="https://cdn.jsdelivr.net/npm/prebid-universal-creative@latest/dist//%%PATTERN:hb_format%%.js"></script>
<script>
    var pbNativeTagData = {};
    pbNativeTagData.pubUrl = "%%PATTERN:url%%";    // GAM specific
    pbNativeTagData.adId = "%%PATTERN:hb_adid%%";  // GAM specific
    // if you're using 'Send All Bids' mode, you should use %%PATTERN:hb_adid_BIDDER%%
    pbNativeTagData.requestAllAssets = true;
    // if you want to track clicks in GAM, add the following variable
    pbNativeTagData.clickUrlUnesc = "%%CLICK_URL_UNESC%%";
    window.pbNativeTag.renderNativeAd(pbNativeTagData);
</script>
```

{: .alert.alert-warning :}
When using `Send All Bids` you should update `pbNativeTagData.adId = "%%PATTERN:hb_adid_biddercode%%";` for each bidder’s creative

{: .alert.alert-info :}
See [Managing the Native Template Outside of GAM](/adops/gam-native.html#managing-the-native-template-outside-of-gam) for ad server instructions.

#### 4.3.3. Define the Render JavaScript

Requirements for a native rendering function:

- It must define a `window.renderAd()` function that will be called by the Prebid Universal Creative
- The `renderAd()` function is passed an object containing an `ortb` property that contains the response in OpenRTB format, and must return a fully resolved and ready-to-display block of HTML that will be appended to the body.
- The renderer can optionally expose a `window.postRenderAd()` function that can be useful to trigger javascript functions.

Here's an example script:

``` javascript
window.renderAd = function(bid) {
    const { ortb } = bid;
    let template = `
    <div class="sponsored-post">
        <div class="thumbnail" style="background-image: url(##hb_native_asset_id_1##);"></div>
        <div class="content">
            <h1>
                <a href="%%CLICK_URL_UNESC%%##hb_native_linkurl##" target="_blank" class="pb-click" hb_native_asset_id="2">
                ##hb_native_asset_id_2##
                </a>
            </h1>
            <p>##hb_native_asset_id_4##</p>
            <div class="attribution">##hb_native_asset_id_3##</div>
        </div>
    </div>`;

    const getAssetValue = (asset) => {
        if (asset.img) {
            return asset.img.url;
        }
        if (asset.data) {
            return asset.data.value;
        }
        if (asset.title) {
            return asset.title.text;
        }
        if (asset.video) {
            return asset.video.vasttag;
        }
    }

    ortb.assets.forEach(asset => {
        template = template.replace(`##hb_native_asset_id_${asset.id}##`, getAssetValue(asset));
    });

    if (ortb.privacy) {
        template = template.replace("##hb_native_privacy##", ortb.privacy);
    }
    template = template.replace("##hb_native_linkurl##", ortb.link.url);
    return template;
}

window.postRenderAd(bid) {
    console.log('Native ad has been attached to the DOM');
    // again, the ortb is in bid.ortb
    ...
}
```

{: .alert.alert-info :}
Note that the format of any macros in external render JavaScript is totally up to you. The data object coming is in OpenRTB format.

## 5. Technical Details

A few details that may help understand and debug your setup:

1. The system assumes that native creatives will be wrapped in an iframe.
1. The native assets are stored in the Prebid.js memory space as the original OpenRTB response.
1. When the `window.pbNativeTag.renderNativeAd()` function is called, an HTML5 postmessage is made. Prebid.js is listening for this message, and responds with the bidder's OpenRTB assets.
1. If the template was defined in the AdServer, the body of the iframe will be replaced. Otherwise, if the template was defined in the AdUnit or external JavaScript, the body of the iframe will be appended with resolved creative HTML.
1. If the AdServer supports it, CSS styles can be defined in the iframe head. Otherwise, they must be defined in the body of the template, for example with <style> tags.
1. Note that native iframes will be resized to the height of the creative after render.

## 6. Event tracking

Native ads support 3 different types of event tracking:

- impression tracking
- click tracking
- viewability tracking

### 6.1. Impression Tracking

Prebid supports both methods (`img` and `js`) for impression tracking. Publishers just need to specify which method is support for which adUnit. This is configured in `adUnit.mediaTypes.native.ortb.eventtrackers`. For more details take a look at the [OpenRTB spec](https://www.iab.com/wp-content/uploads/2018/03/OpenRTB-Native-Ads-Specification-Final-1.2.pdf).

How impression tracking works step by step:

- When the `window.pbNativeTag.renderNativeAd()` is called, the Prebid Universal Creative will request OpenRTB response from Prebid.js (via postmessage).
- Prebid.js responds with OpenRTB response that contains `eventtrackers`
- When the Prebid Universal Creative renders the native ad, it will gather all impression trackers from the response and for each tracker it will:
  - if tracker is `img` method, Prebid Universal Creative will fire pixel provided in the `url` property
  - if tracker is `js` method, Prebid Universal Creative will load the script in the same iframe where native ad is rendered

The publisher doesn't need to implement anything for impression tracking to work, all that is needed is proper configuration of OpenRTB request on adUnit level. Prebid.js + Prebid Universal Creative will automatically take care of the impression tracking.

### 6.2 Click tracking

According to the [OpenRTB spec](https://www.iab.com/wp-content/uploads/2018/03/OpenRTB-Native-Ads-Specification-Final-1.2.pdf), click trackers can be found in `link` objects. There is 'master' `link` object for the entire native ad and also each asset in the response can have it's own separate `link` object.

When native ad is rendered prebid universal creative will attach `click` listeners on all DOM elements that have class `pb-click`. Which means it's up to the publisher to decide which DOM objects are 'clickable'.

Furthermore, prebid universal creative can also track if some specific asset is clicked. To enable this, publisher needs to assign custom attribute to associated DOM element: `hb_native_asset_id="5"`. In that case if user clicks on asset with `id: 5` prebid universal creative will take `link` object from that asset and fire all click trackers. If asset doesn't have `link` object, prebid universal creative will fire all click trackers associated with 'master' `link` object (as described in openRTB specs).

```html
<div class="pb-click" hb_native_asset_id="5">
```

If the user clicks on this div, the Prebid Universal Creative will take the `link` object from the identified asset and fire any click trackers. If the asset doesn't have a `link` object, it will just fire the click trackers associated with 'master' `link` object.

Example of how to configure a template so that the Prebid Universal Creative can fire click trackers:

``` html
<div class="sponsored-post">
  <div class="thumbnail" style="background-image: url(##hb_native_asset_id_1##);"></div>
  <div class="content">
    <h1><a href="%%CLICK_URL_UNESC%%##hb_native_linkurl##" target="_blank" class="pb-click" hb_native_asset_id="2">##hb_native_asset_id_2##</a></h1>
    <p class="pb-click" hb_native_asset_id="4">##hb_native_asset_id_4##</p>
    <div class="attribution" class="pb-click" hb_native_asset_id="3">##hb_native_asset_id_3##</div>
  </div>
</div>
```

## 7. Ad Server Implementation Details

There are detailed [instructions for setting up native in GAM](/adops/gam-native.html), but none of the Prebid functionality is specific to GAM. The requirements to use any of these approaches in a different ad server are:

1. Put the creative in an iframe and load native.js
1. Invoke the renderNativeAd() function with a hash that includes the following values:
    1. pbNativeTagData.pubUrl = "PAGE URL";
    1. pbNativeTagData.adId = "PREBID ADID";
    1. pbNativeTagData.requestAllAssets = true;
1. renderNativeAd() will look for the existence of an "adTemplate" value in the AdUnit. If it finds one, it will resolve macros and append it to the iframe's body.
1. Otherwise, renderNativeAd() will look for the existence of a "rendererUrl" value in the AdUnit. If it finds one, it loads the script then calls window.renderAd() and appends the results to the iframe's body.
1. Otherwise renderNativeAd() scans the iframe body and resolves macros.

## Further Reading

- [Prebid Native Format](/formats/native.html)
- [Setting Up Prebid Native in GAM](/adops/gam-native.html)

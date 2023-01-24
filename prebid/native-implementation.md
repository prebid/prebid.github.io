---

layout: page_v2
title: Prebid.js Native Implementation Guide
description: Prebid.js Native Implementation Guide
sidebarType: 1

---

# Prebid.js Native Implementation Guide
{: .no_toc}

{% capture version2 %}
This document replaces the [original native documentation](/dev-docs/show-native-ads.html) that described how Prebid.js supported native creatives. That documentation is still valid, but the approach described here is better in every way, so we recommend that all new and revised implementations should follow this approach. Here are the key differences between the original approach and the new, preferred approach:
{::nomarkdown}
<ul>
<li>The macro format is different: instead of using AdServer-defined macros, Prebid.js now has its own macro format.
<li>Targeting variables aren't sent from Prebid.js to the AdServer. Rather, they're queried at display time.
<li>A different rendering library is used.
</ol>
{:/}
{% endcapture %}
{% include alerts/alert_important.html content=version2 %}

* TOC
{:toc}


## Overview

A native ad is made up of assets such as a title, description, and image URL that are plugged into a publisher-defined HTML template. The template includes placeholder macros for those assets, and may be styled to match the form of the surrounding page.

At a high level, Prebid.js’ support for native ads works like this:

- The publisher establishes one or more native rendering templates and sets up the ad server.
- The publisher defines which AdUnits are eligible for native ads and the bidders participating in the auction.
- Prebid.js requests native demand from bidder adapters that support the “native” mediatype.
- Native bids are stored in the Prebid.js memory space.
- The call to the ad server is made as usual.
- If the native ad wins, it’s displayed and any trackers are fired.

{: .alert.alert-info :}
To determine whether a bidder can supply native demand, check the [bidder parameter page](/dev-docs/bidders.html).

## 1. Set up your ad server ad slot and HTML div

Create your ad server in-page implementation as usual. See [Setting Up Prebid Native in GAM](/adops/gam-native.html) for instructions for how to do this with Google Ad Manager.

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
| Ad Server | Native template loads native-render.js and calls renderNativeAd(). Uses Prebid ##macro## format. | Native creative loads native-render.js and calls renderNativeAd() with requestAllAssets: true | Native creative loads native-render.js and calls renderNativeAd(), with requestAllAssets:true |
| Prebid Universal Creative | renderNativeAd resolves macros in the creative body and CSS. | renderNativeAd resolves ##macros## in adTemplate and CSS, appending the adTemplate to the creative body | renderNativeAd loads javascript from renderUrl, calls the renderAd function, appending the results to the creative body. |
| Javascript rendering function | n/a | n/a | Receives hash of attributes, responsible for resolving any macro format and returning an HTML block. |

## 3. Prebid.js Native AdUnit Overview

The Prebid.js AdUnit needs to defines a native mediatype object to tell bidders which assets are required. This table defines all attributes that could be included in AdUnit.mediatypes.native. Specific examples of the three different scenarios follow.

**Table 2: Prebid.js AdUnit Native MediaType Options**

{: .table .table-bordered .table-striped }
| Attribute | Scope | Description | Example | Type |
| --- | --- | --- | --- | --- |
| sendTargetingKeys | optional | Defines whether or not to send the hb_native_ASSET targeting keys to the ad server. Defaults to `true` for now, though we recommend setting this to `false` and utilizing one of the ways to define a native template. | `false` | boolean |
| adTemplate | optional | Used in the ‘AdUnit-Defined Creative Scenario’, this value controls the Native template right in the page. | See [example](#42-implementing-adunit-defined-template) below. | escaped ES5 string |
| rendererUrl | optional | Used in the ‘Custom Renderer Scenario’, this points to javascript code that will produce the Native template. | 'https://host/path.js' | string |
| type | optional | A “type” is like a macro that defines a group of assets. The only value currently supported is ‘image’, which implies the following assets: image, title, sponsoredBy, clickUrl, body, icon, and cta. The first 4 are required attributes. | `image` | string |
| ASSETCODE. required | optional | Defines whether native bids must include this asset. Defaults to `false`. | `true` | boolean |
| ASSETCODE. len | optional | For text assets, bidders should pass this value through to the endpoint. Prebid.js does not enforce the responses and there’s no default. | 40 | integer |
| ASSETCODE. sizes | optional | For image assets, bidders may pass this value through to the endpoint. Prebid.js does not enforce the responses and there’s no default. Format is an array with two elements: [WIDTH, HEIGHT] | `[50, 50]` | array of integers |
| ASSETCODE. aspect_ratios | optional | For image assets, bidders may pass this value through to the endpoint. Prebid.js does not enforce the responses and there’s no default. Format is an object with the attributes in the rows below.  | | object |
| ASSETCODE. aspect_ratios.min_width | optional | Part of the aspect_ratios object, bidders may pass this value through to the endpoint. Prebid.js does not enforce the responses and there’s no default. | 50 | integer |
| ASSETCODE. aspect_ratios.min_height | optional | Part of the aspect_ratios object, bidders may pass this value through to the endpoint. Prebid.js does not enforce the responses and there’s no default. | 75 | integer |
| ASSETCODE. aspect_ratios.ratio_width | optional | Part of the aspect_ratios object, bidders may pass this value through to the endpoint. Prebid.js does not enforce the responses and there’s no default. | 2 | integer |
| ASSETCODE. aspect_ratios.ratio_height | optional | Part of the aspect_ratios object, bidders may pass this value through to the endpoint. Prebid.js does not enforce the responses and there’s no default. | 3 | integer |
| ext.CUSTOMASSET | optional | Non-standard or bidder-specific assets can be supplied on the `ext` here. Attributes on custom assets are documented by the vendor. | | |


**Table 3: Native Assets Recognized by Prebid.js**

{% include dev-docs/native-assets.md %}

{: .alert.alert-warning :}
Specific bidders may not support all of the fields listed below or may return differing responses for the assets that are requested.

### 3.1. Two ways to define image sizes

{% include dev-docs/native-image-asset-sizes.md %}

### 3.2 Custom native assets

In order to fit special bidder requirements, Prebid.js supports defining assets beyond the standard set. Simply define custom attributes in mediaTypes.native.ext, and they can be retrieved at render time. Other than being under the `ext` object, custom assets are declared in the same way as the standard ones.

{: .alert.alert-success :}
Note: The `native-render.js::renderNativeAd()` function must be called with `requestAllAssets: true`.

Bid adapters will declare which custom assets they support in their documentation. It is recommended to prefix the asset name with the bidderCode to avoid collision issues.

```
javascript
mediaTypes {
  native: {
    body: {
      required: true
    },
    ext: {
      bidderA_specialtracking: {    // custom asset
        required: false
      }
  }
}
```

In the native template, simply access the custom value with the normal Prebid ##macro## format assuming `hb_native_` as the prefix. For example:

```
    <div id="mytemplate">
    ... render a lovely creative ...
    ... refer to ##hb_native_bidderA_specialtracking## when appropriate ...
    </div>
```

## 4. Implementing the Native Template

- If you want to manage your creative within the ad server (e.g. Google Ad Manager), follow the instructions for [AdServer-Defined Creative](#41-implementing-adserver-defined-template).
- If you’d prefer to manage your creative within the Prebid.js AdUnit, follow the instructions for [AdUnit-Defined Creative](#42-implementing-adunit-defined-template)
- If you’d prefer to manage your creative from a separate piece of JavaScript, follow the instructions for the [Custom Renderer](#43-implementing-the-custom-renderer-scenario).

{: .alert.alert-info :}
For instructions on implementing the native template within Google Ad Manager, see [GAM Step by Step - Native Creative](/adops/gam-native.html)

### 4.1. Implementing AdServer-Defined Template

In this scenario, the body of the native creative template is managed within the ad server and includes special Prebid.js macros.

#### Turn Targeting Keys off in Prebid.js

When the native AdUnit is defined in the page, declare `sendTargetingKeys: false` in the native Object. This will prevent Prebid.js from sending all the native-related ad server targeting variables.

Example Native AdUnit:
```
pbjs.addAdUnits({
    code: slot.code,
    mediaTypes: {
        native: {
	    sendTargetingKeys: false,
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
        ...
    }]
});
```

Here’s an example native AdUnit using the ‘type’ feature, which implies a number of required and optional attributes.

```
const adUnits = [{
    code: 'adUnit-code',
    mediaTypes: {
	sendTargetingKeys: false,
        native: {
            type: 'image'
        }
    }
    bids: [{
        ...
    }]
}];
```

{: .alert.alert-info :}
See [Managing the Native Template in GAM](/adops/gam-native.html#managing-the-native-template-in-gam) for ad server instructions.

### 4.2 Implementing AdUnit-Defined Template

In this scenario, the body of the native creative template is managed within the Prebid.js AdUnit and includes special Prebid.js macros.

#### Prebid.js AdUnit Setup

When the Native AdUnit is defined in the page:

- Declare `sendTargetingKeys: false` in the native Object. This will prevent Prebid.js from sending all the native-related ad server targeting variables.
- Define the adTemplate as an escaped ES5 string using Prebid.js ##macros##. (See the appendix for an exhaustive list of assets and macros.) Note that this approach only affects the HTML body. Any CSS definitions need to be defined in the body of the template or in the AdServer.

Example AdUnit:
```
var adUnits = [{
      code: 'native-div',
      mediaTypes: {
          native: {
	    sendTargetingKeys: false,
            adTemplate: "<div class=\"sponsored-post\">\r\n  <div class=\"thumbnail\" style=\"background-image: url(##hb_native_image##);\"><\/div>\r\n  <div class=\"content\">\r\n  <h1>\r\n    <a href=\"%%CLICK_URL_UNESC%%##hb_native_linkurl##\" target=\"_blank\" class=\"pb-click\">\r\n  ##hb_native_title##\r\n    <\/a>\r\n   <\/h1>\r\n    <p>##hb_native_body##<\/p>\r\n    \t<div class=\"attribution\">\r\n \t##hb_native_brand##\r\n           \t<\/div>\r\n\t<\/div>\r\n<\/div>",
            title: {
              required: true,
              len: 800
            },
            image: {
              required: true,
              sizes: [989, 742],
            },
            sponsoredBy: {
              required: true
            }
          }
        }
    }
}];
```

{: .alert.alert-info :}
See [Managing the Native Template Outside of GAM](/adops/gam-native.html#managing-the-native-template-outside-of-gam) for ad server instructions.

### 4.3 Implementing the Custom Renderer Scenario

In this scenario, the body of the native creative is managed from an external JavaScript file.

#### Prebid.js AdUnit Setup

When the Native AdUnit is defined in the page:

- Declare`sendTargetingKeys: false` in the Native Object. This will prevent Prebid.js from sending all the native-related ad server targeting variables.
- Define the `rendererUrl` as a URL that defines a `window.renderAd` function in the creative iframe. Any CSS definitions need to be defined in the body (e.g. `<style>` tags) or in the AdServer creative.

Example AdUnit setup:
```
var adUnits = [{
      code: 'native-div',
      mediaTypes: {
          native: {
	    sendTargetingKeys: false,
            rendererUrl: "https://files.prebid.org/creatives/nativeRenderFunction.js",
            title: {
              required: true,
              len: 800
            },
            image: {
              required: true,
              sizes: [989, 742],
            },
            sponsoredBy: {
              required: true
            }
          }
        }
    }
}];
```

{: .alert.alert-info :}
See [Managing the Native Template Outside of GAM](/adops/gam-native.html#managing-the-native-template-outside-of-gam) for ad server instructions.

#### The Render JavaScript

Requirements for a native rendering function:

- It must define a window.renderAd function that will be called by the Prebid Universal Creative
- The renderAd() function is passed an object containing all available native assets and must return a fully resolved and ready-to-display block of HTML that will be appended to the body.

Here's an example script:
```
window.renderAd=function(data){
	let template = "<div class=\"sponsored-post\"><div class=\"thumbnail\"><\/div><div class=\"content\"><h1> <a href=\"##hb_native_linkurl##\" target=\"_blank\" class=\"pb-click\">##hb_native_title##<\/a><\/h1><p>##hb_native_body##<\/p> <div class=\"attribution\"> ##hb_native_brand## <\/div> <\/div> <\/div>";
	const map = {
	    title: 'hb_native_title',
	    body: 'hb_native_body',
	    body2: 'hb_native_body2',
	    privacyLink: 'hb_native_privacy',
	    sponsoredBy: 'hb_native_brand',
	    image: 'hb_native_image',
	    icon: 'hb_native_icon',
	    clickUrl: 'hb_native_linkurl',
	    displayUrl: 'hb_native_displayurl',
	    cta: 'hb_native_cta',
	    rating: 'hb_native_rating',
	    address: 'hb_native_address',
	    downloads: 'hb_native_downloads',
	    likes: 'hb_native_likes',
	    phone: 'hb_native_phone',
	    price: 'hb_native_price',
	    salePrice: 'hb_native_saleprice'
	}
	for (var i = 0; i < data.length; i++){
		if (map[data[i].key]) {
			template = template.replace("##"+map[data[i].key]+"##",data[i].value);
		}
	}
	return template;
}
```

{: .alert.alert-info :}
Note that the format of any macros in external render JavaScript is totally up to you. The data object coming in will be keyed according to the Key column in the table in the appendix, e.g. privacyLink and not hb_native_privacy.

## 5. Technical Details

A few details that may help understand and debug your setup:

1. The system assumes that native creatives will be wrapped in an iframe.
1. The native assets are stored in the Prebid.js memory space as the original asset types, e.g. `clickUrl` and not `hb_native_linkurl`.
1. When the window.pbNativeTag.renderNativeAd() function is called, an HTML5 postmessage is made. Prebid.js is listening for this message, and responds with the native assets. Again, the assets are keyed on the original asset type, e.g. `clickUrl`.
1. If the template was defined in the AdServer, the body of the iframe will be replaced. Otherwise, if the template was defined in the AdUnit or external JavaScript, the body of the iframe will be appended with resolved creative HTML.
1. If the AdServer supports it, CSS styles can be defined in the iframe head. Otherwise, they must be defined in the body of the template, for example with <style> tags.
1. Note that native iframes will be resized to the height of the creative after render.

## 6. AdServer Implementation Details

There are detailed [instructions for setting up native in GAM](/adops/gam-native.html), but none of the Prebid functionality is specific to GAM. The requirements to use any of these approaches in a different ad server are:

1. Put the creative in an iframe and load native-render.js
1. Invoke the renderNativeAd() function with a hash that includes the following values:
    1. pbNativeTagData.pubUrl = "PAGE URL";
    1. pbNativeTagData.adId = "PREBID ADID";
    1. pbNativeTagData.requestAllAssets = true;
1. renderNativeAd() will look for the existence of an "adTemplate" value in the AdUnit. If it finds one, it will resolve ##macros## and append it to the iframe's body.
1. Otherwise, renderNativeAd() will look for the existence of a "rendererUrl" value in the AdUnit. If it finds one, it loads the script then calls window.renderAd() and appends the results to the iframe's body.
1. Otherwise renderNativeAd() scans the iframe body and resolves ##macros##.

## Further Reading

- [Prebid Native Format](/formats/native.html)
- [Setting Up Prebid Native in GAM](/adops/gam-native.html)

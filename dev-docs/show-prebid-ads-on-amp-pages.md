---
layout: page_v2
title: Prebid AMP Implementation Guide
description: Show Prebid Ads using Prebid Server and AMP RTC
sidebarType: 2
---



# Prebid AMP Implementation Guide
{: .no_toc}

This page has instructions for showing ads on Accelerated Mobile Pages (AMP) using Prebid.js.

Through this implementation, [Prebid Server][PBS] fetches demand and returns key-value targeting to the AMP runtime using the [AMP Real Time Config (RTC)][RTC-Overview] protocol.

For more information about AMP RTC, see:

+ [How Prebid on AMP Works]({{site.baseurl}}/dev-docs/how-prebid-on-amp-works.html)
+ [Prebid Server AMP Endpoint](https://github.com/prebid/prebid-server/blob/master/docs/endpoints/openrtb2/amp.md)
+ [Prebid Server Stored Bid Requests](https://github.com/prebid/prebid-server/blob/master/docs/developers/stored-requests.md#stored-bidrequests)
+ [AMP RTC Overview][RTC-Overview]
+ [AMP RTC Publisher Integration Guide](https://github.com/ampproject/amphtml/blob/master/extensions/amp-a4a/rtc-publisher-implementation-guide.md)

{% capture tipNote %}
For ad ops setup instructions, see [Setting up Prebid for AMP in DFP]({{site.github.url}}/adops/setting-up-prebid-for-amp-in-dfp.html).
{% endcapture %}

{% include alerts/alert_tip.html content=tipNote %}

* TOC
{:toc }

## Prerequisites

To set up Prebid to serve ads into your AMP pages, you'll need:

+ An account with a [Prebid Server][PBS] instance
+ One or more Prebid Server Stored Bid Requests. A Stored Bid Request is a partial OpenRTB JSON request which:
    + Specifies properties like timeout and price granularity
    + Contains a list of demand partners and their respective parameters
+ An AMP page containing at least one amp-ad element for an AMP ad network that supports Fast Fetch and AMP RTC

## Implementation

+ [Prebid Server Stored Request](#prebid-server-stored-request): This is the Prebid Server Stored Bid Request.
+ [AMP content page](#amp-content-page): This is where your content lives.
+ [HTML Creative](#html-creative): This is the creative your Ad Ops team puts in your ad server.
+ [User Sync in AMP](#user-sync): This is the `amp-iframe` pixel that must be added to your AMP page to sync users with Prebid Server.

### Prebid Server Stored Request

You will have to create at least one Stored Request for Prebid Server.  Valid Stored Requests for AMP pages must contain an `imp` array with exactly one element.  It is not necessary to include a `tmax` field in the Stored Request, as Prebid Server will always use the smaller of the AMP default timeout (1000ms) and the value passed via the `timeoutMillis` field of the `amp-ad.rtc-config` attribute (explained in the next section).

An example Stored Request is given below:

```html

{
    "id": "some-request-id",
    "site": {
        "page": "prebid.org"
    },
    "ext": {
        "prebid": {
            "targeting": {
                "pricegranularity": {  // This is equivalent to the deprecated "pricegranularity": "medium"
                    "precision": 2,
                    "ranges": [{
                        "max": 20.00,
                        "increment": 0.10
                    }]
                }
            }
        }
    },
    "imp": [
        {
            "id": "some-impression-id",
            "banner": {
                "format": [
                    {
                        "w": 300,
                        "h": 250
                    }
                ]
            },
            "ext": {
                "appnexus": {
                    // Insert parameters here
                },
                "rubicon": {
                    // Insert parameters here
                }
            }
        }
    ]
}

```

### AMP content page

The `amp-ad` elements in the page body need to be set up as shown below, especially the following attributes:

+ `data-slot`: Identifies the ad slot for the auction.
+ `rtc-config`: Used to pass JSON configuration data to [Prebid Server][PBS], which handles the communication with AMP RTC.
    + `vendors` is an object that defines any vendors that will be receiving RTC callouts (including Prebid Server) up to a maximum of five.  The list of supported RTC vendors is maintained in [callout-vendors.js][callout-vendors.js].
    + `timeoutMillis` is an optional integer that defines the timeout in milliseconds for each individual RTC callout.  The configured timeout must be greater than 0 and less than 1000ms.  If omitted, the timeout value defaults to 1000ms.

```html

<amp-ad width="300" height="250"
        type="doubleclick"
        data-slot="/19968336/universal_creative"
        rtc-config='{"vendors": {"prebidappnexus": {"PLACEMENT_ID": "13144370"}}, "timeoutMillis": 500}'>
</amp-ad>

```

### HTML Creative

This is the creative that your Ad Ops team needs to upload to the ad server (it's also documented at [Setting up Prebid for AMP in DFP]({{site.github.url}}/adops/setting-up-prebid-for-amp-in-dfp.html)).

{% capture tipNote %}
You can always get the latest version of the creative code below from [the AMP example creative file in our GitHub repo](https://github.com/prebid/prebid-universal-creative/blob/master/template/amp/dfp-creative.html).
{% endcapture %}

{% include alerts/alert_tip.html content=tipNote %}

For DFP:

```html 

<script src="https://cdn.jsdelivr.net/npm/prebid-universal-creative@latest/dist/creative.js"></script>
<script>
  var ucTagData = {};
  ucTagData.adServerDomain = "";
  ucTagData.pubUrl = "%%PATTERN:url%%";
  ucTagData.targetingMap = %%PATTERN:TARGETINGMAP%%;

  try {
    ucTag.renderAd(document, ucTagData);
  } catch (e) {
    console.log(e);
  }
</script>

```

For Mopub:

```html

<script src="https://cdn.jsdelivr.net/npm/prebid-universal-creative@latest/dist/creative.js"></script>
<script>
  var ucTagData = {};
  ucTagData.adServerDomain = "";
  ucTagData.pubUrl = "%%KEYWORD:url%%";
  ucTagData.targetingKeywords = "%%KEYWORDS%%";
   try {
    ucTag.renderAd(document, ucTagData);
  } catch (e) {
    console.log(e);
  }
</script>

```

For all other ad servers:

```html

<script src="https://cdn.jsdelivr.net/npm/prebid-universal-creative@latest/dist/creative.js"></script>
<script>
  var ucTagData = {};
  ucTagData.adServerDomain = "";
  ucTagData.pubUrl = "%%MACRO:url%%";
  ucTagData.adId = "%%MACRO:hb_adid%%";
  ucTagData.cacheHost = "%%MACRO:hb_cache_host%%";
  ucTagData.cachePath = "%%MACRO:hb_cache_path%%";
  ucTagData.uuid = "%%MACRO:hb_cache_id%%";
  ucTagData.mediaType = "%%MACRO:hb_format%%";
  ucTagData.env = "%%MACRO:hb_env%%";
  ucTagData.size = "%%MACRO:hb_size%%";

  try {
    ucTag.renderAd(document, ucTagData);
  } catch (e) {
    console.log(e);
  }
</script>

```

Replace `MACRO` in the preceding example with the appropriate macro for the ad server. (Refer to your ad server's documentation or consult with a representative for specific details regarding the proper macros and how to use them.)

### User Sync

To properly sync user IDs with Prebid Server, the `amp-iframe` pixel below should be added to your AMP pages. As of now, only image pixels (those returned with "type": "redirect") are supported.

{% capture tipNote %}
The following example includes a transparent image as a placeholder which will allow you to place this at the top within the `body`. If this is not included the iFrame must be either 600px away from the top or not within the first 75% of the viewport when scrolled to the top – whichever is smaller. For more information on this, see [amp-iframe](https://ampbyexample.com/components/amp-iframe/)
{% endcapture %}

{% include alerts/alert_tip.html content=tipNote %}

```html

<amp-iframe width="1" title="User Sync"
  height="1"
  sandbox="allow-scripts"
  frameborder="0"
  src="https://cdn.jsdelivr.net/npm/prebid-universal-creative@latest/dist/load-cookie.html">
  <amp-img layout="fill" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" placeholder></amp-img>
</amp-iframe>

```

## Debugging Tips
To review that Prebid on AMP is working properly the following aspects can be looked at:
+ Include `#development=1` to the URL to review AMP specifc debug messages in the browser console.
+ Look for the Prebid server call in the network panel. You can open this URL in a new tab to view additional debugging information relating to the Prebid Server Stored Bid Request. If working properly, Prebid server will display the targeting JSON for AMP to use.
+ Look for the network call from the Ad Server to ensure that key values are being passed. (For DFP these are in the `scp` query string parameter in the network request)
+ Most of the debugging information is omitted from the Prebid Server response unless the `debug=1` parameter is present. It will sometimes be useful to manually edit the query string of the Prebid Server request to add this parameter.

## Related Topics

+ [How Prebid on AMP Works]({{site.github.url}}/dev-docs/how-prebid-on-amp-works.html)
+ [Prebid Server AMP Endpoint](https://github.com/prebid/prebid-server/blob/master/docs/endpoints/openrtb2/amp.md)
+ [Prebid Server Stored Bid Requests](https://github.com/prebid/prebid-server/blob/master/docs/developers/stored-requests.md#stored-bidrequests)
+ [Setting up Prebid for AMP in DFP]({{site.github.url}}/adops/setting-up-prebid-for-amp-in-dfp.html) (Ad Ops Setup)
+ [AMP RTC Overview][RTC-Overview]
+ [AMP RTC Publisher Integration Guide](https://github.com/ampproject/amphtml/blob/master/extensions/amp-a4a/rtc-publisher-implementation-guide.md)

</div>

<!-- Reference Links -->

[PBS]: {{site.baseurl}}/dev-docs/get-started-with-prebid-server.html
[RTC-Overview]: https://github.com/ampproject/amphtml/blob/master/extensions/amp-a4a/rtc-documentation.md
[callout-vendors.js]: https://github.com/ampproject/amphtml/blob/master/extensions/amp-a4a/0.1/callout-vendors.js

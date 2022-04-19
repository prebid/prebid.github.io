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

+ [Prebid Server and AMP](/prebid-server/use-cases/pbs-amp.html)
+ [Prebid Server AMP Endpoint Technical Documentation](/prebid-server/endpoints/openrtb2/pbs-endpoint-amp.html)
+ [Prebid Server Stored Bid Requests](https://github.com/prebid/prebid-server/blob/master/docs/developers/stored-requests.md#stored-bidrequests)
+ [AMP RTC Overview](https://github.com/ampproject/amphtml/blob/master/extensions/amp-a4a/rtc-documentation.md)
+ [AMP RTC Publisher Integration Guide](https://github.com/ampproject/amphtml/blob/master/extensions/amp-a4a/rtc-publisher-implementation-guide.md)

{% capture tipNote %}
For ad ops setup instructions, see [Setting up Prebid for AMP in Google Ad Manager]({{site.github.url}}/adops/setting-up-prebid-for-amp-in-dfp.html).
{% endcapture %}

{% include alerts/alert_note.html content=tipNote %}

* TOC
{:toc }

## Prerequisites

To set up Prebid to serve ads into your AMP pages, you'll need:

+ An account with a [Prebid Server][PBS] instance
+ One or more Prebid Server Stored Bid Requests. A Stored Bid Request is a partial OpenRTB JSON request which:
    + Specifies properties like currency, schain, price granularity, etc.
    + Contains a list of demand partners and their respective parameters
+ An AMP page containing at least one amp-ad element for an AMP ad network that supports Fast Fetch and AMP RTC

## Implementation

+ [Prebid Server Stored Request](#prebid-server-stored-request): This is the Prebid Server Stored Bid Request.
+ [AMP content page](#amp-content-page): This is where your content lives.
+ [HTML Creative](#html-creative): This is the creative your Ad Ops team puts in your ad server.
+ [User Sync in AMP](#user-sync): This is the `amp-iframe` pixel that must be added to your AMP page to sync users with Prebid Server.

### Prebid Server Stored Request

You will have to create at least one Stored Request for Prebid Server.  Valid Stored Requests for AMP pages must contain an `imp` array with exactly one element.  It is not necessary to include a `tmax` field in the Stored Request, as Prebid Server will always use the smaller of the AMP default timeout (1000ms) and the value passed via the `timeoutMillis` field of the `amp-ad.rtc-config` attribute (explained in the next section).

An example Stored Request is given below. You'll see that the Stored Request contains some important info
that doesn't come from /amp parameters:

- cur
- schain
- ext.prebid.cache.bids - needed to let Prebid Server know that you want it to store the result in PBC
- ext.prebid.targeting.pricegranularity - needed to let Prebid Server know how to calculate the price bucket
- ext.prebid.aliases
- bidders and their parameters

```html

{
    "id": "some-request-id",
    "cur": ["USD"],
    "source": {
        "ext": {
            "schain": {
                ...
            }
        }
    },
    "site": {
        "page": "prebid.org"  // will be overridden by the 'curl' parameter on /amp endpoint
    },
    "ext": {
        "prebid": {
            "cache": {
                "bids": {}
            },
            "targeting": {
                "pricegranularity": {  // This is equivalent to "pricegranularity": "medium"
                    "precision": 2,
                    "ranges": [{
                        "max": 20.00,
                        "increment": 0.10
                    }]
                }
            }
        }
    },
    "imp": [{
      "id": "some-impression-id",
      "banner": {
          "format": [{
            "w": 300,
            "h": 250
          }]
      },
      "ext": {
        "prebid": {
          "bidder": {
                "bidderA": {
                    // Insert parameters here
                },
                "bidderB": {
                    // Insert parameters here
                }
          }
        }
      }
    }]
}
```
This basic OpenRTB record will be enhanced by the parameters from the call to the [/amp endpoint](/prebid-server/endpoints/openrtb2/pbs-endpoint-amp.html).

### AMP content page

First ensure that the amp-ad component is imported in the header.

```
<script async custom-element="amp-ad" src="https://cdn.ampproject.org/v0/amp-ad-0.1.js"></script>
```
This script provides code libraries that will convert `<amp-ad>` properties to the endpoint query parameters usint the [Real Time Config](https://github.com/ampproject/amphtml/blob/main/extensions/amp-a4a/rtc-documentation.md) (RTC) protocol.

The `amp-ad` elements in the page body need to be set up as shown below, especially the following attributes:

+ `data-slot`: Identifies the ad slot for the auction.
+ `rtc-config`: Used to pass JSON configuration data to [Prebid Server][PBS], which handles the communication with AMP RTC.
    + `vendors` is an object that defines any vendors that will be receiving RTC callouts (including Prebid Server) up to a maximum of five.  The list of supported RTC vendors is maintained in [callout-vendors.js](https://github.com/ampproject/amphtml/blob/master/src/service/real-time-config/callout-vendors.js). We recommend working with your Prebid Server hosting company to set up which bidders and parameters should be involved for each AMP ad unit.
    + `timeoutMillis` is an optional integer that defines the timeout in milliseconds for each individual RTC callout.  The configured timeout must be greater than 0 and less than 1000ms.  If omitted, the timeout value defaults to 1000ms.

e.g. for the AppNexus cluster of Prebid Servers:
```html
<amp-ad width="300" height="250"
    type="doubleclick"
    data-slot="/1111/universal_creative"
    rtc-config='{"vendors": {"prebidappnexus": {"PLACEMENT_ID": "13144370"}}, "timeoutMillis": 500}'>
</amp-ad>
```

e.g. for Rubicon Project's cluster of Prebid Servers:
```html
<amp-ad width="300" height="250"
    type="doubleclick"
    data-slot="/1111/universal_creative"
    rtc-config='{"vendors": {"prebidrubicon": {"REQUEST_ID": "1234-amp-pub-300x250"}}, "timeoutMillis": 500}'>
</amp-ad>
```

For other hosts, you can specify the URL directly rather than using one of the convenient vendor aliases. e.g.
```html
<amp-ad width="300" height="250"
    type="doubleclick"
    data-slot="/1111/universal_creative"
    rtc-config='{"urls": ["https://prebid-server.example.com/openrtb2/amp?tag_id=1001-amp&w=ATTR(width)&h=ATTR(height)&ow=ATTR(data-override-width)&oh=ATTR(data-override-height)&ms=ATTR(data-multi-size)&slot=ATTR(data-slot)&targeting=TGT&curl=CANONICAL_URL&timeout=TIMEOUT&adc=ADCID&purl=HREF&gdpr_consent=CONSENT_STRING&account=ACCOUNT_ID&gdpr_applies=CONSENT_METADATA(gdprApplies)&addtl_consent=CONSENT_METADATA(additionalConsent)&consent_type=CONSENT_METADATA(consentStringType)]}'
</amp-ad>
```

### HTML Creative

This is the creative that your Ad Ops team needs to upload to the ad server (it's also documented at [Setting up Prebid for AMP in Google Ad Manager]({{site.github.url}}/adops/setting-up-prebid-for-amp-in-dfp.html)).

{% capture tipNote %}
You can always get the latest version of the creative code below from [the AMP example creative file in our GitHub repo](https://github.com/prebid/prebid-universal-creative/blob/master/template/amp/dfp-creative.html).
{% endcapture %}

{% include alerts/alert_tip.html content=tipNote %}

For Google Ad Manager:

```html

<script src="https://cdn.jsdelivr.net/npm/prebid-universal-creative@latest/dist/creative.js"></script>
<script>
  var ucTagData = {};
  ucTagData.adServerDomain = "";
  ucTagData.pubUrl = "%%PATTERN:url%%";
  ucTagData.targetingMap = %%PATTERN:TARGETINGMAP%%;
  ucTagData.hbPb = "%%PATTERN:hb_pb%%";

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
  ucTagData.hbPb = "%%KEYWORD:hb_pb%%";

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
  ucTagData.hbPb = "%%MACRO:hb_pb%%";
  try {
    ucTag.renderAd(document, ucTagData);
  } catch (e) {
    console.log(e);
  }
</script>

```

Replace `MACRO` in the preceding example with the appropriate macro for the ad server. (Refer to your ad server's documentation or consult with a representative for specific details regarding the proper macros and how to use them.)

### User Sync

To sync user IDs with Prebid Server, the `amp-iframe` below may be added to your AMP pages referring to `load-cookie.html` or if you're running an IAB-compliant AMP CMP you can use `load-cookie-with-consent.html`.

{% capture tipNote %}
The following examples include a transparent image as a placeholder which will allow you to place the example at the top within the HTML body. If this is not included the iFrame must be either 600px away from the top or not within the first 75% of the viewport when scrolled to the top – whichever is smaller. For more information on this, see [amp-iframe](https://amp.dev/documentation/components/amp-iframe/)
{% endcapture %}
{% include alerts/alert_tip.html content=tipNote %}

{% capture consentNote %}
 The load-cookie-with-consent.html file has the same argument syntax as load-cookie.html. It's a different file because it's larger and depends on the existence of an AMP Consent Management Platform. Note that the `sandbox` parameter to the amp-iframe must include both "allow-scripts" and "allow-same-origin".
{% endcapture %}
{% include alerts/alert_tip.html content=consentNote %}

If you're using AppNexus' managed service, you would enter something like this:
```html
<amp-iframe width="1" title="User Sync"
  height="1"
  sandbox="allow-scripts allow-same-origin"
  frameborder="0"
  src="https://acdn.adnxs.com/prebid/amp/user-sync/load-cookie.html?endpoint=appnexus&max_sync_count=5&source=amp">
  <amp-img layout="fill" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" placeholder></amp-img>
</amp-iframe>
```

If you are utilizing Magnite's managed service, there's an extra `args` parameter:
```html
<amp-iframe width="1" title="User Sync"
  height="1"
  sandbox="allow-scripts allow-same-origin"
  frameborder="0"
  src="https://GET_URL_FROM_MAGNITE_ACCOUNT_TEAM/prebid/load-cookie.html?endpoint=rubicon&max_sync_count=5&source=amp&args=account:MAGNITE_ACCOUNT_ID">
  <amp-img layout="fill" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" placeholder></amp-img>
</amp-iframe>
```

Or you can specify a full URL to another Prebid Server location (including a QA site) by setting `endpoint` to a URL-encoded string. e.g.
```html
<amp-iframe width="1" title="User Sync"
  height="1"
  sandbox="allow-scripts allow-same-origin"
  frameborder="0"
  src="https://acdn.adnxs.com/prebid/amp/user-sync/load-cookie.html?endpoint=https%3A%2F%2Fprebid-server-qa.example.com%2Fcookie_sync&max_sync_count=5&source=amp">
  <amp-img layout="fill" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" placeholder></amp-img>
</amp-iframe>
```

See [manually initiating a sync](/prebid-server/developers/pbs-cookie-sync.html#manually-initiating-a-sync) for more information about the available parameters.

### AMP RTC and GDPR

The two Prebid Server RTC vendor strings 'prebidappnexus' and 'prebidrubicon'
support passing GDPR consent to Prebid Server.

The CONSENT_STRING macro will be populated if you've integrated with a CMP
that supports amp-consent v2 -- custom CMP integration.

If you're using a custom RTC callout, here are the parameters that can be passed through the RTC string:
- tag_id
- w=ATTR(width)
- h=ATTR(height)
- ow=ATTR(data-override-width)
- oh=ATTR(data-override-height)
- ms=ATTR(data-multi-size)
- slot=ATTR(data-slot)
- targeting=TGT
- curl=CANONICAL_URL
- timeout=TIMEOUT
- adc=ADCID
- purl=HREF
- gdpr_consent=CONSENT_STRING
- consent_type=CONSENT_METADATA(consentStringType)
- gdpr_applies=CONSENT_METADATA(gdprApplies)
- attl_consent=CONSENT_METADATA(additionalConsent)

See the entries in the [AMP vendors callout file](https://github.com/ampproject/amphtml/blob/main/src/service/real-time-config/callout-vendors.js).

## Debugging Tips
To review that Prebid on AMP is working properly the following aspects can be looked at:
+ Include `#development=1` to the URL to review AMP specifc debug messages in the browser console.
+ Look for the Prebid server call in the network panel. You can open this URL in a new tab to view additional debugging information relating to the Prebid Server Stored Bid Request. If working properly, Prebid server will display the targeting JSON for AMP to use.
+ Look for the network call from the Ad Server to ensure that key values are being passed. (For Google Ad Manager these are in the `scp` query string parameter in the network request)
+ Most of the debugging information is omitted from the Prebid Server response unless the `debug=1` parameter is present in the Prebid Server query string. AMP won't add this parameter, so you'll need to grab the Prebid Server URL and manually add it to see the additional information provided.

## Further Reading

+ [Prebid Server and AMP](/prebid-server/use-cases/pbs-amp.html)
+ [Setting up Prebid for AMP in Google Ad Manager](/adops/setting-up-prebid-for-amp-in-dfp.html) (Ad Ops Setup)
+ [AMP RTC Overview](https://github.com/ampproject/amphtml/blob/master/extensions/amp-a4a/rtc-documentation.md)

<!-- Reference Links -->

[PBS]: /prebid-server/overview/prebid-server-overview.html
[callout-vendors.js]: https://github.com/ampproject/amphtml/blob/master/src/service/real-time-config/callout-vendors.js

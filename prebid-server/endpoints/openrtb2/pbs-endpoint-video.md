---
layout: page_v2
sidebarType: 5
title: Prebid Server | Endpoints | OpenRTB2 | Video

---

# Prebid Server | Endpoints | /openrtb2/video
{: .no_toc }
This document describes the behavior of the Prebid Server `video` endpoint in detail.

* TOC
{:toc}

## POST /openrtb2/video

## Overview

Prebid Server (PBS) supports competitve separation for ad pod display from primary ad servers such as Freewheel and Google Ad Manager.  PBS, on receiving this endpoint, will pass default settings and `stored_request` parameters to one or more OpenRTB requests, which will then be sent to the appropriate SSPs.

The process is similar to [Prebid.js client side](/prebid-video/video-long-form.html) support for this feature.

### Process

1. Application makes request for a video stream.
2. An SSAI Server sends a video request to PBS, specifying the pod requirements.
3. PBS sends a request for bids to selected demand partners by relaying OpenRTB requests to them.
4. Demand partners return a bid response to PBS. If competitive seperation is enabled, PBS peforms [category translation](/dev-docs/modules/categoryTranslation.html) on each bid. Whether category translation is required or not, the bids are stored in prebid cache.
5. PBS generates key-value pairs that are comprised of price, category, and duration values. The key is `hb_pb_cat_dur` and each component of the key name after the `hb` represents a related value.  
&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;  `_pb` represents the price bucket.
&nbsp;&nbsp;&nbsp;&nbsp; `_cat` indicates the industry code that is derived from the  [category translation](/dev-docs/modules/categoryTranslation.html).
&nbsp;&nbsp;&nbsp;&nbsp; `_dur` is the length of the bid response in seconds.
&nbsp;&nbsp;&nbsp;&nbsp;
A PBS generated key-value of  `hb_pb_cat_dur = 1200_399_30s` would indicate:
&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp; A price bucket of $12.00 (or the local currency).
&nbsp;&nbsp;&nbsp;&nbsp; The industry represented by id 399.
&nbsp;&nbsp;&nbsp;&nbsp;  A duration of 30 seconds.
&nbsp;&nbsp;&nbsp;&nbsp;
These key-values are returned to the SSAI server as part of the video response.

6. The SSAI server parses the returned key-values, appending them as a query string to the ad server request URL and submits the request.
7. The ad server returns the optimized pod.
8. The SSAI server requests the creatives from prebid cache.
9. The SSAI server requests the content from the content host and stitches the creatives and content together.
10. The stitched stream is returned to the application.

<br>
<img src="/assets/images/flowcharts/pb-lfv-serverside.png" alt="architecture diagram">
<br>

 **Parameters**<a name="parameters"></a>

  {: .table .table-bordered .table-striped }
| Param | Scope | Type | Description |
| --- | --- | --- | --- |
| storedrequestid | Optional  (Required for Xandr PBS) | `String` |  The id used to look up the entire request from a stored configuration in the database. |
| podconfig | Required | `Object` |  Container object for describing all the pod configurations. |
| podconfig.durationrangesec | Required | `Integer[]` |  Range of ad durations allowed in the response. See [pod duration range](#pod-duration-range) for more details. |
| podconfig.requireexactduration | Optional | `Boolean` |  Flag indicating exact ad duration requirement. Default is false. |
| podconfig.pods | Required | `Object[]` |  Container object for describing the adPod(s) to be requested.  |
| site | Required | `Object` |  Container object for the URL of the impression to be shown. Can be excluded if app is included.  |
| site.page | Required | `String` | URL of the page where the impression will be shown.  |
| site.publisher.id | Required | `String` | Appnexus member ID.  |
| app | Required | `Object` |  Container object for app information where the impression is to be shown. Can be excluded if site is included.  |
| app.bundle | Optional | `String` |  A platform-specific application identifier intended to be unique to the app and independent of the exchange. On Android, this should be a bundle or package name (e.g., com.foo.mygame). On iOS, it is typically a numeric ID. |
| app.domain | Required | `String` |  The domain of the app. |
| app.name | Optional | `String` |  The name of the app. |
| app.publisher.id | Required | `String` |  Appnexus member ID. |
| app.storeurl | Optional | `String` |  App store URL for an installed app. |
| video | Required | `Object` |  Container object for video player data. |
| video.w | Optional | `Integer` |  Width of the video player in device independent pixels. |
| video.h | Optional | `Integer` |  Height of the video player in device independent pixels. |
| video.mimes | Required | `String[]` |  Player supported mime types. Example: ["video/mp4"] |
| video.protocols | Required | `Integer[]` |  Array of supported [video protocols](#video-protocols). |
| includebrandcategory | Optional | `Object` |  Container Object for passing Category inputs. |
| includebrandcategory.primaryadserver | Optional | `Integer` |  The ad server used by the publisher. Supported Values 1- Freewheel , 2- Google Ad Manager. |
| includebrandcategory.publisher | Optional | `String` |  Identifier for the Publisher. If <code>includebrandcategory.primaryadserver</code> is set to 2 (GAM) then this parameter is required. This enables the category mapping file to be found. |
| content | Optional | `Object` | Miscellaneous content meta data that can be used for targeting the adPod(s) |
| content.episode | Optional | `Integer` | The episode number. |
| content.title | Optional | `String` | The episode name. |
| content.season | Optional | `String` | The season name. |
| content.series | Optional | `String` | The series name. |
| content.len | Optional | `Integer` | The length of the content in seconds. |
| content.livestream | Optional | `Integer` | The content mode indicator for VOD or Live. Supported values:  integer 0 = not live, 1 = content is live (e.g., stream, live blog). |
| user | Optional  (recommended) | `Object` | Container object for the user of of the actual device. |
| user.yob | Optional   | `Integer` |  Year of birth as a 4-digit integer.  |
| user.gender | Optional   | `String` |  Gender, where “M” = male, “F” = female, “O” = known to be other (i.e., omitted is unknown).  |
| user.keywords | Optional   | `String` |  Comma separated list of keywords, interests, or intent.  |
|user.ext.consent | Optional  | `String` |  String containing the data structure developed by the [GDPR Consent Working Group](https://iabtechlab.com/standards/gdpr-transparency-and-consent-framework/) under the auspices of IAB Europe. See the [Regulations](#price-range) section below for more details. |
| user.ext.prebid.buyeruids | Optional   | `Object` |  Container objects for all the SSP UserIDs to send to the SSPs endpoint.  |
| device | Optional  (recommended) | `Object` | Container object for device specific data. |
| device.ua | Optional  | `String` | Browser user agent string. |
| device.dnt | Optional  | `Integer` |     Standard “Do Not Track” flag as set in the header by the browser, where 0 = tracking is unrestricted, 1 = do not track. |
| device.lmt | Optional  | `Integer` | “Limit Ad Tracking” signal commercially endorsed (e.g., iOS, Android), where 0 = tracking is unrestricted, 1 = tracking must be limited per commercial guidelines. |
| device.ip | Optional  | `String` | IP address of the device making the ad request. |
| device.os | Optional  | `String` | Device operating system. Example "iOS". |
| device.w | Optional  | `Integer` | Physical width of the screen in pixels. |
| device.h | Optional  | `Integer` | Physical height of the screen in pixels. |
| device.ifa | Optional  | `String` | ID sanctioned for advertiser use in the clear (i.e., not hashed). |
| device.didsha1 | Optional  | `String` | Hardware device ID (e.g., IMEI); hashed via SHA1. |
| device.didmd5 | Optional  | `String` | Hardware device ID (e.g., IMEI); hashed via MD5. |
| device.dpidsha1 | Optional  | `String` | Platform device ID (e.g., Android ID); hashed via SHA1. |
| device.dpidmd5 | Optional  | `String` | Platform device ID (e.g., Android ID); hashed via MD5. |
| device.macsha1 | Optional  | `String` | MAC address of the device; hashed via SHA1. |
| device.macmd5 | Optional  | `String` | MAC address of the device; hashed via MD5. |
| pricegranularity | Optional  (recommended)   | `Object` | The price range in varying increments that the CPM of the ad unit will fall into. Visit our [price granualarity](/adops/price-granularity.html) overview for more details. |
| pricegranularity.precision | Optional  | `Object` | If precision is omitted, it will default to 2. |
| pricegranularity.ranges | Optional  (recommended)   | `Object[]` | See [price range](#price-range) for details. |
| regs | Optional   | `Object` |  Container object for data related to various regulations. See the [Regulations](#price-range) section below for more details. |
| regs.ext.gdpr | Optional   | `Integer` |  Enable the user to indicate whether GDPR is in effect. `0` for disabled, `1` for enabled.  The default setting is disabled. See the [Regulations](#price-range) section below for more details. |
| regs.ext.us_privacy | Optional   | `String` |  Enables the user to apply California Consumer Protection Act (CCPA) settings per [IAB standards for U.S. Privacy](https://iabtechlab.com/standards/ccpa/). See the [Regulations](#price-range) section below for more details. |

### Pod Duration Range

The `podconfig.durationrangesec` is an array containing integers representing the range of ad durations allowed in the pod in seconds. For example:

```javascript
durationrangesec = [15, 30]
```

These values would indicate that ad durations of 15 and 30 seconds were allowed with this bid.

If `podconfig.requireexactduration` is set to `false`, then the ads durations will be rounded up to the closest value in the `durationrangesec` array. Implicit minimum bid duration is 0.

Using the values above, a ten second bid would be rounded to 15 seconds and an eighteen second bid would be rounded to 30 seconds.

If `podconfig.requireexactduration` is set to `true`, then only the ads that are the exact duration match to the `durationrangesec` array will be allowed.

Again, using the values above, a 15 second bid will be allowed  whereas an 18 second bid will be rejected.

### Pods
These are the parameters for the `pod` subobject:  

{: .table .table-bordered .table-striped }
| Param | Scope | Type | Description |
| --- | --- | --- | --- |
| podconfig.pods | Required | `Object` |  Container object describing the adPod(s) to be requested. |
| pod.podid | Required | `Integer` |  Unique id of the pod within a particular request.   <br>**Recommendation**: Order these numerically, with increment of 1. |
| pod.adpoddurationsec | Required | `Integer` |  Duration of the adPod. |
| pod.configid | Required | `String` |  ID of the stored config that corresponds to a single pod request for all included adapters. |

### Video Protocols
A streaming protocol is a standardized method for delivering multimedia (usually video or audio) over the internet. It defines a method for sending "chunks" of content from one device to another and subsequently the method for reassembling those "chunks" into playable content.

To indicate which protocol or protocols you wish to use for content management, pass an array of integers, each integer representing a video protocol. The table below list the integer/video protocol relationship.

{: .table .table-bordered .table-striped }
| Integer | Protocol  |
| --- | --- |
| 1  | VAST 1.0 |
| 2  | VAST 2.0 |
| 3  | VAST 3.0 |
| 4  | VAST 1.0 Wrapper |
| 5  | VAST 2.0 Wrapper |
| 6  | VAST 3.0 Wrapper |
| 7  | VAST 4.0 |
| 8  | VAST 4.0 Wrapper |
| 9  | DAAST 1.0 |
| 10  | DAAST 1.0 Wrapper |

### Buyer UIDs
The `user.ext.prebid.buyeruids` is an optional, but recommended parameter. It is an object that contains all the SSP UserIDs to send to the SSPs endpoint. They are passed as key-value pairs: `{bidder_name:bidder_specific_userid}`.

These are the supported (registered) bidder names.  

* "33across"
* "adform"
* "adkernelAdn"
* "adtelligent"  
* "appnexus"
* "audienceNetwork"  
* "beachfront"
* "eplanning"
* "epsilon"
* "grid"
* "gumgum"
* "ix"
* "lifestreet"
* "openx"
* "pubmatic"  
* "pulsepoint"
* "rhythmone"
* "rubicon"
* "somoaudience"  
* "sonobi"
* "sovrn"
* "yieldmo"

### Price Range

The `pricegranularity` sub-object `range` describes the maximum price point for the price range and the increments to traverse that range. Visit our [price granualarity](/adops/price-granularity.html) overview for more details.

{: .table .table-bordered .table-striped }
| Param | Scope | Type | Description |
| --- | --- | --- | --- |
| range | Optional | `Object` |  Container object price granularity range. |
| range.max | Required | `Float` |   |
| range.increment | Required | `Float` |   |

### Regulations

{% include legal-warning.html %}

In order for publishers to meet their transparency, notice and choice/consent requirements under the GDPR and CCPA, Prebid Server supports the [IAB Europe Transparency & Consent Framework](https://www.iab.com/topics/consumer-privacy/gdpr/) and the [CCPA Compliance Framework](https://www.iab.com/guidelines/ccpa-framework/).

Publishers can enable GDPR regulations by setting `regs.ext.gdpr` to `1`. To disable GDPR, change the setting to `0`. The default setting is `0`.

Publishers can comply with CCPA regulations by setting `regs.ext.us.privacy` to one of the accepted string formats outlined in [IAB's CCPA Framework](https://iabtechlab.com/standards/ccpa/) such as `1YNN`.

## Examples

### Post Request

 ```javascript
 {
  "storedrequestid": "80ce30c53c16e6ede735f123ef6e32361bfc7b22",
  "podconfig": {
    "durationrangesec": [
      15,
      30
    ],
    "pods": [
      {
        "podid": 1,
        "adpoddurationsec": 60,
        "configid": "fba10607-0c12-43d1-ad07-b8a513bc75d6"
      },
      {
        "podid": 2,
        "adpoddurationsec": 60,
        "configid": "8b452b41-2681-4a20-9086-6f16ffad7773"
      }
    ]
  },
  "site": {
    "page": "https://www.foobar.com/1234.html"
  },
  "user": {
    "yob": 1982,
    "gender": "M",
    "buyeruids": {
      "appnexus": "unique_id_an"
    },
    "gdpr": {
      "consentrequired": false,
      "consentstring": ""
    }
  },
  "device": {
    "ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.13 (KHTML, like Gecko) Version/5.1.7 Safari/534.57.2",
    "ip": "123.145.167.10",
    "devicetype": 1,
    "ifa": "AA000DFE74168477C70D291f574D344790E0BB11"
  },
  "includebrandcategory": {
    "primaryadserver": 1
  },
  "video": {
    "w": 640,
    "h": 480,
    "mimes": [
      "video/mp4"
    ],
    "protocols": [
      2,
      3
    ]
  },
  "content": {
    "episode": 6,
    "title": "episodeName",
    "series": "TvName",
    "season": "season3",
    "len": 900,
    "livestream": 0
  }
}
```

### Post Response

The POST response contains an array of `adPod` objects which represents the `adPods` in the request. Each value of the `adPod` object (`podid:1`, `podid:2`, etc) contain the key-value targeting for those bids and optionally any errors encountered.

```javascript
{
  "adPods": [
    {
      "podid": 1,
      "targeting": [
        {
          "hb_pb": "20.00",
          "hb_pb_cat_dur": "20.00_413_30s",
          "hb_cache_id": "420d7329-30e8-4c4e-8eaa-fe937172e4e0"
        },
        {
          "hb_pb": "10.00",
          "hb_pb_cat_dur": "10.00_395_30s",
          "hb_cache_id": "420d7329-30e8-4c4e-8eaa-fe937172e4e0"
        },
        {
          "hb_pb": "10.00",
          "hb_pb_cat_dur": "10.00_401_30s",
          "hb_cache_id": "420d7329-30e8-4c4e-8eaa-fe937172e4e0"
        }
      ]
    },
    {
      "podid": 2,
      "targeting": [
        {
          "hb_pb": "10.00",
          "hb_pb_cat_dur": "10.00_409_30s",
          "hb_cache_id": "420d7329-30e8-4c4e-8eaa-fe937172e4e0"
        },
        {
          "hb_pb": "10.00",
          "hb_pb_cat_dur": "10.00_394_30s",
          "hb_cache_id": "420d7329-30e8-4c4e-8eaa-fe937172e4e0"
        },
        {
          "hb_pb": "15.00",
          "hb_pb_cat_dur": "15.00_399_30s",
          "hb_cache_id": "420d7329-30e8-4c4e-8eaa-fe937172e4e0"
        }
      ],
      "errors": {
        "openx": [
          {
            "code": 1,
            "message": "The request exceeded the timeout allocated"
          }
        ]
      }
    }
  ]
}
```

## SSAI processing of the response
The SSAI should take the key-values from the response `adPods.[].targeting.[]${key}` and pass it to the primary ad server as keywords. Because `adPods` do not have specific targeting, an `adPod` can target any bid as long as the bid duration matches that of the `adPod`.

## Further Reading

* [Prebid Server overview](/prebid-server/overview/prebid-server-overview.html)  
* [OpenRTB auction endpoint](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html)  
* [Category Translation module](/dev-docs/modules/categoryTranslation.html)  
* [Freewheel module](/dev-docs/modules/freewheel.html)  
* [Ad Pod module](/dev-docs/modules/adpod.html)  

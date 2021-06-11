---
layout: page_v2
sidebarType: 5
title: Prebid Server | Endpoints | OpenRTB2 | AMP

---

# Prebid Server | Endpoints | /openrtb2/amp

This document describes the behavior of the Prebid Server AMP endpoint in detail.
For a more general reference, see the [Prebid AMP Implementation Guide
]({{site.baseurl}}/dev-docs/show-prebid-ads-on-amp-pages.html).

## GET /openrtb2/amp

 **Parameters**

 {: .table .table-bordered .table-striped }
| Param | Scope | Type | Description |
| --- | --- | --- | --- |
| tag_id | Required | `String` |  The `tag_id` ID must reference a [Stored BidRequest]({{site.baseurl}}/prebid-server/features/pbs-storedreqs.html). For a thorough description of bid request JSON, see the [/openrtb2/auction](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html) docs. |
| w | recommended | `String` | Comes from the amp-ad.width attribute. The stored request may contain width already, but this parameter reflects what's actually in the page. It replaces imp.banner.format[0].w |
| h | recommended | `String` | Comes from the amp-ad.height attribute. The stored request may contain height already, but this parameter reflects what's actually in the page. It replaces imp.banner.format[0].h |
| ms | optional | `String` | Comes from the amp-ad.data-multi-size attribute. e.g. "970x90, 728x90". Sizes are parsed and added to imp.banner.format |
| oh | optional | `String` | Comes from the amp-ad.data-override-height attribute. See below for details on size calculation. |
| ow | optional | `String` | Comes from the amp-ad.data-override-width attribute. See below for details on size calculation. |
| curl | optional | `String` | Added to OpenRTB request as site.page |
| slot | optional | `String` | Added to OpenRTB request as imp[0].tagid |
| timeout | optional | `String` | Added to OpenRTB request as tmax |
| targeting | optional | `String` | First Party Data (PBS-Java only) |
| gdpr_consent | optional | `String` | Consent string passed from CMP. Note this is used for both GDPR and CCPA. |
| account | optional | `String` | Can be used to pass the Prebid-Server specific account ID. This is useful if `tag_id` parameters aren't unique across accounts. |
| debug | optional | `integer` | If 1, returns additional debug info. |

To be compatible with AMP, this endpoint behaves different from normal `/openrtb2/auction` requests.

1. The Stored `request.imp` data must have exactly one element.
2. `request.imp[0].secure` will be always be set to `1`, because AMP requires all content to be `https`.
3. AMP query params will overwrite parts of your Stored Request. For details, see the [Query Parameters](#query_params) section.

### Request

Valid Stored Requests for AMP pages must contain an `imp` array with exactly one element.  It is not necessary to include a `tmax` field in the Stored Request, as Prebid Server will always use the smaller of the AMP default timeout (1000ms) and the value passed via the `timeoutMillis` field of the `amp-ad.rtc-config`.

An example Stored Request is given below:

```javascript
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
            "banner": {}, // The sizes are defined by your AMP tag query params settings
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

Note that other ext.prebid extensions can be specified in the stored request such as:
- [ext.prebid.currency](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#currency-support)
- [ext.prebid.aliases](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#bidder-aliases)
- [ext.prebid.multibid](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#multibid-pbs-java-only)
- etc.

#### First Party Data

(Currently only supported in PBS-Java)

You can send first party data into an AMP request by encoding a JSON
targeting block like this:

```
GET /openrtb2/amp?tag_id=7470-Eater_AMP_ROS_ATF&w=300&h=250&ow=&oh=&ms=&slot=%2F172968584%2Feater%2Fgoogle%2Famp_med_rec_02&targeting=%7B%22site%22%3A%7B%22keywords%22%3A%22article%2C%20las%20vegas%22%2C%22cat%22%3A%7B%22blah%22%3A%221%22%7D%2C%22other-attribute%22%3A%22other-value%22%2C%22ext%22%3A%7B%22data%22%3A%7B%22entry_group%22%3A%5B%22front-page%22%2C%22featured-stories%22%5D%2C%22page_type%22%3A%22AMP%22%7D%7D%7D%2C%22user%22%3A%7B%22gender%22%3A%22m%22%7D%2C%22bidders%22%3A%5B%22rubicon%22%2C%22appnexus%22%5D%2C%22keywords%22%3A%22las%20vegas%20hospitality%20employees%22%2C%22foo%22%3A%7B%22bar%22%3A%22baz%22%7D%7D...
```

Prebid Server will expand the targeting value and merge the data into
the resulting OpenRTB JSON for the appropriate bidders.

For example, if this AMP targeting is provided:
```
{
    "site": {
      "keywords": "article, las vegas", // (1)
      "cat": { "blah": "1" }, // invalid data type, will be dropped
      "other-attribute": "other-value", // not openrtb2, remove
      "ext": {
        "data": {
          "entry_group": ["front-page","featured-stories"], // (4)
          "page_type": "AMP" // (5)
        } 
     }
    },
    "user": {
      "gender": "m", // (2)
    },
    "bidders": ["rubicon","appnexus"], // (3)
    "keywords": "las vegas hospitality employees", // (6)
    "foo": { // (7)
      "bar": "baz"
    }
}
```
The numbered elements from the raw targeting data above are merged into the resulting OpenRTB like this:
```
{
  "imp": [...],
  "site": {
    "publisher": { … },
    "keywords": "article, las vegas" // (1)
    "ext":{
      "data": {
        "entry_group": ["front-page","featured-stories"], // (4)
        "page_type": "AMP" // (5)
      }
    }
  },
  "user": {
    "gender": "m" // (2)
  },
  "ext": {
    "prebid": {
      "data": {
        "bidders": ["rubicon",appnexus"], // (3)
      }
    }
  },
  "imp": [
    ...
    "ext": {
       "context": {
         "data": {
           "keywords": "las vegas hospitality employees", // (6)
           "foo": { // (7)
             "bar": "baz"
           }
         }
       }
    }
  ]
}
```

### Response

A sample response payload looks like this:

```javascript
{
    "targeting": {
        "hb_bidder": "appnexus",
        "hb_bidder_appnexus": "appnexus",
        "hb_cache_id": "420d7329-30e8-4c4e-8eaa-fe937172e4e0",
        "hb_cache_id_appnexus": "420d7329-30e8-4c4e-8eaa-fe937172e4e0",
        "hb_creative_loadtype": "html",
        "hb_pb": "0.50",
        "hb_pb_appnexus": "0.50",
        "hb_size": "300x250",
        "hb_size_appnexus": "300x250"
    }
    "errors": {
        "openx":[
            {
               "code": 1,
               "message": "The request exceeded the timeout allocated"
            }
        ]
    }
}
```

In [the typical AMP setup]({{site.baseurl}}/dev-docs/show-prebid-ads-on-amp-pages.html),
these targeting params will be sent to Google Ad Manager.

### Error Messages

If any errors were generated they will appear  within `response.ext.errors.{bidderName}`. There are five error codes that could be returned:

```
0   NoErrorCode
1   TimeoutCode
2   BadInputCode
3   BadServerResponseCode
999 UnknownErrorCode
```

See the [/openrtb2/auction endpoint](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html) for a description of some common OpenRTB errors. The following is a list of AMP specific errors that could be returned:

{: .table .table-bordered .table-striped }
| Task  | Code |  Message | Action  |
|---|---|---|---|
|  Returning auction data. | 3  | Critical error.  | status set to `StatusInternalServerError`.  |
|  Extracting the targeting parameters from the response. | 3  | Critical error while unpacking AMP targets.  | status set to `StatusInternalServerError`.  |
|  Extract error from response. | 999  | AMP response: failed to unpack OpenRTB response.ext, debug info cannot be forwarded.  | Error is logged.  |
|  Adding debug information. | 999  | Test set on request but debug not present in response.  | Error is logged.  |
|  Encoding the response. | 999  | `/openrtb2/amp` failed to send response.  | Error is logged.  |


The following errors can occur when loading a stored OpenRTB request for an incoming AMP request.

{: .table .table-bordered .table-striped }
| Task  | Code |  Message | Action  |
|---|---|---|---|
|  Query check for tag_id. | 999  | AMP requests require an AMP tag_id.  | Error is returned.  |
|  Checking stored request for match against tag_id. | 999  | No AMP config found for tag_id `%s`.  | Error is returned.  |
|  Checking if imp exists. | 999  | Data for tag_id=`'%s'` does not define the required imp array.  | Error is returned.  |
|  Checking if imp count is greater than one. | 999  | Data for tag_id `'%s'` includes `%d` imp elements. Only one is allowed.  | Error is returned.  |
|  Checking if request.app exists. | 999  | `request.app` must not exist in AMP stored requests.  | Error is returned.  |


<a name="query_params"></a>
### Query Parameter Details

   - A configuration option `amp_timeout_adjustment_ms` may be set to account for estimated latency so that Prebid Server can handle timeouts from adapters and respond to the AMP RTC request before it times out.

Ensure that the amp-ad component was imported in the header.

```html
<script async custom-element="amp-ad" src="https://cdn.ampproject.org/v0/amp-ad-0.1.js"></script>
 ```

This script provides code libraries that will convert the `<amp-ad>` properties to the endpoint query parameters. In the most basic usage pass `width` and `height` as well as `type` and a `rtc-config`.  The `type` value is the ad network you will be using. The `rtc-config` is used to pass JSON configuration to the Prebid Server, which handles the communication with [AMP RTC](https://medium.com/ampfuel/better-than-header-bidding-amp-rtc-fc54e80f3999). Vendors is an object that defines any vendors that will be receiving the RTC callout. In this example, the required parameter `tag_id` will receive the `PLACEMENT_ID` (or `REQUEST_ID`) value.

```html
<amp-ad  
    width="300"
    height="250"
    rtc-config='{"vendors": {"prebidappnexus": {"PLACEMENT_ID": "ef8299d0-cc32-46cf-abcd-41cebe8b4b85"}}, "timeoutMillis": 500}'
</amp-ad>
```
Here's a simplified URL:

```
/openrtb2/amp?tag_id='ef8299d0-cc32-46cf-abcd-41cebe8b4b85'&w=300&h=250&timeout=500
```

Some endpoint parameters will override parts of the Stored Request.

1. `ow`, `oh`, `w`, `h`, and/or `ms` will be used to set `request.imp[0].banner.format` if `request.imp[0].banner` is present.
2. `curl` will be used to set `request.site.page`
3. `timeout` will generally be used to set `request.tmax`. However, the Prebid Server host can [configure](https://github.com/prebid/prebid-server/blob/master/docs/developers/configuration.md) their deploy to reduce this timeout for technical reasons.
4. `debug` will be used to set `request.test`, causing the `response.debug` to have extra debugging info in it.

### Resolving Sizes

We strive to return ads with sizes which are valid for the `amp-ad` on your page. This logic intends to
track the logic used by `doubleclick` when resolving sizes used to fetch ads from their ad server.

Specifically:

1. If `ow` and `oh` exist, `request.imp[0].banner.format` will be a single element with `w: ow` and `h: oh`
2. If `ow` and `h` exist, `request.imp[0].banner.format` will be a single element with `w: ow` and `h: h`
3. If `oh` and `w` exist, `request.imp[0].banner.format` will be a single element with `w: w` and `h: oh`
4. If `ms` exists, `request.imp[0].banner.format` will contain an element for every size it uses.
5. If `w` and `h` exist, `request.imp[0].banner.format` will be a single element with `w: w` and `h: h`
6. If `w` _or_ `h` exist, it will be used to override _one_ of the dimensions inside each element of `request.imp[0].banner.format`
7. If none of these exist then the Stored Request values for `request.imp[0].banner.format` will be used without modification.

## Further Reading
- [Prebid and AMP](/formats/amp.html)
- [Prebid Server AMP Use Case Overview](/prebid-server/use-cases/pbs-amp.html)
- [Prebid Server First Party Data](/prebid-server/features/pbs-fpd.html)

---
layout: page_v2
sidebarType: 5
title: Prebid Server | Endpoints | OpenRTB2 | AMP

---

# Prebid Server | Endpoints | /openrtb2/amp
{:.no_toc}

* TOC
{:toc}

This document describes the behavior of the Prebid Server AMP endpoint in detail.
For a more general reference, see the [Prebid AMP Implementation Guide
](/dev-docs/show-prebid-ads-on-amp-pages.html).

## GET /openrtb2/amp

 **Parameters**

 {: .table .table-bordered .table-striped }
| Param | Scope | Type | Description |
| --- | --- | --- | --- |
| tag_id | Required | `String` |  The `tag_id` ID must reference a [Stored BidRequest]({{site.baseurl}}/prebid-server/features/pbs-storedreqs.html). For a thorough description of bid request JSON, see the [/openrtb2/auction](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html) docs. |
| w | recommended | `String` | Comes from the amp-ad.width attribute. The stored request may contain width already, but this parameter reflects what's actually in the page. It's used to help determine imp.banner.format[0].w. See [resolving sizes](#resolving-sizes). |
| h | recommended | `String` | Comes from the amp-ad.height attribute. The stored request may contain height already, but this parameter reflects what's actually in the page. It's used to help determine imp.banner.format[0].h. See [resolving sizes](#resolving-sizes). |
| ms | optional | `String` | Comes from the amp-ad.data-multi-size attribute. e.g. "970x90, 728x90". Sizes are parsed and added to imp.banner.format |
| oh | optional | `String` | Comes from the amp-ad.data-override-height attribute. See [resolving sizes](#resolving-sizes). |
| ow | optional | `String` | Comes from the amp-ad.data-override-width attribute. See [resolving sizes](#resolving-sizes). |
| curl | optional | `String` | Added to OpenRTB request as site.page |
| slot | optional | `String` | Added to OpenRTB request as imp[0].tagid |
| timeout | optional | `String` | Added to OpenRTB request as tmax |
| targeting | optional | `String` | First Party Data |
| gdpr_consent | optional | `String` | Consent string passed from CMP. Note this is used for both GDPR and CCPA. |
| consent_type | optional | `String` | If "1", request is TCFv1 and GDPR fields are ignored. If "2", the 'gdpr_consent' field is interpreted as TCFv2. If "3", the 'gdpr_consent' field is interpreted as us_privacy. |
| gdpr_applies | optional | `String` | Takes the values "true", "false" or empty. This is used as the value of regs.ext.gdpr. If "true", regs.ext.gdpr:1, if "false", regs.ext.gdpr:0. |
| addtl_consent | optional | `String` | GAM "additional consent". If present, this value is copied to user.ext.ConsentedProvidersSettings.consented_providers |
| account | optional | `String` | Can be used to pass the Prebid-Server specific account ID. This is useful if `tag_id` parameters aren't unique across accounts. |
| debug | optional | `integer` | If 1, sets ext.prebid.debug to true to obtain additional debug info. |

To be compatible with AMP, this endpoint behaves different from normal `/openrtb2/auction` requests.

1. The 'tag_id' parameter points to a stored request.
2. The stored request must have exactly one `imp` element.
3. The request `imp[0].secure` will be always be set to `1`, because AMP requires all content to be `https`.
4. AMP query params will overwrite parts of your Stored Request. See the table above.

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
    "imp": [{
      "id": "some-impression-id",
      "banner": {}, // The sizes are defined by your AMP tag query params settings
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

Note that other ext.prebid extensions can be specified in the stored request such as:
- [ext.prebid.currency](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#currency-support)
- [ext.prebid.aliases](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#bidder-aliases)
- [ext.prebid.multibid](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#multibid)
- etc.

#### First Party Data

The nature of AMP is that user-level FPD is difficult or impossible. All of the pages are cached on a CDN and page javascript that can modify RTC calls is severely limited.

Contextual First Party Data must be defined in the stored request entries.

The only field that PBS supports in the AMP call that can be considered FPD is the 'targeting' block. These are key-value pairs that are sent to the ad server. They are also copied to the ORTB JSON in imp[].ext.data.

For example, if the AMP JSON targeting provided is:
```
  <amp-ad width="300" height="50"
    type="doubleclick"
    data-slot="/1111/amp_test"
    rtc-config='{"vendors": {"prebidrubicon": {"REQUEST_ID": "1001-my-test"}}}'
    json='{ "targeting": {"attr1": "val1", "attr2": "val2"}}' >
  </amp-ad>
```
The AMP URL would be something like this:
```
GET /openrtb2/amp?tag_id=1001-my-test&w=300&h=250&ow=&oh=&ms=&slot=%2F1111%2Famp_test&targeting=%7B%22attr1%22%3A%22val1%22%2C%22attr2%22%3A%22val2%22%7D&...
```
And the resulting OpenRTB would merge these targeting values as FPD on imp.ext.data:
```
{
  "imp": [{
    ...
    "ext": {
      "data": {
        "attr1": "val1",
        "attr2": "val2"
      }
    }
  }],
  ...
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
|  Checking if app exists. | 999  | The `app` object must not exist in AMP stored requests.  | Error is returned.  |

### Resolving Sizes

We strive to return ads with sizes which are valid for the `amp-ad` on your page. This logic intends to
track the logic used by `doubleclick` when resolving sizes used to fetch ads from their ad server.

Specifically:

1. If `ow` and `oh` exist, `imp[0].banner.format` will be a single element with `w: ow` and `h: oh`
2. If `ow` and `h` exist, `imp[0].banner.format` will be a single element with `w: ow` and `h: h`
3. If `oh` and `w` exist, `imp[0].banner.format` will be a single element with `w: w` and `h: oh`
4. If `ms` exists, `imp[0].banner.format` will contain an element for every size it uses.
5. If `w` and `h` exist, `imp[0].banner.format` will be a single element with `w: w` and `h: h`
6. If `w` _or_ `h` exist, it will be used to override _one_ of the dimensions inside each element of `imp[0].banner.format`
7. If none of these exist then the Stored Request values for `imp[0].banner.format` will be used without modification.

## Configuration Options

- settings.generate-storedrequest-bidrequest-id: replace the stored request `id` with a UUID
- amp.default-timeout-ms: default operation timeout for AMP requests
- amp.timeout-adjustment-ms: reduces timeout value passed in AMP request. Can be used to account for estimated latency so that Prebid Server can respond to the AMP RTC request before it times out.
- amp.max-timeout-ms: maximum operation timeout for AMP requests

## Further Reading
- [Prebid and AMP](/formats/amp.html)
- [Prebid Server AMP Use Case Overview](/prebid-server/use-cases/pbs-amp.html)
- [Prebid Server First Party Data](/prebid-server/features/pbs-fpd.html)
- [Stored Requests](/prebid-server/features/pbs-storedreqs.html)

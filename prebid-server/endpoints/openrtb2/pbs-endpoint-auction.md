---
layout: page_v2
sidebarType: 5
title: Prebid Server | Endpoints | OpenRTB2 | Auction
---

# Prebid Server | Endpoints | /openrtb2/auction
{:.no_toc}

## POST /openrtb2/auction
{:.no_toc}

- TOC
{:toc }

This endpoint runs an auction with the given OpenRTB 2.x bid request.

### Sample Request

This is a sample OpenRTB 2.x bid request:

```json
{
  "id": "some-request-id",
  "test": 1,
  "site": {
    "page": "prebid.org"
  },
  "imp": [{
    "id": "some-impression-id",
    "banner": {
      "format": [{
        "w": 600,
        "h": 500
      }, {
        "w": 300,
        "h": 600
      }]
    },
    "ext": {
      "prebid": {
        "bidder": {
          "bidderA": {
            "placement": 12345
          }
        }
      }
    }
  }],
  "tmax": 500
}
```

Additional examples can be found in [endpoints/openrtb2/sample-requests/valid-whole](https://github.com/prebid/prebid-server/tree/master/endpoints/openrtb2/sample-requests/valid-whole).

### Sample Response

This endpoint will respond with either:

- An OpenRTB 2.x bid response, or
- HTTP 400 if the request is malformed, or
- HTTP 503 if the account or app specified in the request is blacklisted

This is a corresponding sample response to a sample bid request:

```json
{
  "id": "some-request-id",
  "seatbid": [{
    "seat": "bidderA",
    "bid": [{
      "id": "145556724130495288",
      "impid": "some-impression-id",
      "price": 0.01,
      "adm": "<script type=\"application/javascript\">...</script>",
      "adid": "107987536",
      "adomain": [
        "biddera.com"
      ],
      "iurl": "https://biddera.com/cr?id=107987536",
      "cid": "3532",
      "crid": "107987536",
      "w": 600,
      "h": 500,
      "ext": {
        "prebid": {
          "type": "banner",
          "video": {
            "duration": 0,
            "primary_category": ""
          }
        },
        "bidder": {
          "bidderA": {
            "brand_id": 1,
            "auction_id": 7311907164510136364,
            "bidder_id": 2,
            "bid_ad_type": 0
          }
        }
      }
    }]
  }],
  "cur": "USD",
  "ext": {
    "responsetimemillis": {
      "bidderA": 10
    },
    "tmaxrequest": 500
  }
}
```

#### Fledge Auctions

[Fledge](https://github.com/google/ads-privacy/tree/master/proposals/fledge-multiple-seller-testing) is an experimental approach to running online ad auctions with enhanced privacy.

Prebid Server's support for Fledge is a passthrough:

1. If the request contains `imp.ext.ae: 1`
2. Bid adapters may respond with 'auction config' that's placed in `ext.prebid.fledge.auctionconfigs[]`.

The auction config must then be used by the client. See the Prebid.js [Fledge for GPT](/dev-docs/modules/fledgeForGpt.html) module for more information.

### OpenRTB Fields

Prebid Server accepts all OpenRTB 2.x fields and passes them in the request to all bid and analytics adapters. Some fields are processed by Prebid Server in the following ways:

{: .table .table-bordered .table-striped }
| ORTB Field | Version | Notes |
| --- | --- | --- |
| id | 2.5 | See below |
| source.tid | 2.5 | See below |
| imp[].id | 2.5 | See below |
| imp[].ext.tid | 2.x | See below |
| cur | 2.5 | Only the first array element is taken to be the "Ad Server Currency" for purposes of [currency conversion](/prebid-server/features/pbs-currency.html). |
| exp | 2.5 | See the [expiration](#expiration) section below |
| tmax | 2.5 | See the [timeout](#timeout) section below |
| device.lmt | 2.5 | See special processing for iOS apps defined in [issue 1699](https://github.com/prebid/prebid-server/issues/1699) |
| regs.gdpr | 2.6 | Bidders supporting 2.5 only: downgraded to regs.ext.gdpr |
| regs.us_privacy | 2.6 | Bidders supporting 2.5 only: downgraded to regs.ext.us_privacy |
| user.consent | 2.6 | Bidders supporting 2.5 only: downgraded to user.ext.consent |
| imp.rwdd | 2.6 | Bidders supporting 2.5 only: downgraded to imp.ext.prebid.is_rewarded_inventory |
| user.eids | 2.6 | Bidders supporting 2.5 only: downgraded to user.ext.eids |
| source.schain | 2.6 | Bidders supporting 2.5 only: downgraded to source.ext.schain |
| wlangb, {content, device}.langb, cattax, {site, app, publisher, content, producer}.cattax, ssai, {app, site}.content.{network, channel}, {app, content, site, user}.kwarray, device.sua | 2.6 | Bidders supporting 2.5 only: these fields are removed |
| {video, audio}.{rqddurs, maxseq, poddur, podid, podseq, mincpmpersec, slotinpod} | 2.6 | Bidders supporting 2.5 only: these fields are removed |
| regs.gpp | 2.6-202211 | Bidders supporting 2.5 only: this field is removed |
| regs.gpp_sid | 2.6-202211 | Bidders supporting 2.5 only: this field is removed |
| dooh | 2.6-202211 | not yet supported by PBS |
| imp.qty | 2.6-202211 | (PBS-Go only so far) Bidders supporting 2.5 only: this field is removed |
| imp.dt | 2.6-202211 | (PBS-Go only so far) Bidders supporting 2.5 only: this field is removed |
| imp.refresh | 2.6-202303 | (PBS-Go only so far) Bidders supporting 2.5 only: this field is removed |
| imp.video.plcmt | 2.6-202303 | (PBS-Go only so far) Bidders supporting 2.5 only: this field is removed |

#### IDs

Prebid Server has the ability to fill in key IDs in the request.

##### request.id

```text
if host config generate_request_id (Go) / generate-storedrequest-bidrequest-id (Java) is true
    if $.id is not set, generate a random value
    if the storedrequest is from AMP or from ext.prebid.storedrequest, then replace any existing $.id with a random value
if $.id contains "{{UUID}}", replace that macro with a random value
```

##### request.source.tid

PBS-Go - this will change once [issue 2727](https://github.com/prebid/prebid-server/issues/2727) is implemented to link the transmitTid activity.

```text
if source.tid is not set:
   set source.tid to a random UUID
if host config auto_gen_source_tid (Go) / generate-storedrequest-bidrequest-id (Java) is true
    if the storedrequest is from AMP or from a top-level stored request (ext.prebid.storedrequest), then replace any existing $.source.tid with a random value
if $.source.tid contains "{{UUID}}", replace that macro with a random value
```

PBS-Java

```text
if source.tid is not set and the transmitTid activity is allowed:
   set source.tid to a random UUID
if host config generate-storedrequest-bidrequest-id config is true and the transmitTid activity is allowed
    if the storedrequest is from AMP or from a top-level stored request (ext.prebid.storedrequest), then replace any existing $.source.tid with a random value
if $.source.tid contains "{{UUID}}", replace that macro with a random value
```

Note: the request parameter `ext.prebid.createtids` can override the [transmitTids activity](/prebid-server/features/pbs-activitycontrols.html).

##### request.imp[].id

```text
if host config generate-storedrequest-bidrequest-id config is true
    if any $.imp[].id is missing, set it to a random 16-digit string. (Note: this wasn't in issue 1507)
    if the storedrequest is from AMP **or** from a top-level stored request (ext.prebid.storedrequest), confirm that all $.imp[].id fields in the request are different. If not different, re-number them all starting from "1".
```

##### request.imp[].ext.tid

PBS-Go - this will change once [issue 2727](https://github.com/prebid/prebid-server/issues/2727) is implemented to link the transmitTid activity.

```text
if imp[n].ext.tid is not set:
       set imp[n].ext.tid to a randomly generated UUID
   if host config generate-storedrequest-bidrequest-id config is true
       if the storedrequest is from AMP or from ext.prebid.storedrequest, then replace any existing $.imp[n].ext.tid with a random value
if $.imp[n].ext.tid contains "{{UUID}}", replace that macro with a random value
```

PBS-Java

```text
for each imp:
   if imp[n].ext.tid is not set and the transmitTid activity is allowed:
       set imp[n].ext.tid to a randomly generated UUID
   if host config generate-storedrequest-bidrequest-id config is true and the transmitTid activity is allowed
       if the storedrequest is from AMP or from a top-level stored request (ext.prebid.storedrequest), then replace any existing $.imp[n].ext.tid with a random value
  if $.imp[n].ext.tid contains "{{UUID}}", replace that macro with a random value
```

Note: the request parameter `ext.prebid.createtids` can override the [transmitTids activity](/prebid-server/features/pbs-activitycontrols.html).

#### Expiration

The `imp[].exp` field is an "Advisory as to the number of seconds that may elapse
between the auction and the actual impression."

This field is used in slightly different ways by PBS-Go and PBS-Java:

##### PBS-Go
{:.no_toc}

How long an item is stored in Prebid Cache is determined by this hunt path:

1. bidResponse.seatbid[].bid[].exp + 60: as set by the bidder's adapter
2. request.imp[].exp + 60: as set by the incoming request
3. account config: cache_ttl.{banner,video,native,audio} + 60
4. global config: cache.default_ttl_seconds.{banner,video,native,audio} + 60

A 60-second buffer is added to make sure cache retrievals work towards the end of the
cache period.

##### PBS-Java
{:.no_toc}

How long an item is stored in Prebid Cache is determined by this hunt path:

1. bidResponse.seatbid[].bid[].exp: set by the bidder's adapter
2. request.imp[].exp: set by the incoming request
3. request.ext.prebid.cache.{bids,vastxml}.ttlseconds
4. account config: {banner,video}-cache-ttl
5. global config: cache.{banner,video}-ttl-seconds

#### Timeout

The OpenRTB 2.5 `tmax` field defines how long Prebid Server has to process the request
before the client will stop waiting.

This field is used in different ways by PBS-Go and PBS-Java:

##### PBS-Go

Hosts can configure `auction_timeouts_ms` and `tmax_adjustments` to enable the utilization of tmax in auction endpoints.

The `auction_timeouts_ms` parameter comprises default and max values. These values serve the purpose of determining the tmax duration PBS has for processing an auction request.

- If tmax value is not specified or is set to 0 in the auction request, PBS will use the default value configured by the host (auction_timeouts_ms.default) as the tmax.
- If tmax value specified in the auction request exceeds the maximum value defined by the host (auction_timeouts_ms.max), PBS will use host defined max (auction_timeouts_ms.max) as tmax.

The resultant tmax, as determined by the above rules is employed in conjunction with the `tmax_adjustments` to estimate the tmax value for bidders i.e `bidder_tmax`. This estimated value indicates the time allotted for bidders to respond to a bid request.

The `tmax_adjustments` parameter encompasses the following values:

- enabled (required): indicates whether the estimation of bidder_tmax should be enabled or not. Hosts can set it to "false" to disable the estimation of bidder_tmax.
- bidder_network_latency_buffer_ms: accounts for network delays that may occur between PBS and the bidder servers. A value of 0 indicates that no network latency buffer should be accounted for bidder_tmax calculation.
- bidder_response_duration_min_ms (required): minimum amount of time that PBS can expect to receive response from a bidder server.
- pbs_response_preparation_duration_ms (required): defines time needed for PBS to process all the responses from the bidders and generate the final response for a request.

Additionally, PBS takes into account the request_processing_time when estimating the bidder_tmax value. The request_processing_time represents the duration PBS takes to process a specific auction request before sending it to the bidder servers. It's important to note that the request_processing_time is calculated at runtime.

PBS won't send a request to the bidder if the calculated bidder_tmax is less than the pbs_response_preparation_duration_ms.

To summarize the process:

- If request.tmax is 0:

  ```text
  tmax = auction_timeouts_ms.default
  ```

- If request.tmax is set to a large value, PBS attempts to cap tmax:

  ```text
  tmax = min(request.tmax, auction_timeouts_ms.max)
  ```

- bidder_tmax is calculated as follows:

  ```text
  bidder_tmax = tmax - request_processing_time - bidder_network_latency_buffer_ms - bidder_response_duration_min_ms
  ```

- If bidder_tmax is less than pbs_response_preparation_duration_ms, the request is not sent to the bidder server.

- In case tmax_adjustments.enabled is set to false, PBS continues to apply its rules for determining tmax, but bidder_tmax will not be calculated, and PBS will consistently send the request to the bidder server.

##### PBS-Java

Core concepts:

- request_tmax: what the incoming ORTB request defines as tmax (as milliseconds)
- biddertmax_max: controls that upstream doesn't tell us ridiculous values. In milliseconds. (configuration auction.biddertmax.max)
- biddertmax_min: it's not worth calling bidders and give them less time than this number of milliseconds (configuration (auction.biddertmax.min). Note: we recommend this value be at least 150 ms)
- biddertmax_percent: a lower number means more buffer for network delay. Host companies should set this to a lower value in regions where the network connections are slower. (configuration auction.biddertmax.percent)
- tmax_upstream_response_time: the amount of time (in ms) that PBS needs to respond to the original caller (configuration auction.tmax-upstream-response-time)
- processing_time: PBS calculation for how long it's been since the start of the request up to the point where the bidders are called
- bidder_tmax: this is what PBS-core tells the bidders they have to respond. The conceptual formula is: capped(request_tmax)*biddertmax_percent - processing_time - tmax_upstream_response_time ==> must be at least the configured min
- enforced_tmax: this is long PBS-core actually gives the bidders: capped(request_tmax)- processing_time - tmax_upstream_response_time ==> cannot be lower than bidder_tmax

The full formulas:

bidder_tmax=max(calculated_tmax, biddertmax_min)=max((min(request_tmax,biddertmax_max)*biddertmax_percent)-processing_time - tmax_upstream_response_time, biddertmax_min)

enforced_tmax=max(calculated_enforcement,bidder_tmax)=max(min(request_tmax,biddertmax_max)-processing_time - tmax_upstream_response_time , bidder_tmax)

### OpenRTB Extensions

#### Conventions

OpenRTB 2.x permits exchanges to define their own extensions to any object from the spec.
These fall under the `ext` field of JSON objects.

If `ext` is defined on an object, Prebid Server uses the following conventions:

1. `ext` in "request objects" uses `ext.prebid` and/or `ext.{anyBidderCode}`.
2. `ext` on "response objects" uses `ext.prebid` and/or `ext.bidder`.
The only exception here is the top-level `BidResponse`, because it's bidder-independent.

`ext.{anyBidderCode}` and `ext.bidder` extensions are defined by bidders.
`ext.prebid` extensions are defined by Prebid Server.

Prebid Server supports the following "standard" industry extensions:

- `request.regs.ext.gdpr` and `request.user.ext.consent` -- To support GDPR
- `request.regs.ext.us_privacy` -- To support CCPA
- `request.site.ext.amp` -- To identify AMP as the request source
- `request.user.ext.eids` -- To support Extended Identifiers
- `request.app.ext.source` and `request.app.ext.version` -- To support identifying the displaymanager/SDK in mobile apps. If given, we expect these to be strings.

#### OpenRTB Request Extensions

##### Global Bid Adapter Parameters

PBS supports two scenarios:

1. If a bid adapter has a parameter that is the same across all imp[] entries,
it can be supplied on `ext.prebid.bidderparams.BIDDER`:

```json
{
  "ext": {
    "prebid": {
      "bidderparams": {
        "bidderA": {
          "key1": "some-value-1",
          "key2": {
            "version": 3.3,
            "profileid": 1234
          }
        },
        "bidderB": {
          "key3": "some-value-3"
        }
      }
    }
  }
}
```

Bid adapters do not need to read this data from ext.prebid. PBS will merge the attributes to each imp[] in the request so the adapter can read them normally.

{:start="2"}
2. If a bid adapter has a parameter that alters its runtime behavior, but is not a formal parameter, it can be supplied on `ext.prebid.bidders.BIDDER`. The adapter will see this on `ext.prebid.bidders.bidder`.

```json
{
  "ext": {
    "prebid": {
      "bidders": {
        "bidderA": {
          "option": "value"
        },
        "bidderB": {
          "option": "value"
        }
      }
    }
  }
}
```

##### Bid Adjustments

Bidders are encouraged to make Net bids. However, there's no way for Prebid to enforce this.
If you find that some bidders use Gross bids, publishers can adjust for it with `request.ext.prebid.bidadjustmentfactors`:

```json
{
  "ext": {
    "prebid": {
      "bidadjustmentfactors": {
        "bidderA": 0.9,
        "bidderB": 0.8
      }
    }
  }
}
```

This may also be useful for publishers who want to account for different discrepancies with different bidders.

It's also possible to define different bid adjustment factors by mediatype, which can be helpful to adjust discrepancies that differ across mediatypes:

```json
{
  "ext": {
    "prebid": {
      "bidadjustmentfactors": {
        "bidderA": 0.9,
        "bidderB": 0.8,
        "mediatypes": {
          "banner": {
            "bidderA": 0.8
          },
          "video-outstream": {
            "bidderC": 0.9
          },
          "video": {
            "bidderB": 0.85
          }
        }
      }
    }
  }
}
```

Note that video-outstream is defined to be imp[].video requests where imp[].video.placement is greater than 1.

##### Targeting

Targeting refers to strings that are sent to the adserver to
[make header bidding possible](/overview/intro.html).

`request.ext.prebid.targeting` is an optional property that causes Prebid Server
to set these params on the response at `response.seatbid[i].bid[j].ext.prebid.targeting`.

{: .table .table-bordered .table-striped }
| Attribute | Required? | Description | Example | Type |
| --- | --- | --- | --- | --- |
| pricegranularity | no | Defines how PBS quantizes bid prices into buckets | (see below) | object |
| pricegranularity.precision | no | How many decimal places are there in price buckets | Defaults to 2 | integer |
| pricegranularity.ranges | no | Non-overlapping price bucket definitions  | (see below) | array of objects |
| pricegranularity.ranges.max | no | Top end of this range of price buckets. The bottom end is 0 or the max of the previous bucket. Note: in order to prevent ranges with gaps, there's no 'min' attribute. | 5.55 | float |
| pricegranularity.ranges.increment | no | Size of the buckets in this range. | 1.50 | float |
| mediatypepricegranularity | no | Defines how PBS quantizes bid prices into buckets, allowing for different ranges by media type. | (see below) | object |
| mediatypepricegranularity.banner | no | Defines how PBS quantizes bid prices into buckets for banners. | (see below) | object |
| mediatypepricegranularity.video | no | Defines how PBS quantizes bid prices into buckets for video. | (see below) | object |
| mediatypepricegranularity.native | no | Defines how PBS quantizes bid prices into buckets for native. | (see below) | object |
| mediatypepricegranularity.TYPE.precision | no | How many decimal places are there in price buckets. | Defaults to 2 | integer |
| mediatypepricegranularity.TYPE.ranges | no | Same as pricegranularity.ranges | (see below) | array of objects |
| includewinners | no | Whether to include targeting for the winning bids in response.seatbid[].bid[]. ext.prebid.targeting. Defaults to false. | true | boolean |
| includebidderkeys | no | Whether to include targeting for the best bid from each bidder in response.seatbid[].bid[]. ext.prebid.targeting. Defaults to false. | true | boolean |
| includeformat | no | Whether to include the "hb_format" targeting key. Defaults to false. | false | boolean |
| preferdeals | no | If targeting is returned and this is true, PBS will choose the highest value deal before choosing the highest value non-deal. Defaults to false. | true | boolean |
| alwaysincludedeals | no | If true, generate hb_ATTR_BIDDER values for all bids that have a dealid | true | boolean |
| prefix | no | (PBS-Java only) Instead of emitting all targeting values with the default prefix `hb`, use this value. Note that long prefixes are discouraged because GAM has a 20-char limit on key value pairs and some Prebid targeting values (e.g. hb_cache_host_bidderA) are already more than 20 chars. | "hb2" | string |

**Request format** (optional param `request.ext.prebid.targeting`)

```json
{
  "ext": {
    "prebid": {
      "targeting": {
        "pricegranularity": {
          "precision": 2,
          "ranges": [{
            "max": 20.00,
            "increment": 0.10 // This is equivalent to the deprecated
                              // "pricegranularity": "medium"
          }]
        },
        "includewinners": true,     // Optional param defaulting to false
        "includebidderkeys": false, // Optional param defaulting to false
        "includeformat": false,     // Optional param defaulting to false
        "preferdeals": true         // Optional param defaulting to false
        "alwaysincludedeals": true  // Optional param defaulting to false
      }
    }
  }
}
```

The list of price granularity ranges must be given in order of increasing `max` values. If `precision` is omitted, it will default to `2`. The minimum of a range will be 0 or the previous `max`. Any cpm above the largest `max` will go in the `max` pricebucket.

For backwards compatibility the following strings will also be allowed as price granularity definitions. There is no guarantee that these will be honored in the future. "One of ['low', 'med', 'high', 'auto', 'dense']" See [price granularity definitions](/adops/price-granularity.html).

One of "includewinners" or "includebidderkeys" should be true if you want targeting - both default to false if unset. If both are false, then no targeting keys will be set, which is better configured by omitting targeting altogether.

The parameter "includeformat" indicates the type of the bid (banner, video, etc) for multiformat requests. It will add the key `hb_format` and/or `hb_format_{bidderName}` as per "includewinners" and "includebidderkeys" above.

MediaType PriceGranularity - when a single OpenRTB request contains multiple impressions with different mediatypes, or a single impression supports multiple formats, the different mediatypes may need different price granularities. If `mediatypepricegranularity` is present, `pricegranularity` would only be used for any mediatypes not specified.

For example:

```json
{
  "ext": {
    "prebid": {
      "targeting": {
        "pricegranularity": {                 // use this for banner and native
          "ranges": [
              {"max": 20, "increment": 0.5}
            ]
        },
        "mediatypepricegranularity": {        // video gets a different set of ranges     
          "video": {
            "ranges": [
              {"max": 10, "increment": 1},
              {"max": 20, "increment": 2},
              {"max": 50, "increment": 5}
            ]
          }
        }
      },
      "includewinners": true
    }
  }
}
```

**Response format** (returned in `bid.ext.prebid.targeting`)

```json
{
  "seatbid": [{
    "bid": [{
      ...
      "ext": {
        "prebid": {
          "targeting": {
            "hb_bidder_{bidderName}": "The seatbid.seat which contains this bid",
            "hb_size_{bidderName}": "A string like '300x250' using bid.w and bid.h for this bid",
            "hb_pb_{bidderName}": "The bid.cpm, rounded down based on the price granularity."
          }
        }
      }
    }]
  }]
}
```

The winning bid for each `request.imp[i]` will also contain `hb_bidder`, `hb_size`, and `hb_pb`
(with _no_ {bidderName} suffix). To prevent these keys, set `request.ext.prebid.targeting.includeWinners` to false.

**NOTES**:

- Targeting keys are limited to 20 characters. If {bidderName} is too long, the returned key
will be truncated to only include the first 20 characters.

##### Buyer UID

Each Bidder should receive their own ID in the `request.user.buyeruid` property.
Prebid Server has three ways to populate this field. In order of priority:

1. If the request payload contains `request.user.buyeruid`, then that value will be sent to all Bidders.
In most cases, this is probably a bad idea.

2. The request payload can store a `buyeruid` for each Bidder by defining `request.user.ext.prebid.buyeruids` like so:

    ```json
    {
      "user": {
        "ext": {
          "prebid": {
            "buyeruids": {
              "bidderA": "some-biddera-id",
              "bidderB": "some-bidderb-id"
            }
          }
        }
      }
    }
    ```

    Prebid Server's core logic will preprocess the request so that each Bidder sees their own value in the `request.user.buyeruid` field.

3. Prebid Server will use its Cookie to map IDs for each Bidder.

    If you're using [Prebid.js](https://github.com/prebid/Prebid.js), this is happening automatically.

    If you're using another client, you can populate the Cookie of the Prebid Server host with User IDs for each Bidder by using the `/cookie_sync` endpoint, and calling the URLs that it returns in the response.

##### Native Request

For each native request, the `assets` object's `id` field is optional and if not defined, Prebid Server will set this automatically, using the index of the asset in the array as the ID.

##### Bidder Aliases

Requests can define Bidder aliases if they want to refer to a Bidder by a separate name.
This can be used to request bids from the same Bidder with different params. For example:

```json
{
  "imp": [{
    "id": "some-impression-id",
    "video": {
      "mimes": ["video/mp4"]
    },
    "ext": {
      "appnexus": {
        "placementId": 123
      },
      "districtm": {
        "placementId": 456
      }
    }
  }],
  "ext": {
    "prebid": {
      "aliases": {
        "districtm": "appnexus"
      }
    }
  }
}
```

For all intents and purposes, the alias will be treated as another Bidder. This new Bidder will behave exactly
like the original, except that the Response will contain separate SeatBids, and any Targeting keys
will be formed using the alias' name.

If an alias overlaps with a core Bidder's name, then the alias will take precedence.
This prevents breaking API changes as new Bidders are added to the project.

For example, if the Request defines an alias like this:

```json
"aliases": {
  "appnexus": "rubicon"
}
```

then any `imp.ext.appnexus` params will actually go to the **rubicon** adapter.
It will become impossible to fetch bids from AppNexus within that Request.

##### Bidder Alias GVL IDs

For publishers that use Prebid Server as part of their [GDPR/TCF](/prebid-server/features/pbs-privacy.html#gdpr) strategy, it can be important to define the Global Vendor List (GVL) ID with an alias.

To do this, just set `ext.prebid.aliasgvlids` alongside ext.prebid.aliases:

```json
"ext": {
  "prebid": {
    "aliases": {
      "newAlias": "originalBidderCode"
    },
    "aliasgvlids": {
      "newAlias": 11111
    }
  }
}
```

##### Stored Requests

`request.imp[i].ext.prebid.storedrequest` incorporates a [Stored Request](/prebid-server/features/pbs-storedreqs.html) from the server.

A typical `storedrequest` value looks like this:

```json
{
  "imp": [{
    "ext": {
      "prebid": {
        "storedrequest": {
          "id": "some-id"
        }
      }
    }
  }]
}
```

For more information, see the docs for [Stored Requests](/prebid-server/features/pbs-storedreqs.html).

##### Cache bids

Bids can be temporarily cached on the server by sending instructions in `request.ext.prebid.cache`:

```json
{
  "ext": {
    "prebid": {
      "cache": {
        "bids": {},
        "vastxml": {}
      }
    }
  }
}
```

Both `bids` and `vastxml` are optional, but one of the two is required if you want to cache bids. This property will have no effect
unless `request.ext.prebid.targeting` is also set in the request.

{: .table .table-bordered .table-striped }
| Attribute | Required? | Description | Example | Type |
| --- | --- | --- | --- | --- |
| ext.prebid.cache. bids | no | If present, cache the bid and respond with cache location | | object |
| ext.prebid.cache. bids.ttlseconds | no | How long to cache the bid. Default is set by PBS host config. | 300 | integer |
| ext.prebid.cache. bids.returnCreative | no | If false, suppress the body of the creative to save network bandwidth. Default is true. | false | boolean |
| ext.prebid.cache. vastxml | no | If present, cache the bid and respond with cache location | | object |
| ext.prebid.cache. vastxml.ttlseconds | no | How long to cache the bid. Default is set by PBS host config. | 300 | integer |
| ext.prebid.cache. vastxml.returnCreative | no | If false, suppress the body of the creative to save network bandwidth. Default is true. | false | boolean |

###### Caching the entire bid

If the `ext.prebid.cache.bids` object is present, Prebid Server will make a best effort to cache the entire bid object server-side and return the cache location in two places:

1. OpenRTB seatbid.bid.ext.prebid.cache.bids

    ```json
        {
          "seatbid": [
            "bid": [
              ...
              "ext": {
                "prebid": {
                  "cache": {
                    "bids": {
                      "url": "https://example.com:443/cache?uuid=385b283c-22cb-49a0-8c0b-8b88c49d9fe9",
                      "cacheId": "385b283c-22cb-49a0-8c0b-8b88c49d9fe9"
                    }
                  }
                }
              }
            ]
          ]
        }
    ```

2. Extra `bid.ext.prebid.targeting` keys:

    - `hb_cache_id`: the cache ID for the highest overall bid in each imp.
    - `hb_cache_host`: the hostname where the cacheId may be retrieved.
    - `hb_cache_path`: the path where the cacheId may be retrieved. https://hb_cache_host/hb_cache_path?uuid=hb_cacheId
    - `hb_cache_id_{bidderName}`: the cache ID for the highest bid from {bidderName} in each imp.

If caching succeeded, the value will be a UUID which can be used to fetch Bid JSON from [Prebid Cache](https://github.com/prebid/prebid-cache).
The keys may not exist if the host company's cache is full, having connection problems, etc.

This option is mainly intended for Prebid Mobile setups where bids aren't cached client-side.

###### Caching just the VAST XML

This option is mainly intended for video players that need a URL that returns a VAST XML body.

If the `ext.prebid.cache.vastxml` object is present, Prebid Server will make a best effort to cache just the VAST XML server-side and return the cache location in two places:

1. OpenRTB seatbid.bid.ext.prebid.cache.vastXml

    ```json
        {
          "seatbid": [
            "bid": [
              ...
              "ext": {
                "prebid": {
                  "cache": {
                    "vastXml": {
                      "url": "https://example.com:443/cache?uuid=385b283c-22cb-49a0-8c0b-8b88c49d9fe9",
                      "cacheId": "385b283c-22cb-49a0-8c0b-8b88c49d9fe9"
                    }
                  }
                }
              }
            ]
          ]
        }
    ```

2. Extra `bid.ext.prebid.targeting` keys:

    - `hb_uuid`: the cache ID for the highest overall video bid in each imp.
    - `hb_cache_host`: the hostname where the UUID may be retrieved.
    - `hb_cache_path`: the path where the UUID may be retrieved. ex: https://hb_cache_host/hb_cache_path?uuid=hb_uuid
    - `hb_uuid_{bidderName}`: the cache ID for the highest video bid from {bidderName} in each imp.

In addition to the caveats noted for cache.bids, these will exist only if there are video bids.
If the keys exist, the values can be used to fetch the bid's VAST XML from Prebid Cache directly.

##### GDPR

Prebid Server supports the IAB's [GDPR recommendations](https://iabtechlab.com/wp-content/uploads/2018/02/OpenRTB_Advisory_GDPR_2018-02.pdf).

This adds two optional properties:

- `request.user.ext.consent`: Is the consent string required by the IAB standards.
- `request.regs.ext.gdpr`: Is 0 if the caller believes that the user is not under GDPR, 1 if the user is in GDPR-scope, and undefined if the caller is uncertain.

These fields will be forwarded to each Bidder, so they can decide how to process them.

##### Interstitial support
Additional support for interstitials is enabled through the addition of two fields to the request:
`device.ext.prebid.interstitial.minwidthperc` and `device.ext.prebid.interstitial.minheightperc`.
The values will be numbers that indicate the minimum allowed size for the ad, as a percentage of the base side. For example, a width of 600 and `"minwidthperc": 60` would allow ads with widths from 360 to 600 pixels inclusive.

Example:

```json
{
  "imp": [{
    ...
    "banner": { ... },
    "instl": 1,
    ...
  }],
  "device": {
    ...
    "h": 640,
    "w": 320,
    "ext": {
      "prebid": {
        "interstitial": {
          "minwidthperc": 60,
          "minheightperc": 60
        }
      }
    }
  }
}
```

If PBS receives a request for an interstitial imp and these parameters are set, it will rewrite the format object within the interstitial imp. If the format array's first object is a size, PBS will take it as the max size for the interstitial. If that size is 1x1, it will look up the device's size and use that as the max size. If the format is not present, it will also use the device size as the max size (1x1 support so that you don't have to omit the format object to use the device size).

PBS with interstitial support will come preconfigured with a list of common ad sizes,preferentially organized by weighing the larger and more common sizes first. But no guarantees to the ordering will be made. PBS will generate a new format list for the interstitial imp by traversing this list and picking the first 10 sizes that fall within the imp's max size and minimum percentage size. There will be no attempt to favor aspect ratios closer to the original size's aspect ratio. The limit of 10 is enforced to ensure we don't overload bidders with an overlong list. All the interstitial parameters will still be passed to the bidders, so they may recognize them and use their own size matching algorithms if they prefer.

##### Currency Support

To set the desired 'ad server currency', use the standard OpenRTB `cur` attribute. Note that Prebid Server only looks at the first currency in the array.

```json
"cur": ["USD"]
```

If you want or need to define currency conversion rates (e.g. for currencies that your Prebid Server doesn't support),
define ext.prebid.currency.rates.

```json
"ext": {
  "prebid": {
    "currency": {
      "rates": {
        "USD": { "UAH": 24.47, "ETB": 32.04 }
      }
    }
  }
}
```

If it exists, a rate defined in `ext.prebid.currency.rates` has the highest priority.
If a currency rate doesn't exist in the request, the external file will be used.

An additional option is `usepbsrates`. When `true`, this flag indicates that dynamic currency exchange rates should be preferred over any supplied static rates. When `false`, it indicates that dynamic exchange rates should not be used. The default is 'true'.

##### Supply Chain Support

Basic supply chains are passed to Prebid Server on `source.ext.schain` and passed through to bid adapters. Prebid Server does not currently offer the ability to add a node to the supply chain.

Bidder-specific schains:

```json
"ext.prebid.schains": [
   { "bidders": ["bidderA"], "schain": { SCHAIN OBJECT 1}},
   { "bidders": ["*"], "schain": { SCHAIN OBJECT 2}}
]
```

In this scenario, Prebid Server sends the first schain object to `bidderA` and the second schain object to everyone else.

If there's already an source.ext.schain and a bidder is named in ext.prebid.schains (or covered by the wildcard condition), ext.prebid.schains takes precedent.

##### User IDs

Prebid Server adapters can support the [Prebid.js User ID modules](/dev-docs/modules/userId.html) by reading the following extensions and passing them through to their server endpoints:

```json
{
  "user": {
    "ext": {
      "eids": [{
        "source": "adserver.org",
        "uids": [{
          "id": "111111111111",
          "ext": {
            "rtiPartner": "TDID"
          }
        }]
      },
      {
        "source": "pubcid.org",
        "id":"11111111"
      }]
    }
  }
}
```

##### EID Permissions

Publishers can constrain which bidders receive which user.ext.eids entries. See the [Prebid.js user ID permissions](/dev-docs/modules/userId.html#permissions) reference for background.

```json
{
  "ext": {
    "prebid": {
      "data": {
        "eidpermissions": [
          {"source": "sharedid.org", "bidders": ["*"]},  // * is the default
          {"source": "neustar.biz",  "bidders": ["bidderB"]},
          {"source": "id5-sync.com", "bidders": ["bidderA","bidderC"]}
        ]
      }
    }
  }
}
```

ext.prebid.data.eidpermissions is an array of objects that can contain these attributes:

{: .table .table-bordered .table-striped }
| Attribute | Required? | Description | Example | Type |
| --- | --- | --- | --- | --- |
| source | Yes | Which user.ext.eids.source is receiving the permissions, one entry per source is allowed | "sharedid.org" | string |
| bidders | Yes | Which bidders are allowed to receive the named eid source | ["bidderA", "bidderC"] | array of strings |

##### Rewarded Video

{: .alert.alert-info :}
To be deprecated for `request.imp[].rwdd` introduced in OpenRTB 2.6.

Rewarded video is a way to incentivize users to watch ads by giving them 'points' for viewing an ad. A Prebid Server
client can declare a given adunit as eligible for rewards by declaring `imp.ext.prebid.is_rewarded_inventory:1`.

##### Create Transaction ID

The request can contain the global `createtids` flag to control the `transmitTid` [Activity Control](/prebid-server/features/pbs-activitycontrols.html).

```text
ext.request.createtids: false
```

If the value is `false`, the `transmitTid` activity is overridden to "denied", which means bid adapters will not get unique transaction IDs. If not specified, then the value of the transmitTid activity for the account is used. The overall default value it `true`, which translates to "allow" the generation of TIDs.

See the [endpoint documentation on IDs](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#ids) for details on how PBS creates the various IDs including transaction IDs.

##### Debug Flag

The OpenRTB `test` flag has a special meaning that bidders may react to: they may not perform a normal auction, or may not pay for test requests.

You can turn on the extra Prebid Server debug log without the formal `test` behavior by instead setting `ext.prebid.debug: true`.

##### Trace Flag

You can turn on additional Prebid Server tracing by setting `ext.prebid.trace` to either "verbose" or "basic".
This provides additional information for certain scenarios:

- for [modules](/prebid-server/pbs-modules/), look in response ext.prebid.modules.trace
- for [PG](/prebid-server/features/pg/pbs-pg-idx.html), look in response ext.debug.trace

##### Stored Responses

While testing SDK and video integrations, it's important, but often difficult, to get consistent responses back from bidders that cover a range of scenarios like different CPM values, deals, etc. Prebid Server supports a debugging workflow in two ways:

- a stored-auction-response that covers multiple bidder responses
- multiple stored-bid-responses at the bidder adapter level

**Single Stored Auction Response ID**

When a storedauctionresponse ID is specified:

- the rest of the imp.ext.prebid block is irrelevant and ignored
- nothing is sent to any bidder adapter for that imp
- the response retrieved from the stored-response-id is assumed to be the entire contents of the seatbid object corresponding to that impression.

This request:

```json
{
  "test": 1,
  "tmax": 500,
  "id": "test-auction-id",
  "app": { ... },
  "ext": {
    "prebid": {
      "targeting": {},
      "cache": {
        "bids": {}
      }
    }
  },
  "imp": [
    {
      "id": "a",
      "ext": {
        "prebid": {
          "storedauctionresponse": { "id": "1111111111" }
        }
      }
    },
    {
      "id": "b",
      "ext": {
        "prebid": {
          "storedauctionresponse": { "id": "22222222222" }
        }
      }
    }
  ]
}
```

will result in this response, assuming that the ids exist in the appropriate DB table read by Prebid Server:

```json
{
  "id": "test-auction-id",
  "seatbid": [
    {
      "bid": [{
        // BidderA bid from storedauctionresponse=11111111111
      },{
        // BidderA bid from storedauctionresponse=22222222222
      }],
      "seat": "bidderA"
    },
    {
      "bid": [{
        // BidderB bid from storedauctionresponse=11111111111
      },{
        // BidderB bid from storedauctionresponse=22222222222
      }],
      "seat": "bidderB"
    }
  ]
}
```

In this scenario, the contents of the storedauctionresponse entry is
an array of ortb2 seatbid objects. e.g.

```json
[
  {
    "bid": [{
        "impid": "a", // doesn't have to match the request
        ... bid 1 ...
    },{
        "impid": "b", // doesn't have to match the request
        ... bid 2 ...
    }],
    "seat": "bidderA"
  },{
    "bid": [{
        "impid": "a", // doesn't have to match the request
        ... bid 1 ...
    },{
        "impid": "b", // doesn't have to match the request
        ... bid 2 ...
    }],
    "seat": "bidderB"
  }
]
```

**Multiple Stored Bid Response IDs**

In contrast to the feature above, using `storedbidresponse` (instead of stored**auction**response) lets real auctions take place while the actual bidder response is overridden in such a way that it still exercises adapter code.

PBS removes imp.ext.prebid.bidder parameters for those
bidders specified in storedbidresponse but if there's a bidder present
in imp.ext.prebid.bidder that's doesn't have a storedbidresponse specified,
the adapter will be called as usual.

For example, this request:

```json
{
  "test": 1,
  "tmax": 500,
  "id": "test-auction-id",
  "app": { ... },
  "ext": {
    "prebid": {
      "targeting": {},
        "cache": { "bids": {} }
    }
  },
  "imp": [
    {
      "id": "a",
      "ext": {
        "prebid": {
          "bidder: {
            "bidderA": { ... params ... },
            "bidderB": { ... params ... }
          },
          "storedbidresponse": [
            { "bidder": "BidderA", "id": "333333", "replaceimpid":true },
            { "bidder": "BidderB", "id": "444444", "replaceimpid":true },
          ]
        }
      }
    },
    {
      "id": "b",
      "ext": {
        "prebid": {
          "bidder: {
            "bidderA": { ... params ... },
            "bidderB": { ... params ... }
          },
          "storedbidresponse": [
            { "bidder": "BidderA", "id": "5555555", "replaceimpid":true }
            // note: no storedbidrespose for bidderB
          ]
        }
      }
    }
  ]
}
```

Could result in this response:

```json
{
  "id": "test-auction-id",
  "seatbid": [
    {
      "bid": [{
        // contents of storedbidresponse=3333333 as parsed by bidderA adapter
      },{
        // contents of storedbidresponse=5555555 as parsed by bidderA adapter
      }],
      "seat": "bidderA"
    },
    {
      "bid": [{
        // contents of storedbidresponse=4444444 as parsed by bidderB adapter
      },{
        // actual bid response from bidderB
      }],
      "seat": "bidderB"
    }
  ]
}
```

Notes:

- The DB entries for this stored-response scenario are quite different: they need to be in whatever format the bid adapter's endpoint responds with. i.e. the host company will need to capture an actual bid response from the specific bidders and enter it into the DB table.
- The `replaceimpid` parameter tells PBS to ignore the impid supplied in the DB and instead create/overwrite seatbid.bid.impid with the value that matches the incoming request. This simplifies debugging.
- `replaceimpid` doesn't work in PBS-Java. Instead, the implementation there is to use the `##PBSIMPID##` macro in the body of the stored response, which will be replaced by PBS-core.

See Prebid.org [troubleshooting pages](/troubleshooting/pbs-troubleshooting.html#manual-specification-of-stored-responses-in-openrtb) for how to utilize this feature within the context of the browser.

##### First Party Data Support

This is a standard way for the page (or app) to supply First Party Data and control which bidders have access to it.

Prebid defines several types of First Party Data (FPD):

1. Cross-impression contextual information. e.g. the content category of the page. This data goes in the `site.ext.data` object or the `app.ext.data` object.
1. User-level information. e.g. whether the user is a registered user. This data goes in `user.ext.data`.
1. Impression-level information. e.g. the Global Placement ID. This data goes in the `imp.ext.data` object.
1. Seller-Defined Audience (SDA) contextual data. This goes in `site.data[]` or `app.data[]` in accordance with the [IAB segment taxonomy conventions](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/main/extensions/community_extensions/segtax.md).
1. SDA user data goes in `user.data[]` with the same [conventions](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/main/extensions/community_extensions/segtax.md) as the contextual data.

See below for how to specify these different types of data and how to define which bidders are
allowed to receive which.

###### Data Permissions

This approach specifies whether the given bidder(s) are allowed to receive the global (contextual or user)
FPD.

If a `ext.prebid.data.bidders[]` is specified, it means that {site,app}.ext.data and user.ext.data fields will only be passed to the named bidders. For example:

```json
{
  "ext": {
    "prebid": {
      "data": { "bidders": [ "bidderA", "bidderB" ] }  // these are the bidders allowed to see the globsl FPD
    }
  }
}
```

For example:

```json
{
  "ext": {
    "prebid": {
      "data": { "bidders": [ "bidderA", "bidderB" ] }  // these are the bidders allowed to see protected data
    }
  },
  "site": {
    "keywords": "",
    "search": "",
    "ext": {
      "data": { GLOBAL SITE DATA } // only seen by bidders named in ext.prebid.data.bidders[]
    }
  },
  "user": {
    "keywords": "",
    "geo": {},
    "ext": {
      "data": { GLOBAL USER DATA }  // only seen by bidders named in ext.prebid.data.bidders[]
    }
  },
  "imp": [
    {
      ...
      "ext": {
        "data": {
          ADUNIT SPECFIC CONTEXT DATA  // can be seen by all bidders
        }
      }
    }
  ]
}
```

###### Bidder-Specific global FPD

Bidder-specific global (i.e. cross-impression) data can be defined with ext.prebid.bidderconfig:

```json
"ext": {
  "prebid": {
    "bidderconfig": [
      {
        "bidders": ["bidderA", "bidderB"],
        "config": {
           "ortb2": {
              "site": { ... },
              "user": { ... }
           }
        }
      },
      {
        "bidders": ["bidderC"],
        "config": {
           "ortb2": {
              "site": { ... },
              "user": { ... }
           }
        }
      }
    ]
  }
}
```

Prebid Server enforces data permissioning. So before passing values to the bidder adapters, the PBS core will:

1. Check for ext.prebid.bidderconfig
    1. If it exists, merge config.ortb2 into the bidder-specific request
1. As the OpenRTB request is being sent to each adapter:
    1. If ext.prebid.data.bidders exists in the original request and this bidder is on the list, then copy site.content.data, site.ext.data, app.ext.data, user.data, and user.ext.data to the bidder request -- otherwise don't copy those blocks. Remove ext.prebid.data.bidders from the bidder-specific request
    1. copy other objects as normal

Each adapter must be coded to read the values from the ortb and pass it to their endpoints appropriately.

###### Bidder-Specific Impression-Level FPD

When Prebid Server sees `imp[].ext.prebid.imp.BIDDER`, the behavior is to:

1. When passing this imp to that bidder, merge the contents of BIDDER into the imp
1. Remove the imp[].ext.prebid.imp object
1. Leave any imp[].ext.prebid.storedrequest object
1. The imp.ext.prebid.imp.BIDDER object name is case insensitive and supports aliases
1. If imp.ext.prebid.imp.BIDDER does not resolve to an actual bidder or alias in a case-insensitive way, it is ignored with a warning when in debug mode.
1. No validation is done on imp.ext.prebid.imp.BIDDER.ext except that imp.ext.prebid.imp.BIDDER.ext.prebid.BIDDER is removed.
1. The contents of imp.ext.prebid.imp.BIDDER takes precedence in the merge if the field already exists in the request.
1. The resulting imp object must be valid OpenRTB per the system schema.

Here's an example showing a scenario showing a storedrequest-based scenario:

```json
{
  imp: [{
    ext: {
      prebid: {
        storedrequest: { id: "sr1" },  // for the first imp, pull bidders out of a storedrequest
        imp: {
          bidderA: {
            pmp: {
              deals: [{ id:"dealA" }]      // apply this deal to bidderA
            }
          }
        }
      }
  },{
    ext: {
      prebid: {
        storedrequest: { id: "sr2" }, // for the second imp, pull bidders out of a different storedrequest
        imp: {
          bidderB: {
            pmp: {
              deals: [{ id:"dealB" }]     // apply this deal to bidderB
            }
          }
        }
      }
  }]
}
```

##### Custom Targeting

An OpenRTB extension, whether in the the original request or the [stored-request](/prebid-server/features/pbs-storedreqs.html), can customize the ad server targeting generated by PBS.

The OpenRTB field is `ext.prebid.adservertargeting`. Here's an example:

```json
"ext.prebid.adservertargeting":  [
  {
    "key": "hb_amp_ow",           // the targeting key
    "source": "bidrequest",       // pull the value from the path specified in the bid request object
    "value": "ext.prebid.amp.data.ow"  // path to value in the bidrequest
  },{
    "key": "hb_static_thing",
    "source": "static",          // just use the 'value' provided
    "value": "my-static-value"
  },{
    "key": "{% raw %}{{BIDDER}}{% endraw %}_custom1", // {% raw %}{{BIDDER}}{% endraw %} is a macro to be resolved
    "source": "bidresponse",     // pull the value from the path specified in the bid response object
    "value": "seatbid.bid.ext.custom1"
  }
]
```

`ext.prebid.adservertargeting` is an array objects. Each object has the following format:

{: .table .table-bordered .table-striped }
| Attribute | Required? | Description | Example | Type |
| --- | --- | --- | --- | --- |
| key | yes | Defines the key part of the targeting key-value-pair. May contain a ``{{BIDDER}}` macro which is resolved to the biddercode. | "hb_custom_thing" | string |
| source | yes | Defines where to get the value part of the key-value-pair. Options are "static", "bidrequest", and "bidresponse". | "bidresponse" | string |
| value | yes | Along with `source`, defines the value part of the targeting key-value-pair. If source=bidrequest or source=bidresponse, `value` is taken to be an openrtb path. | "seatbid.bid.ext.custom1" | string |

In order to pull AMP parameters out into targeting, Prebid Server places AMP query string parameters in ext.prebid.amp.data. e.g.

```json
"ext": {
  "prebid": {
    "amp": {
      "data": {
        "adc": "GA1.2.662776284.1602172186",
        "curl": "https://example.com/index.html",
        "debug": "1",
        "pvid": "",  // page view ID
        "ms": "",    // multi-size
        "ow": "",    // override-width
        "oh": "",    // override-height
        "w": "300",
        "h": "50",
        "gdpr_consent": "",
        "purl": "https://example.com/index.html",
        "slot": "/11111/amp_test",
        "timeout": "1000",
        "targeting": "{\"site\":{\"attr\":\"val\"}}",
        "tag_id": "amp-AMP_Test-300x250",
        "account": "22222"
      }
    }
  }
}
```

##### MultiBid

Allows a single bidder to bid more than once into an auction and have extra bids passed
back to the client.

See the [Prebid.js MultiBid Module](/dev-docs/modules/multibid.html) for background information and use cases.

The Prebid extension to the OpenRTB protocol is `ext.prebid.multibid`. For example:

```json
{
  "ext": {
    "prebid": {
      "multibid": [{
        "bidder": "bidderA",
        "maxbids": 2,
        "targetbiddercodeprefix": "bidA"
      }, {
        "bidder": "bidderB",
        "maxbids": 3,
        "targetbiddercodeprefix": "bidB"
      }, {
        "bidders": ["bidderC", "bidderD"],
        "maxbids": 2
      }]
    }
  }
}
```

MultiBid parameter details:

{: .table .table-bordered .table-striped }
| Attribute | Required? | Description | Example | Type |
| --- | --- | --- | --- | --- |
| bidder | Yes, unless bidders is specified | A biddercode | `'bidderA'` | string |
| bidders | Yes, unless bidder is specified | Multiple biddercodes | `['bidderB','bidderC']` | array of strings |
| maxBids | Yes | The number of bids the named bidder(s) can supply. Max of 9. | `2` | integer |
| targetBiddercodePrefix | No | An alternate (short) bidder code to send to the ad server. A number will be appended, starting from 2, e.g. hb_pb_PREFIX2. If not provided, the extra bids will not go to the ad server. | `'bidA'` | string |

Prebid Server core does the following when it sees `ext.prebid.multibid`:

1. Before sending the request to bid adapters, it removes all entries from the multibid array except the one for that particular bid adapter. This lets the bid adapters be aware of how many bids they're going to be allowed to submit into the auction.
2. Lets any additional bids through the OpenRTB response on `seatbid[].bid[]`.
3. Adds the additional specified targeting on `seatbid[].bid[].ext.prebid.targeting` and repeats the biddercode used for targeting on `seatbid[].bid[].ext.prebid.targetbiddercode`.

Here's an example response:

```json
{
  "seatbid": [{
    "seat": "bidderA",
    "bid": [{
      "id": "bid1",
      "impid": "imp1",
      "price": 1.04,
      "ext": {
        "prebid": {
          "targeting": {
            "hb_pb_bidderA": 1.00
          },
          "targetbiddercode": "bidderA"
        }
      }
      ...
    }, {
      "id": "bid2",
      "impid": "imp1", // same imp as above
      "price": 0.8,
      "ext": {
        "prebid": {
          "targeting": {
            "hb_pb_bidA2": 0.50
          },
          "targetbiddercode": "bidA2"
        }
      }
      ...
    }]
  }]
}
```

##### Echo StoredRequest Video Attributes

Several video specific fields can be set in the Stored Request that
the device player would not have context to at time of render.
The requester (e.g. Prebid SDK) can send this signal to Prebid Server,
which causes PBS-core to place the video-related attributes on the response.

```json
{
  ...
  "imp": [{
    "id": "123456789",
    "video": {
      ...
    },
    "ext": {
      "prebid": {
        "storedrequest": {
          "id": "xxx"
        },
        "options": {
          "echovideoattrs": true
        }
      }
    },
    ...
  }]
  ...
}
```

1. Prebid Server receives this request and expands the `storedrequest` value, merging it with the imp object.
2. Because `echovideoattrs` is true, video parameters in the storedrequest imp[].video are copied to seatbid.bid.ext.prebid.storedrequestattributes.

```json
{
  "seatbid": [{
    "bid": [{
      ...
      "ext": {
        "prebid": {
          "storedrequestattributes": {
            "maxduration": 60,
            "mimes": ["video/mp4"],
            "minduration": 15,
            "protocols": [1, 2],
            "skipafter": 0,
            "skipmin": 0,
            "startdelay": 0,
            "playbackmethod": [1]
          }
        }
      }
    }]
  }],
  ...
}
```

##### Request Passthrough

In support of the Prebid SDK, PBS supports a simple passthrough mechanism at two levels:

If the bidrequest contains a global `$.ext.prebid.passthrough` object, the object is copied to the bidresponse `$.ext.prebid.passthrough` with no validation other than it being valid JSON.

If the bidrequest contains impression-level `$.imp[].ext.prebid.passthrough` object, that object is copied to the bidresponse `$.seatbid.bid.ext.prebid.passthrough` with no validation other than it being valid JSON.

The initial use is for the SDK to define render-time parameters, but this mechanism may find use in other applications.

##### Floors

See the [Prebid Server Floors Feature](/prebid-server/features/pbs-floors.html) for more info.

##### Server Metadata

PBS-core creates this block before sending to bid adapters. They receive additional metadata about the PBS calling them. e.g.

```json
"server": {
  "externalurl": "https://prebid-server.rubiconproject.com",
  "gvlid": 52,
  "datacenter": "us-east-1"
}
```

##### Analytics Extensions

###### Analytics adapter flags

Some analytics adapters may support special flags that can be passed on ext.prebid.analytics. e.g.

```json
ext.prebid: {
  analytics: {
    myanalyticsadapter: {
      myflag: true
    }
  }
}
```

###### Sending analytics tags to the client-side

{: .alert.alert-info :}
PBS-Java only

[Analytics Tags](/prebid-server/developers/module-atags.html) (aka "aTags") are an advanced feature that some [modules](/prebid-server/pbs-modules/) and
features utilize to communicate auction details to server-side analytics adapters.

When there are Prebid.js-based analytics adapters in use, server-side details can be sent to them with aTags. This allows the client-side analytics systems
to see what's happening within Prebid Server - all analytics tags created by all modules will be sent to the client.

To allow the sharing of these details, there are two conditions:

1. Server-side account configuration must allow sharing of these details by setting `analytics.allow-client-details: true`
1. The ORTB request must contain `ext.prebid.analytics.options.enableclientdetails: true`

If both are true, then any and all PBS analytics tags will be copied to the response field ext.prebid.analytics.tags.

See the [Analytics Tags](/prebid-server/developers/module-atags.html) page for more information.

##### Preferred Media Type

{: .alert.alert-info :}
PBS-Java only

This feature can be useful when a bid adapter either chokes on multiformat request, or if it makes a sub-optimal choice
about which of multiple formats to consider. The publisher may be able to override bidder behavior from the request
by passing in ext.prebid.biddercontrols.BIDDERCODE.prefmtype. The value must be "banner", "video", or "native".

For example:

```json
ext.prebid.biddercontrols: {
     "bidderB": { "prefmtype": "video" },
     "bidderC": { "prefmtype": "native" }
}
```

Here's how this works:

1. If the bid adapter YAML declares support of multiformat, then `prefmtype` is ignored in the request. The default value of multiformat supported is `true`.
1. If the bidder declares that they don't support multiformat and the incoming request contains multiple formats, then one of the formats is chosen by either `$.ext.prebid.biddercontrols.BIDDER.prefmtype` or config `auction.preferredmediatype.BIDDER`

#### OpenRTB Response Extensions

##### Bidder Response Times

`response.ext.responsetimemillis.{bidderName}` tells how long each bidder took to respond.
These can help quantify the performance impact of "the slowest bidder."

##### Bidder Errors

`response.ext.errors.{bidderName}` contains messages which describe why a request may be "suboptimal".
For example, suppose a `banner` and a `video` impression are offered to a bidder
which only supports `banner`.

In cases like these, the bidder can ignore the `video` impression and bid on the `banner` one.
However, the publisher can improve performance by only offering impressions which the bidder supports.

For example, a request may return this in `response.ext`

```json
{
  "ext": {
    "errors": {
      "appnexus": [{
        "code": 2,
        "message": "A hybrid Banner/Audio Imp was offered, but Appnexus doesn't support Audio."
      }],
      "rubicon": [{
        "code": 1,
        "message": "The request exceeded the timeout allocated"
      }]
    }
  }
}
```

The codes currently defined are:

```text
0   NoErrorCode
1   TimeoutCode
2   BadInputCode
3   BadServerResponseCode
999 UnknownErrorCode
```

##### Ad Server Targeting

Prebid Server will generate ad server targeting variables as defined by request parameters:

1. If ext.prebid.targeting.includewinners is true, seatbid.bid.ext.prebid.targeting will be defined for the top bid in each imp object and will carry the following targeting values: hb_pb, hb_size, and hb_bidder.
1. If ext.prebid.targeting.includebidderkeys is true, seatbid.bid.ext.prebid.targeting will be defined for the top bid from each bidder in each imp object and will carry the following targeting values: hb_pb_BIDDER and hb_size_BIDDER.
1. If ext.prebid.cache.bids is specified, any targeting objects will also contain hb_cache_id, hb_cache_id_BIDDER, hb_cache_host, and hb_cache_path.
1. If ext.prebid.cache.vastxml is specified, any targeting objects will also contain hb_uuid, hb_uuid_BIDDER, hb_cache_host, and hb_cache_path.
1. If the bid response defines a deal, any targeting objects will also contain hb_deal or hb_deal_BIDDER
1. If ext.prebid.adservertargeting is defined, arbitrary targeting values may be specified.

```json
{
  "seatbid": [{
    "seat": "bidderA",
    "bid": [{
      "id": "bid1",
      "impid": "imp1",
      "price": 1.04,
      "ext": {
        "prebid": {
          "targeting": {
            "hb_pb": 1.00, // values without prefixes on the winning bids only
            "hb_pb_bidderA": 1.00, // only if includebidderkeys is true
            "hb_bidder": "bidderA",
            "hb_size": "300x250",
            "hb_size_bidderA": "300x250",
            "hb_format": "video", // only if includeformat is specified
            "hb_deal": "123"      // only if bid response contains a deal
          }
        }
      }
      ...
    }]
  }]
}
```

##### Debug Output

`response.ext.debug.httpcalls.{bidder}` will be populated only if `test:1` or `ext.prebid.debug:true`.

This contains info about every request and response sent by the bidder to its server.
It is only returned on `test` bids for performance reasons, but may be useful during debugging.

`response.ext.debug.resolvedrequest` will be populated **only if** `request.test` **was set to 1**.

This contains the request after the resolution of stored requests and implicit information (e.g. site domain, device user agent).

```json
"ext": {
  "debug": {
    "httpcalls": {
      "bidderA": [ ... ]
    },
    "resolvedrequest": { ... },
    "responsetimemillis": { ... }
    ...
  }
}
```

##### Original Bid CPM

`response.seatbid[].bid[].ext.origbidcpm` and `response.seatbid[].bid[].ext.origbidcur` will contain the original bid price/currency from the bidder.
The value in seatbid[].bid[].price may be converted for currency and adjusted with a [bid adjustment factor](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#bid-adjustments).

##### Seat Non-Bid

Prebid Server supports the [Seat Non-Bid OpenRTB Extension](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/master/extensions/community_extensions/seat-non-bid.md) that allows callers to get more information about bidders that had a chance to bid but did not. Eventually the system will support a fine-grained set of codes describing why a given bidder didn't bid on a particular impression, but for now we're phasing in the necessary internal infrastructure.

To enable the additional output, set `ext.prebid.returnallbidstatus: true`.

Here's a sample response:

```json
{ 
  ...
  "ext": {
    "seatnonbid": [
      {
        "seat": "someBidder",
        "nonbid": [
          {
            "impid": "test-div",
            "statuscode": 0
          }
        ]
      }
    ]
  }
}
```

The codes currently returned:

{: .table .table-bordered .table-striped }
| Code | Meaning | Platform | Notes |
| --- | --- | --- | --- |
| 0 | General No Bid | Java | The bidder had a chance to bid, and either declined to bid on this impression. |
| 100 | General Error | Java | The bid adapter returned with an unspecified error for this impression. |
| 101 | Timeout | Java | The bid adapter timed out. |
| 102 | Invalid Bid Response | Java | The bidder returned HTTP < 200 or >= 400 |
| 103 | Bidder Unreachable | Java | The bidder returned HTTP 503 |
| 200 | Request Blocked - General | Java | This impression not sent to the bid adapter for an unspecified reason. |
| 201 | Request Blocked - Unsupported Channel (app/site/dooh) | Java | The request was not sent to the bidder because they don’t support site, app, or dooh. |
| 202 | Request Blocked due to mediatype | Java | This impression not sent to the bid adapter because it doesn't support the requested mediatype. |
| 204 | Request Blocked - Privacy | Java | The bidder was not called due to TCF Purpose 2. |
| 300 | Response Rejected - General | Go + Java | The bid response was rejected for an unspecified reason. See warnings in debug mode. (Mostly caused by DSA validation rules) |
| 301 | Response Rejected - Below Floor | Java | The bid response did not meet the floor for this impression. |
| 303 | Response Rejected - Category Mapping Invalid | Go | The bid response did not include a category to map. |
| 350 | Response Rejected - Invalid Creative (ORTB blocking) | Java | The ortbblocking module enforced a bid response for battr, bcat, bapp, btype. |
| 351 | Response Rejected - Invalid Creative (Size Not Allowed) | Both | The bid response banner size exceeds the max size, when creative validation is enabled. |
| 352 | Response Rejected - Invalid Creative (Not Secure) | Both | The bid response adm does not use https, when secure markup validation is enabled. |
| 356 | Response Rejected - Invalid Creative (Advertiser Blocked) | Java | The ortbblocking module enforced a bid response due to badv. |

See the [IAB's Seat Non-Bid OpenRTB Extension](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/main/extensions/community_extensions/seat-non-bid.md) for the full list of status codes that may be supported in the future.

### OpenRTB Ambiguities

This section describes the ways in which Prebid Server **implements** OpenRTB spec ambiguous parts.

- `request.cur`: If `request.cur` is not specified in the bid request, Prebid Server will consider it as being `USD` whereas OpenRTB spec doesn't mention any default currency for bid request.
```request.cur: ['USD'] // Default value if not set```

### OpenRTB Differences

This section describes the ways in which Prebid Server **breaks** the OpenRTB spec.

#### Allowed Bidders

Prebid Server returns a 400 on requests which define `wseat` or `bseat`.
We may add support for these in the future, if there's compelling need.

Instead, an impression is only offered to a bidder if `bidrequest.imp[i].ext.{bidderName}` exists.

This supports publishers who want to sell different impressions to different bidders.

#### Deprecated Properties

This endpoint returns a 400 if the request contains deprecated properties (e.g. `imp.wmin`, `imp.hmax`).

The error message in the response describes how to alter the request to make it acceptable for Prebid Server.

#### Determining Bid Security (http/https)

In the OpenRTB spec, `request.imp[i].secure` says:

> Flag to indicate if the impression requires secure HTTPS URL creative assets and markup,
> where 0 = non-secure, 1 = secure. If omitted, the secure state is unknown, but non-secure
> HTTP support can be assumed.

In Prebid Server, an `https` request which does not define `secure` will be forwarded to Bidders with a `1`.
Publishers who run `https` sites and want insecure ads can still set this to `0` explicitly.

### HTTP Headers

In order to facilitate compatibility and analytics, Prebid Server will add the x-prebid HTTP header to outgoing requests. Some examples:

```text
x-prebid: pbs-go/0.155
x-prebid: pbjs/4.39,pbs-go/0.155
x-prebid: prebid-mobile/1.2.3,pbs-java/1.64
```

The PBJS version comes from ext.prebid.channel: `{name: "pbjs", version: "4.39"}`

The Prebid SDK version comes from:

```json
"app.ext.prebid": {
   "source":  "prebid-mobile"
   "version": "1.2.3"
}
```

### Prebid Server ORTB2 Extension Summary

#### Request
{:.no_toc}

{: .table .table-bordered .table-striped }
| Extension | Description | Type | Adapter Sees? |
| --- | --- | --- | --- |
| imp[]<wbr>.ext<wbr>.data<wbr>.ATTR | Publisher-specific adunit-level first party data.<br>ex: `{"pmp_elig": true}` | any  | yes |
| imp[]<wbr>.ext<wbr>.BIDDER | DEPRECATED bidder parameters.<br>ex: `imp[].ext.prebid.bidder.biddera: { placement: 123 }` | object | Seen as imp[]<wbr>.ext<wbr>.bidder |
| imp[]<wbr>.ext<wbr>.prebid<wbr>.bidder<wbr>.BIDDER | Bidder parameters.<br>ex: `imp[].ext.prebid.bidder.biddera: { placement: 123 }` | object | Seen as imp[]<wbr>.ext.<wbr>bidder |
| imp[]<wbr>.ext<wbr>.prebid<wbr>.options<wbr>.echovideoattrs | Causes PBS-core to [echo video attributes](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#echo-storedrequest-video-attributes) on seatbid[].bid[].ext.prebid.storedrequestattributes so the player has access to them<br>ex: `true` | boolean | yes |
| imp[]<wbr>.ext<wbr>.prebid<wbr>.storedauctionresponse | PBS-Core skips the auction and uses the response in the DB instead, see [stored responses](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#stored-responses). | object | no |
| imp[]<wbr>.ext<wbr>.prebid<wbr>.storedbidresponse | PBS-Core calls the adapter with the response in the DB instead of actually running the auction,see [stored responses](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#stored-responses). | object | no |
| imp[]<wbr>.ext<wbr>.prebid<wbr>.storedrequest<wbr>.id | Look up the defined stored request and merge the DB contents with this imp, see [stored requests](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#stored-requests). | object | no (yes with [issue 2292](https://github.com/prebid/prebid-server/issues/2292) |
| imp[]<wbr>.ext<wbr>.prebid<wbr>.is_rewarded_inventory | (deprecated) Passed through to bid adapters, see [rewarded video](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#rewarded-video). (use imp.rwdd in ORTB 2.6) | integer | yes |
| imp[]<wbr>.ext<wbr>.prebid<wbr>.passthrough | Copied to the response in seatbid.bid.ext.prebid.passthrough. Allows an application to pass a value through to the response, see [request passthrough](#request-passthrough). | object | no |
| imp<wbr>.ext<wbr>.prebid<wbr>.adunitcode | Prebid.js adunit code | string | yes |
| device<wbr>.ext<wbr>.prebid<wbr>.interstitial | PBS-core will adjust the sizes on a request for interstitials,see [interstitial support](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#interstitial-support). | object | yes |
| user<wbr>.ext<wbr>.prebid<wbr>.buyeruids | An alternate to [/cookie_sync](/prebid-server/endpoints/pbs-endpoint-cookieSync.html), the request can supply bidder ID values, see [buyer uid](#buyer-uid). | object | no |
| ext<wbr>.prebid<wbr>.adservertargeting | advanced targeting value rules, see [custom targeting](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#custom-targeting). | object | no |
| ext<wbr>.prebid<wbr>.auctiontimestamp | Timestamp for use in correlating PBJS and PBS events. | long int | yes |
| ext<wbr>.prebid<wbr>.aliases | defines alternate names for bidders, see [bidder aliases](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#bidder-aliases). | object | no |
| ext<wbr>.prebid<wbr>.aliasgvlids | defines the global vendor list IDs for aliases, see [bidder aliases](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#bidder-aliases). | object | no |
| ext<wbr>.prebid<wbr>.bidadjustmentfactors | Adjust the CPM value of bidrequests, see [bid adjustments](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#bid-adjustments) | object | no |
| ext<wbr>.prebid<wbr>.bidderconfig | bidder-specific first party data, see [first party data](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#first-party-data-support). | array of obj | no |
| ext<wbr>.prebid<wbr>.bidderparams | Publishers can specify any adapter-specific cross-impression attributes, see [global bid parameters](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#global-bid-adapter-parameters) | object | no |
| ext<wbr>.prebid<wbr>.cache | defines whether to put bid results in Prebid Cache, see [cache bids](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#cache-bids). | object | no |
| ext<wbr>.prebid<wbr>.channel | Generally "pbjs", "amp", or "app". Passed through to events and analytics.<br>ex: `{name: "pbjs", version: "4.39"}` | object | yes |
| ext<wbr>.prebid<wbr>.currency<wbr>.rates | publisher-defined currency conversions, see [currency support](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#currency-support). | object | yes |
| ext<wbr>.prebid<wbr>.currency<wbr>.usepbsrates | if true, currency.rates is used as a backup if dynamic rates aren't found. If false, dynamic rates are not used.<br>ex: `true` | boolean | yes |
| ext<wbr>.prebid<wbr>.data.<wbr>bidders | bidders in scope for bidder-specific first party data, see [first party data](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#first-party-data-support). | array of strings | no |
| ext<wbr>.prebid<wbr>.data.<wbr>eidpermissions | Allows publishers to define which bidders are allowed to see which extended IDs, see [eid permissions](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#eid-permissions) | object  | no |
| ext<wbr>.prebid<wbr>.debug | Provides debug output in response. | boolean | yes |
| ext<wbr>.prebid<wbr>.trace | Provides trace output in response. | "verbose" or "basic" | yes |
| ext<wbr>.prebid<wbr>.events | Enables VAST impression tracking injection for the request when an empty object is provided. This is an alernative method from using account configuration. | object | no |
| ext<wbr>.prebid<wbr>.experiment<wbr>adscert<wbr>.enabled | Enabled Ads.Cert 2.0 Authenticated Connections on supported outgoing bidder requests. | boolean | no |
| ext<wbr>.prebid<wbr>.integration | host-dependent integration type passed through to events and analytics.<br>ex: `"managed"` | string | yes |
| ext<wbr>.prebid<wbr>.multibid | allows bidders to respond with more than one bid, see [multi-bid](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#multibid) | object | yes, but only their value |
| ext<wbr>.prebid<wbr>.passthrough | Copied to the response in ext.prebid.passthrough. Allows an application to pass a value through to the response, see [request passthrough](#request-passthrough). | object | no |
| ext<wbr>.prebid<wbr>.schains | Bidder-specific supply chains, see [supply chain support](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#supply-chain-support) | object | no |
| ext<wbr>.prebid<wbr>.targeting | defines the key-value pairs that PBS-core places in seatbid.bid.ext.prebid.targeting, see [ad server targeting](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#targeting) | object | no |
| ext<wbr>.prebid<wbr>.nosale | turns off CCPA processing for the named bidder(s).<br>ex: `["bidderA"]`. A value of ["*"] is allowed. | array of strings | no |
| ext<wbr>.prebid<wbr>.server | additional Prebid Server metadata | object | yes |
| ext<wbr>.prebid<wbr>.floors | PBS floors data | object | no |
| ext<wbr>.prebid<wbr>.returnallbidstatus | If true, PBS returns [ext.seatnonbid](#seat-non-bid) with details about bidders that didn't bid. | boolean | no |
| ext<wbr>.prebid<wbr>.analytics | Arguments that can be passed through to individual analytics adapters | object | no |
| ext<wbr>.prebid<wbr>.analytics<wbr>.options.<wbr>enableclientdetails | Requests that [aTags](/prebid-server/developers/module-atags.html) be sent to the client-side for analytics. | boolean | no |
| imp<wbr>.ext<wbr>.ae | If 1, signals bid adapters that Fledge auction config is accepted on the response. (ae stands for auction environment) | integer | yes |
| app<wbr>.ext<wbr>.prebid<wbr>.source | The client that created this ORTB. Normally "prebid-mobile" | string | yes |
| app<wbr>.ext<wbr>.prebid<wbr>.version | The version of the client that created this ORTB. e.g. "1.1" | string | yes |
| ext<wbr>.prebid<wbr>.biddercontrols<wbr>.BIDDERCODE<wbr>.prefmtype | Override the mediatype sent to the named bidder if they don't support multiformat. | string | no |
| ext<wbr>.prebid<wbr>.bidders | Publishers can specify an adapter-specific flag, see [global bid parameters](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#global-bid-adapter-parameters) | object | seen on ext<wbr>.prebid<wbr>.bidderparams<wbr>.bidder |
| ext<wbr>.prebid<wbr>.createtids | (PBS-Java only) Override the `transmitTids` activity to influence [which IDs PBS will generate](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#ids). | boolean | yes |

#### Response
{:.no_toc}

{: .table .table-bordered .table-striped }
| Extension | Description | Type |
| seatbid[]<wbr>.bid[]<wbr>.ext<wbr>.prebid<wbr>.bidid | Defines a Prebid-generated id for this bid in case the bidder's ID isn't unique. | string |
| seatbid[]<wbr>.bid[]<wbr>.ext<wbr>.prebid<wbr>.cache<wbr>.bids/vastXml<wbr>.cacheId | ID of the cached object, see [cache bids](#cache-bids). | string |
| seatbid[]<wbr>.bid[]<wbr>.ext<wbr>.prebid<wbr>.cache<wbr>.bids/vastXml<wbr>.url | URL location of the cached object, see [cache bids](#cache-bids). | string |
| seatbid[]<wbr>.bid[]<wbr>.ext<wbr>.prebid<wbr>.events<wbr>.imp | URL for registering an impression event for this bid. | string |
| seatbid[]<wbr>.bid[]<wbr>.ext<wbr>.prebid<wbr>.events<wbr>.win | URL for registering a BIDS_WON event for this bid. | string |
| seatbid[]<wbr>.bid[]<wbr>.ext<wbr>.prebid<wbr>.meta<wbr>.ATTR | bidder-supplied metadata, see [building a bid adapter](/prebid-server/developers/add-new-bidder-go.html) | object |
| seatbid[]<wbr>.bid[]<wbr>.ext<wbr>.prebid<wbr>.storedrequestattributes | results of the ext.prebid.options.echovideoattrs option above, see [echo video attributes](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#echo-storedrequest-video-attributes). | object |
| seatbid[]<wbr>.bid[]<wbr>.ext<wbr>.prebid<wbr>.targeting | Ad server targeting values related to req ext.prebid.targeting. See [ad server targeting](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#ad-server-targeting) | object |
| seatbid[]<wbr>.bid[]<wbr>.ext<wbr>.prebid<wbr>.type | Type of the bid creative, either "banner", "video", "native", or "audio". | string |
| seatbid[]<wbr>.bid[]<wbr>.ext<wbr>.origbidcpm | Copy of the unadjusted bid price, see [original bid cpm](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#original-bid-cpm). | float |
| seatbid[]<wbr>.bid[]<wbr>.ext<wbr>.origbidcur | Copy of the original bid currency, see [original bid cpm](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#original-bid-cpm). | string |
| ext<wbr>.debug | debug mode: useful output, see [debug output](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#debug-output). | object |
| ext<wbr>.debug<wbr>.httpcalls<wbr>.BIDDER |Debug Mode: the HTTP request/response from the named bidder | object |
| ext<wbr>.errors<wbr>.BIDDER | Debug Mode: errors from the named bidder | object |
| ext<wbr>.responsetimemillisv.BIDDER | Debug Mode: how long the named bidder took to respond with a bid. | integer |
| ext<wbr>.prebid<wbr>.passthrough | Copy of request ext.prebid.passthrough, see [passthrough](#request-passthrough). | object|
| ext<wbr>.seatnonbid | Details on which bidders did not bid on each imp. See [seatnonbid](#seat-non-bid)| object|
| ext<wbr>.prebid<wbr>.fledge.auctionconfigs | Bidder-supplied [Fledge](https://github.com/google/ads-privacy/tree/master/proposals/fledge-multiple-seller-testing) responses. | array of objects |

### Further Reading

- [Example auction request](/prebid-server/endpoints/openrtb2/auction-request-example.html)
- [OpenRTB 2.4 Specification](https://iabtechlab.com/wp-content/uploads/2016/04/OpenRTB-API-Specification-Version-2-4-FINAL.pdf)
- [OpenRTB 2.5 Specification](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf)
- [OpenRTB 2.6 Specification](https://github.com/InteractiveAdvertisingBureau/openrtb2.x/blob/main/2.6.md)

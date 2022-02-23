---
layout: page_v2
sidebarType: 5
title: Prebid Server | Endpoints | OpenRTB2 | Auction
---

# Prebid Server | Endpoints | /openrtb2/auction
{:.no_toc}

## POST /openrtb2/auction
{:.no_toc}

* TOC
{:toc }

This endpoint runs an auction with the given OpenRTB 2.5 bid request.

### Sample Request

This is a sample OpenRTB 2.5 bid request:

```
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
            "placement": 12883451
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

- An OpenRTB 2.5 bid response, or
- HTTP 400 if the request is malformed, or
- HTTP 503 if the account or app specified in the request is blacklisted

This is the corresponding response to the above sample OpenRTB 2.5 bid request, with the `ext.debug` field removed and the `seatbid.bid.adm` field simplified.

```
{
  "id": "some-request-id",
  "seatbid": [{
    "seat": "appnexus",
    "bid": [{
      "id": "145556724130495288",
      "impid": "some-impression-id",
      "price": 0.01,
      "adm": "<script type=\"application/javascript\">...</script>",
      "adid": "107987536",
      "adomain": [
        "appnexus.com"
      ],
      "iurl": "https://nym1-ib.adnxs.com/cr?id=107987536",
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
          "appnexus": {
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
      "appnexus": 10
    },
    "tmaxrequest": 500
  }
}
```
### OpenRTB Fields

Prebid Server recognizes several standard OpenRTB2.5 fields.

#### Currency

The `cur` field is read and the first element of the array is taken to be the
"Ad Server Currency" for purposes of [currency conversion](/prebid-server/features/pbs-currency.html).

#### Expiration

The OpenRTB2.5 `imp[].exp` field is an "Advisory as to the number of seconds that may elapse
between the auction and the actual impression."

This field is used in slightly different ways by PBS-Go and PBS-Java:

##### PBS-Go
{:.no_toc}

How long an item is stored in Prebid Cache is determined by:

1. bidResponse.seatbid[].bid[].exp + 60: as set by the bidder's adapter
2. request.imp[].exp + 60: as set by the incoming request

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

#### Privacy fields

Prebid Server reads the OpenRTB privacy fields:

- regs.coppa
- regs.ext.gdpr
- regs.ext.us_privacy
- user.ext.consent
- device.lmt

#### Other OpenRTB Fields

Prebid Server doesn't do any special processing on any other fields, but passes them
all to the bid and analytics adapters.

### OpenRTB Extensions

#### Conventions

OpenRTB 2.5 permits exchanges to define their own extensions to any object from the spec.
These fall under the `ext` field of JSON objects.

If `ext` is defined on an object, Prebid Server uses the following conventions:

1. `ext` in "request objects" uses `ext.prebid` and/or `ext.{anyBidderCode}`.
2. `ext` on "response objects" uses `ext.prebid` and/or `ext.bidder`.
The only exception here is the top-level `BidResponse`, because it's bidder-independent.

`ext.{anyBidderCode}` and `ext.bidder` extensions are defined by bidders.
`ext.prebid` extensions are defined by Prebid Server.

Exceptions are made for extensions with "standard" recommendations:

- `request.regs.ext.gdpr` and `request.user.ext.consent` -- To support GDPR
- `request.regs.ext.us_privacy` -- To support CCPA
- `request.site.ext.amp` -- To identify AMP as the request source
- `request.app.ext.source` and `request.app.ext.version` -- To support identifying the displaymanager/SDK in mobile apps. If given, we expect these to be strings.

#### OpenRTB Request Extensions

##### Global Bid Adapter Parameters

If a bid adapter has a parameter that is the same across all imp[] entries,
it can be supplied

```
{
"ext": {
  "prebid": {
    "bidderparams": { 
       "adapter1": { 
          "key1": "data specific to key1", 
          "key2": "  { 
            "version": 3.3, 
             "profileid": 1234 
            } 
          }, 
      "adapter2": { 
         "key3": "data specific to key3" 
      }, 
      "adapter3": { 
          "key4": [ 
            "data" 
          ] 
       } 
    }
  }
} 
```
Bid adapters do not need to read this data from ext.prebid. PBS will merge the attributes to each imp[] in the request so the adapter can read them normally.

##### Bid Adjustments

Bidders are encouraged to make Net bids. However, there's no way for Prebid to enforce this.
If you find that some bidders use Gross bids, publishers can adjust for it with `request.ext.prebid.bidadjustmentfactors`:

```
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

It's also possible to define different bid adjustment factors by mediatype, which can be helpful to adjust discrepancies that differ across mediatypes (PBS-Java only):
```
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

Targeting refers to strings which are sent to the adserver to
[make header bidding possible](/overview/intro.html#how-does-prebid-work).

`request.ext.prebid.targeting` is an optional property which causes Prebid Server
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
| mediatypepricegranularity.TYPE.precision | no | How many decimal places are there in price buckets. | Defaults to 2 | integer |
| mediatypepricegranularity.TYPE.ranges | no | Same as pricegranularity.ranges | (see below) | array of objects |
| includewinners | no | Whether to include targeting for the winning bids in response.seatbid[].bid[]. ext.prebid.targeting. Defaults to false. | true | boolean |
| includebidderkeys | no | Whether to include targeting for the best bid from each bidder in response.seatbid[].bid[]. ext.prebid.targeting. Defaults to false. | true | boolean |
| includeformat | no | Whether to include the "hb_format" targeting key. Defaults to false. | false | boolean |
| preferdeals | no | If targeting is returned and this is true, PBS will choose the highest value deal before choosing the highest value non-deal. Defaults to false. | true | boolean |

**Request format** (optional param `request.ext.prebid.targeting`)

```
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
      }
    }
  }
}
```
The list of price granularity ranges must be given in order of increasing `max` values. If `precision` is omitted, it will default to `2`. The minimum of a range will be 0 or the previous `max`. Any cmp above the largest `max` will go in the `max` pricebucket.

For backwards compatibility the following strings will also be allowed as price granularity definitions. There is no guarantee that these will be honored in the future. "One of ['low', 'med', 'high', 'auto', 'dense']" See [price granularity definitions](/prebid-mobile/adops-price-granularity.html)

One of "includewinners" or "includebidderkeys" must be true (both default to false if unset). If both are false, then no targeting keys will be set, which is better configured by omitting targeting altogether.

The parameter "includeformat" indicates the type of the bid (banner, video, etc) for multiformat requests. It will add the key `hb_format` and/or `hb_format_{bidderName}` as per "includewinners" and "includebidderkeys" above.

MediaType PriceGranularity (PBS-Java only) - when a single OpenRTB request contains multiple impressions with different mediatypes, or a single impression supports multiple formats, the different mediatypes may need different price granularities. If `mediatypepricegranularity` is present, `pricegranularity` would only be used for any mediatypes not specified.

```
{
  "ext": {
    "prebid": {
      "targeting": {
        "mediatypepricegranularity": {
          "banner": {
            "ranges": [
              {"max": 20, "increment": 0.5}
            ]
          },
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

```
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

**NOTE**: Targeting keys are limited to 20 characters. If {bidderName} is too long, the returned key
will be truncated to only include the first 20 characters.

##### Buyer UID

Each Bidder should receive their own ID in the `request.user.buyeruid` property.
Prebid Server has three ways to populate this field. In order of priority:

1. If the request payload contains `request.user.buyeruid`, then that value will be sent to all Bidders.
In most cases, this is probably a bad idea.

2. The request payload can store a `buyeruid` for each Bidder by defining `request.user.ext.prebid.buyeruids` like so:

```
{
  "user": {
    "ext": {
      "prebid": {
        "buyeruids": {
          "appnexus": "some-appnexus-id",
          "rubicon": "some-rubicon-id"
        }
      }
    }
  }
}
```

Prebid Server's core logic will preprocess the request so that each Bidder sees their own value in the `request.user.buyeruid` field.

3. Prebid Server will use its Cookie to map IDs for each Bidder.

If you're using [Prebid.js](https://github.com/prebid/Prebid.js), this is happening automatically.

If you're using another client, you can populate the Cookie of the Prebid Server host with User IDs
for each Bidder by using the `/cookie_sync` endpoint, and calling the URLs that it returns in the response.

##### Native Request

For each native request, the `assets` object's `id` field is optional and if not defined, Prebid Server will set this automatically, using the index of the asset in the array as the ID.


##### Bidder Aliases

Requests can define Bidder aliases if they want to refer to a Bidder by a separate name.
This can be used to request bids from the same Bidder with different params. For example:

```
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

```
"aliases": {
  "appnexus": "rubicon"
}
```

then any `imp.ext.appnexus` params will actually go to the **rubicon** adapter.
It will become impossible to fetch bids from AppNexus within that Request.

##### Bidder Alias GVL IDs

For environments that have turned on [GDPR enforcement](/prebid-server/features/pbs-privacy.html#gdpr), it can be important to define the Global Vendor List (GVL) ID with an alias.

To do this, just set `ext.prebid.aliasgvlids` alongside ext.prebid.aliases:

```
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

```
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

```
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

If `bids` is present, Prebid Server will make a _best effort_ to include these extra
`bid.ext.prebid.targeting` keys:

- `hb_cache_id`: On the highest overall Bid in each Imp.
- `hb_cache_id_{bidderName}`: On the highest Bid from {bidderName} in each Imp.

Clients _should not assume_ that these keys will exist, just because they were requested, though.
If they exist, the value will be a UUID which can be used to fetch Bid JSON from [Prebid Cache](https://github.com/prebid/prebid-cache).
They may not exist if the host company's cache is full, having connection problems, or other issues like that.

If `vastxml` is present, PBS will try to add analogous keys `hb_uuid` and `hb_uuid_{bidderName}`.
In addition to the caveats above, these will exist _only if the relevant Bids are for Video_.
If they exist, the values can be used to fetch the bid's VAST XML from Prebid Cache directly.

These options are mainly intended for certain limited Prebid Mobile setups, where bids cannot be cached client-side.

##### GDPR

Prebid Server supports the IAB's GDPR recommendations, which can be found [here](https://iabtechlab.com/wp-content/uploads/2018/02/OpenRTB_Advisory_GDPR_2018-02.pdf).

This adds two optional properties:

- `request.user.ext.consent`: Is the consent string required by the IAB standards.
- `request.regs.ext.gdpr`: Is 0 if the caller believes that the user is *not* under GDPR, 1 if the user *is* under GDPR, and undefined if we're not certain.

These fields will be forwarded to each Bidder, so they can decide how to process them.

##### Interstitial support
Additional support for interstitials is enabled through the addition of two fields to the request:
device.ext.prebid.interstitial.minwidthperc and device.ext.interstial.minheightperc
The values will be numbers that indicate the minimum allowed size for the ad, as a percentage of the base side. For example, a width of 600 and "minwidthperc": 60 would allow ads with widths from 360 to 600 pixels inclusive.

Example:
```
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

PBS receiving a request for an interstitial imp and these parameters set, it will rewrite the format object within the interstitial imp. If the format array's first object is a size, PBS will take it as the max size for the interstitial. If that size is 1x1, it will look up the device's size and use that as the max size. If the format is not present, it will also use the device size as the max size. (1x1 support so that you don't have to omit the format object to use the device size)
PBS with interstitial support will come preconfigured with a list of common ad sizes. Preferentially organized by weighing the larger and more common sizes first. But no guarantees to the ordering will be made. PBS will generate a new format list for the interstitial imp by traversing this list and picking the first 10 sizes that fall within the imp's max size and minimum percentage size. There will be no attempt to favor aspect ratios closer to the original size's aspect ratio. The limit of 10 is enforced to ensure we don't overload bidders with an overlong list. All the interstitial parameters will still be passed to the bidders, so they may recognize them and use their own size matching algorithms if they prefer.

##### Currency Support

To set the desired 'ad server currency', use the standard OpenRTB `cur` attribute. Note that Prebid Server only looks at the first currency in the array.

```
"cur": ["USD"]
```

If you want or need to define currency conversion rates (e.g. for currencies that your Prebid Server doesn't support),
define ext.prebid.currency.rates.

```
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

If it exists, a rate defined in ext.prebid.currency.rates has the highest priority.
If a currency rate doesn't exist in the request, the external file will be used.

##### Supply Chain Support


Basic supply chains are passed to Prebid Server on `source.ext.schain` and passed through to bid adapters. Prebid Server does not currently offer the ability to add a node to the supply chain.

Bidder-specific schains:

```
"ext.prebid.schains": [
   { "bidders": ["bidderA"], "schain": { SCHAIN OBJECT 1}},
   { "bidders": ["*"], "schain": { SCHAIN OBJECT 2}}
]
```
In this scenario, Prebid Server sends the first schain object to `bidderA` and the second schain object to everyone else.

If there's already an source.ext.schain and a bidder is named in ext.prebid.schains (or covered by the wildcard condition), ext.prebid.schains takes precedent.

##### User IDs

Prebid Server adapters can support the [Prebid.js User ID modules](/dev-docs/modules/userId.html) by reading the following extensions and passing them through to their server endpoints:

```
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

```
{
  "ext": {
    "prebid": {
      "data": {
        "eidpermissions": [   // prebid server will use this to filter user.ext.eids
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
| source | Yes | Which user.ext.eids.source is receiving the permissions | "sharedid.org" | string |
| bidders | Yes | Which bidders are allowed to receive the named eid source | ["bidderA", "bidderC"] | array of strings |

##### Rewarded Video (PBS-Java only)

Rewarded video is a way to incentivize users to watch ads by giving them 'points' for viewing an ad. A Prebid Server
client can declare a given adunit as eligible for rewards by declaring `imp.ext.prebid.is_rewarded_inventory:1`.

##### Debug Flag

The OpenRTB `test` flag has a special meaning that bidders may react to: they may not perform a normal auction, or may not pay for test requests.

You can turn on the extra Prebid Server debug log without the formal `test` behavior by instead setting `ext.prebid.debug: true`.

##### Stored Responses (PBS-Java only)

While testing SDK and video integrations, it's important, but often difficult, to get consistent responses back from bidders that cover a range of scenarios like different CPM values, deals, etc. Prebid Server supports a debugging workflow in two ways:

- a stored-auction-response that covers multiple bidder responses
- multiple stored-bid-responses at the bidder adapter level

**Single Stored Auction Response ID**

When a storedauctionresponse ID is specified:

- the rest of the imp.ext.prebid block is irrelevant and ignored
- nothing is sent to any bidder adapter for that imp
- the response retrieved from the stored-response-id is assumed to be the entire contents of the seatbid object corresponding to that impression.

This request:
```
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

Will result in this response, assuming that the ids exist in the appropriate DB table read by Prebid Server:
```
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
```
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
```
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
            { "bidder": "BidderA", "id": "333333" },
            { "bidder": "BidderB", "id": "444444" },
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
            { "bidder": "BidderA", "id": "5555555" }
            // note: no storedbidrespose for bidderB
          ]
        }
      }
    }
  ]
}
```
Could result in this response:

```
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

Note that the storedresponse DB entries for this scenario are very different:
they're whatever format the bid adapter's endpoint responds with. i.e. the host company will
need to capture an actual bid response from the specific bidders and enter it
into the DB table.

See Prebid.org troubleshooting pages for how to utilize this feature within the context of the browser.


##### First Party Data Support

This is the Prebid Server version of the Prebid.js First Party Data feature. It's a standard way for the page (or app) to supply first party data and control which bidders have access to it.

It specifies where in the OpenRTB request non-standard attributes should be passed. For example:

```
{
  "ext": {
    "prebid": {
      "data": { "bidders": [ "rubicon", "appnexus" ] }  // these are the bidders allowed to see protected data
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
    "gender": "",
    "yob": 1999,
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

Bidder-specific data can be defined with ext.prebid.bidderconfig:
```
"ext": {
  "prebid": {
    "bidderconfig": {
      "bidders": ["bidderA", "bidderB"]
    },
    "config": {
      "ortb2": {
        "site": { ... },
        "user": { ... }
      }
    }
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

##### Custom Targeting (PBS-Java only)

An OpenRTB extension, whether in the the original request or the [stored-request](/prebid-server/features/pbs-storedreqs.html), can customize the ad server targeting generated by PBS.

The OpenRTB field is `ext.prebid.adservertargeting`. Here's an example:

```
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
```
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

##### MultiBid (PBS-Java only)

Allows a single bidder to bid more than once into an auction and have extra bids passed
back to the client.

See the [Prebid.js MultiBid Module](/dev-docs/modules/multibid.html) for background information and use cases.

The Prebid extension to the OpenRTB protocol is `ext.prebid.multibid`. For example:

```
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
```
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

##### Echo StoredRequest Video Attributes (PBS-Java only)

Several video specific fields can be set in the Stored Request that
the device player would not have context to at time of render.
The requester (e.g. Prebid SDK) can send this signal to Prebid Server,
which causes PBS-core to place the video-related attributes on the response.

```
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

```
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

##### PG Deals Extensions (PBS-Java only)

In support of [Programmatic Guaranteed](/prebid-server/features/pg/pbs-pg-idx.html),
there are two extensions at the bidder level to control behavior:

- imp[].ext.prebid.bidder.BIDDER.`dealsonly` - if `true`, PBS will call the bidder, but if there's no deal ID in the response, it will reject the bid. This allows for scenarios where a bidder is called twice, once for Open Market bids, once for deals bids. Defaults to `false`.
- imp[].ext.prebid.bidder.BIDDER.`pgdealsonly` - If `true` and no PG line item for this bidder matches in this impression, PBS will not even call the bid adapter. This saves network bandwidth when no PG line items are available. Defaults to `false`. If set to 'true', this flag forces the `dealsonly` flag (above) to true.

These flags can be used separately or together. For example:

```
{
  "imp": [{
    "ext": {
      "prebid": {
        "bidder": {
          "bidderA": {
            ...,
            "dealsonly": true,
            "pgdealsonly": true
          }
        }
      }
    }
  }]
}
```

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

```
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

```
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

```
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

```
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

##### Original Bid CPM (PBS-Java only)

`response.seatbid[].bid[].ext.origbidcpm` and `response.seatbid[].bid[].ext.origbidcur` will contain the original bid price/currency from the bidder.
The value in seatbid[].bid[].price may be converted for currency and adjusted with a [bid adjustment factor](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#bid-adjustments).

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

The error message in the response should describe how to "fix" the request to make it legal.
If the message is unclear, please [log an issue](https://github.com/prebid/prebid-server/issues)
or [submit a pull request](https://github.com/prebid/prebid-server/pulls) to improve it.

#### Determining Bid Security (http/https)

In the OpenRTB spec, `request.imp[i].secure` says:

> Flag to indicate if the impression requires secure HTTPS URL creative assets and markup,
> where 0 = non-secure, 1 = secure. If omitted, the secure state is unknown, but non-secure
> HTTP support can be assumed.

In Prebid Server, an `https` request which does not define `secure` will be forwarded to Bidders with a `1`.
Publishers who run `https` sites and want insecure ads can still set this to `0` explicitly.

### HTTP Headers

In order to facilitate compatibility and analytics, Prebid Server will add the x-prebid HTTP header to outgoing requests. Some examples:

```
x-prebid: pbs-go/0.155
x-prebid: pbjs/4.39,pbs-go/0.155
x-prebid: prebid-mobile/1.2.3,pbs-java/1.64
```

The PBJS version comes from ext.prebid.channel: `{name: "pbjs", version: "4.39"}`

The Prebid SDK version comes from:
```
"app.ext.prebid": {
   "source":  "prebid-mobile"
   "version": "1.2.3"
}
```


### Prebid Server ORTB2 Extension Summary

{: .table .table-bordered .table-striped }
| Req/Resp | Extension | Description | Type | Example | Adapter Sees? |
| --- | --- | --- | --- | --- | --- |
| req | imp[].ext.prebid. bidder.BIDDER | bidder parameters | object | imp[].ext. prebid.bidder. biddera: { placement: 123 } | They see the object as imp[].ext.bidder |
| req | imp[].ext.BIDDER | DEPRECATED place to put bidder parameters | object | imp[].ext. prebid.bidder. biddera: { placement: 123 } | They see the object as imp[].ext.bidder |
| req | imp[].ext.prebid. storedrequest.id | look up the defined stored request and merge the DB contents with this imp | object | see [stored requests](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#stored-requests) | no |
| req | imp[].ext.prebid. storedauctionresponse | PBS-Core skips the auction and uses the response in the DB instead | object | see [stored responses](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#stored-responses-pbs-java-only) | no |
| req | imp[].ext.prebid. is_rewarded_inventory | passed through to bid adapters | integer | see [docs](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#rewarded-video-pbs-java-only) | yes |
| req | imp[].ext.data.ATTR | Publisher-specific adunit-level first party data | any | "pmp_elig": true | yes |
| req | app.ext.source | defined by Prebid SDK | string | "prebid-mobile" | yes |
| req | app.ext.version | defined by Prebid SDK | string | "1.6" | yes |
| req | ext.prebid.bidadjustmentfactors | Adjust the CPM value of bidrequests | object | See [docs](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#bid-adjustments) | no |
| req | ext.prebid.bidderparams | Publishers can specify any adapter-specific cross-impression attributes. | object | see [docs](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#global-bid-adapter-parameters) | no |
| req | ext.prebid.targeting | defines the targeting values PBS-core places in seatbid.bid.ext.prebid.targeting | object | see [docs](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#targeting) | no |
| req | ext.prebid.adservertargeting | advanced targeting value rules | object | see [docs](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#custom-targeting-pbs-java-only) | no |
| req | ext.prebid.integration | host-dependent integration type passed through to events and analytics | string | "managed" | yes |
| req | ext.prebid.channel | Generally "pbjs", "amp", or "app". Passed through to events and analytics | object | {name: "pbjs", version: "4.39"} | yes |
| req | ext.prebid.aliases | defines alternate names for bidders | object | see [docs](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#bidder-aliases) | yes |
| req | ext.prebid.debug | provides debug output in response | boolean | true | yes |
| req | ext.prebid.cache | defines whether to put bid results in Prebid Cache | object | see [docs](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#cache-bids) | no |
| req | ext.prebid.schains | bidder-specific supply chains | object | see [docs](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#supply-chain-support) | no |
| req | ext.prebid.data.bidders | bidders in scope for bidder-specific first party data | array of strings | see [docs](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#first-party-data-support-pbs-java-only) | no |
| req | ext.prebid.bidderconfig | bidder-specific first party data | object | see [docs](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#first-party-data-support-pbs-java-only) | no |
| req | ext.prebid.currency | publisher-defined currency conversions | object | see [docs](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#currency-support) | yes |
| req | ext.prebid.no-sale | turns off CCPA processing for the named bidder(s) | array of strings | ["bidderA"] | no |
| req | ext.prebid.interstitial | PBS-core will adjust the sizes on a request for interstitials | object | see [docs](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#interstitial-support) | yes |
| req | ext.prebid.auctiontimestamp | timestamp for use in correlating PBJS and PBS events | long int | 123456789 | yes |
| req | ext.prebid.options. echovideoattrs | causes PBS-core to [echo video attributes](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#echo-storedrequest-video-attributes-pbs-java-only) on seatbid[].bid[].ext.prebid.storedrequestattributes so the player has access to them | boolean | true | yes |
| req | ext.prebid.multibid | allows bidders to respond with more than one bid | object | see [docs](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#multibid-pbs-java-only) | yes, but only their value |
| req | ext.prebid.buyeruid | An alternate to [/cookie_sync](/prebid-server/endpoints/pbs-endpoint-cookieSync.html), the request can supply bidder ID values | object | See [doc](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#buyer-uid) | no |
| resp | seatbid[].bid[].ext. prebid.targeting | ad server targeting values. Related to req ext.prebid.targeting. | object | see [docs](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#ad-server-targeting) | n/a |
| resp | seatbid[].bid[].ext.prebid. type | "banner", "video", "native" | string | "banner" | n/a |
| resp | seatbid[].bid[].ext.prebid. cache.bids.url | URL location of the bid or VAST | string | URL | n/a |
| resp | seatbid[].bid[].ext.prebid. cache.bids.cacheId | ID of the bid or VAST | string | "1234" | n/a |
| resp | seatbid[].bid[].ext.prebid. events.win | URL for registering a BIDS_WON event for this bid | string | URL | n/a |
| resp | seatbid[].bid[].ext.prebid. events.imp | URL for registering an impression event for this bid | string | URL | n/a |
| resp | seatbid[].bid[].ext.prebid. bidid | defines a Prebid-generated id for this bid in case the bidder's ID isn't unique | string | UUID | n/a |
| resp | seatbid[].bid[].ext.prebid. meta.ATTR | bidder-supplied metadata | object | see [docs](/prebid-server/developers/add-new-bidder-go.html) | n/a |
| resp | seatbid[].bid[].ext.prebid. storedrequestattributes | results of the ext.prebid.options.echovideoattrs option above. | object | see [docs](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#echo-storedrequest-video-attributes-pbs-java-only) | n/a |
| resp | response.seatbid[].bid[].ext. origbidcpm | a copy of the unadjusted bid price | float | see [docs](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#original-bid-cpm-pbs-java-only) | n/a |
| resp | response.seatbid[].bid[].ext. origbidcur | a copy of the original bid currency | string | see [docs](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#original-bid-cpm-pbs-java-only) | n/a |
| resp | ext.responsetimemillis.BIDDER | debug mode: how long the named bidder took to respond with a bid | integer | 100 | n/a |
| resp | ext.debug.httpcalls.BIDDER | debug mode: the HTTP request/response from the named bidder | object | | n/a |
| resp | ext.errors.BIDDER | debug mode: errors from the named bidder | object | | n/a |
| resp | ext.debug | debug mode: useful output | object | see [docs](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#debug-output)| n/a |

### Further Reading

- [The OpenRTB 2.5 spec](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf)

---
layout: page_v2
title: Prebid.js First Party Data
description: First Party Data - Prebid.js
sidebarType: 1
---

# First Party Data - Prebid.js
{: .no_toc}

* TOC
{:toc}

Prebid allows publishers to supply attributes related to their content
and users, and to apply permissions so only certain bidders are allowed
to access those attributes.

{: .alert.alert-warning :}
These conventions aren't implemented by all adapters. Please
check with each of your bidders to make sure they're reading first
party data from the standard Prebid locations.

{: .alert.alert-warning :}
This document covers the method of specifying First Party Data as of Prebid.js 4.30, which
we recommend all publishers use. In previous versions of Prebid.js, the interface was
to set `fpd` values. We now use the more generic `ortb2` interface,
which can be used for more than just First Party Data.

## How It Works

Publishers supply First Party Data (FPD) by specifying attributes as
configuration or on a Prebid.js AdUnit:

- Global site or user data that applies to all AdUnits, bidders, and auctions. Use [`setConfig()`](/dev-docs/publisher-api-reference/setConfig.html#setConfig-fpd)
- Auction-specific site or user data that applies to all AdUnits and bidders in that auction. Use the `ortb2` parameter of [`requestBids()`](/dev-docs/publisher-api-reference/requestBids.html)
- AdUnit-specific data that applies to all bidders and auctions. Define [AdUnit.ortb2Imp](/dev-docs/adunit-reference.html#first-party-data)
- Bidder-specific site or user data that applies to all AdUnits and auctions. Use [`setBidderConfig()`](/dev-docs/publisher-api-reference/setBidderConfig.html)

## In-Page Examples

The Prebid First Party Data JSON structure reflects the OpenRTB standard.
- Arbitrary attributes should go in `ortb2.site.ext.data` or `ortb2.user.data`.
- Fields that are meant to be standard [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) should be in `ortb2.site` or `ortb2.user`. Specfically, the standard values for 'site' are: name, domain, cat, sectioncat, pagecat, page, ref, search, keywords. For 'user' these are: yob, gender, keywords.
- Segment taxonomy values go in `ortb2.site.content.data` or `ortb2.user.data` using the IAB standard representation.

### Supplying Global Data

Here's how a publisher can let all bid adapters have access
to first party data that might be useful in ad targeting that's good in PBJS 4.30 and later:
```javascript
pbjs.setConfig({
   ortb2: {
       site: {
           name: "example",
           domain: "page.example.com",
           cat: ["IAB2"],
           sectioncat: ["IAB2-2"],
           pagecat: ["IAB2-2"],
           page: "https://page.example.com/here.html",
           ref: "https://ref.example.com",
           keywords: "power tools, drills",
           search: "drill",
           content: {
		userrating: "4",
		data: [{
          	    name: "www.dataprovider1.com",
          	    ext: {
		        segtax: 7,
			cids: [ "iris_c73g5jq96mwso4d8" ]
		    },
		    segment: [
            		{ id: "687" },
            		{ id: "123" }
		    ]
                }]
	   },
	   ext: {
               data: {   // fields that aren't part of openrtb 2.6
                   pageType: "article",
                   category: "repair"
               }
	   }
        },
        user: {
           keywords: "a,b",
	   data: [{
	       name: "dataprovider.com",
	       ext: { segtax: 4 },
               segment: [
		  { id: "1" }
               ]
	   }],
	   ext: {
               data: {
                  registered: true,
                  interests: ["cars"]
	       }
           }
        },
        regs: {
            gpp: "abc1234",
            gpp_sid: [7]
        }
    }
});
```

{: .alert.alert-warning :}
Note that supplying first party **user** data may require special
consent in certain regions. Prebid.js does **not** police the passing
of user data as part of its GDPR or CCPA modules.

{: .alert.alert-warning :}
If you're using PBJS version 4.29 or before, replace the following in the example above: 'ortb' with 'fpd', 'site' with 'context' and 'site.ext.data' with 'context.data'.

### Supplying Auction-Specific Data

In some situations the same page may wish to supply different `site` data for some of its sections, 
for example in infinite scroll or instream video scenarios where multiple pieces of content that would benefit from different contexts are served together.

To support this use case, Prebid version 7 and above accepts auction-specific first-party data as a parameter to `requestBids`. For example: 

```javascript
pbjs.requestBids({
    ortb2: {
        site: {
            content: {
                data: [{
                    name: 'www.iris.com',
                    ext: {
                        segtax: 500,
                        cids: ['iris_c73g5jq96mwso4d8']
                    },
                    segment: [
                        {id: '687'},
                        {id: '123'}
                    ]
                }]
            }
        }
    }
});
```


### Supplying AdUnit-Specific Data

If an attribute is specific to an AdUnit, it can be passed this way:

```javascript
pbjs.addAdUnits({
    code: "test-div",
    mediaTypes: {
        banner: {
            sizes: [[300,250]]
        }
    },
    ortb2Imp: {
        ext: {
	        data: {
                pbadslot: "homepage-top-rect",
                adUnitSpecificAttribute: "123"
            }
        }
    },
    ...
});
```

Another case is [declaring rewarded](https://github.com/InteractiveAdvertisingBureau/openrtb2.x/blob/422eedb76e8730c89dcac75c7427c18cfa10e8c4/2.6.md?plain=1#L993). Here is how one might do that: 


```javascript
pbjs.addAdUnits({
    code: "test-div-rewarded",
    mediaTypes: {
        banner: {
            sizes: [[300,250]]
        }
    },
    ortb2Imp: {
        rwdd: 1,
        ext: {
	        data: {
                pbadslot: "my-rewarded-rectangle",
                adUnitSpecificAttribute: "123"
            }
        }
    },
    ...
});
```

You may also specify adUnit-specific transaction IDs using `ortb2Imp.ext.tid`, and Prebid will use them instead of generating random new ones. This is useful if you are auctioning the same slots through multiple header bidding libraries. Note: you must take care to not re-use the same transaction IDs across different ad units or auctions. Here's a simplified example passing a tid through the [requestBids](/dev-docs/publisher-api-reference/requestBids.html) function:

```javascript
const tid = crypto.randomUUID();
pbjs.requestBids({
   adUnits: [{
    code: 'test-div',
    // ...
    ortb2Imp: {
        ext: {
          tid: tid
        }
    }
   }]
});
// reuse `tid` when auctioning `test-div` through some other header bidding wrapper   
```

{: .alert.alert-info :}
Prebid does not support AdUnit-specific **user** data, nor does it support
bidder-specific AdUnit First Party Data. You could implement either of
these scenarios with a publisher-specific callback on the [`requestBids` event](/dev-docs/publisher-api-reference/onEvent.html)

{: .alert.alert-warning :}
If you're using PBJS version 4.29 or before, replace the following in the example above: 'ortb2Imp.ext.data' with 'fpd.context.data'.

### Supplying Bidder-Specific Data

Use the [`setBidderConfig()`](/dev-docs/publisher-api-reference/setBidderConfig.html) function to supply bidder-specific data. In this example, only bidderA and bidderB will get access to the supplied
global data.

```javascript
pbjs.setBidderConfig({
   bidders: ['bidderA', 'bidderB'],
   config: {
       ortb2: {
           site: {
               ext: {
                   data: {
                      pageType: "article",
                      category: "tools"
                   }
               }
            },
            user: {
               ext: {
                   data: {
                      registered: true,
                      interests: ["cars"]
                   }
               }
           }
       }
   }
});

pbjs.setBidderConfig({ // different bidders can receive different data
   bidders: ['bidderC'],
   config: {
     ortb2: { ... }
   }
});
```

### Supplying App or DOOH ORTB Objects

Occasionally, an app which embeds a webview might run Prebid.js. In this case, the app object is often specified for OpenRTB, and the site object would be invalid. When this happens, one should specify app.content.data in place of site.content.data. We can also imagine scenarios where billboards or similar displays are running Prebid.js. In the case of a DOOH object existing, both the site object and the app object are considered invalid. 

```javascript
pbjs.setConfig({
  ortb2: {
    app: {
      name: "myappname",
      keywords: "power tools, drills",
      content: {
        data: [
          {
            name: "www.dataprovider1.com",
            ext: {
              segtax: 6
            },
            segment: [
              {
                id: "687"
              },
              {
                id: "123"
              }
            ]
          },
          {
            name: "www.dataprovider1.com",
            ext: {
              segtax: 7
            },
            segment: [
              {
                id: "456"
              },
              {
                id: "789"
              }
            ]
          }
        ]
     }
    }
  }
)

```

### Supplying OpenRTB Content Data
OpenRTB `content` object describes specific (mostly audio/video) content information, and it is useful for targeting.
For website ad, the content object should be defined in `ortb2.site.content`, for non-browser ad, it should be defined in `ortb2.app.content`

```javascript
pbjs.setConfig({
    ortb2: {
        site: {
            content: {
                id: "some_id",
                episode: "1",
                title: "some title",
                series: "some series",
                season: "s1",
                artist: "John Doe",
                genre: "some genre",
                isrc: "CC-XXX-YY-NNNNN",
                url: "http://foo_url.de",
                cat: ["IAB1-1", "IAB1-2", "IAB2-10"],
                context: "7",
                keywords: "k1,k2",
                live: "0"
            }
        }
    }
});
```

## Segments and Taxonomy

The [IAB](https://iab.com) offers standard content and audience taxonomies for categorizing sites and users. Prebid supports defining these values as first party data in `site.content.data` or `user.data` as shown in examples above and below.

```
        user: {
	   data: [{
	       name: "dataprovider.com", // who resolved the segments
	       ext: { segtax: 4 },       // taxonomy used to encode the segments
               segment: [
		  { id: "1" }
               ]
	   }],
```

The new extension is `segtax`, which identifies the specific taxonomy used to
determine the provided segments. This model supports using taxonomies other
than IAB taxonomies, but all taxonomies must be registered with the IAB to be
assigned a number. Once the IAB finalizes the process, we'll place a link
here to their page. For now, here's the beta table defining the segtax values:

{: .table .table-bordered .table-striped }
| Segtax ID | Taxonomy Type | Version | Description |
|-----------+---------------+---------+-------------|
| 1 | Content | 1.0 | IAB - Content Taxonomy version 1 - deprecated|
| 2 | Content | 2.0 | IAB - Content Taxonomy version 2) - deprecated |
| 4 | Audience | 1.1 | [IAB - Audience Taxonomy version 1.1](https://iabtechlab.com/wp-content/uploads/2020/07/IABTL-Audience-Taxonomy-1.1-Final.xlsx) |
| 5 | Content | 2.1 | [IAB - Content Taxonomy version 2.1](https://iabtechlab.com/standards/content-taxonomy/) |
| 6 | Content | 2.2 | [IAB - Content Taxonomy version 2.2](https://iabtechlab.com/standards/content-taxonomy/) |

{: .alert.alert-info :}
The [IAB version of this table](https://github.com/InteractiveAdvertisingBureau/AdCOM/blob/master/AdCOM%20v1.0%20FINAL.md#list--category-taxonomies-) is associated with ADCOM. Publishers should check with their SSPs and DSPs to confirm which
segment taxonomies they support.

## How Bid Adapters Should Read First Party Data

Prebid.js bid adapters are supplied global data in the `ortb2` property of [bid requests](/dev-docs/bidder-adaptor.html#building-the-request):

```javascript
buildRequests: function(validBidRequests, bidderRequest) {
   const firstPartyData = bidderRequest.ortb2;
}
```

AdUnit-specific values must be parsed out of the AdUnit object.

The assumption is that bid adapters will copy the values to the appropriate protocol location for their endpoint.

See [Prebid Server First Party Data](/prebid-server/features/pbs-fpd.html) for a discussion of this feature for Prebid Server bid adapters.

## Related Topics

- The [Prebid.js Publisher API](/dev-docs/publisher-api-reference.html)
- The [AdUnit Reference](/dev-docs/adunit-reference.html)
- [Prebid Server First Party Data support](/prebid-server/features/pbs-fpd.html)

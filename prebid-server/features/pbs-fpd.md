---
layout: page_v2
sidebarType: 5
title: First Party Data - Prebid Server
---

# First Party Data - Prebid Server
{: .no_toc}

* TOC
{:toc}

Prebid allows publishers to supply attributes related to their content
and users, and to apply permissions so only certain bidders are allowed
to access those attributes.

{: .alert.alert-warning :}
For now, these conventions aren't implemented by all adapters. Please
check with each of your bidders to make sure they're reading first
party data from the standard Prebid locations.

## How It Works

Each of the three main sources of Prebid Server traffic will place
First Party Data in the OpenRTB JSON in several places:

{: .table .table-bordered .table-striped }
| OpenRTB Attribute | Description | Prebid.js Source | SDK Source | AMP Source |
| --- | --- | --- | --- | --- |
| site.ATTR | Only standard OpenRTB attributes should be here: name, domain, cat, sectioncat, pagecat, page, ref, search, keywords. | config ortb2.site.ATTR | n/a | Stored Request |
| site.ext.data.ATTR | Any other site-related attributes should go here. | config ortb2.site.ext.data | n/a | Stored Request |
| site.keywords | Site keywords | config ortb2.site.keywords | n/a | Stored Request |
| app.ext.data.ATTR | Any app-related attributes should go here. | n/a | Targeting addContextData() | n/a |
| app.keywords | App keywords | n/a | Targeting addContextKeywords() | n/a |
| user.keywords | User keywords | config ortb2.user.keywords | addUserKeywords | n/a |
| user.ATTR | Only standard OpenRTB attributes should be here: yob, gender, keywords. | config ortb2.user.ATTR | n/a | n/a |
| user.ext.data.ATTR | Any other user-related attributes should go here. | config ortb2.user.ext.data.ATTR | Targeting addUserData() | n/a |
| imp[].ext.data.ATTR | AdUnit-specific attributes should go here. | AdUnit.ortb2.ext.data | AdUnit addContextData() | AMP targeting attribute or Stored Request |
| ext.prebid. data.bidders[] | If specified, only these bidders are allowed to see fields in {site/app/user}.ext.data. | n/a | addBidderTo AccessControlList() | Stored Request |
| ext.prebid. bidderconfig | Bidder-specific config | [setBidderConfig()](/dev-docs/publisher-api-reference/setBidderConfig.html) | n/a | Stored Request |

This diagram summarizes how first party data flows into the OpenRTB JSON:

![First Party Data Summary](/assets/images/flowcharts/FirstPartyData-Detailed.png){: .pb-lg-img :}

{: .alert.alert-info :}
Note that Prebid.js directly supports the [`setBidderConfig`](/dev-docs/publisher-api-reference/setBidderConfig.html) method of defining
bidder-specific first party data, while SDK only supports the `ext.prebid.data.bidders[]` approach with an in-app call.
Both SDK and AMP can have the stored request define bidder FPD permissions.

## OpenRTB Examples

In this example, only BidderA has access to the global first party data:
```
{
    ext: {
       prebid: {
           data: { bidders: [ "bidderA" ] }  // limit bidders that receive global data
       }
    },
    site: {
         keywords: "",
         search: "",
         ext: {
             data: {
                 // only seen by bidderA as named in ext.prebid.data.bidders[]
                 GLOBAL CONTEXT DATA
             }
         }
    },
    user: {
        keywords: "",
        gender: "",
        yob: 1999,
        geo: {},
        ext: {
            data: {
                // only seen by bidderA as named in ext.prebid.data.bidders[]
                GLOBAL USER DATA
            }  
        }
    },
    imp: [
        ...
        ext: {
            data: {
                // everyone sees this data
                ADUNIT SPECIFIC CONTEXT DATA
            }
         }
    ]
}
```

This example shows an array of bidder-specific config:
```
{
    ext: {
       prebid: {
           bidderconfig: [ {
               bidders: [ 'bidderA', 'bidderB' ],
               config: {
                  ortb2: { site: { ... }, user: { ...} }
               }
            },{
               bidders: [ 'bidderC' ],
               config: {
                  ortb2: { site: { ... }, user: { ...} }
               }
            }]
       }
    }
}
```

## How Server-Side Bid Adapters Read First Party Data

Bid adapters don't need to worry about whether the request came from
Prebid.js, the SDK, or AMP -- everything is merged into the OpenRTB JSON. If a bid adapter receives first party data on any of the fields noted in
the table above, they can simply pass that data to their endpoint in
the expected way.

In other words, just be aware of site.ext.data.ATTR, app.ext.data.ATTR, user.ext.data.ATTR,
and imp[].ext.data.ATTR and either pass them straight through or map
attributes to where your endpoints expect them.

## Further Reading

- [Prebid.js First Party Data](/features/firstPartyData.html)
- [Prebid Server and AMP](/prebid-server/use-cases/pbs-amp.html)

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
For now, this feature is only supported in PBS-Java and these conventions aren't implemented by all adapters. Please
check with each of your bidders to make sure they're reading first
party data from the standard Prebid locations.

## How It Works

Each of the three main sources of Prebid Server traffic will place
First Party Data in the OpenRTB JSON in several places:

{: .table .table-bordered .table-striped }
| OpenRTB Attribute | Description | PBJS Source | SDK Source | AMP Source |
| --- | --- | --- | --- | --- |
| site.ATTR | Only standard OpenRTB attributes should be here: name, domain, cat, sectioncat, pagecat, page, ref, search, keywords. | config.fpd.context.ATTR | n/a | site.ATTR |
| site.ext.data.ATTR | Any other site-related attributes should go here. | config.fpd.context.data | n/a | site.ext.data.ATTR |
| app.ext.data.ATTR | Any app-related attributes should go here. | n/a | Targeting addContextData() | n/a |
| user.ATTR | Only standard OpenRTB attributes should be here: yob, gender, keywords. | config.fpd.user.ATTR | n/a | user.ATTR |
| user.ext.data.ATTR | Any other user-related attributes should go here. | config.fpd.user.data.ATTR | Targeting addUserData() | user.ext.data.ATTR |
| imp[].ext.context.data.ATTR | AdUnit-specific attributes should go here. | AdUnit.fpd.context | AdUnit addContextData() | n/a |
| ext.prebid.data.bidders[] | If specified, only these bidders are allowed to see fields in {site/app/user}.ext.data. | n/a | addBidderToAccessControlList() | bidders |
| ext.prebid.bidderconfig | Bidder-specific config | [setBidderConfig()](/dev-docs/publisher-api-reference.html#module_pbjs.setBidderConfig) | n/a | n/a |

This diagram summarizes how first party data flows into the OpenRTB JSON:

![First Party Data Summary](/assets/images/flowcharts/FirstPartyData-Detailed.png){: .pb-lg-img :}

{: .alert.alert-info :}
Note that Prebid.js supports the [`setBidderConfig`](/dev-docs/publisher-api-reference.html#module_pbjs.setBidderConfig) method of defining
bidder-specific first party data, while SDK and AMP only support the `ext.prebid.data.bidders[]` approach.

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
            context: {
                keywords: "",
                search: "",
                data: {
                    // everyone sees this data
                    ADUNIT SPECIFIC CONTEXT DATA
                }
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
                  fpd: { site: { ... }, user: { ...} }
               }
            },{
               bidders: [ 'bidderC' ],
               config: {
                  fpd: { site: { ... }, user: { ...} }
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
and imp[].ext.context.data.ATTR and either pass them straight through or map
attributes to where your endpoints expect them.

## Further Reading

- [Prebid.js First Party Data](/features/firstPartyData.html)
- [Prebid Server and AMP](/prebid-server/use-cases/pbs-amp.html)

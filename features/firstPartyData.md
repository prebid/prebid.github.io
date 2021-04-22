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

- Global site or user data that applies to all AdUnits and all bidders. Use [`setConfig()`](/dev-docs/publisher-api-reference.html#setConfig-fpd)
- AdUnit-specific data that applies to all bidders. Define [AdUnit.ortb2Imp](/dev-docs/adunit-reference.html#first-party-data)
- Bidder-specific site or user data that applies to all AdUnits. Use [`setBidderConfig()`](/dev-docs/publisher-api-reference.html#module_pbjs.setBidderConfig)

## In-Page Examples

The Prebid First Party Data JSON structure reflects the OpenRTB standard.
- Arbitrary attributes should go in `ortb2.site.ext.data` or `ortb2.user.data`.
- Fields that are meant to be standard [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) should be in `ortb2.site` or `ortb2.user`. Specfically, the standard values for 'site' are: name, domain, cat, sectioncat, pagecat, page, ref, search, keywords. For 'user' these are: yob, gender, keywords.
- Segment taxonomy values go in `ortb2.site.content.data` or `ortb2.user.data` using the IAB standard representation.

### Supplying Global Data

Here's how a publisher can let all bid adapters have access
to first party data that might be useful in ad targeting that's good in PBJS 4.30 and later:
{% highlight js %}
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
          	    "name": "www.dataprovider1.com",
          	    "ext": { "taxonomyname": "iab_content_taxonomy" },
		    "segment": [
            		{ "id": "687" }, 
            		{ "id": "123" }
		    ]
                }]
	   },
	   ext: {
               data: {   // fields that aren't part of openrtb 2.5
                   pageType: "article",
                   category: "repair"
               }
	   }
        },
        user: {
           yob: 1985,
           gender: "m",
           keywords: "a,b",
	   data: [{
	       name: "dataprovider.com",
	       ext: { taxonomyname: "iab_audience_taxonomy" },
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
        }
    }
});
{% endhighlight %}

{: .alert.alert-warning :}
Note that supplying first party **user** data may require special
consent in certain regions. Prebid.js does **not** police the passing
of user data as part of its GDPR or CCPA modules.

{: .alert.alert-warning :}
If you're using PBJS version 4.29 or before, replace the following in the example above: 'ortb' with 'fpd', 'site' with 'context' and 'site.ext.data' with 'context.data'.

### Supplying AdUnit-Specific Data

If an attribute is specific to an AdUnit, it can be passed this way:

{% highlight js %}
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
{% endhighlight %}

{: .alert.alert-info :}
Prebid does not support AdUnit-specific **user** data, nor does it support
bidder-specific AdUnit First Party Data. You could implement either of
these scenarios with a publisher-specific callback on the [`requestBids` event](/dev-docs/publisher-api-reference.html#module_pbjs.onEvent)

{: .alert.alert-warning :}
If you're using PBJS version 4.29 or before, replace the following in the example above: 'ortb2Imp.ext.data' with 'fpd.context.data'.

### Supplying Bidder-Specific Data

Use the [`setBidderConfig()`](/dev-docs/publisher-api-reference.html#module_pbjs.setBidderConfig) function to supply bidder-specific data. In this example, only bidderA and bidderB will get access to the supplied
global data.

{% highlight js %}
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
{% endhighlight %}

## How Bid Adapters Should Read First Party Data

To access global data, a Prebid.js bid adapter needs only to call [`getConfig()`](/dev-docs/publisher-api-reference.html#module_pbjs.getConfig), like this:

{% highlight js %}
config.getConfig('ortb2'))
{% endhighlight %}

AdUnit-specific values must be parsed out of the AdUnit object.

The assumption is that bid adapters will copy the values to the appropriate protocol location for their endpoint.

See [Prebid Server First Party Data](/prebid-server/features/pbs-fpd.html) for a discussion of this feature for Prebid Server bid adapters.

## Related Topics

- The [Prebid.js Publisher API](/dev-docs/publisher-api-reference.html)
- The [AdUnit Reference](/dev-docs/adunit-reference.html)
- [Prebid Server First Party Data support](/prebid-server/features/pbs-fpd.html)

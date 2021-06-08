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

## How It Works

Here's a summary of how first party data (FPD) works:

![First Party Data Summary](/assets/images/flowcharts/FirstPartyData-Summary.png){: .pb-lg-img :}

This diagram shows a page that can provide:

- Global context (site) data that applies to all AdUnits and all bidders
- Global user data that applies to all AdUnits and all bidders
- AdUnit-specific data that applies to all bidders
- Bidder-specific context data that applies to all AdUnits
- Bidder-specific user data that applies to all AdUnits

## In-Page Examples

The Prebid First Party Data JSON structure reflects the OpenRTB standard.
Arbitrary values should go in fpd.context.data or fpd.user.data. Fields
that are meant to be standard [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) values should be in fpd.context or fpd.user. Specfically, the standard values for `site` are: name, domain, cat, sectioncat, pagecat, page, ref, search, keywords. For `user` these are: yob, gender, keywords.

{: .alert.alert-info :}
'Context' corresponds to the OpenRTB 'site' object.

### Supplying Global Data

Here's how a publisher can let all bid adapters have access
to first party data that might be useful in ad targeting:
{% highlight js %}
pbjs.setConfig({
   fpd: {
       context: {
           name: "example",
           domain: "page.example.com",
           cat: ["IAB2"],
           sectioncat: ["IAB2-2"],
           pagecat: ["IAB2-2"],
           page: "https://page.example.com/here.html",
           ref: "https://ref.example.com",
           keywords: "power tools, drills",
           search: "drill",
           content: { userrating: 4 },
           data: {   // fields that aren't part of openrtb 2.5
               pageType: "article",
               category: "repair"
           }
        },
        user: {
           yob: 1985,
           gender: "m",
           keywords: "a,b",
           data: {
              registered: true,
              interests: ["cars"]
           }
        }
    }
});
{% endhighlight %}

{: .alert.alert-warning :}
Note that supplying first party **user** data may require special
consent in certain regions. Prebid does **not** police the passing
of user data as part of its GDPR or CCPA modules.

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
    fpd: {
        context: {
            pbAdSlot: "homepage-top-rect",
            data: {
                adUnitSpecificAttribute: "123"
            }
         }
    },
    ...
});
{% endhighlight %}

{: .alert.alert-info :}
Prebid does not support AdUnit-Specific **user** data.

### Supplying Bidder-Specific Data

Use the [`setBidderConfig()`](/dev-docs/publisher-api-reference.html#module_pbjs.setBidderConfig) function to supply bidder-specific data. In this example, only bidderA and bidderB will get access to the supplied
global data.

{% highlight js %}
pbjs.setBidderConfig({
   bidders: ['bidderA', 'bidderB'],
   config: {
       fpd: {
           context: {
               data: {
                  pageType: "article",
                  category: "tools"
               }
            },
            user: {
               data: {
                  registered: true,
                  interests: ["cars"]
               }
          }
      }
   }
});

pbjs.setBidderConfig({ // different bidders can receive different data
   bidders: ['bidderC'],
   config: {
     fpd: { ... }
   }
});
{% endhighlight %}

{: .alert.alert-info :}
Applying permissions to AdUnit-specific First Party Data has
to be done manually by using an event handler -- [pbjs.onEvent('beforeRequestBids', function())](/dev-docs/publisher-api-reference.html#module_pbjs.onEvent)

## How Bid Adapters Should Read First Party Data

To access global data, a Prebid.js bid adapter needs only to call [`getConfig()`](/dev-docs/publisher-api-reference.html#module_pbjs.getConfig), like this:

{% highlight js %}
config.getConfig('fpd.context'))
config.getConfig('fpd.user'))
{% endhighlight %}

AdUnit-specific values must be parsed out of the AdUnit object.

The assumption is that bid adapters will copy the values to the appropriate protocol location for their endpoint.

See [Prebid Server First Party Data](/prebid-server/features/pbs-fpd.html) for a discussion of this feature for Prebid Server bid adapters.

## Further Reading

- The [Prebid.js Publisher API](/dev-docs/publisher-api-reference.html)
- The [AdUnit Reference](/dev-docs/adunit-reference.html)
- [Prebid Server First Party Data support](/prebid-server/features/pbs-fpd.html)

---
layout: page_v2
sidebarType: 5
title: Prebid Server | Features | Price Floors
---

# Prebid Server | Features | Price Floors
{: .no_toc}

* TOC
{:toc}

## Overview

{: .alert.alert-danger :}
This feature is in beta. Please post [questions and issues](https://github.com/prebid/prebid-server-java/issues).

{: .alert.alert-warning :}
The Floors feature is currently only available in PBS-Java.

The Price Floors feature provides an open framework for Publishers to configure Prebid price floors on their own or to work with advanced vendors who can provide optimized floors.

A ‘floor’ is defined as the lowest price a bid that will be accepted for each Prebid auction. It’s a way for publishers to signal to bidders the price to beat, thereby protecting the value of their inventory. Proper floors are dynamic and determined based on detailed factors like mediaType, adSlot, size, and other factors.

The Prebid Server version of this feature is similar to the [Prebid.js Price Floors Module](/dev-docs/modules/floors.html) with a few differences. Here are the advantages to having this feature on the server-side:

- Mobile APP and AMP scenarios can support floors. However, neither Prebid SDK nor AMP supports specifying complex floor data. The intention is that floor data is either in the top-level stored request, or obtained with a dynamic fetch.
- Floor data is cached by PBS, so using server-side floors may lighten the load on the browser and perhaps improve auction performance. It no longer has to load floor data with the PBJS package or make a dynamic fetch for them. However, this PBS-based floors feature does not currently support client-side analytics, so in many cases, the Prebid.js client-side floors feature may still be necessary.

Here are the differences between Prebid.js and Prebid Server floors:
- As noted, floor data is retrieved outside the regular auction flow and cached for a period of time
- Custom schema attributes are supported in Prebid.js but not in Prebid Server. This is because publishers cannot define arbitrary server-side javascript functions.
- However, there are additional schema attributes supported in Prebid Server, e.g. country and deviceType. See [floor schema dimensions](/prebid-server/features/pbs-floors.html#floor-schema-dimensions) below for details.
- Prebid Server only supports "Floor Schema version 2".

The syntax of the floors schema is so similar between Prebid.js and Prebid Server that floor providers should not need to change how they generate floors data.

{: .alert.alert-info :}
The PBS floors feature isn't a formal [PBS module](/prebid-server/pbs-modules/). Yeah, that bums us out too.
Turns out that floors just don't fit the 7-stage module architecture model.
Specifically, modules don't support the feature where bid adapters need access to floor data.

### Terminology

- **Floor**: the lowest price bid that will be accepted.
- **Floors data**: the sum-total of all the floors information. Includes the models, rules, and attributes controlling behavior.
- **Floor model**: a set of floor rules. optimization algorithms can define multiple sets of floor rules with different weights to experiment with different scenarios. i.e. A/B/C testing of floor values.
- **Floor schema**: defines which attributes are in the floor rules. e.g. "adslot and mediaType".
- **Floor rule**: A mapping of floor schema dimensions to a floor values. e.g. "if adslot is /111/homepage and mediaType is banner, then the floor is 1.00".

## How Floors work in Prebid Server

Here's the high level picture of what's happening in Prebid Server to support floors:

![Floors High Level](/assets/images/prebid-server/pbs-floors-basic.png){:class="pb-xlg-img"}

1. Account configuration enables the floors feature.
2. If configured to do so, floors data is periodically updated from a defined URL specific to an account. A "Floors Provider" service is expected to conform to Prebid floors schema v2. Note that using a vendor service is optional: floor data can be provided on the request.
3. The main communication path for the calculated floor is the OpenRTB `imp.bidfloor` field, which is sent to each bid adapter in the auction.

{: .alert.alert-info :}
Vendor services generally calculate floors with optimization algorithms fed by an analytics adapter.
Generally floors data would be updated hourly, or perhaps once per day.
It is best practice is to avoid a "hardcode-and-forget" method of setting floors.
If a publisher doesn't want to utilize a floors service, they should commit to periodically reviewing manually-defined numbers.

Drilling down one level into some detail, the PBS Floors feature has several main parts that work together:

![Prebid Server Architecture](/assets/images/prebid-server/pbs-floors-detailed.png){:class="pb-xlg-img"}

1. The **floor fetching** component should be thought of as an event-driven service that periodically polls a vendor to retrieve updated floors data specific for each account. 
2. The **floor signaling** component parses the floors data and determines the actual floor for each ORTB imp object in the auction. The floors data could come from: (a) the request/stored-request or (b) an external floors provider
3. The best floor number is passed to the bid adapter on imp.bidfloor with the currency defined by imp.bidfloorcur. Certain bid adapters may be able to support more sophisticated floors for scenarios like multi-format. Due to bidder-specific [bid adjustment](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#bid-adjustments) feature, each bid adapter may see a different floor value.
4. The **floor enforcement** component verifies that each bid has met the floor for that adapter after currency and bid adjustments.
5. Finally, analytics adapters have access to all the floors data. This can be used to feed optimization algorithms.

The following sections go through each of the floor components.

## Dynamic Floor Fetching

The Prebid Server host company and publisher
may optionally decide to work with an external vendor to provide optimized floors.

Setting up the service is straightforward:

- Choose a vendor. See the [floors provider list](/dev-docs/modules/floors.html#floors-providers) in the Prebid.js documentation.
- Work with that vendor to determine the details: the schema, period, and other configurable values.
- Obtain a URL from the vendor for each publisher account. This URL should be a file on a CDN or otherwise be available within a few seconds around the globe.
- Define the URL in the account-specific configuration.

That's it. Here's how fetching works:

1. **Retrieve floors** - On the first request from the account, the Floor Fetching component will notice that it needs to obtain floors data from the vendor and will start a separate
thread to read data from the URL. (Note: this means the first request from each account will not have floors data available.)
1. **Cache floor data** - The floors data will be cached in Prebid Server memory for a defined period.
1. **Poll for updated data** - Once it's time to poll for new data, the next request from that account will trigger a refresh of floor data.
1. **Expire stale data** - If the data ever gets more stale than a configured age, it will be flagged as invalid.
1. **Surface data problems** - Operational metrics and log entries are made when there are problems obtaining floors data.


## Floor Signaling

Floor signaling is the process that determines which floor value to send to each bid adapter. Here's what it does for each auction:

1. **Confirm floors are enabled** - make sure floors are enabled for Prebid Server, the account, and the request. If any of them are disabled, don't process floors. Instead, any original imp.bidfloor is passed through to bid adapters unmodified.
1. **Determine which floor data to use**
    1. First, use floor data cached from a floors vendor if one was configured. This is the data retrieved in the fetch step above.
    1. If there's no valid data cached, then use floor data defined in the request (or stored-request) in `ext.prebid.floors`.
    1. Finally, if no floor rules are available, the incoming imp.bidfloor can still be used and adjusted as needed for bid adjustment and currency.
1. **Process skipRate** - choose a random number. If it's greater than the skipRate, bypass floor signaling. Set ext.prebid.floors.skipped to true. This allows for A/B testing for the effectiveness of floors.
1. **Process the floor rules** - see below for details.
1. **Prepare downstream data**
    1. Update imp[].bidfloor and bidfloorcur with the appropriate values. These are standard OpenRTB fields that should be used by bid adapters to communicate the floor to their endpoints.
    1. If dynamic floor rules were utilized, overwrite the request ext.prebid.floors with the specific source and model being used so downstream entities all know which data was used to process floor rules.
    1. Update imp[].ext.prebid.floors with impression-specific values: the floorRule and floorRuleValue used to set the imp.bidfloor
    1. Set values for analytics adapters: enabled, location, skipped, fetchStatus.
1. **Prepare bidder-specific values** - for bidders with [cpm adjustments](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#bid-adjustments), update imp[].bidfloor with the appropriate value.

The default way that bid adapters receive the floor is just the OpenRTB standard `bidfloor` (and `bidfloorcur`).
But floors may actually be richer than a single value. For instance, in a multi-format impression,
there could be a floor for banner and a separate floor for video. Unfortunately, OpenRTB 2.5/2.6 don't support bidfloor at the mediaType level, so most bidders don't support that distinction either. However,
Prebid Server offers a way for bid adapters to distinguish between
mediatypes, sizes, and other details if they support it. See the [Bid Adapter Floor Interface](/prebid-server/features/pbs-floors.html#bid-adapter-floor-interface) section below.

## Floor Enforcement

The enforcement stage of the Floors feature validates bid responses from the adapters.

1. **Let bid adjustments happen as usual** - if the [cpm adjustments](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#bid-adjustments) feature is active, PBS-core runs it as usual.
1. **Confirm floor enforcement is enabled**
    1. Checks whether the Signaling stage was active. i.e. if skipRate applied to signaling, it applies to the Enforcement stage as well.
    1. Check ext.prebid.floors.enforcement.enforcePBS. If defined and false, bypass enforcement.
    1. If Signaling was active, check the enforceRate. If specified, choose a random number, and if it's greater than the enforceRate value, don't verify bid values.
1. **Enforce**
    1. Normalize bid currency against the floor currency
    1. Confirm the bid is greater than or equal to the floor
    1. If not, reject the bid and flag it:
        1. Add a warning when in debug mode
        1. Send a 'rejected-due-to-floors' status to analytics adapters
        1. Log a sampled metric so the host company can follow up with bidders that aren't adhering to the floors.

## Floor Data

Prebid Server floors data must always be formatted using the [Schema 2](/dev-docs/modules/floors.html#schema-2) format supported by Prebid.js.
There a few fields supported by Prebid Server not supported in Prebid.js, but it's
completely backwards-compatible -- PBS will accept and process any Prebid.js floors data formatted in Schema 2.

### Defining Floor data

As described in the [Signaling](#floor-signaling) section above, floor data may be defined in several ways. Here's the order of priority:
1. Dynamic data - if PBS finds recent (non-expired) floors data from a dynamic floors vendor, that takes precedence.
1. Request data - ext.prebid.floors may be specified in the client-request or in a stored-request.
1. Default floor - finally, the publisher may specify request imp.bidfloor as an overal default in case no other floors info is present.

Here's an example of floors data coming in on the request:
```
{
  ...
  "ext": {
    "prebid": {
      "floors": {
        "floorMin": 1.00,
        "floorMinCur": "USD",
        ...
        "data": {
          "modelGroups": [{
            ...
          }]
        }
      }
    }
  }
}
```

### Dynamic Floor Providers

If you're a vendor looking to provide dynamic floors data via
Prebid Server, it's possible to use the same system
you're using for Prebid.js. Or you may want to take advantage of
the additional dimensions available.

You'll need to work with the Prebid Server host company on how to get the analytics. 
It may be necessary to build a [server-side analytics adapter](/prebid-server/developers/pbs-build-an-analytics-adapter.html) in order
to get data about which models were used, skipRate effectiveness, etc.

At this time, floors analytics data (e.g. skipped) is not passed back to the client.
The expectation is that
Publishers will use this floors feature mainly for mobile app and AMP scenarios. 
It's assumed that Web sites running Prebid.js will utilize the client-side module and analytics.
If the community requires client-side analytics for floors,
please [open an issue](https://github.com/prebid/prebid-server/issues) with as much detail as you can about the requirements.

{: .alert.alert-info :}
Note: when producing a floors file, be aware that the entire contents are mered under
the 'data' object of [Schema 2](/dev-docs/modules/floors.html#schema-2). i.e.
the file should not contain the 'data' object, just attributes of the 'data' object.


### Processing Floor Rules

To understand how floor rules look and operate, see the [rules selection process](/dev-docs/modules/floors.html#rule-selection-process) in the Prebid.js floors module doc.

### Floor Schema Dimensions

These are the fields that can be used in defining the rules. The ones highlighed in **bold** are
supported only in Prebid Server, not in Prebid.js.

{: .table .table-bordered .table-striped }
| Dimension | Type | Example | How it works |
|---+---+---+---|
| **siteDomain** | string | "level4.level3.example.com" | This is the full site domain. The value in the floor rule is compared to ORTB site.domain or app.domain |
| **pubDomain** | string | "example.com" or "example.co.uk" | This is the publisher's base domain. It's compared to site.publisher.domain or app.publisher.domain |
| domain | string | "example.com" | This is the robust way to check either the full domain or the base domain. It's compared against (site.domain and site.publisher.domain) or (app.domain and app.publisher.domain). If any of them match this part of the rule matches. |
| **bundle** | string | "org.prebid.drprebid" | This value in the rule is compared to ORTB app.bundle |
| **channel** | string | "app" | This rule value is compared against ORTB ext.prebid.channel.name |
| mediaType | string | "video" | If more than one of the following ORTB objects exists, only the "*" rule value will match: imp.banner, imp.video, imp.native, imp.audio. Otherwise: {::nomarkdown}<ul><li>the "banner" rule value will match if imp.banner exists.</li><li> the "video-outstream" rule value will match if imp.video exists and imp.video.placement is not 1</li><li>the "video-instream" rule value will match if imp.video exists and imp.video placement exists and is 1</li><li>the "video" rule value is treated as "video-instream" above.</li><li>the "native" rule value will match if imp.native exists</li><li>the "audio" rule value will match if imp.audio exists</li></ul>{:/} |
| size | string | "300x250" | {::nomarkdown}<ul><li>if ORTB imp.banner exists and only one size exists in imp.banner.format, then the rule value is matched against imp.banner.format[0].w and imp.banner.format[0].h</li><li>else if ORTB imp.banner exists and there's no imp.banner.format, then match the rule value against imp.banner.w and imp.banner.h</li><li>else if ORTB imp.video exists, match the rule value against imp.video.w and imp.video.h</li><li>Otherwise the size rule value only matches the "*" condition</li></ul>{:/} |
| gptSlot | string | "/111/homepage" | if imp.ext.data.adserver.name=="gam" then compare the rule value against imp.ext.data.adserver.adslot. Otherwise compare the rule value against imp.ext.data.pbadslot |
| **pbAdSlot** | string | "/111/homepage#div1" | Compare the rule value against imp.ext.data.pbadslot |
| **country** | string | "USA" | Compare the rule value against device.geo.country (ISO-3166-1-alpha-3) |
| **deviceType** | string | "desktop", "phone", "tablet" | This is a very simple device-type algorithm: {::nomarkdown}<ul><li>if ORTB device.ua is not present, only rules specifying a wildcard deviceType will match. In other words, there's no default value unless device.ua exists.</li><li>otherwise, match a rule value of "phone" if UA matches one of these patterns: "Phone", "iPhone", "Android.*Mobile", "Mobile.*Android"</li><li>otherwise, match a rule value of "tablet" if UA matches one of these: "tablet", "iPad", "Windows NT.*touch", "touch.*Windows NT", "Android"</li><li>otherwise assume the rule value "desktop" matches all other user agent strings.</li></ul>{:/} |

Note that these schema dimensions are coded into the floors feature. If you need
another attribute to break out rules, please submit a code pull request with
an enhancement.

Here's an example of some rules using PBS-specific schema dimensions:
```
{
  ...
  "data": {  
    "floorProvider": "providerA",
    "currency": "USD",
    "modelGroups": [{
        "modelWeight": 50,
        "modelVersion": "111111",
        "schema": {
            "fields": ["country", "mediaType", "deviceType"],
            "delimiter": "|"
        },
        "values": {
            "usa|banner|tablet": 0.50, // banners on tablets from the US
            "can|video-outstream|desktop": 0.75, // outstream on Canadian desktops
            ...
        },
        "default": 0.01
    }, {
        ....
    ]}
  }
  ...
```

## Floor Configuration

The floors feature gives publishers and host companies a fair amount of control over how it operates.

Here are the configurable items:

{: .table .table-bordered .table-striped }
| Config | Type | Default | Description |
|---+---+---+---|
| enabled | boolean | true | Master switch for turning off the floors feature for this account. |
| enforce-floors-rate | integer | 100 | Default value for the enforceRate attribute. |
| adjust-for-bid-adjustment | boolean | true | Default value for the enforcement.bidAdjustment attribute. |
| enforce-deal-floors | boolean | false | Default value for the enforcement.floorDeals attribute. |
| fetch.enabled | boolean | false | Turns on the polling of an external dynamic floor data source. |
| fetch.url | string | - | URL for the external dynamic floor data source. |
| fetch.timeout-ms | integer | 3000 | How long to wait for the dynamic floor data source. |
| fetch.max-file-size-kb | integer | 100 | How big can the rule data get before being rejected. Helps protect memory problems. |
| fetch.max-rules | integer | 1000 | How many rules is too many. Helps protect processing time. |
| fetch.max-age-sec | integer | 86400 | How long is dynamically fetched data considered usable? |
| fetch.period-sec | integer | 3600 | How often between attempts to poll for updated data? |
| use-dynamic-data | boolean | true | Can be used as an emergency override to start ignoring dynamic floors data if something goes wrong. |

The precise details of configuration may differ for PBS-Java vs PBS-Go. See the configuration document for your platform.

## Bid Adapter Floor Interface

Most bid adapters will not need to do anything special to obtain floors. They can 
just read imp.bidfloor and imp.bidfloorcur, converting currency as needed.

However, there are some use cases where advanced adapters might want to
get more granular access to floors data:
- In a multi-format impression object, some adapters may choose to split the imp into two requests to their endpoint. e.g. one for video with a video floor, one for banner with a banner floor.
- The endpoint may be capable of receiving a floor value for each different size. This is not part of the ORTB spec, but might be something an endpoint could handle.

Let's look at the first use case in more detail. When the Floors Signaling component
sees multiple media types in a single impression, it will always choose a "*"-valued rule for mediaType. Say we have this rule scenario:

```
{
  "data": {
    "currency": "USD",
    "modelGroups": [{
        ...
        "schema": {
            "fields": ["country", "mediaType"],
            "delimiter": "|"
        },
        "values": {
            "usa|banner": 0.50,
            "usa|video-outstream": 0.75,
            "usa|video-instream": 0.99,
            "usa|*": 0.99,
            ...
        },
        "default": 0.01
    }, {
       ...
    }]
  }
}
```
And say this is the request:
```
{
    "imp": {
        "banner": {
            ...
        },
        "video": {
            "placement": 1,
            ...
        }
    }
}
```
The Floors Signaling component sees that both banner and video are present,
so will only match the "*" rule for mediaType. In other words, it will set
imp.bidfloor to 0.99 in this scenario.
But if a bidder only supports banner, the 0.99 floor is higher than necessary.
It would be easier to meet the 0.50 floor for banners.

To address this, a special floor function enables adapters to retrieve more granular
floor values for each impression in the auction. Due to the complexity of the rule system, deriving the correct floor would be a difficult task without this function.

See the [developer bid adapter documentation](/prebid-server/developers/add-new-bidder-java.html) for details.

## Analytics Adapters

To get floors information, developers of an analytics adapter will need to
pull data from both the bidrequest object and bidresponse object.

In most scenarios, floor data is all in the bidrequest object, specifically in the ext.prebid.floors object. See [Schema 2](/dev-docs/modules/floors.html#schema-2) for the available fields.

Here are some scenarios where looking at the bid response level data is used:

- when the Floors feature rejects a bid because it didn't meet the floor
- when a bidder's floor was adjusted due to bidAdjustmentFactor
- when a bidder uses the getFloor() function to determine a custom floor

Check the bid response object for this data:

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|---+---+---|
| bidAdjustment | boolean | Used to record if the bid floor was CPM adjusted based on the bidAdjustmentFactor provided in the bidRequest |
| floorCurrency | string | Currency of the floor matched. Only specified if the bidder calls getFloor. |
| floorRule | string | The matching rule for the given bidResponse. Only needed if the bidder calls getFloor(). |
| floorRuleValue | float | Rule floor selected. This is to differentiate between the floor bound to the selected rule and the OpenRTB bidfloor (if available). Only needed if the bidder calls getFloor(). |
| floorValue | float | The value of the floor enforced for this bidder. This will be the greater of the OpenRTB bidfloor and floorRuleValue. Only needed if the bidder calls getFloor or if the floor was adjusted due to bidCpmAdjustments. |


See the [developer's guide to building an analytics adapter](/prebid-server/developers/pbs-build-an-analytics-adapter.html) for more details, and see existing code as an example.

## Related Reading

- [Prebid.js Floors module](/dev-docs/modules/floors.html)
- [Floor Provider Vendor list](/dev-docs/modules/floors.html#floors-providers)

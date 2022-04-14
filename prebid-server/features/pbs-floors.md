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

{: .alert.alert-warning :}
The Floors feature is currently only available in PBS-Java.

The Price Floors feature provides an open source framework for Publishers to configure Prebid price floors on their own or to work with a vendor who can provide floors.

A ‘floor’ is defined as the lowest CPM price a bid will need to meet for each Prebid auction. It’s a way for publishers to signal to bidders the price to beat, thereby protecting the value of their inventory. Proper floors are dynamic and determined based on detailed factors like mediaType, adSlot, size, and others.

The Prebid Server version of this feature is similar to the [Prebid.js Price Floors Module](/dev-docs/modules/floors.html) with a few differences. There are advantages to having this feature on the server-side:

- Mobile APP and AMP scenarios can support floors. However, neither Prebid SDK nor AMP supports specifying complex floor data. The intention is that floor data is either in the top-level stored request, or obtained with a dynamic fetch.
- Floor data is cached by PBS, so using server-side floors may lighten the load on the browser and perhaps improve auction performance. It no longer has to load floor data with the PBJS package or make a dynamic fetch for them. However, this PBS-based floors feature does not currently support client-side analytics, so in many cases, the Prebid.js client-side floors feature may still be necessary.

Finally, there are several differences between Prebid.js and Prebid Server floors:
- Floor data is retrieved outside the regular auction flow and cached for a period of time
- Custom schema attributes are supported in Prebid.js but not Prebid Server. This is because publishers cannot define arbitrary server-side javascript functions.
- However, there are additional schema attributes supported in Prebid Server, e.g. country and deviceType. See [floor schema dimensions](/prebid-server/features/pbs-floors.html#floor-schema-dimensions) below for details.
- Prebid Server only supports "Floor Schema version 2"

Other than these differences, the syntax of the floors schema is identical between Prebid.js and Prebid Server, so floor providers should not need to change how they generate floors data.

{: .alert.alert-info :}
The PBS floors feature isn't a formal [module](/prebid-server/pbs-modules/). Yeah, that bums us out too.
Turns out that floors just don't fit the 7-stage module architecture model.
Specifically, modules don't support the important feature where bid adapters need access to floor data.

### Terminology

- **Floor**: the lowest price for a bid that will be accepted.
- **Floors data**: the sum-total of all the floors information. Includes the models, rules, and attributes controlling behavior.
- **Floor model**: optimization algorithms can define multiple sets of floor rules with different weights to experiment with different scenarios. i.e. A/B/C testing of floor values.
- **Floor schema**: defines which attributes define floors values. e.g. "adslot and mediaType".
- **Floor rule**: A specific mapping of floor schema values and the floor to be used for that combination of values. e.g. "if adslot is /111/homepage and mediaType is banner, then the floor is 1.00".

## How floors work in Prebid Server

Here's the high level picture of what's happening in Prebid Server to support floors:

![Floors High Level](/assets/images/prebid-server/pbs-floors-basic.png){:class="pb-xlg-img"}

1. Account configuration can enabled the floors feature.
2. If configured to do so, floors data will be periodically updated from a defined URL specific to an account. A "Floors Provider" service is expected to conform to Prebid floors schema v2. It's important to note that using a vendor's floor service is optional. Floors data can be provided on the request.
3. The main communication path for the calculated floor is the standard OpenRTB `imp.bidfloor` field, which is sent to each bid adapter participating in the auction.

{: .alert.alert-info :}
Floors data as calculated by vendors is generally calculated by optimization algorithms fed by a PBS analytics adapter.
Generally floors data would not be updated more often than a few times per hour, and perhaps only once per day.
Best practice is to avoid the "hardcode-and-forget" method of setting floors.
If a publisher doesn't want to utilize a floors service, they should commit to periodically reviewing any manually-defined numbers.

Drilling down one level into some detail, the PBS Floors feature has several main parts that work together:

![Prebid Server Architecture](/assets/images/prebid-server/pbs-floors-detailed.png){:class="pb-xlg-img"}

1. The **floor fetching** component should be thought of as an event-driven service that periodically polls a vendor service to retrieve updated floors data specific for each account. 
2. The **floor signaling** component does the work of parsing the floors data and determing the actual floor for each of ORTB imp object in the auction. The floors data could come from: (a) the request/stored-request or (b) an external floors provider
3. The best floor number is passed to the bid adapter on imp.bidfloor with the currency defined by imp.bidfloorcur. Certain bid adapters may be able to support more sophisticated floors for scenarios like multi-format. Note that due to the bidder-specific [bid adjustment](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#bid-adjustments) feature, each bid adapter may see a different floor value.
4. The **floor enforcement** component verifies that each bid has met the price defined as the floor value for that bid adapter after currency and bid adjustments.
5. Finally, analytics adapters has access to all the floors data. This can be used to feed the optimization algorithms.

The following sections go through each of the floor components.

## Floor Fetching

The 'fetching' component is optional. The Prebid Server host company and publisher
may decide to work with an external vendor to provide optimized floors.

Setting up the service is simple:

- Choose a vendor. See the [floors provider list](/dev-docs/modules/floors.html#floors-providers) in the Prebid.js documentation.
- Work with that vendor to determine the details: the schema, period, and other configurable values.
- Obtain a URL from the vendor specific to the publisher account.
- Define the URL in the account-specific configuration.

That's it. Here's how the feature works:

1. On the first request from the account, the Floor Fetching component will notice that it needs to obtain floors data from the vendor and will start a separate
thread to do so.
1. The floors data will be cached in Prebid Server memory for the defined period.
1. Once it's time to poll for new data, the next request from that account will trigger a refresh of the floors data.
1. If the data ever gets more stale than a configured age, it won't be used.
1. Operational metrics and log entries are made when there are problems obtaining floors data.


## Floor Signaling

Floor signaling is the process that determines what floor value to send to each bid adapter. Here's what it does for each auction:

1. **Confirm floors are enabled** - make sure floors are enabled for Prebid Server, the account, and the request. If any of them are disabled, skip floor processing entirely. If the remaining steps are skipped, any original imp.bidfloor is passed through to bid adapters unmodified.
1. **Determine which floor data to use**
    1. First, use floor data cached from a floors vendor if one was configured.
    1. Next, use any floor data defined in the request (or stored-request) ext.prebid.floors.
    1. Finally, if no floor rules are available, the incoming imp.bidfloor can still be used and adjusted as needed for bid adjustment and currency.
1. **Process skipRate** - choose a random number. If it's greater than the skipRate, bypass floor signaling. Set ext.prebid.floors.skipped to true.
1. **Process the floor rules** - see below for details.
1. **Prepare downstream data**
    1. update imp[].bidfloor and bidfloorcur with the appropriate values. These are the standard OpenRTB fields used by bid adapters to communicate the floor to their endpoints.
    1. If dynamic floor rules were utilized, overwrite the request ext.prebid.floors with the specific source and model being used so downstream entities all know which data was used to process floor rules.
    1. update imp[].ext.prebid.floors with impression-specific values: the floorRule and floorRuleValue used to set the imp.bidfloor
    1. Set values for analytics adapters: enabled, location, skipped, fetchStatus.
1. **Prepare bidder-specific values** - for bidders with [cpm adjustments](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#bid-adjustments), update imp[].bidfloor/cur with the appropriate value

You may notice that the default interface bid adapters have to floors is simply `bidfloor` (and `bidfloorcur`), but that floors may actually
be richer than a single value. For instance, in a multi-format impression,
there could be a floor for banner and a separate floor for video. Unfortunately, OpenRTB 2.5/2.6 don't support bidfloor at the mediaType level, so most bidders don't support that distinction either. However,
Prebid Server offers a way for bid adapters to distinguish between
mediatypes, sizes, and other details if they support it. See the [Bid Adapter Floor Interface](/prebid-server/features/pbs-floors.html#bid-adapter-floor-interface) section below.

## Floor Enforcement

The enforcement stage of the Floors feature validates the bid responses from the adapters.

1. **Let bid adjustments happen as usual** - if the [cpm adjustments](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#bid-adjustments) feature is active, PBS-core runs it as usual.
1. **Confirm floor enforcement is enabled**
    1. Checks whether the Signaling stage was active. i.e. if skipRate applied to signaling, it applies to the Enforcement stage as well.
    1. Check ext.prebid.floors.enforcement.enforcePBS. If defined and false, bypass enforcement.
    1. If Signaling was active, check the enforceRate. If specified, choose a random number, and if it's greater than the enforceRate value, let bids skip enforcement.
1. **Enforce**
    1. Normalize the bid currency against the floor currency
    1. Confirm the bid is greater than or equal to the floor
    1. If not, reject the bid and flag it:
        1. Add a warning when in debug mode
        1. Send a 'rejected-due-to-floors' status to analytics adapters
        1. Log a sampled metric so the host company can follow up with bidders that aren't adhering to the floors.


## Floors Data

Prebid Server floors data must always be formatted using the [Schema 2](/dev-docs/modules/floors.html#schema-2) format supported by Prebid.js.
Actually, there a few fields supported by Prebid Server not supported in Prebid.js, so really the PBS schema is more like v2.1. However, it's
completely backwards-compatible -- PBS will accept and process any Prebid.js floors data formatted in Schema 2.

### Defining Floor data

Floor data may be defined in several ways. Here's the order
of priority:
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
Prebid Server, it's possible to use most of the same system
you're using for Prebid.js. The one piece you'll need to work out
with the Prebid Server host company is how to get the analytics. 
You may need to build a [server-side analytics adapter](/prebid-server/developers/pbs-build-an-analytics-adapter.html) in order
to get data about which models were used, etc.

At this time, the analytics data is not passed back to the client.
If the community requires client-side analytics for floors,
please [open an issue](https://github.com/prebid/prebid-server/issues) with as much detail as you can about the requirements.

The expectation with the Prebid Server floors feature is that
Publishers will use it mainly for mobile app and AMP scenarios. 
Web sites running Prebid.js will utilize the client-side module.

### Processing Floor Rules

To understand how floor rules look and operate, see the [rules selection process](/dev-docs/modules/floors.html#rule-selection-process) in the Prebid.js floors module doc.

### Floor Schema Dimensions

{: .table .table-bordered .table-striped }
| Dimension | Type | Example | How it works |
|---+---+---+---|
| siteDomain | string | "level4.level3.example.com" | This is the full site domain. The value in the floor rule is compared to ORTB site.domain or app.domain |
| pubDomain | string | "example.com" or "example.co.uk" | This is the publisher's base domain. It's compared to site.publisher.domain or app.publisher.domain |
| domain | string | "example.com" | This is the robust way to check either the full domain or the base domain. It's compared against (site.domain and site.publisher.domain) or (app.domain and app.publisher.domain). If any of them match this part of the rule matches. |
| bundle | string | "org.prebid.drprebid" | This value in the rule is compared to ORTB app.bundle |
| channel | string | "app" | This rule value is compared against ORTB ext.prebid.channel.name |
| mediaType | string | "video" | If more than one of the following ORTB objects exists, only the "*" rule value will match: imp.banner, imp.video, imp.native, imp.audio. Otherwise: {::nomarkdown}<ul><li>the "banner" rule value will match if imp.banner exists.</li><li> the "video-outstream" rule value will match if imp.video exists and imp.video.placement is not 1</li><li>the "video-instream" rule value will match if imp.video exists and imp.video placement exists and is 1</li><li>the "video" rule value is treated as "video-instream" above.</li><li>the "native" rule value will match if imp.native exists</li><li>the "audio" rule value will match if imp.audio exists</li></ul>{:/} |
| size | string | "300x250" | {::nomarkdown}<ul><li>if ORTB imp.banner exists and only one size exists in imp.banner.format, then the rule value is matched against imp.banner.format[0].w and imp.banner.format[0].h</li><li>else if ORTB imp.banner exists and there's no imp.banner.format, then match the rule value against imp.banner.w and imp.banner.h</li><li>else if ORTB imp.video exists, match the rule value against imp.video.w and imp.video.h</li><li>Otherwise the size rule value only matches the "*" condition</li></ul>{:/} |
| gptSlot | string | "/111/homepage" | if imp.ext.data.adserver.name=="gam" then compare the rule value against imp.ext.data.adserver.adslot. Otherwise compare the rule value against imp.ext.data.pbadslot |
| pbAdSlot | string | "/111/homepage#div1" | Compare the rule value against imp.ext.data.pbadslot |
| country | string | "USA" | Compare the rule value against device.geo.country (ISO-3166-1-alpha-3) |
| deviceType | string | "desktop", "phone", "tablet" | This is a very simple device-type algorithm: {::nomarkdown}<ul><li>if ORTB device.ua is not present, only rules specifying a wildcard deviceType will match. In other words, there's no default value unless device.ua exists.</li><li>otherwise, match a rule value of "phone" if UA matches one of these patterns: "Phone", "iPhone", "Android.*Mobile", "Mobile.*Android"</li><li>otherwise, match a rule value of "tablet" if UA matches one of these: "tablet", "iPad", "Windows NT.*touch", "touch.*Windows NT", "Android"</li><li>otherwise assume the rule value "desktop" matches all other user agent strings.</li></ul>{:/} |

Note that these schema dimensions are coded into the floors feature. If you need
another attribute to break out rules, please submit a code pull request with
an enhancement.

Here's an example of some rules using PBS-specific schema dimensions:
```
{
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
```

## Floor Configuration

The floors feature gives publishers and host companies a fair amount of control over how it operates. The precise details of the configuration are going to differ for
PBS-Java vs PBS-Go, so the details are left for those configuration resources. 

But here are the configurable items and a description.

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

## Bid Adapter Floor Interface

Most bid adapters will not need to do anything special to obtain floors. They can 
just read imp.bidfloor and imp.bidfloorcur, converting currency as needed.

However, there are some use cases where advanced adapters might want to
get more granular access to floors data:
- In a multi-format impression object, the adapter splits the request into two requests to their endpoint.
- The endpoint is capable of receiving a floor value for each different size

Let's look at the first use case in more detail. When the Floors Signaling component
sees multiple media types in a single impression, it will always choose a "*" valued rule for mediaType. Say we have this rule scenario:

```
{
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
The floors signaling component sees that both banner and video are present,
so will only match the "*" rule for mediaType. In other words, it will set
imp.bidfloor to 0.99 in this scenario.

But if a bidder only supports banner, the 0.99 floor is higher than necessary.
It would be easier to meet the 0.50 floor for banners.

To address this, a special floor function enables adapters to retrieve more granular
floor values for each impression in the auction. Due to the complexity of the rule system, deriving the correct floor can be a difficult task. The function simplifies the retrieval process.

See the [developer bid adapter documentation](/prebid-server/developers/add-new-bidder-java.html) for details.

## Analytics Adapters

To get floors information, developers of an analytics adapter will need to
pull data from both the bidrequest object and bidresponse object.

In most scenarios, floor data is all in the bidrequest object, specifically in the ext.prebid.floors object. See [Schema 2](/dev-docs/modules/floors.html#schema-2) for the available fields.

Here are some scenarios where looking at the bid response level data is needed:

- when the Floors feature determines that it needs to remove a bid response for enforcement reasons
- when a bidder's floor was adjusted due to bidAdjustmentFactor
- when a bidder uses 'getFloor' logic to determine a custom floor

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

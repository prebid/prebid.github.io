---
layout: page_v2
page_type: module
title: Module - Price Floors
description: Determine and enforce auction price floors
module_code : floors
display_name : Price Floors
enable_download : false
sidebarType : 1
---

# Price Floors Module
{:.no_toc}

{: .alert.alert-warning :}
DRAFT

* TOC
{:toc}

## Overview

The Floors module provides an open source framework in Prebid for Publishers to configure price floors on their own or to work with a vendor who can provide floors.

A 'floor' is defined as the lowest price that a publisher will accept for a
bid on a Prebid AdUnit. It's a way for publishers to protect the value of
their inventory by requiring buyers to keep bids at a minimum level. 

The module provides several ways for floors to be defined, passes them to
bidders and enforces that bid responses meet the floor in any supported currency. The floors utilized by Prebid.js are fairly simple, spanning only three dimensions:

- AdUnit or AdSlot
- MediaType
- Ad Size

The entire set of floors defined for a given page view are called 'Page Floors'. They may be defined in several ways:

1. Right in the AdUnit
1. With `setConfig`
1. Retrieved from a real-time data service

Examples for each of these scenarios follows.

{: .alert.alert-info :}
Even though Page Floors are defined with only three attributes,
it's possible to utilize other attributes of the page or user to define the
Page Floors. For example, of floor values could be dynamically created
based on device type, country, page category, etc.

## Defining Floors

How price floors are defined in the page environment will depend on how you're
obtaining the floors and how Prebid.js is integrated into the pages. We strongly recommend an automated analytical process rather than sporadic manual updates.

### Floors Defined in the AdUnit

In this approach, the Publisher configures the floors directly into the Prebid.js
AdUnits. This method can be used on simple pages or as part of a content
management system that dynamically creates AdUnits.

{% highlight js %}
    var adUnits = [
           {
               code: 'test-div',
               mediaTypes: {
                   banner: { sizes: [[300,250],[300,600]] },
                   video: {
                       context: 'outstream',
                       playerSize: [300,250],
                       ...
                   }
               },
               floors: {
                   currency: 'USD',
                   schema: {
                       delimiter: '|',
                       fields: [ 'mediaType', 'size' ]
                   },
                   values: [
                       {key: 'banner|300x250', floor: 1.10},
                       {key: 'banner|300x600', floor: 1.35},
                       {key: 'video|300x250', floor: 2.00}
                   ]
               },
               bids: [
                   ...
               ]
           }
       ];
{% endhighlight %}

Note that the `values` object is what contains the actual floors, and in this
example they're based on a combination of the mediaType and size. Since many
adapters don't currently support defining a floor for each size, a simpler
definition would be:

{% highlight js %}
               ...
               floors: {
                   currency: 'USD',
                   schema: {
                       fields: [ 'mediaType' ]
                   },
                   values: [
                       {key: 'banner', floor: 1.10},
                       {key: 'video', floor: 2.00}
                   ]
               },
               ...
{% endhighlight %}

Or if there's only one mediaType in the AdUnit and a single global floor, the syntax gets easier:

{% highlight js %}
               ...
               floors: {
                   default: 1.00     // default currency is USD
               },
               ...
{% endhighlight %}

### Package-Level Floors

This approach is intended for scenarios where the Publisher or their Prebid managed
service provider periodically appends updated floor data to the Prebid.js package.
In this model, there could be a more floor data present to
cover AdUnits across many pages.

{% highlight js %}
pbjs.setConfig({
    floors: {
        auctionDelay: 0,      // this is the default
        data: {
            currency: 'USD',
            schema: {
                fields: [ 'gptSlot' ]
            },
            values: [
                {key: '/1111/homepage/top-rect', floor: 0.80},
                {key: '/1111/homepage/left-nav', floor: 0.90},
                ... there could be hundreds of these ...
                {key: '/1111/tech/left-nav', floor: 1.50}
            ],
            default: 0.75
        }
    }
});
{% endhighlight %}

By defining floor data with setConfig, the Floors module will map GPT ad slots to AdUnits as needed. It does this in the same way as the setTargetingForGPTAsync() function -- first looking for an AdUnit.code that matches the slot name, then looking for an AdUnit.code that matches the div id of the named GPT slot.

Here's another example that includes more fields:

{% highlight js %}
pbjs.setConfig({
    floors: {
        data: {
            currency: 'USD',
            schema: {
                fields: [ 'gptSlot', 'mediaType' ]
            },
            values: [
                {key: '/1111/homepage/top-rect|banner', floor: 0.80},
                {key: '/1111/homepage/top-rect|video', floor: 1.20},
                {key: '/1111/homepage/left-nav|banner', floor: 0.90},
                ...
                {key: '/1111/tech/left-nav|banner', floor: 1.50}
            ],
            default: 0.75
        }
    }
});
{% endhighlight %}

### Dynamic Floors
The final method of obtaining floor data allows the publisher to delay the auction for a certain time period to obtain up-to-date floor data tailored to this specific pageview. The assumed workflow is:
 
1. The Publisher signs up with a floor data provider
1. The Publisher configures Prebid.js to resolve and enforce the price floor
1. The Floor provider makes a JSON file available with floor data

Here's an example defining a simple GET endpoint:
{% highlight js %}
pbjs.setConfig({
    floors: {
        auctionDelay: 100,   // in milliseconds
        endpoint: {
            url: 'https://floorprovider.com/a1001-mysite.json',
            method: 'GET'
        },
        data: {     // default if endpoint doesn't return in time
            currency: 'USD',
            schema: {
                fields: [ 'mediaType' ]
            },
            values: [
                {key: 'banner', floor: 0.80},
                {key: 'video', floor: 1.20}
            ]
        }
    }
});
{% endhighlight %}

If the dynamic data doesn't come back from the endpoint in time, the floors defined in the data object will be utilized.

### SetConfig Syntax

The examples above covered several different scenarios. Here are all the options supported by the Floors module.

{: .table .table-bordered .table-striped }
| Param | Required? | Type | Description | Default |
|---+---+---+---+---|
| auctionDelay | no | integer | number of milliseconds to delay the auction. Will always be 0 if there's no endpoint param. Must be > 0 if endpoint is defined. | 100 if the 'endpoint' param is defined. 0 otherwise.|
| endpoint | no | object | defines how PBJS should call out to a floor provider to obtain dynamic floor data | none |
| endpoint.url | no | string | URL of the endpoint | none |
| endpoint.method | no | string | Only GET is currently supported. | "GET" |
| data | object | yes | floor data that may be used by the module to send to bidders and enforce floors. Used as a fallback if a dynamic floor service doesn't respond within the auctionDelay period. | none |
| data.currency | no | floor data will expressed in a given currency, which will be converted as needed to pass to adapters or enforce. | 'USD' |
| data.schema | no | allows for flexible definition of how floor data is formatted. | none |
| data.schema.delimiter | no | which character separates the floor keys | '\|' |
| data.schema.fields | no | array of strings | supported values are: gptSlot, adUnitCode, mediaType, size | none |
| data.values | no | array of objects | a series of attributes representing a hash of floor data in a format defined by the schema object. | none |
| data.values.key | no | string | delimited field of attribute values that define a floor | none |
| data.values.floor | no | float | the floor value for this key | none |
| data.default | no | float | floor to use if there aren't any values or if none of them match | none |

## How it Works
There are several places where the Floor module changes the behavior of the Prebid.js auction process.

1. When building the Prebid.js package, the Floors module needs to be included with 'gulp build --modules=floors,...'
1. As soon as the setConfig({'floors'}) call is made, the Floors module will immediately initiate any calls to a dynamic floor endpoint.
1. When an auction is initiated with requestBids(), the Floors module will request to delay the auction if the auctionDelay option is set.
1. If it hasn't converted floor currencies already, the Floors module will look for the existence of a configured Ad Server Currency, converting floor prices as needed.
1. Bid Adapters are responsible for utilizing the getFloors() function and passing the floor values to their bidding endpoints.
1. Prebid.js core gives the Floors module a chance to review each bid response, which will be invalidated if they exceed the floor value.
1. Analytics adapters have access to the floor data and any invalidated bid statuses.

## Interfaces

### Floor Data Provider Interface

Dynamic endpoints must return JSON data that's formatted like the data object
in the floor `setConfig` call. Floor data should be returned quickly because
the auction may be waiting on it. This implies that it should either be
stored on a CDN or be provided by a distributed tier of high performance servers.

Example Response 1 - floor determined by GPT Ad Slot and mediatype
{% highlight js %}
{
    data: {
            currency: 'USD',
            schema: {
                fields: [ 'gptSlot', 'mediaType' ]
            },
            values: [
                {key: '/1111/homepage/top-rect|banner', floor: 0.80},
                {key: '/1111/homepage/top-rect|video', floor: 1.20},
                {key: '/1111/homepage/left-nav|banner', floor: 0.90},
                ...
                {key: '/1111/tech/left-nav|banner', floor: 1.50}
            ],
            default: 0.75
        }
}
{% endhighlight %}

Example Response 2 - floor determined by AdUnit code and size:
{% highlight js %}
{
    data: {
            currency: 'EUR',
            schema: {
                fields: [ 'adUnitCode', 'size' ]
            },
            values: [
                {key: 'div-1|300x250', floor: 0.80},
                {key: 'div-2|300x600', floor: 1.20},
                {key: 'div-2|300x250', floor: 0.90},
                ...
                {key: 'div-3|640x480', floor: 1.50}
            ],
            default: 0.75
        }
}
{% endhighlight %}

The format of the request for dynamic floor data has been left open -
each floor provider can determine the URL structure, working
with the publisher to integrate their service into the page.

### Prebid.js Bid Adapter Interface

Many Prebid.js bid adapters already allow the publisher to define a floor in
their bidder-specific params. This module establishes a new and more powerful
convention, but requires each adapter look for the floor data in the
appropriate place. Rather than forcing adapters to look in the AdUnit and
the global config and parse complicated floor data, we've thoughtfully
provided a utility function called 'getFloors()'. To use it:

1. import getFloor function
1. call getFloors() with the desired parameters
1. parse the results
1. pass floor value(s) to the bid endpoint

{% highlight js %}
getFloors(paramsObj);
{% endhighlight %}

{: .table .table-bordered .table-striped }
| Param | Required? | Type | Description | Default |
|---+---+---+---+---|
| bidRequest | yes | object | bidRequest object passed to buildRequests function | none |
| currency | no | string | preferred floor currency | adServerCurrency |
| mediaType | no | string | some adapters don't support all media types, so this constrains results to just the type needed by the current ad unit. e.g. 'banner' | none |
| supportMultipleSizes | no | boolean | supporting different floors per size isn't yet a common feature, but we default it to true. By supplying 'false' to this argument, a single floor value will be returned | true |

The JSON object returned by the function looks similar to the floors object in the adunit.

For example, a bidder adapter that can only handle one floor value could make this call:

{% highlight js %}
getFloors({
    bidRequest: bidRequestObj,
    currency: 'USD',
    mediaType: 'banner',
    supportMultipleSizes: false
});
{% endhighlight %}

The response in this case would quite easy to parse:

{% highlight js %}
{
    currency: 'USD',
    default: 1.80
}
{% endhighlight %}

But if the `mediaType` field isn't passed in the params object, the response would provide different floor values for each mediaType:

{% highlight js %}
{
    currency: 'USD',
    schema: {
        fields: [ 'mediaType' ]
    },
    data: [
        {key: 'banner', floor: 1.60},
        {key: 'video', floor: 1.80}
    ]
}
{% endhighlight %}

And adapters that support full floor flexibility could receive something they need to parse:

{% highlight js %}
{
    currency: 'USD',
    schema: {
        fields: [ 'mediaType', 'size' ]
    },
    data: [
        {key: 'banner|300x250', floor: 1.50},
        {key: 'banner|300x600', floor: 1.60},
        {key: 'video|300x250', floor: 1.80},
    ]
}
{% endhighlight %}

{: .alert.alert-info :}
Note that whenever the `getFloors` function combines multiple underlying floors
into one, it always chooses the highest floor in order to avoid any scenario
where a bid is later discarded due to more granular flooring rules. Yes,
this will affect bid density. 

### Prebid.js Analytics Adapter Interface

Analytics adapters may want to report on floor-related events:

- which floors were sent to the bidders on each AdUnit
- whether any bids were discarded because the bidder did not respect the floor

Like bid adapters, analytics adapters can call the 'getFloors()' utility
function with each bidrequest object to obtain the floor data. They can
check the status of the bid, which would be NO_BID_FLOOR if the bid was
discarded because it was below the floor.

### Prebid Server Interface

The Prebid Server Bid Adapter copies floor configuration to the OpenRTB2 protocol:

- It copies AdUnit-specific floor values directly to the relevant imp object
- It copies floors data coming from setConfig to ext.prebid.floors
- It does not copy any endpoint information -- it is assumed that if dynamic floor data is used, that transaction is being handled by Prebid.js and should not be done again on the server side.
- It always sets ext.prebid.options.enforcefloors to false because there's no way in OpenRTB to return no-bid status per-impression.

AdUnit-specific Floors in OpenRTB:

{% highlight js %}
{
    "cur": "USD",
    "imp": [{
        ...
       "ext": {
            "prebid": {
                "floors": {
                    "data": {
                        "currency": "USD",
                        "schema": {
                            "delimiter": "|",
                            "fields": [ "mediaType", "size" ]
                        },
                        "values": [
                            {"key": "banner|300x250", "floor": 0.90},
                            {"key": "banner|300x360", "floor": 1.07},
                            {"key": "banner|*", "floor": 0.56},
                        ]
                    }
                }
            }
        }
    }],
    "ext": {
        "prebid": {
            "options": {
                "enforcefloors": false,
            }
        }
    }
}
{% endhighlight %}

Floors defined in `setConfig` are placed in the top-level `ext` object:

{% highlight js %}
{
    "cur": "USD",
    "imp": [{
        ...
    }],
    "ext": {
        "prebid": {
            "options": {
                "enforcefloors": false,
            },
            "floors": {
                "data": {
                    "currency": "USD",
                    "schema": {
                        "delimiter": "|",
                        "fields": [ "mediaType", "size" ]
                    },
                    "values": [
                        {"key": "banner|300x250", "floor": 0.90},
                        {"key": "banner|300x360", "floor": 1.07},
                        {"key": "banner|*", "floor": 0.56},
                    ]
                }
            }
        }
    }
}
{% endhighlight %}

When called from Prebid.js, the convention is that Prebid Server will pass floors provided by Prebid.js to the adapters, but will not enforce floors.

A separate document will describe how Prebid Server handles floors for SDK and AMP.

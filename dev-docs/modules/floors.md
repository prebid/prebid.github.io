---
layout: page_v2
page_type: module
title: Module - Price Floors
description: Determine and enforce auction price floors
module_code : priceFloors
display_name : Price Floors
enable_download : true
sidebarType : 1
---

# Price Floors Module
{:.no_toc}

* TOC
{:toc}

## Overview

The Floors module provides an open source framework in Prebid for Publishers to configure Prebid price floors on their own or to work with a vendor who can provide floors.

A ‘floor’ is defined as the lowest CPM price a bid will need to meet for each Prebid auction. It’s a way for publishers to signal to bidders the price to beat, thereby protecting the value of their inventory.

The module provides several ways for Prebid floors to be defined, that are used by bidder adapters to read floors and enforced on bid responses in any supported currency. The floors utilized by the Prebid.js floors module are defined by one or more set of rules containing any or all of the following dimensions:


- AdUnit
- GPT Slot Name
- MediaType
- Ad Size
- Domain
- "custom dimensions"

{: .alert.alert-warning :}
When using GPT Slot name, the gpt library is required to load first. Failing to do so may yield unexpected results and could impact revenue performance.

The entire set of Prebid floors selected by the Floors Module for a given auction is called a “Rule Location”. A Rule Location can be any one of:
1. Within the AdUnit (AdUnit)
2. Within setConfig  (Package)
3. Retrieved from a real-time data service (Dynamic)


{: .alert.alert-info :}
Even though floors are defined with five pre-configured dimensions, it’s possible to extend the list of dimensions to attributes of the page, user, auction or other data by supplying a dimension matching function. For example, a publisher can provide a matching function that returns the device type to allow the price floor module to use device type as an attribute within a prebid floor rules file.


## How it Works
There are several places where the Floor module changes the behavior of the Prebid.js auction process. Below is a diagram describing the general flow of the Floors Module:

![Floors Module Flow](/assets/images/floors/floors_flow.png)

1. When building the Prebid.js package, the Floors module (and any analytics adapters) needs to be included with 'gulp build --modules=priceFloors,...'
2. As soon as the setConfig({floors}) call is initiated, the Floors Module will build an internal hash table for each auction derived from a Rule Location (one of Dynamic, setConfig or adUnit)
  - a. If an endpoint URL (a Dynamic Floor) is defined, the Floors Module will attempt to fetch floor data from the Floor Provider's endpoint. When requestBids is called, the Floors Module will delay the auction up to the supplied amount of time in floors.auctionDelay or as soon as the dynamic endpoint returns data, whichever is first.
3. Bid Adapters are responsible for utilizing the getFloors() from the bidRequest object for each ad slot media type, size combination. The Floors Module will perform currency conversion if the bid adapter requests floors in a different currency from the defined floor data currency.
4. Bid Adapters will pass the floor values to their bidding endpoints, to request bids, responding with any bids that meet or exceed the provided floor
5. Bid adapters will submit bids to back to Prebid core, where the Floors Module will perform enforcement on each bid
6. The Floors Module will mark all bids below the floor as bids rejected. Prebid core will submit all eligible bids to the publisher ad server
    - a. The Floors module emits floor event / bid data to Analytics adapters to allow Floor Providers a feedback loop on floor performance for model training


## Defining Floors

How price floors are used in the page will depend on how you’re obtaining the floors and how Prebid.js is integrated into the pages. For optimal revenue performance, we strongly recommend an automated flooring method compared to manual, sporadic updates.

### Floors Defined in the AdUnit

In this approach, the Publisher configures the floors directly into the Prebid.js AdUnits. This method can be used on simple pages or as part of a content management system that dynamically creates AdUnits.

Below are some basic principles of ad unit floor definitions:

- Ad unit defined rules only apply to the ad unit they are created in
- Setting a rule with a value that does not match the context of that given ad unit will never be used
- If multiple ad units have configured floor objects, the first ad unit’s schema would apply to all subsequent ad unit floor definitions
    - Values can differ between ad units


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
                 values: {
                     'banner|300x250': 1.10,
                     'banner|300x600': 1.35,
                     'video|300x250': 2.00
                 }
             },
             bids: [
                 ...
             ]
         }
     ];
{% endhighlight %}

{: .alert.alert-info :}
When defining floors at the adUnit level, the Floors Module requires the floors object to be defined in setConfig, even if the definition is an empty object as shown below: {% highlight js %}pbjs.setConfig({ floors: {} });{% endhighlight %}

Floor definitions are set in the “values” object containing one or more rules, where the rule is the criteria that needs to be met for that given ad unit, with an associated CPM floor. In the above example, the floors are enforced when the bid from a bidder matches the “mediaType” and “size” combination. Since many bid adapters are not able to ingest floors per size, a simpler setup can be:

{% highlight js %}
floors: {
           currency: 'USD',
           skipRate: 5,
           modelVersion: 'Sports Ad Unit Floors',
           schema: {
               fields: [ 'mediaType']
           },
           values: {
               'banner': 0.8,
               'video': 2.01
           }
       }
{% endhighlight %}

For more advanced publisher setups, values can accept a “\*” to denote a catch all when a bid comes back that the floors module does not have an exact match and for bid adapters who are not able to use a floor per size, the bid adapter will automatically receive the “\*” rule’s floor if available. Example setup can be:

{% highlight js %}
floors: {
   currency: 'USD',
   skipRate: 5,
   modelVersion: 'Sports Ad Unit Floors',
   schema: {
       fields: [ 'mediaType', 'size']
   },
   values: {
       'banner|300x250': 0.8,
       'banner|300x600': 1.8,
       'banner|728x90': 0.90,
       'banner|*': 1.00,
       'video|300x250': 2.01,
       'video|*': 2.01
   }
}
{% endhighlight %}

Alternatively, if there’s only one mediaType in the AdUnit and a single global floor, the syntax gets easier:

{% highlight js %}
...
 floors: {
     default: 1.00     // default currency is USD
 },
 ...
{% endhighlight %}

### Package-Level Floors

This approach is intended for scenarios where the Publisher or their Prebid managed service provider periodically appends updated floor data to the Prebid.js package. In this model, there could be more floor data present to cover AdUnits across many pages.

{% highlight js %}
pbjs.setConfig({
    floors: {
        enforcement: {
           floorDeals: false, //default to false
            bidAdjustment: true
        },
        data: {     // default if endpoint doesn't return in time
            currency: 'USD',
            skipRate: 5,
            modelVersion: 'some setconfig model version',
            schema: {
                fields: [ 'gptSlot', 'mediaType' ]
            },
            values: {
                '/1111/homepage/top-rect|banner': 0.80,
                '/1111/homepage/top-rect|video': 2.20,
                '/1111/homepage/top-rect|*': 1.50,
                '/1111/homepage/left-nav|banner': 1.20,
                '/1111/homepage/left-nav|video': 2.20,
                '/1111/homepage/left-nav|*': 1.50,
                ... there could be hundreds of these ...
                '*|banner': 0.98,
                '*|video': 1.74
            }
        }
    }
});
{% endhighlight %}

By defining floor data with setConfig, the Floors module will map GPT ad slots to AdUnits as needed. It does this in the same way as the setTargetingForGPTAsync() function – first looking for an AdUnit.code that matches the slot name, then looking for an AdUnit.code that matches the div id of the named GPT slot.

Here’s another example that includes more fields:

{% highlight js %}
pbjs.setConfig({
    floors: {
        data: {     // default if endpoint doesn't return in time
            currency: 'USD',
            skipRate: 5,
            modelVersion: 'some setconfig model version',
            schema: {
                fields: [ 'domain', 'gptSlot', 'mediaType', 'size']
            },
            values: {
                'www.plublisher.com|/1111/homepage/top-rect|banner|300x250': 0.80,
                'www.publisher.com|/1111/homepage/top-rect|video|300x250': 2.20,
                'www.plublisher.com|/1111/homepage/left-nav|banner|300x250': 1.77,
                'www.publisher.com|/1111/homepage/left-nav|video|300x250': 2.88
                ...
            }
        }
    }
});
{% endhighlight %}

### Dynamic Floors
The final method of obtaining floor data allows the publisher to delay the auction for a certain time period to obtain up-to-date floor data tailored to each page or auction context. The assumed workflow is:

1. The Publisher signs up with a floor data provider
2. The Publisher configures Prebid.js to resolve and enforce the price floor
3. The Floor provider makes a JSON file available with floor data

Here’s an example defining a simple GET endpoint:

{% highlight js %}
pbjs.setConfig({
    floors: {
        enforcement: {
           floorDeals: true, //default to false
        },
        auctionDelay: 100,   // in milliseconds
        endpoint: {
            url: 'https://floorprovider.com/a1001-mysite.json'
        }
    }
});
{% endhighlight %}

The floors module is flexible to handle floors set in multiple locations. Like in the below example a publisher can configure Dynamic floors in addition to Package floors (in setConfig). While the floors module is only able to use one set of rules (either Package, adUnit or Dynamic) defined as a Floor Location, setting floors in the Package will be utilized when the Dynamic floors fail to return data or another error condition occurs with the Dynamic fetch.

{% highlight js %}
pbjs.setConfig({
    floors: {
        enforcement: {
           floorDeals: false, //default to false
        },
        auctionDelay: 100,   // in milliseconds
        endpoint: {
            url: 'https://floorprovider.com/a1001-mysite.json'
        },
        data: {     // default if endpoint doesn't return in time
            floorProvider: 'floorProviderName',
            currency: 'USD',
             skipRate: 5,
            modelVersion: ‘new model 1.0’
            schema: {
                fields: [ 'mediaType' ]
            },
            values: {
                'banner': 0.80,
                'video': 1.20
            }
        }
    }
});
{% endhighlight %}


## Floors Syntax

The examples above covered several different scenarios where floors can be applied. Below we will cover the syntax and definition of the floors data schema. As of Prebid.js version 3.24, the Floors module supports a second data schema with the ability to add new schemas to future-proof the needs of additional design changes while keeping backwards compatibility.


### Schema 1

Schema 1 restricts floors providers or publishers to applying only one data group. To test more than one floor group, floor providers or publishers are required to reset the data set with new rules after each request bids.

{: .table .table-bordered .table-striped }
| Param | Type | Description | Default |
|---+---+---+---+---|
| floorMin | float | The mimimum CPM floor used by the Floors Module (as of 4.13). The Floors Module will take the greater of floorMin and the matched rule CPM when evaluating getFloor() and enforcing floors. | - |
| floorProvider | string | Optional atribute (as of prebid version 4.1) used to signal to the Floor Provider's Analytics adapter their floors are being applied. They can opt to log only floors that are applied when they are the provider. If floorProvider is supplied in both the top level of the floors object and within the data object, the data object's configuration shall prevail.| - |
| enforcement | object | Controls the enforcement behavior within the Floors Module.| - |
| skipRate | integer | skipRate is a random function whose input value is any integer 0 through 100 to determine when to skip all floor logic, where 0 is always use floor data and 100 is always skip floor data. The use case is for publishers or floor providers to learn bid behavior when floors are applied or skipped. Analytics adapters will  have access to model version (if defined) when skipped is true to signal the Floors Module is in floors mode. If skipRate is supplied in both the root level of the floors object and within the data object, the skipRate configuration within the data object shall prevail. | 0 |
| enforcement.enforceJS | boolean | If set to true, the floors module will provide floors to bid adapters for bid request matched rules and suppress any bids not exceeding a matching floor. If set to false, the prebid floors module will still provide floors for bid adapters, there will be no floor enforcement.| true |
| enforcement.enforcePBS | boolean | If set to true, the Prebid.js floors module will signal to Prebid Server to pass floors to it’s bid adapters and enforce floors. If set to false, the pbjs should still pass matched bid request floor data to PBS, however no enforcement will take place. | false |
| enforcement.floorDeals | boolean | Enforce floors for deal bid requests. | false |
| enforcement.bidAdjustment | boolean | If true, the Floors Module will use the bidAdjustment function to adjust the floor per bidder. If false (or no bidAdjustment function is provided), floors will not be adjusted. Note: Setting this parameter to false may have unexpected results, such as signaling a gross floor when expecting net or vice versa. | true |
| endpoint | object | Controls behavior for dynamically retrieving floors.  | - |
| endpoint.url | string | URL of endpoint to retrieve dynamic floor data.  | - |
| data | object (required) | Floor data used by the Floors Module to pass floor data to bidders and floor enforcement. | - |
| data.floorProvider | string | Optional atribute (as of prebid version 4.2) used to signal to the Floor Provider's Analytics adapter their floors are being applied. They can opt to log only floors that are applied when they are the provider. If floorProvider is supplied in both the top level of the floors object and within the data object, the data object's configuration shall prevail.| - |
| data.currency | string | Currency of floor data. Floor Module will convert currency where necessary. See Currency section for more details. | 'USD' |
| data.skipRate | integer | skipRate is a random function whose input value is any integer 0 through 100 to determine when to skip all floor logic, where 0 is always use floor data and 100 is always skip floor data. The use case is for publishers or floor providers to learn bid behavior when floors are applied or skipped. Analytics adapters will  have access to model version (if defined) when skipped is true to signal the Floors Module is in floors mode. If skipRate is supplied in both the root level of the floors object and within the data object, the skipRate configuration within the data object shall prevail. | 0 |
| data.floorsSchemaVersion | string | The Floors Module supports two versions of the data schema. Version 1 allows for only one model to be applied in a given data set, whereas Version 2 allows you to sample multiple models selected by supplied weights. If no schema version is provided, the Floors Module will assume version 1 for the sake of backwards compatiblity. For schema version 2 see the next section. | 1 |
| data.modelVersion | string | Used by floor providers to train on model version performance. The expectation is a floor provider’s analytics adapter will pass the model verson back for algorithm training. | - |
| data.modelTimestamp | int | Epoch timestamp associated with modelVersion. Can be used to track model creation of floor file for post auction analysis.| - |
| data.schema | object |allows for flexible definition of how floor data is formatted. | - |
| data.schema.delimiter | string | Character separating the floor keys. | '\|' |
| data.schema.fields | array of strings | Supported values are: gptSlot, adUnitCode, mediaType, size | - |
| data.values | key / values | A series of attributes representing a hash of floor data in a format defined by the schema object. | - |
| data.values."rule key" | string | Delimited field of attribute values that define a floor. | - |
| data.values."rule floor value" | float | The floor value for this key. | - |
| data.default | float | Floor used if no matching rules are found. | - |
| additionalSchemaFields | object | Object contain the lookup function to map custom schema.fields | - |
| additionalSchemaFields."custom key" | string | custom key name | - |
| additionalSchemaFields."key map function" | function | Function used to lookup the value for that particular custom key | - |



### Schema 2

Schema 2 allows floors providers to A / B one or more floor groups, determined at auction time.

The following principles apply to schema 2:
- The below attributes are required:
    - data.floorsSchemaVersion to be set to 2
    - A valid modelGroups object must be set
    - The field modelGroups.modelWeight is required for each model group
        - If one of the model weights is missing, no schema 2 floor will be set and the Floors Module will look in other locations for floor definitions
- If common attributes are set in both the modelGroups and root level of the data object, modelGroups attributes prevail
- The Schema 2 data model can only be applied in Package level (i.e. directly in setConfig) or Dynamic level
- Sampling weights are applied at the auction level. Each new auction the dice will be rolled
- If the data.modelGroups object and the data.values (schema 1 field) are set, the data.floorsSchemaVersion will dictate what schema version is applied


While some attributes are common in both schema versions, for completeness, all valid schema 2 attributes are provided:

{: .table .table-bordered .table-striped }
| Param | Type | Description | Default |
|---+---+---+---+---|
| floorMin | float | The mimimum CPM floor used by the Floors Module (as of 4.13). The Floors Module will take the greater of floorMin and the matched rule CPM when evaluating getFloor() and enforcing floors. | - |
| floorProvider | string | Optional atribute (as of prebid version 4.1) used to signal to the Floor Provider's Analytics adapter their floors are being applied. They can opt to log only floors that are applied when they are the provider. If floorProvider is supplied in both the top level of the floors object and within the data object, the data object's configuration shall prevail.| - |
| enforcement | object | Controls the enforcement behavior within the Floors Module.| - |
| skipRate | integer | skipRate is a random function whose input value is any integer 0 through 100 to determine when to skip all floor logic, where 0 is always use floor data and 100 is always skip floor data. The use case is for publishers or floor providers to learn bid behavior when floors are applied or skipped. Analytics adapters will  have access to model version (if defined) when skipped is true to signal the Floors Module is in floors mode. If skipRate is supplied in both the root level of the floors object and within the data object, the skipRate configuration within the data object shall prevail. | 0 |
| enforcement.enforceJS | boolean | If set to true, the floors module will provide floors to bid adapters for bid request matched rules and suppress any bids not exceeding a matching floor. If set to false, the prebid floors module will still provide floors for bid adapters, but there will be no floor enforcement.| true |
| enforcement.enforcePBS | boolean | If set to true, the Prebid.js floors module will signal to Prebid Server to pass floors to it’s bid adapters and enforce floors. If set to false, Prebid.js should still pass matched bid request floor data to Prebid Server, however no enforcement will take place. | false |
| enforcement.floorDeals | boolean | Enforce floors for deal bid requests. | false |
| enforcement.bidAdjustment | boolean | If true, the Floors Module will use the bidAdjustment function to adjust the floor per bidder. If false (or no bidAdjustment function is provided), floors will not be adjusted. Note: Setting this parameter to false may have unexpected results, such as signaling a gross floor when expecting net or vice versa. | true |
| endpoint | object | Controls behavior for dynamically retrieving floors.  | - |
| endpoint.url | string | URL of endpoint to retrieve dynamic floor data.  | - |
| data | object (required) | Floor data used by the Floors Module to pass floor data to bidders and floor enforcement. | - |
| data.floorProvider | string | Optional atribute (as of prebid version 4.2) used to signal to the Floor Provider's Analytics adapter their floors are being applied. They can opt to log only floors that are applied when they are the provider. If floorProvider is supplied in both the top level of the floors object and within the data object, the data object's configuration shall prevail.| - |
| data.currency | string | Currency of floor data. Floors Module will convert currency where necessary. See Currency section for more details. | 'USD' |
| data.skipRate | integer | skipRate is a random function whose input value is any integer 0 through 100 to determine when to skip all floor logic, where 0 is always use floor data and 100 is always skip floor data. The use case is for publishers or floor providers to learn bid behavior when floors are applied or skipped. Analytics adapters will  have access to model version (if defined) when skipped is true to signal the Floors Module is in floors mode. If skipRate is supplied in both the root level of the floors object and within the data object, the skipRate configuration within the data object shall prevail.| 0 |
| data.floorsSchemaVersion | string | The Floors Module supports two version of the data schema. Version 1 allows for only one model to be applied in a given data set, whereas Version 2 allows you to sample multiple models selected by supplied weights. If no schema version is provided, the Floors Module will assume version 1 for the sake of backwards compatiblity.| 1 |
| data.modelTimestamp | int | Epoch timestamp associated with modelVersion. Can be used to track model creation of floor file for post auction analysis.| - |
| data.modelGroups | array of objects | Array of model objects to be used for A/B sampling multiple models. This field is only used when data.floorsSchemaVersion = 2 | - |
| data.modelGroups[].currency | string | Currency of floor data. Floor Module will convert currency where necessary. See Currency section for more details. | 'USD' |
| data.modelGroups[].skipRate | integer | skipRate is a random function whose input value is any integer 0 through 100 to determine when to skip all floor logic, where 0 is always use floor data and 100 is always skip floor data. The use case is for publishers or floor providers to learn bid behavior when floors are applied or skipped. Analytics adapters will have access to model version (if defined) when skipped is true to signal the Floors Module is in floors mode. | 0 |
| data.modelGroups[].modelVersion | string | Used by floor providers to train on model version performance. The expectation is a floor provider’s analytics adapter will pass the model verson back for algorithm training. | - |
| data.modelGroups[].modelWeight | integer | Used by the Floors Module to determine when to apply the specific model. All weights will be normalized and appllied at runtime. Futher clarification will be provided in examples below. | - |
| data.schema | object | Allows for flexible definition of how floor data is formatted. | - |
| data.modelGroups[].schema.delimiter | string | Character separating the floor keys. | '\|' |
| data.modelGroups[].schema.fields | array of strings | Supported pre-defined values are: gptSlot, adUnitCode, mediaType, size | - |
| data.modelGroups[].values | key / values | A series of attributes representing a hash of floor data in a format defined by the schema object. | - |
| data.modelGroups[].values."rule key" | string | Delimited field of attribute values that define a floor. | - |
| data.modelGroups[].values."rule floor value" | float | The floor value for this key. | - |
| data.modelGroups[].default | float | Floor used if no matching rules are found. | - |
| additionalSchemaFields | object | Object contain the lookup function to map custom schema.fields | - |
| additionalSchemaFields."custom key" | string | custom key name | - |
| additionalSchemaFields."key map function" | function | Function used to lookup the value for that particular custom key | - |


*Example 1*
Model weights add up to 100 and are sampled at a 25%, 25%, 50% distribution. Additionally, each model group has diffirent schema fields:

{% highlight js %}
{
    "currency": "EU",
    "skipRate": 20,
    "floorsSchemaVersion":2,
    "modelGroups": [
        {
            "modelWeight":25,
            "modelVersion": "Model1",
            "schema": {
                "fields": [ "domain", "gptSlot", "mediaType", "size" ]
            },
            "values": {
                "www.publisher.com|/1111/homepage/top-banner|banner|728x90": 1.00,
                "www.publisher.com|/1111/homepage/top-rect|banner|300x250": 1.20,
                "www.publisher.com|/1111/homepage/top-rect|banner|300x600": 1.80,
                ...
                "www.domain.com|/1111/homepage/top-banner|banner|728x90": 2.11
                ...
                "www.publisher.com|*|*|*": 0.80,
            },
            "default": 0.75
        },
        {
            "modelWeight": 25,
            "modelVersion": "Model2",
            "schema": {
                "fields": [ "domain", "mediaType", "size" ]
            },
            "values": {
                "www.publisher.com|banner|728x90": 1.00,
                "www.publisher.com|banner|300x250": 1.20,
                "www.publisher.com|banner|300x600": 1.80,
                ...
                "www.domain.com|banner|728x90": 2.11
                ...
                "www.publisher.com|*|*|*": 0.80,
            },
            "default": 0.75
        },
        {
            "modelWeight": 50,
            "modelVersion": "Model3",
            "schema": {
                "fields": [ "gptSlot", "mediaType", "size" ]
            },
            "values": {
                "/1111/homepage/top-banner|banner|728x90": 1.00,
                "/1111/homepage/top-rect|banner|300x250": 1.20,
                "/1111/homepage/top-rect|banner|300x600": 1.80,
                ...
                "/1111/homepage/top-banner|banner|728x90": 2.11
                ...
                "*|banner|*": 0.80,
            },
            "default": 0.75
        }
    ]

}
{% endhighlight %}

*Example 2*
Model weights do not equal 100 and are normalized. Weights will be applied in the following method: Model weight / (sum of all weights)
model1 = 20  -> 20 / (20 + 50) = 29% of auctions model 1 will be applied
model2 = 50  -> 50 / (20 + 50) = 71% of auctions model 2 will be applied

Additionally skipRate is supplied at model group level where model1 will skip floors 20% of times when model1 is selected, whereas model2 will skip 50% of auctions when model2 is selected.

{% highlight js %}
{
    "currency": "EU",
    "floorsSchemaVersion":2,
    "modelGroups": [
        {
            "modelWeight":25,
            "skipRate": 20,
            "modelVersion": "Model1",
            "schema": {
                "fields": [ "domain", "gptSlot", "mediaType", "size" ]
            },
            "values": {
                "www.publisher.com|/1111/homepage/top-banner|banner|728x90": 1.00,
                "www.publisher.com|/1111/homepage/top-rect|banner|300x250": 1.20,
                "www.publisher.com|/1111/homepage/top-rect|banner|300x600": 1.80,
                ...
                "www.domain.com|/1111/homepage/top-banner|banner|728x90": 2.11
                ...
                "www.publisher.com|*|*|*": 0.80,
            },
            "default": 0.75
        },
        {
            "modelWeight": 50,
            "skipRate": 50,
            "modelVersion": "Model2",
            "schema": {
                "fields": [ "gptSlot", "mediaType", "size" ]
            },
            "values": {
                "/1111/homepage/top-banner|banner|728x90": 1.00,
                "/1111/homepage/top-rect|banner|300x250": 1.20,
                "/1111/homepage/top-rect|banner|300x600": 1.80,
                ...
                "/1111/homepage/top-banner|banner|728x90": 2.11
                ...
                "*|banner|*": 0.80,
            },
            "default": 0.75
        }
    ]

}
{% endhighlight %}

## Custom Schema Fields

Custom schema fields are fields the Floors Module does not support out of the box. To use a custom schema field, one needs to perform twp steps:

1. Create lookup function to give the Floors Module context of the value of custom fields for that given auction
1. Define, Set and Map Custom Schema Attributes

### Create Lookup Function

Create a function to allow the Floors Module to understand context of a given auction. In the below example, we must create a lookup function to give the Floors Module what deviceType this auction is. 

Here is an example lookup function:

{% highlight js %}

  function deviceTypes (bidRequest, bidResponse) {
      //while bidRequest and bidResponse are not required for this function, they are available for custom attribute mapping
      
      let deviceType = getDeviceTypeFromUserAgent(navigator.userAgent);

      if(deviceType = 'mobile')
          return 'mobile'
      else if (deviceType = 'tablet')
          return 'tablet'
      else if (deviceType = 'desktop')
          return 'desktop'
  }

{% endhighlight %}


### Define, Set and Map Custom Schema Attributes

After defining a lookup function for the given context of the auction, the custom schema field(s) need to be defined in the `floors.schema.fields` array. Once your custom field is defined you can assign rule values in `floors.data.values` derived from said field(s). The last step would be to supply the lookup function(s) that map from each custom field to a value of the context wthin that auction by using the `floors.additionalSchemaFields` attribute as seen below.

In the below example, `deviceType` is a custom field not currently supported by default in the Floors Module whose values are one of "mobile", "desktop" or "tablet".

{% highlight js %}

  pbjs.setConfig({
      floors: {
          enforcement: {
             floorDeals: false //default to false
          },
          floorMin: 0.05,
          data: {
              floorProvider : 'rubicon',
              skipRate : 0,
              currency: 'USD',
              schema: {
                  fields: ['mediaType', 'deviceType']
              },
              modelVersion : 'testAddtionalFields',
              values : {
                  'banner|mobile' : 0.10,
                  'banner|desktop' : .15,
                  'banner|tablet' : 0.16,
                  'banner|*' : 0.16,
                  '*|*' : 0.03
              }
          },
          additionalSchemaFields : {
              deviceType : deviceTypes // where deviceTypes is the function reference for your lookup function
          }
      }
  });

{% endhighlight %}




## Rule Handling

### Rule Location Priority

As defined in the overview, a Rule Location is where a particular rule is located, either defined in the Ad Unit, within setConfig or via a fetch from the browser (named Dynamic) for fresh rules. It may be possible (rather more than likely) that floor rules can be set in one or more locations for a given Prebid auction (i.e. on requestBids). At auction, the Floors Module will only ever use rules from one Rule Location, decided at run-time. Each auction will be assigned an immutable set of rules from one Rule Location, even if the rules change prior to auction complete.

The Floors Module will use the below prioritization scheme on determining which Rule Location is selected at run-time:

- Dynamic
- setConfig
- adUnit


### Rule Selection Process

The job of the Prebid floors module is to select a matching Prebid floor rule for enforcement \(when a bid adapter bids in the auction\) given the context of each Ad Unit. With the usage of “\*” values in rules definitions \(where “\*” applies when no specific value matches\) multiple Prebid floor rules can match for a given ad unit auction.

The Prebid Floors module algorithm will produce a list of every possible permutation for each ad unit auction based on the defined schema types. The best matching rule for each enforced bid request and getFloor is based on specificity of values \(meaning match an exact value\) weighted from left to right, where the specificity of a value in the left most column would match over a rule with it’s “\*” equivalent if “\*” is supplied.

Priority order behavior where “\_” is a specific value, and the “\*” is a catch all

Priority order for one column rule sets:  

 \_   
 \*   

Priority order for two column rule set:

 \_ \| \_  
 \_ \| \*  
 \* \|\_   
 \* \| \*   

Priority order for three column rule sets:

 \_ \| \_ \| \_  
 \_ \| \_ \| \*  
 \_ \| \* \| \_  
 \* \| \_ \| \_  
 \* \| \_ \| \*  
 \_ \| \* \| \*  
 \* \| \_ \| \*  
 \* \| \* \| \_  
 \* \| \* \| \*  



Below are some real example behaviors.

#### Example 1

Domain = www.website.com

Floor provider rule definition

{% highlight js %}
{
  "modelVersion": "Fancy Model",
  "currency": "USD",
  "schema": {
    "fields": [ "mediaType", "size", "domain"],
  },
  "values": {
    "banner|300x250|www.website.com": 1.01,
    "banner|300x250|*": 2.01,
    "banner|300x600|www.website.com": 3.01,
    "banner|300x600|*": 4.01,
    "banner|728x90|www.website.com": 5.01,
    "banner|728x90|*": 6.01,
    "banner|*|www.website.com": 7.01,
    "banner|*|*": 8.01,
    "*|300x250|www.website.com": 9.01,
    "*|300x250|*": 10.01,
    "*|300x600|www.website.com": 11.01,
    "*|300x600|*": 12.01,
    "*|728x90|www.website.com": 13.01,
    "*|728x90|*": 14.01,
    "*|*|www.website.com": 15.01,
    "*|*|*": 16.01
  },
  "default": 0.01
}
{% endhighlight %}

**Bidder A Bid**

mediaType = banner  
Size = 300x600  
Domain context = www.website.com  

The Price Floor Module produces an internal hash table of all possible permutations of “banner”, “300x600”, “www.website.com” and “\*” with the most specific hash values up top, weighting rules priority from left column specific values to right. Each left value will weigh more than the subsequent column’s specific values. The Floors Module attempt to find the matching rule by cycling through each below possible rule (from top to bottom) against the above rule provider data set.

{% highlight js %}
{
    "banner|300x600|www.website.com",     //Most specific possible rule match against floor provider rule set
    "banner|300x600|*",                               
    "banner|*|www.website.com",                
    "*|300x600|www.website.com”,               
    "banner|*|*",
    "*|300x600|*",               
    "*|300x600|*",
    "*|*|www.website.com",
    "*|*|*"                                                       
  }
{% endhighlight %}

Matching rule: "banner|300x600|www.website.com"  
Floor enforced: 3.01  


**Bidder B Bid**

mediaType = video  
Size = 640x480  
Domain context = www.website.com  

Price Floor internal possible permutations sorted by priority:
{% highlight js %}
{
    "video|640x480|www.website.com",       //Fails to match due to no video specific rule
    "video|640x480|*",                                  //Fails to match due to no video specific rule
    "video|*|www.website.com",                   //Fails match due to no video specific rule
    "*|640x480|www.website.com",              //Fails match due to no size 480 specific rule
    "video|*|*",                                              //Fails match due to no size video specific rule
    "*|640x480|*",                                         //Fails match due to no size 480 specific rule
    "*|*|www.website.com",                           //Matching rule
    "*|*|*"
  }
{% endhighlight %}

Matching rule: "\*|\*|www.website.com"  
Enforced Floor: 15.01


**Bidder C Bid**

mediaType = video  
Size = 300x250  
Domain context = www.website.com  

Price Floor internal possible permutations sorted by priority:
{% highlight js %}
{
    "video|300x250|www.website.com",       //Fails to match due to no video specific rule
    "video|300x250|*",                                  //Fails to match due to no video specific rule
    "video|*|www.website.com",                   //Fails to match due to no video specific rule
    "*|300x250|www.website.com",             //Matching rule
    "video|*|*",
    "*|300x250|*",
    "*|*|www.website.com",
    "*|*|*"
  }
{% endhighlight %}

Matching Rule "\*|300x250|www.website.com”  
Enforced floor: 10.01  

#### Example 2

Similar data set with slightly different rules and same bids from each bidder. Matching rules will differ from example 1.

Domain = www.website.com

Floor provider rule definition

{% highlight js %}
{
  "modelVersion": "Fancy Model",
  "currency": "USD",
  "schema": {
    "fields": [ "mediaType", "size", "domain"],
  },
  "values": {
    "banner|300x250|www.publisher.com": 1.01,
    "banner|300x250|*": 2.01,
    "banner|300x600|www.publisher.com": 3.01,
    "banner|300x600|*": 4.01,
    "banner|728x90|www.website.com": 5.01,
    "banner|728x90|*": 6.01,
    "banner|*|www.website.com": 7.01,
    "banner|*|*": 8.01,
    "video|*|*": 9.01,
    "*|300x250|www.website.com": 9.01,
    "*|300x250|*": 10.01,
    "*|300x600|www.website.com": 11.01,
    "*|300x600|*": 12.01,
    "*|728x90|www.website.com": 13.01,
    "*|728x90|*": 14.01,
    "*|*|www.website.com": 15.01,
    "*|*|*": 16.01
  },
  "defaultValue": 0.01
}
{% endhighlight %}

**Bidder A Bid**

mediaType = banner  
Size = 300x600  
Domain context = www.website.com  

{% highlight js %}

{
    "banner|300x600|www.website.com",   // Fails due to website.com does not match with banner and 300x600
    "banner|300x600|*",    //  Banner, 300x600 * matches first       
    "banner|*|www.website.com",                
    "*|300x600|www.website.com”,               
    "banner|*|*",
    "*|300x600|*",               
    "*|300x600|*",
    "*|*|www.website.com",
    "*|*|*"                                                       
  }

{% endhighlight %}

Matching rule: "banner|300x600|\*"  
Floor enforced: 4.01  

**Bidder B Bid**

mediaType = video  
Size = 640x480  
Domain context = www.website.com.

Price Floor internal possible permutations sorted by priority:

{% highlight js %}

{
    "video|640x480|www.website.com",    //Fails to match due to no video specific rule
    "video|640x480|*",        //Fails to match due to no video specific rule
    "video|*|www.website.com",      //Fails match due to no video specific rule
    "*|640x480|www.website.com",              //Fails match due to no size 480 specific rule
    "video|*|*",                                              //Matches existing rule
    "*|640x480|*",                                   
    "*|*|www.website.com",
    "*|*|*"
  }

{% endhighlight %}

Matching rule: "video\|\*\|\*"  
Enforced Floor: 9.01


**Bidder C Bid**

mediaType = video  
Size = 300x250  
Domain context = www.website.com  

Price Floor internal possible permutations sorted by priority:

{% highlight js %}
{
    "video|300x250|www.website.com",       //Fails to match due to no video specific rule
    "video|300x250|*",                                  //Fails to match due to no video specific rule
    "video|*|www.website.com",                   //Fails to match due to no video specific rule
    "*|300x250|www.website.com",             //Matching existing rule
    "video|*|*",
    "*|300x250|*",
    "*|*|www.website.com",
    "*|*|*"
  }
{% endhighlight %}

Matching Rule "\*|300x250|www.website.com”  
Enforced floor: 10.01  


## Interfaces

### Floor Data Provider Interface

Floor data providers can supply data to publishers either within the setConfig as part of a Prebid.js Package if the provider is also a host provider of the Prebid library, or via a real-time Dynamic fetch, prior to the auction.

Data providers can optionally build Analytics Adapters to ingest bid data within Prebid for algorithm learning and review floor performance. Please refer to the Analytics Interface section for more details.



{% capture warning_note %}
As a floor provider, your goal is to provide effective floors, with minimal page impact. If you are performing a Dynamic fetch to retrieve data prior to auctions, the following recommendations are advised to reduce page performance issues:  

- Return results to the page quickly. This implies data should be stored on a CDN or be provided by a distributed tier of high performance services  
- Work with publishers on setting appropriate auction delays to retrieve dynamic data  
- Implement client-side caching (such as max-age headers) whenever possible  
- Evaluate data freshness vs frequency of new fetches to the CDN to reduce unnecessary calls  
- Be aware of file sizes returned to the browser, implementing trimmiming algorithms for extremely large data sets  
{% endcapture %}
{% include /alerts/alert_important.html content=warning_note %}

For Dynamic fetches, the floors module will perform a GET request to the supplied endpoint, that must return valid JSON, formatted like the data object in the “setConfig” Package configuration.


On rule creation, we recommend supplying various rules with catch all \(“\*”\) values with associated floors. This is to accommodate bid adapters who cannot retrieving floors on a per size basis, as well as using various permutations of rules with “\*” values to match auctions that do not have an exact match on a specific rule. Please refer to the Rule Selection Process when determining floors as attribute order and number of “\*”s may have an impact on which rule is selected.

#### Example Dynamic fetch

{% highlight js %}

pbjs.setConfig({
    floors: {
        enforcement: {
           floorDeals: true
        },
        auctionDelay: 100,
        endpoint: {
            url: 'https://floorprovider.com/a1001-mysite.json'
        }
    }
});

{% endhighlight %}

#### Example Response 1

floor determined by AdUnit code and Media Type:

{% highlight js %}

{
    floorProvider: 'floorProviderName',
    currency: 'USD',
    skipRate: 5,
    modelVersion: ‘new model 1.0’
    schema: {
        fields: [ 'gptSlot', 'mediaType' ]
    },
    values: {
        '/1111/homepage/top-rect|banner': 0.80,
        '/1111/homepage/top-rect|video': 1.20,
        '/1111/homepage/left-nav|banner': 0.90,
        ...
        '/1111/tech/left-nav|banner': 1.50
    },
    default: 0.75
}

{% endhighlight %}

#### Example Response 2

floor determined by Domain, GPT Slot, Media Type and Size:

{% highlight js %}

{
    currency: 'EU',
    skipRate: 20,
    modelVersion: ‘High_skip_rate’
    schema: {
        fields: [ 'domain', 'gptSlot', 'mediaType', 'size' ]
    },
    values: {
        'www.publisher.com|/1111/homepage/top-banner|banner|728x90': 1.00,
        'www.publisher.com|/1111/homepage/top-rect|banner|300x250': 1.20,
        'www.publisher.com|/1111/homepage/top-rect|banner|300x600': 1.80,
        ...
        'www.domain.com|/1111/homepage/top-banner|banner|728x90': 2.11
        ...
        'www.publisher.com|*|*|*': 0.80,
    },
    default: 0.75
}

{% endhighlight %}


#### Example Response 3

Floors Schema version 2

{% highlight js %}

{
    "currency": "USD",
    "floorsSchemaVersion":2,
    "skipRate": 5,
    "modelGroups": [
        {
            "modelWeight":50,
            "modelVersion": "Model1",
            "schema": {
                "fields": [ "domain", "gptSlot", "mediaType", "size" ]
            },
            "values": {
                "www.publisher.com|/1111/homepage/top-banner|banner|728x90": 1.00,
                "www.publisher.com|/1111/homepage/top-rect|banner|300x250": 1.20,
                "www.publisher.com|/1111/homepage/top-rect|banner|300x600": 1.80,
                ...
                "www.domain.com|/1111/homepage/top-banner|banner|728x90": 2.11
                ...
                "www.publisher.com|*|*|*": 0.80,
            },
            "default": 0.15
        },
        {
            "modelWeight": 50,
            "modelVersion": "Model3",
            "schema": {
                "fields": [ "gptSlot", "mediaType", "size" ]
            },
            "values": {
                "/1111/homepage/top-banner|banner|728x90": 1.00,
                "/1111/homepage/top-rect|banner|300x250": 1.20,
                "/1111/homepage/top-rect|banner|300x600": 1.80,
                ...
                "/1111/homepage/top-banner|banner|728x90": 2.11
                ...
                "*|banner|*": 0.80,
            },
            "default": 0.05
        }
    ]

}

{% endhighlight %}


### Bid Adapter Interface

The Prebid Floors Module is capable of handling an arbitrarily large set of floor rules of any combination of supported dimensions. To reduce the need for each bid adapter to process each and every rule in the selected rule data set, an encapsulated function (getFloor) was created to allow bid adapters to query the Floors Module for a floor for each mediaType, size and currency the bid adapter needs.

If the price floors module is enabled for a given auction, the Floors Module will add to the bidRequest object the getFloor function. All bid adapters are recommended to call getFloor to retrieve a desired floor. The job of the getFloor function will be to return the floor CPM of a matched rule based on the rule selection process (written out above), using the getFloor inputs.

Intended changes for bid adapters:


1. Check for presence of getFloor within the bidRequest obect
1. If getFloors exists, call getFloor with desired parameters
1. Parse floor and currency response
1. Pass floor and / or currency to bid adapter endpoint

getFloor takes in a single object with the following params:

{% highlight js %}

  getFloor({
      currency: string,
      mediaType: string  //Required
      size : [ w, h] OR "*"
  });

{% endhighlight %}


{: .alert.alert-warning :}
Consider how floors will behave in multi-currency scenarios. A common pitfall is requesting floors without specifying currency, or specifying the wrong currency back to the bid adapter's platform. This may lead to bidders requesting one currency and bidding in an alternate currency.


{: .table .table-bordered .table-striped }
| Param | Type | Description | Default |
|---+---+---+---|
| bidRequest | object | bidRequest object passed to buildRequests function | none |
| mediaType | string | The media type within the current bidRequest context to receive a floor from the Floors Module. Floors Module will return best matching floor. Possible values are one of “banner”, “video”, “Native” or "\*" | "banner" |
| size | Size array or ‘\*’ (required) | The size within the current bidRequest context to receive a floor from the Floors Module. Defaults to ‘\*’Array of size [w, h] for a specific size. If your bid adapter cannot handle size specific floors, use ‘\*’ to retrieve catch all size floor if defined by the publisher or floor provider | "\*" |
| currency | String | The desired currency to return the floor in. Please refer to the currency section to understand how currency conversion is applied. If no currency is supplied, the floor module will assume USD. If the Floor Module cannot convert a floor to the supplied currency, bid adapters will be required to handle the supplied floor. | "USD" |

#### getFloor Response

{% highlight js %}

{
    currency: string,
    floor: float
}

{% endhighlight %}

Or empty object if a floor was not found for a given input

{% highlight js %}

{ }

{% endhighlight %}

#### Example getFloor scenarios

Example rules file used for getFloor

{% highlight js %}

  {
      "data": {
              "currency": "USD",
              "schema": {
                  "fields": [ "gptSlot", "mediaType", "size"]
              },
              "values": {
                  "/1111/homepage/top-rect|banner|300x250": 0.60,
                  "/1111/homepage/top-rect|banner|300x600": 1.78,
                  "/1111/homepage/top-rect|banner|*": 1.10,
                  "/1111/homepage/top-rect|video|480x600": 3.20,
                  "/1111/homepage/top-leaderboard|banner|728x90": 1.50
              },
              "default": 0.75
          }
  }

{% endhighlight %}

**Example getFloor 1**

getFloor for media type Banner for a bid request in the context of the gpt slot “/1111/homepage/top-rect” where the bid adapter does not support floors per size.

{% highlight js %}

  getFloor({
      currency: 'USD',
      mediatype: ‘banner’,
      Size: ‘*’
  });
{% endhighlight %}

**Response**

{% highlight js %}
{
    currency: 'USD',
    floor: 1.10
}
{% endhighlight %}

To aid in the accuracy of floor selection when using size ”\*” in getFloor, the Floors Module has built-in smart rule selection when an ad unit in the internal bidRequest to the bid adapters interface has one ad unit type and one size. In the above example, if the ad unit within the bidRequest object has an ad unit type of “banner” with only one size, say “300x250”, the Floors Module will intelligently select the rule with "banner\|300x250" in it, as opposed to the "banner\|\*" rule producing the following response:

{% highlight js %}
{
    currency: 'USD',
    floor: 0.60
}
{% endhighlight %}


**Example getFloor 2**

getFloor for media type Banner for a bid requests in the context of the gpt slot “/1111/homepage/top-rect” with size of 300x600 where bid adapter does support floors per size.

{% highlight js %}
getFloor({
    currency: 'USD',
    size: [300,600],
    mediatype: ‘banner’
});
{% endhighlight %}

**Response**

{% highlight js %}
{
    currency: 'USD',
    floor: 1.78
}
{% endhighlight %}

Here are some examples of how a bid adapter may wish to configure their adapter to handle getFloor function:

For a bid adapter who does not wish to handle making a request for each size in a given bid request they can leverage the \* attribute which is meant to be a skewed average for a floor.

{% highlight js %}
 if (typeof bidRequest.getFloor === 'function') {
      let floorInfo = bidRequest.getFloor({
        currency: 'USD',
        mediaType: 'banner',
        size: '*'
      });
      data['adapter_floor'] = floorInfo.currency === 'USD' ? floorInfo.floor : undefined;
    }
{% endhighlight %}

### Analytics Adapter Interface

Price Floors providers will most likely rely heavily on their associated (or their partner’s) prebid analytics adapter in order to make the most informed and optimal price floor rule sets. Because of this, the price floors module needs to relay important information about the flooring and decisions made in the lifecycle of an auction.

The price floors module will do this by leveraging the already existing implementation for prebid analytics adapters by exposing floorData information onto the bidRequest and bidResponse objects. Thus, when an analytics adapter hooks into these prebid events, it will be able to pick out the price floors data and pass it along to their servers.

**bidRequest**: Bid Requests objects are updated to contain some basic top level information which a floor provider may need:

{: .table .table-bordered .table-striped }
| bidRequest.floorData. | Type | Description | example |
|---+---+---+---+---|
| fetchStatus | String | Provides details on the status of a fetch for a JSON floors file when fetches are attempted. Valid values are: 'success' (when fetch returns an http 200 status), 'timeout' (when fetch results not returned before either auction delay or prebid timeout) or 'error' (any http status other than 200 or other error condition). To determine if fetch succeeds but returns invalid floors data, refer to the location field to infer invalid data if 'fetch' is not resultant value. | ‘success’ |
| floorMin | float | The mimimum CPM floor used by the Floors Module (as of 4.13). The Floors Module will take the greater of floorMin and the matched rule CPM when evaluating getFloor() and enforcing floors. | 0.10 |
| floorProvider | string | Optional atribute (as of prebid version 4.1) used to signal to the Floor Provider's Analytics adapter their floors are being applied. They can opt to log only floors that are applied when they are the provider. If floorProvider is supplied in both the top level of the floors object and within the data object, the data object's configuration shall prevail.| "rubicon" |
| location | String | Where the Floors Module derived the rule set. Values are one of 'adUnit', 'setConfig', 'fetch' or 'noData'. If the Floors Module code is invoked and no floors object is able to be found (either by error or other condition) the floorsModule will set  location to 'noData'. When on data is found, it is up to the analtyics adapter to decide what to log. All available values will be provided in teh bidRequest object. | ‘fetch’ |
| modelVersion | String | The name of the model| ‘floor-model-4.3’ |
| modelWeight | integer | The weight of the model selected (for schema 2 version only)| 50 |
| modelTimestamp | integer | Epoch timestamp associated with the modelVersion to be used for post auction analysis.| 1607126814 |
| skipRate | integer | skipRate will be populated when a skip rate is configured in the Prebid Floors Module, even if the skipRate is evaluated to false. Skip Rate is used to determine when to skip all floors logic.  | 15 |
| skipped | Boolean | Whether the skipRate resolved to be true or false| true |

**bidResponse**: When a bid response is being processed it is important for analytics adapters to know the decision which was made and the context of the rule selection. Here is the data which is attached to each bidResponse:

{: .table .table-bordered .table-striped }
| bidResponse.floorData. | Type | Description | example |
|---+---+---+---+---|
| cpmAfterAdjustments | number | The bidder response CPM after any applicable adjustments (currency and  / or bidCpmAdjustments) | 2.20 |
| enforcements | object | The input floor enforcements object. Keys are enforceJS, enforcePBS, floorDeald, bidAdjustment | { enforceJS: true, enforcePBS: false, floorDeals: false, bidAdjustment: true } |
| floorCurrency | string | Currency of the matched floor | ‘USD’ |
| floorRule | String | The matching rule for the given bidResponse | ‘div-1\|300x250\|\*’ |
| floorRuleValue | float | Rule floor selected. This is to differentiate between the floor bound to the selected rule and floorMin, where floorValue will be the selected floor between the two for enforcement. | 2.33 |
| floorValue | float | The value of the floor enforced. This will be the greater of floorMin and floorRuleValue.| 2.33 |
| matchedFields | object | Fields of the prebid auction used to match against the floorData.schema.fields. | { mediaType: ‘banner’, Size: ‘300x250, Domain: ‘www.prebid.org’, gptSlot: ‘/12345/prebid/sports’ } |

### Prebid Server Interface

Not supported in initial build. S2S config support will be coming in the subsequent release.


## Currency

The floors module will default the floor CPM currency  with any associated rule to USD if none is supplied in the data object of the floors configuration. For any non-USD currency support, a publisher is required to specify the desired currency. If you are working with a floor provider, please speak to them about supplying the desired currency for your integration.

{% capture warning_note %}
For publishers seeking to perform currency conversions within the floors module (for example if the floors data currency is not the same as a bid adapter’s supported currency), failure to include the currency module may result in unexpected behavior and / or may impact revenue performance.
{% endcapture %}
{% include /alerts/alert_warning.html content=warning_note %}

Currency conversion can occur in two areas of the Floor Module code:
- On the **getFloor** call when Bid Adapters request a floor
- On the **enforcement** side when each bidder submits a bidResponse


**getFloor**

The job of the getFloor method is to retrieve an appropriate floor for the requesting Bid Adapter, for a given auction context. If a Bid Adapter performs a getFloor call with a currency different than the currency of the floor data, the Floors Module will attempt to perform a currency conversion, utilizing the convertCurrency function in the global Prebid object.

If a currency conversion is successful in getFloor, the resulting floor will be returned to the requesting Bid Adapter. If the conversion failed, the Floors Module will return the original floor currency defined within the selected rule location data set.

Example Rule:
currency = ‘USD’,
‘banner|300x250’: 1.00

{% highlight js %}
getFloor({
  currency: ‘EUR’,
  mediaType: ‘banner’,
  size: [300, 250]
});
{% endhighlight %}

If successfully returned the requested currency:

{% highlight js %}
{
  floor: 0.85,
  currency: ‘EUR’
}
{% endhighlight %}

If unsuccessfully returned the requested currency:

{% highlight js %}
{
  floor:1.0,
  currency: ‘USD’
}
{% endhighlight %}

Currency conversion can fail for the following reasons:
- Currency module is not included in the prebid bundle.
- Currency module is included but not enabled
- Currency module is included and enabled but:
    - No default rates were set
    - Currency rates fetch failed
    - Data has not returned yet
- Bidder passes in a currency code which does not have a conversion rate
- Floors was set with a currency which does not have a conversion rate

**Enforcement**

Enforcement in the Floors module occurs when bidders respond (i.e. bid) with a bidResponse object into the Prebid auction. The Floors Module will read the bid submitted within each valid bidResponse and its associated currency, performing currency conversion where necessary.

There exist three locations where currencies can differ within enforcement:

- adServerCurrency: The currency the publisher set in their currency module setConfig call
- Price Floor Currency: Currency set in the price floors data object
- bidResponse Currency: The currency the bidder returned with their bidResponse back to Prebid

When a bid adapter submits a bid into the auction, the currency module will first determine if any conversion logic is necessary, afterwhich the bid is passed to the Floors Module. If currency conversion occurs at this stage, the bidResponse object will have the following attributes:

- Cpm: The adServerCurrency converted CPM currency
- Currency: The currency the adServerCurrency was set in
- originalCpm: The original CPM the bidder responded with
- originalCurrency: The original currency the bidder responded with

Below is a chart explaining the behavior of currency conversion, if necessary, within the Floors Module when comparing bid CPM to floor CPM for enforcement:

{: .table .table-bordered .table-striped }
| bid.currency | bid.originalCurrency | floor.currency | result |
|---+---+---+---+---|
| USD | USD | USD | Bid.cpm is compared to floor. If bid meets or exceeds the floor, bid.originalCpm is sent to the ad server. |
| USD | USD | EUR | Bid.cpm is converted to EUR then compared with floor. If bid meets or exceeds the floor, bid.originaCpm is sent to the ad server. |
| USD | EUR | EUR | bid.originalCpm is compared to floor. If bid meets or exceeds the floor, bid.Cpm is sent to the ad server. |
| USD | JPY | EUR | Bid.cpm is converted to EUR then compared with floor.  If bid meets or exceeds the floor, bid.Cpm is sent to the ad server. |
| EUR | USD | EUR | Bid.cpm is compared to floor. If bid meets or exceeds the floor, bid.Cpm is sent to the ad server. |
| USD | Undefined (currency module possibly not included) | USD | Bid.cpm is compared to floor.  If bid meets or exceeds the floor, bid.originalCpm is sent to the ad server. |
| USD | Undefined (currency module possibly not included) | EUR | Bid.cpm is converted to EUR then compared with floor. Bid.cpm is compared to floor.  If bid meets or exceeds the floor, bid.originalCpm is sent to the ad server. |

If the currency function is unable to derive the correct cpm in any of the scenarios above where a conversion is needed, then the associated bidResponse will just pass through into the auction as if a matching floor was not found.


## Floors Providers

{: .table  }
| Partner | Contact | About |
| <img src="/assets/images/partners/leader/Magnite_logo.png" style="height:50px;"> | [globalsupport@magnite.com](mailto:globalsupport@magnite.com) | Magnite data-science applied to dynamic floors 
| pubx.ai | [hello@pubx.ai](mailto:hello@pubx.ai) | AI-powered dynamic floor optimization |
| Assertive Yield | [assertiveyield.com](https://assertiveyield.com) | Holistic flooring covering Prebid, Amazon, GAM UPR, RTB and more |
| OpenX | Reach out to OpenX at [apollo@openx.com] | Dynamic floor optimization and more |

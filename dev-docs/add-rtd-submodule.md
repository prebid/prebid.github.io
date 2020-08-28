/--
layout: page_v2
title: How to Add a Prebid.js RTD submodule
description: How to Add a Prebid.js RTD submodule
sidebarType: 1
---

# How to Add a Real Time Data Submodule
{:.no_toc}

Sub-modules interact with the Real-Time Data (RTD) core module to
add data to bid requests or add targeting values for the primary ad server.


* TOC
{:toc }

## Overview
1. RTD module is a generic core module, allowing sub-modules to register and use it to modify bid request/response and set targeting data for the publisher’s ad server.
2. This is done using hooks (with optional auction delay) and events.
3. Publishers will decide which RTD sub-modules they want to use, and can set parameters like timeout, endpoints, etc.
4. Sub-module functions are invoked by the RTD core module.
5. As a rule, sub-modules should delay the auction as little as possible.

## Architecture

The RTD module using hooks and event listeners to genrate the flow for the data modificatios.
On each step it calls the submodules to retrive the data.
Here is the flow for how the RTD-core module interacts with its sub-modules:

![Prebid RTD Architecture Diagram](/assets/images/prebid-rtd-architecture.jpg){: .pb-xlg-img :}

The activities performed by the RTD-core module are on the left-hand side, while the functions
that can be provided by your RTD sub-module are on the right-hand side. Note that you don't need to implement all of the functions - you'll want to plan out your functionality and develop the appropriate functions.

## Creating a Sub-Module

Working with any Prebid project requires using Github. In general, we recommend the same basic workflow for any project:

1. Fork the appropriate Prebid repository (e.g. [Prebid.js](https://github.com/prebid/Prebid.js)).
2. Create a branch in your fork for your proposed code change. (e.g. feature/exRtdSProvider)
3. Build and test your feature/bug fix in the branch.
4. Open a [pull request](https://help.github.com/en/desktop/contributing-to-projects/creating-a-pull-request) to the appropriate repository's master branch with a good description of the feature/bug fix.
5. If there's something that needs to change on the prebid.org website, follow the above steps for the [website repo](https://github.com/prebid/prebid.github.io).

{: .alert.alert-warning :}
RTD sub-modules are subject to a number of specific technical rules. Please become familiar
with the [module rules](/dev-docs/module-rules.html) that apply globally and to Real Time Data modules in particular.

### Step 1: Add a markdown file describing the sub-module

Create a markdown file under `modules` with the name of the module suffixed with 'RtdProvider', e.g., `exRtdProvider.md`

Example markdown file:
{% highlight text %}
# Overview

Module Name: Ex Rtd Provider
Module Type: Rtd Provider
Maintainer: prebid@example.com

# Description

RTD provider for Example.com. Contact prebid@example.com for information.

{% endhighlight %}

### Step 2: Build the Module

Now create a javascript file under `modules` with the name of the module suffixed with 'RtdProvider', e.g., `exRtdProvider.js`

#### The Sub-Module object

In order to let RTD-core know where to find the functions in your sub-module, create an object called `submoduleObj` that contains key values:

{: .table .table-bordered .table-striped }
|  param name | type  | Scope | Description | Params |
| :------------ | :------------ | :------ | :------ | :------ |
| name  | string  | required | must match the name provided by the publisher in the on-page config | n/a |
|  init | function | required | defines the function that does any auction-level initialization required | config, gdpr, usp |
|  getTargtingData  | function | optional | defines a function that provides ad server targeting data to RTD-core | adUnitArray, onDoneCallback |
|  auctionInit | function | optional | defines a function that lets the sub-module inspect and/or update the auction | auctionDetails, config |
|  auctionEnd | function |optional | defines a function that lets the sub-module know when auction is done | auctionDetails, config |
| updateBidRequest | function |optional | defines a function that lets a sub-module inspect and/or update adunits before the auction | adUnitArray, config |
| updateBidResponse | function |optional | defines a function that lets a sub-module inspect and/or update bidresponses | bidResonse, config |

For example:
{% highlight text %}
export const subModuleObj = {
  name: 'ExampleRTDModule',
  init: init,
  addTargeting: sendDataToModule
};
{% endhighlight %}

#### Register the submodule 

Register submodule to RTD-core:

{% highlight text %}
submodule('realTimeData', subModuleObject);
{% endhighlight %}

#### The init() function
1. This function receives module configuration, GDPR consent, and USP consent as parameters.
2. If the function returns `false`, the submodule will be ignored.

See the [Building the Request](/dev-docs/bidder-adaptor.html#building-the-request) section of the Bid Adapter documentation for more details about GDPR and USP.

####  The addTargeting() function
1. RTD-core will call this function with an array of adUnits and a callback function as parameters
2. Your sub-module will respond with data that should be set as key values on the ad server targeting.
3. For empty data, call the callback function with an empty object.
4. The function should call the callback function with an object in the following structure:
{% highlight text %}
{
  "slotA":{
      "p":0.56,   // ad server targeting variable (e.g. p) for slotA is 0.56
  },
  "slotB":{
      "p":0.824,  // ad server targeting variable (e.g. p) for slotB is 0.824
  }
}
{% endhighlight %}

**Code Example**

{% highlight text %}
/** @type {RtdSubmodule} */
export const subModuleObj = {
  name: 'ExampleRTDModule',
  init: init,
  addTargeting: sendDataToModule
};

function init(params, gdprData, uspData) {
  // do init stuff
  if (initfailed) return false;
  return true;
}

function sendDataToModule(adUnits, callback) {
  let data = {};
  adUnits.forEach(unit => {
    data[unit.code] = {data: 'data'}
  });
  callback(data);
}

submodule('realTimeData', subModuleObj);
{% endhighlight %}

#### beforeInit
1. Use this function to take action to make sure data will be served as soon as possible (AJAX calls, pixels, etc..)
2. This function is **not** invoked by the RTD module, and should be invoked at the bottom of the submodule.

**Code Example**

Here is a code example with both mandatory and optional functions:
{% highlight text %}
/** @type {RtdSubmodule} */
export const subModuleObj = {
  name: 'ExampleRTDModule',
  init: init,
  addTargeting: sendDataToModule,
  auctionInit: onAuctionInit,
  auctionEnd: onAuctionEnd,
  updateBidRequest: onUpdateBidRequest,
  updateBidResponse: onUpdateBidResponse
};

function onAuctionInit(auctionDetails, config) {
 // inspect/update auction details
}

function onAuctionEnd(auctionDetails,config) {
  // take note of auction end
}

function onUpdateBidRequest(adUnitArray,config) {
  //optionally update adUnits
}

function onUpdateBidResponse(bidResponse,config) {
  //optionally update bidResponse
}

function init(params, gdprData, uspData) {
  // do init stuff
  if (initfailed) return false;
  return true;
}

function sendDataToModule(adUnits, callback) {
  let data = {};
  adUnits.forEach(unit => {
    data[unit.code] = {data: 'data'}
  });
  callback(data);
}

function beforeInit(){
  //take actions to get data as soon as possible
  submodule('realTimeData', subModuleObj);
}

beforeInit();
{% endhighlight %}

#### Using event listeners
1. The RTD-core module listens for 4 events - `auctionInit`, `auctionEnd`, `beforeRequestBids` and `bidResponse`.
2. Each time one of the events fires, RTD-core will invoke the corresponding function on each sub-module, allowing the sub-module to make changes to the event object.
3. To use this on your sub-module, define the required functions (`onAuctionInit` / `onAuctionEnd` / `updateBidRequest` / `updateBidResponse`).


### Step 3: Add unit tests

1. Create a JS file under `test/spec/modules` with the name of the bidder suffixed with 'RtdProvider_spec', e.g., `exRtdProvider_spec.js`

2. Write great unit tests. See the other `RtdProvider_spec.js` files for examples.

### Step 4: Submit the code

Once everything looks good, submit the code, tests, and markdown as a pull request to the [Prebid.js repo](https://github.com/prebid/Prebid.js).

### Step 5: Website pull request

1. Create a fork of the [website repo](https://github.com/prebid/prebid.github.io) and a branch for your new adapter. (e.g. feature/exRtdProvider)

2. Create a new file for your RTD sub-module in dev-docs/modules/ExampleRtdProvider.md. Take a look at the other *RtdProvider.md files in that directory for the important header values. Specifically it requires the following:

    ```
    ---
    layout: page_v2
    title: Example Module
    description: Useful statement for what this does
    page_type: module
    module_type: rtd
    module_code : example
    enable_download : true
    sidebarType : 1
    ---
    
    # Example Module
    
    [Useful publisher-facing documentation]
    ```
3. Submit the pull request to the prebid.github.io repo.

### Step 6: Wait for Prebid volunteers to review

We sometimes get pretty busy, so it can take a couple of weeks for the review process to complete, so while you're waiting, consider [joining Prebid.org](https://prebid.org/membership/) to help us out with code reviews. (!)

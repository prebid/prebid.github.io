---
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
|  init | function | required | defines the function that does any auction-level initialization required | config, userConsent |
|  getTargetingData  | function | optional | defines a function that provides ad server targeting data to RTD-core | adUnitArray, config, userConsent |
|  getBidRequestData  | function | optional | defines a function that provides ad server targeting data to RTD-core | reqBidsConfigObj, callback, config, userConsent  |
|  onAuctionInitEvent | function | optional | listens to the AUCTION_INIT event and calls a sub-module function that lets it inspect and/or update the auction | auctionDetails, config, userConsent |
|  onAuctionEndEvent | function |optional | listens to the AUCTION_END event and calls a sub-module function that lets it know when auction is done | auctionDetails, config, userConsent |
|  onBidResponseEvent | function |optional | listens to the BID_RESPONSE event and calls a sub-module function that lets it know when a bid response has been collected | bidResponse, config, userConsent |

For example:
{% highlight text %}
export const subModuleObj = {
  name: 'ExampleRTDModule',
  init: init,
  getTargetingData: sendDataToModule
};
{% endhighlight %}

#### Register the submodule 

Register submodule to RTD-core:

{% highlight text %}
submodule('realTimeData', subModuleObject);
{% endhighlight %}

#### User Consent

Several of the interfaces get a `userConsent` object. It's an object that carries these attributes:
- [gdpr](/dev-docs/modules/consentManagement.html#bidder-adapter-gdpr-integration) - GDPR
- [usp](/dev-docs/modules/consentManagementUsp.html#bidder-adapter-us-privacy-integration) - US Privacy (aka CCPA)
- [coppa](/dev-docs/publisher-api-reference.html#setConfig-coppa) - the Child Online Privacy Protection Act

These are provided so you can do the right thing with respect to regulations. The only privacy requirement imposed by the RTD-core is that sub-modules make make use of the StorageManager instead of attempting to access cookies or localstorage directly.

#### The init() function
1. This function receives module configuration and userConsent parameters
2. If the function returns `false`, the submodule will be ignored.

See the [Building the Request](/dev-docs/bidder-adaptor.html#building-the-request) section of the Bid Adapter documentation for more details about GDPR and USP.

#### getTargetingData

This is the function that will allow RTD sub-modules to merge ad server targeting data into the auction. It's called at the AUCTION_END event for each auction.

1. RTD-core will call this function with an array of adUnits, config, and userConsent as parameters
2. Your sub-module should respond with per-adslot data that should be set as key values on the ad server targeting in this format:
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
  getTargetingData: returnTargetingData
};

function init(config, userConsent) {
  // do init stuff
  if (initfailed) return false;
  return true;
}

function returnTargetingData(adUnits, config, userConsent) {
  // do stuff
  return data;
}

submodule('realTimeData', subModuleObj);
{% endhighlight %}

#### getBidRequestData

This is the function that will allow RTD sub-modules to modify the AdUnit object for each auction. It's called as part of the requestBids hook.

1. RTD-core will call this function with:
    - reqBidsConfigObj: the object that's passed to [`pbjs.requestBids`](). Note that several auctions can happen concurrently, so the sub-module must be ready to support this.
    - callback: lets RTD-core know which auction the sub-module is done with.
    - config: the sub-module's config params provided by the publisher
    - userConsent object (see above)
2. Your sub-module may update the reqBidsConfigObj and hit the callback.

**Code Example**

{% highlight text %}
/** @type {RtdSubmodule} */
export const subModuleObj = {
  name: 'ExampleRTDModule2',
  init: init,
  setBidRequestsData: alterBidRequests
};

function init(config, userConsent) {
  // do init stuff
  if (initfailed) return false;
  return true;
}

function alterBidRequests(reqBidsConfigObj, callback, config, userConsent) {
  // do stuff
  callback();
}

submodule('realTimeData', subModuleObj);
{% endhighlight %}

#### beforeInit
1. Use this function to take action to make sure data will be served as soon as possible (AJAX calls, pixels, etc..)
2. This function is **not** invoked by the RTD module, and should be invoked at the bottom of the submodule.

#### Using event listeners
1. The RTD-core module listens for 3 events - `AUCTION_INIT`, `AUCTION_END`, and `BID_RESPONSE`.
2. Each time one of the events fires, RTD-core will invoke the corresponding function on each sub-module, allowing the sub-module to make changes to the event object.
3. To use this on your sub-module, define the required functions as noted in the table above and the examples below.

**Code Example**

Here is a code example with both mandatory and optional functions:
{% highlight text %}
/** @type {RtdSubmodule} */
export const subModuleObj = {
  name: 'ExampleRTDModule3',
  init: init,
  onAuctionInitEvent: onAuctionInit,
  onAuctionEndEvent: onAuctionEnd,
  onBidResponseEvent: onBidResponse
};

function onAuctionInit(auctionDetails, config, userConsent) {
 // inspect/update auction details
}

function onAuctionEnd(auctionDetails, config, userConsent) {
  // take note of auction end
}

function onBidResponse(bidResponse, config, userConsent) {
  //optionally update bidResponse
}

function init(config, userConsent) {
  // do init stuff
  if (initfailed) return false;
  return true;
}

function beforeInit(){
  //take actions to get data as soon as possible
  submodule('realTimeData', subModuleObj);
}

beforeInit();
{% endhighlight %}


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

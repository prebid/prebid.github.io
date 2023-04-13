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
The point of the Real Time Data (RTD) infrastructure is to make configuration consistent for publishers. Rather than having dozens of different modules with disparate config approaches, being a Real-Time Data sub-module means plugging into a framework
for publishers to control how sub-modules behave. For example, publishers can define how long the auction can be delayed and give some
sub-modules priority over others.

The RTD infrastructure is a generic module, not useful by itself. Instead, it allows sub-modules to register and modify bid request/response and/or set targeting data for the publisher’s ad server.

Publishers will decide which RTD sub-modules they want to use, and can set parameters like timeout, endpoints, etc. They will set limits on how long sub-modules are allowed to delay the auction, which will most likely be in the tens of milliseconds.

See the [Publisher Real-Time Data Configuration](/dev-docs/publisher-api-reference/setConfig.html#setConfig-realTimeData) reference for more information.

Your module should not look at the values of the auctionDelay or waitForIt flags - just do what needs to be done as fast as possible. It's ok to *ask* publishers in your documentation
to give you a certain amount of time or to flag your module as important, but
it's not ok for the code to require it.

## Architecture

The RTD-core infrastructure uses hooks and event listeners to call the appropriate sub-modules to retrieve the data.
Here is the flow for how the RTD-core module interacts with its sub-modules:

![Prebid RTD Architecture Diagram](/assets/images/prebid-rtd-architecture.jpg){: .pb-xlg-img :}

The activities performed by the RTD-core module are on the left-hand side, while the functions
that can be provided by your RTD sub-module are on the right-hand side. Note that you don't need to implement all of the functions - you'll want to plan out your functionality and develop the appropriate functions.


## Creating a Sub-Module

When you create a Real-Time Data sub-module, you will be operating under the umbrella of the Real-Time Data core module. Here are the services core provides:
- your sub-module will be initialized as soon as pbjs.setConfig({realTimeData}) is called. If you can initialize at the time of code load, that can be done at the bottom of your javascript file.
- whenever any of your functions is called, it will be passed the config params provided by the publisher. As a result, you should not call getConfig().
- your functions will also be passed all available privacy information. As a result, you do not need to query to get GDPR, US Privacy, or any other consent parameters.

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
|  getBidRequestData  | function | optional | defines a function that provides bid request data to RTD-core | reqBidsConfigObj, callback, config, userConsent  |
|  onAuctionInitEvent | function | optional | listens to the AUCTION_INIT event and calls a sub-module function that lets it inspect and/or update the auction | auctionDetails, config, userConsent |
|  onAuctionEndEvent | function |optional | listens to the AUCTION_END event and calls a sub-module function that lets it know when auction is done | auctionDetails, config, userConsent |
|  onBidRequestEvent | function |optional | listens to the BID_REQUESTED event and calls a sub-module function that lets it know when a bid is about to be requested | bidRequest, config, userConsent |
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
- [coppa](/dev-docs/publisher-api-reference/setConfig.html#setConfig-coppa) - the Child Online Privacy Protection Act

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
    - reqBidsConfigObj: a slightly modified version of the object that's passed to `pbjs.requestBids` (see [below](#reqBidsConfigObj)). Note that several auctions can happen concurrently, so the sub-module must be ready to support this.
    - callback: lets RTD-core know which auction the sub-module is done with.
    - config: the sub-module's config params provided by the publisher
    - userConsent object (see above)
2. Your sub-module may update the reqBidsConfigObj and hit the callback. To inject data into the bid requests, you should follow one of these conventions:
    - Recommended: use one of these [First Party Data](/features/firstPartyData.html) conventions:
        - For AdUnit-specific first party data, set AdUnit.ortb2Imp.ext.data.ATTRIBUTES
        - For global first party data, including bidder-specific data, modify the `reqBidsConfigObj` as shown [below](#reqBidsConfigObj) 
    - Not recommended: Place your data in bidRequest.rtd.RTDPROVIDERCODE.ATTRIBUTES and then get individual adapters to specifically read that location. Note that this method won't pass data to Prebid Server adapters.

<a id="reqBidsConfigObj" />

The `reqBidsConfigObj` parameter is a copy of the object passed to [`requestBids`](/dev-docs/publisher-api-reference/requestBids.html), except for:

- `adUnits` and `timeout` are always defined (if the publisher didn't provide them, the default values are filled in - `pbjs.adUnits` and `getConfig('bidderTimeout')` respectively)
- `ortb2` is replaced with an `ortb2Fragments` object, intended to be inspected and / or modified by your module.

The `ortb2Fragments` parameter is an object containing two properties:

- `global`, an object containing global (not bidder-specific) first party data in the same OpenRTB format used by `setConfig({ortb2})`
- `bidder`, a map from bidder code to bidder-specific, OpenRTB-formatted first party data.

Your module may modify either or both with additional data. If adding bidder-specific data in `ortb2Fragments.bidder`, it should also support a parameter to allow the publisher to define which bidders are to receive the data.

{: .alert.alert-warning :}
Before version 7, the pattern for first party data inspection and enrichment by RTD modules was `getConfig({ortb2])` / `mergeConfig({ortb2})`. With the introduction of [auction-specific data](/features/firstPartyData.html#supplying-auction-specific-data) in 7, the global `getConfig('ortb2')` is "frozen"
at the time `requestBids` is called, and RTD submodules that wish to modify it are required to work on `ortb2Fragments` instead - as any additional call to `mergeConfig` will only take effect on the *next* auction.  

**Code Example**

{% highlight text %}
/** @type {RtdSubmodule} */
export const subModuleObj = {
  name: 'ExampleRTDModule2',
  init: init,
  getBidRequestData: alterBidRequests
};

function init(config, userConsent) {
  // do init stuff
  if (initfailed) return false;
  return true;
}

function alterBidRequests(reqBidsConfigObj, callback, config, userConsent) {
  // do stuff
  // put data in adUnits' ortb2Imp:
  reqBidsConfigObj.adUnits.forEach((adUnit) => mergeDeep(adUnit, 'ortb2Imp.ext', myCustomData);
  // or in global first party data:
  mergeDeep(reqBidsConfigObj.ortb2Fragments.global, myCustomData);
  // or in bidder-specific first party data:
  config.bidders.forEach((bidderCode) => mergeDeep(reqBidsConfigObj.ortb2Fragments.bidder, {[bidderCode]: myCustomData});
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
  onBidRequestEvent: onBidRequest,
  onBidResponseEvent: onBidResponse
};

function onAuctionInit(auctionDetails, config, userConsent) {
 // inspect/update auction details
}

function onAuctionEnd(auctionDetails, config, userConsent) {
  // take note of auction end
}

function onBidRequest(bidRequest, config, userConsent) {
  // optionally update bidRequest
}

function onBidResponse(bidResponse, config, userConsent) {
  // optionally update bidResponse
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
    display_name: Example
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

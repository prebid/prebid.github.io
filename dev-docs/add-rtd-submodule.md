---
layout: page_v2
title: How to Add a Prebid.js RTD submodule
description: How to Add a Prebid.js RTD submodule
sidebarType: 1
---

# How to Add a Real Time Data Submodule
{:.no_toc}

Sub-modules will interact with the Real-Time Data (RTD) core module in order to add any type of data to bidders and to the primary ad server.


* TOC
{:toc }

## Overview
1. RTD module is a generic core module, allowing sub-modules to register and use it to modify bid request/response and set targeting data for the publisher’s ad server.
2. This will be done using hooks (with optional auction delay) and events.
3. Sub-modules functions will be invoked by the RTD module, eliminating race conditions and data override issues.
4. As a rule, sub-modules should delay the auction as little as possible.

## Architecture

The RTD module using hooks and event listeners to genrate the flow for the data modificatios.
On each step it calls the submodules to retrive the data.
Here is the flow for the RTD module and submodules:

![Prebid RTD Architecture Diagram]({{ site.baseurl }}/assets/images/prebid-rtd-architecture.jpg){: .pb-md-img :}

## Creating a submodule

Working with any Prebid project requires using Github. In general, we recommend the same basic workflow for any project:

1. Fork the appropriate Prebid repository (e.g. [Prebid.js](https://github.com/prebid/Prebid.js)).
2. Create a branch in your fork for your proposed code change. (e.g. feature/exRtdSProvider)
3. Build and test your feature/bug fix in the branch.
4. Open a [pull request](https://help.github.com/en/desktop/contributing-to-projects/creating-a-pull-request) to the appropriate repository's master branch with a good description of the feature/bug fix.
5. If there's something that needs to change on the prebid.org website, follow the above steps for the [website repo](https://github.com/prebid/prebid.github.io).

{: .alert.alert-warning :}
Analytics adapters are subject to a number of specific technical rules. Please become familiar
with the [module rules](/dev-docs/module-rules.html) that apply globally and to real time data modules in particular.

### Step 1: Add a markdown file describing the module

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

### Step 2: Mandatory functions and parameters

#### Submodule object

Create an object with the following parameters:

{: .table .table-bordered .table-striped }
|  param name | type  |
| :------------ | :------------ |
| name  | string  |
|  getData  | function  |
|  init | function  |

#### Register submodule 

Register submodule to the real time data module:

{% highlight text %}
submodule('realTimeData', subModuleObject);
{% endhighlight %}


#### initialization function
1. The function receives module configuration, GDPR consent, and USP consent as parameters.
2. If the function returns `false`, the submodule will be ignored.



####  getData function
1. The function receives adUnits and callback function as parameters
2. This data will be set as key values on the primary ad server and bidders.
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

####  Code example

{% highlight text %}
/** @type {RtdSubmodule} */
export const submoduleObj = {
  name: 'Sוubmodule name',
  getData: sendDataToModule,
  init: init
};

function init(params, gdprData, uspData) {
  return gdprData.consentRequired;
}

function sendDataToModule(adUnits, callback) {
  let data = {};
  adUnits.forEach(unit => {
    data[unit.code] = {data: 'data'}
  });
  callback(data);
}

submodule('realTimeData', submoduleObj);
{% endhighlight %}

### Step 3: Optional functions

#### Using event listeners
1. RTD module listens to 4 events - `auctionInit`, `auctionEnd`, `beforeRequestBids` and `bidResponse`.
2. Each time one of the events fires, the RTD module will invoke its corresponding function on the sub-modules, allowing the sub-module to make changes to the event object.
3. To use this on your sub-module, define the required functions (`onAuctionInit` / `onAuctionEnd` / `updateBidRequest` / `updateBidResponse`).



#### beforeInit
1. Use this function to take action to make sure data will be served as soon as possible (AJAX calls, pixels, etc..)
2. This function is **not** invoked by the RTD module, and should be invoked within the submodule.

#### code example
here is a code example with both mandatory and optional functions:
{% highlight text %}
/** @type {RtdSubmodule} */
export const submoduleObj = {
  name: 'Sוubmodule name',
  getData: sendDataToModule,
  auctionInit: onAuctionInit,
  auctionEnd: onAuctionEnd,
  updateBidRequest: onUpdateBidRequest,
  updateBidResponse: onUpdateBidResponse,
  init: init
};

function onAuctionInit(obj, params) {
 //place code to run on auction init
}

function onAuctionEnd(obj,params) {
  //place code to run on auction end
}

function onUpdateBidRequest(obj,params) {
  //place code to run on beforeRequestBids
}

function onUpdateBidResponse(obj) {
  //place code to run on bidResponse
}

function init(params, gdprData, uspData) {
  return gdprData.consentRequired;
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
  submodule('realTimeData', submoduleObj);
}

beforeInit();
{% endhighlight %}



### Step 4: Add unit tests

1. Create a JS file under `test/spec/modules` with the name of the bidder suffixed with 'RtdProvider_spec', e.g., `exRtdProvider_spec.js`

2. Write great unit tests. See the other `RtdProvider_spec.js` files for examples.

### Step 5: Submit the code

Once everything looks good, submit the code, tests, and markdown as a pull request to the [Prebid.js repo](https://github.com/prebid/Prebid.js).

### Step 6: Website pull request

There are two files that need to be updated to list your new RTD provider.

1. Create a fork of the [website repo](https://github.com/prebid/prebid.github.io) and a branch for your new adapter. (e.g. feature/exRtdProvider)

*******not sure how we want to handle docs - do we want to have some category for it? *******

2. Update `overview/analytics.md` to add your adapter alphabetically into the list.

3. Update `download.md` to add your new adapter alphabetically into the li
st of other analytics adapters.

4. Submit the pull request to the prebid.github.io repo.

### Step 6: Wait for Prebid volunteers to review

We sometimes get pretty busy, so it can take a couple of weeks for the review process to complete, so while you're waiting, consider [joining Prebid.org](/partners/partners.html) to help us out with code reviews. (!)

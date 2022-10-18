---
layout: page_v2
title: How to Add a Prebid.js Video submodule
description: How to Add a Prebid.js Video submodule
sidebarType: 1
---

# How to Add a Video Submodule
{:.no_toc}

Video submodules interact with the Video Module to integrate Prebid with Video Players, allowing Prebid to automatically:
- render bids in the desired video player
- mark used bids as won
- trigger player and media events
- populate the oRTB Video Impression and Content params in the bid request

* TOC
  {:toc }

## Overview

The Prebid Video Module simplifies the way Prebid integrates with video players by acting as a single point of contact for everything video.
In order for the Video Module to connect to a video player, a submodule must be implemented. The submodule acts as a bridge between the Video Module and the video player.
The Video Module will route commands and tasks to the appropriate submodule instance.
A submodule is expected to work for a specific video player. i.e. the JW Player submodule is used to integrate Prebid with JW Player. The video.js submdule connects to video.js. 
Publishers who use players from different vendors on the same page can use multiple video submodules.

## Architecture

?

## Creating a Submodule
Working with any Prebid project requires using Github. In general, we recommend the same basic workflow for any project:

1. Fork the appropriate Prebid repository (e.g. [Prebid.js](https://github.com/prebid/Prebid.js)).
2. Create a branch in your fork for your proposed code change. (e.g. feature/exampleVideoProvider)
3. Build and test your feature/bug fix in the branch.
4. Open a [pull request](https://help.github.com/en/desktop/contributing-to-projects/creating-a-pull-request) to the appropriate repository's master branch with a good description of the feature/bug fix.
5. If there's something that needs to change on the prebid.org website, follow the above steps for the [website repo](https://github.com/prebid/prebid.github.io).


### Step 1: Add a markdown file describing the submodule

Create a markdown file under `modules` with the name of the module suffixed with 'VideoProvider', e.g., `exampleVideoProvider.md`

Example markdown file:
{% highlight text %}
# Overview

Module Name: Example Video Provider
Module Type: Video Provider
Video Player: Example player
Player website: example-player.com
Maintainer: someone@example.com

# Description

Video provider for Example Player. Contact someone@example.com for information.

{% endhighlight %}

### Step 2: Add a Vendor Code

Vendor codes are required to indicate which submodule type to instantiate. Add your vendor code constant to an export const in `vendorCodes.js` in Prebid.js under `libraries/video/constants/vendorCodes.js`.
i.e. in `vendorCodes.js`:
{% highlight text %}
export const EXAMPLE_PLAYER_VENDOR = 3;
{% endhighlight %}

### Step 2: Build the Module

Now create a javascript file under `modules` with the name of the module suffixed with 'VideoProvider', e.g., `exampleVideoProvider.js`

#### The Submodule factory

The Video Module will need a submodule instance for every player instance registered with Prebid. You will therefore need to implement a submodule factory which is called with a `videoProviderConfig` argument and returns a Video Provider instance.
Your submodule should import your vendor code constant and set it to a `vendorCode` property on your submodule factory.
Your submodule should also import 

**Code Example**

{% highlight text %}
function exampleSubmoduleFactory(videoProviderConfig) {
  const videoProvider = {
    // implementation
  };

  return videoProvider;
}

exampleSubmoduleFactory.vendorCode = EXAMPLE_VENDOR;
submodule('video', exampleSubmoduleFactory);
{% endhighlight %}

#### The Submodule object



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

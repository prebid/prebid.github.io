---
layout: page
title: Setting up prebid.js with Smart Ad Server
head_title: Setting up Prebid.js with Smart Ad Server
description: Setting up Prebid.js with Smart Ad Server
pid: 3
hide: false
top_nav_section: adops
nav_section: tutorials
---

<div class="bs-docs-section" markdown="1">
# Setting up prebid.js with Smart Ad Server
## Introduction
This article describes the basic steps to set up prebid.js with Smart Ad Server.

Comprehensive documentation is available in the article [Holistic+ Setup](https://support.smartadserver.com/s/article/Holistic-Setup) in Smart’s Help Center. This documentation may be more up to date than the explanations below.

For some of the setup steps described below, you need to have a login to [Smart’s UI](https://manage.smartadserver.com/). 

## How it works

 - you implement the prebid.js header bidding wrapper as well as Smart’s ad tags on your website
 - the header auction winner’s data (bidder name, CPM, currency) is passed with the ad call executed by Smart’s ad tag
 - in Smart’s UI, you simply set up an RTB+ insertion in order to establish the competition between the header auction winner and Smart’s connected monetization partners (DSPs);  there is no need to set up multiple line items, price buckets, keyword targeting etc.
 - at the same time, Smart’s holistic yield algorithm will make sure your direct (guaranteed) campaigns meet their targets
 - finally, the impression is either given to (1) Smart’s own RTB+ (bid higher than in header action) or (2) a direct campaign (if required to meet targets) or (3) the header auction winner (if Smart’s own RTB+ had no higher bid)

## Setup
### Step 1 - Implement the wrapper
Proceed as follows:
- go to the [prebid.js download page](http://prebid.org/download.html)
- select the relevant **Bidder Adapter(s)**, an **Analytics Adapter** (optional) and **Module(s)** (optional)
- download the code
- consult the [Bidders' Params](http://prebid.org/dev-docs/bidders.html) to get help for filling the parameters
- make sure you specify the timeout; the timeout is the maximum time to wait until the next step (the Smart ad call) is executed - even if some partners have not responded yet
- implement the prebid.js file on the site

This step is also documented [here](https://support.smartadserver.com/s/article/Holistic-Setup#implement-wrapper).
### Step 2 - Implement Smart’s tag
Smart’s OneCall tagging is strongly recommended. With OneCall, you can set header bidding data per `tagId`. The `tagId` is the Id of the container (`<div>`), where the ad will be displayed. The `tagId` format is `sas_<formatId>` (e. g.: `sas_1234`).

Make sure you use Smart’s **new OneCall tagging**, which uses POST requests with all the necessary information in the request body; simply check if you see the `formats` array in your tag. If you see `formatId`, you are still dealing with an old tag - in this case, get back to your service contact at Smart.

For samples of both the new and legacy Onecall as well as a full implementation example, read [here](https://support.smartadserver.com/s/article/Holistic-Setup#onecall). 

**Additional resources**:
- [Implementation with Smart’s Standard Call tagging](https://support.smartadserver.com/s/article/Holistic-Setup#implement-smart-tag)
- [Full tagging guide](https://support.smartadserver.com/s/article/Tagging-guide) 
### Step 3 - Setup in Smart’s UI
Things to keep in mind for the Setup in [Smart’s UI](https://manage.smartadserver.com/):
- in the RTB+ insertion, you must enable the checkbox "Activate Holistic yield mode" (in the "General settings" section of the insertion)
- RTB+ must be enabled and configured (global settings in the network)
- the Holistic+ feature must be enabled on the network
- you must use the official and Holistic RTB+ script templates in the insertions

For more details, read [here](https://support.smartadserver.com/s/article/Holistic-Setup#setup-ui).
### Step 4 - Get reporting
Read these articles to learn more about the available header bidding reporting:
- [Holistic Dashboard](https://support.smartadserver.com/s/article/Holistic-dashboard) - provides a fast and easy overview of basic metrics by delivery channel and RTB product
- [Big Data Reports](https://support.smartadserver.com/s/article/Holistic-Setup#bdr) - provides full, in-depth reporting with header bidding related dimensions and metrics
</div>

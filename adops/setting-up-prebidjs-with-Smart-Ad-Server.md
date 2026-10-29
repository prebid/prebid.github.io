---
layout: page_v2
title: Setting up Prebid.js with Smart Ad Server
head_title: Setting up Prebid.js with Smart Ad Server
description: Setting up Prebid.js with Smart Ad Server

sidebarType: 3
---


# Setting up Prebid.js with Smart Ad Server

## Introduction

This article describes the basic steps to set up Prebid.js with Smart Ad Server.

Comprehensive documentation is available in the article [Holistic+ Setup](https://help.equativ.com/monetize-with-partners/monetize-with-prebidjs-partners) in Smart AdServer’s Help Center. This documentation may be more up to date than the explanations below.

For some of the setup steps described below, you need to have a login to [Smart AdServer’s UI](https://manage.smartadserver.com/).

## How it works

- You implement the Prebid.js header bidding wrapper as well as Smart AdServer’s ad tags on your website.
- The header auction winner’s data (bidder name, CPM, currency) is passed with the ad call executed by Smart AdServer’s ad tag.
- In Smart AdServer’s UI, you simply set up an RTB+ insertion in order to establish the competition between the header auction winner and Smart AdServer’s connected monetization partners (DSPs);  there is no need to set up ultiple line items, price buckets, keyword targeting etc.
- At the same time, Smart AdServer’s holistic yield algorithm will make sure your direct (guaranteed) campaigns meet their targets.
- Finally, the impression is given to the highest bid: (1) Smart AdServer’s own RTB+ (2) a direct campaign or (3) the header auction winner.

## Setup

### Step 1 - Implement the wrapper

Proceed as follows:

- Go to the [Prebid.js download page](/download.html).
- Select the relevant **Bidder Adapter(s)**, an **Analytics Adapter** (optional) and **Module(s)** (optional).
- Download the code.
- Consult the [Bidders' Params]({{site.baseurl}}/dev-docs/bidders.html) to get help for filling the parameters.
- Make sure you specify the timeout; the timeout is the maximum time to wait until the Smart AdServer ad call is executed - even if some partners have not responded yet.
- Implement the Prebid.js file on the site.

This step is also documented [Smart AdServer setup documentation](https://help.equativ.com/monetize-with-partners/monetize-with-prebidjs-partners#step-1-implement-client-side-header-bidding-wrapper-3).

### Step 2 - Implement Smart AdServer’s tag

Smart AdServer’s OneCall tagging is strongly recommended. With OneCall, you can set header bidding data per `tagId`. The `tagId` is the Id of the container (`<div>`), where the ad will be displayed. The `tagId` format is `sas_<formatId>`. e.g. `sas_1234`.

Make sure you use Smart AdServer’s **new OneCall tagging**, which uses POST requests with all the necessary information in the request body; simply check if you see the `formats` array in your tag. If you see `formatId`, you are still dealing with an old tag - in this case, get back to your service contact at Smart AdServer.

For samples of both the new and legacy OneCall as well as a full implementation example, read [OneCall documentation](https://help.equativ.com/monetize-with-partners/monetize-with-prebidjs-partners#onecall-7).

**Additional resources**:

- [Implementation with Smart AdServer’s Standard Call tagging](https://help.equativ.com/monetize-with-partners/monetize-with-prebidjs-partners#standard-call-5)
- [Full tagging guide](https://help.equativ.com/supply-inventory-with-web-ad-tags/tagging-guide-get-started)

### Step 3 - Setup in Smart AdServer’s UI

Things to keep in mind for the Setup in [Smart AdServer’s UI](https://manage.smartadserver.com/):

- In the RTB+ insertion, you must enable the checkbox "Activate Holistic yield mode" in the "General settings" section of the insertion.
- RTB+ must be enabled and configured in the network global settings.
- The Holistic+ feature must be enabled on the network.
- You must use the official and Holistic RTB+ script templates in the insertions.

For more details, read [setup instructions](https://help.equativ.com/monetize-with-partners/monetize-with-prebidjs-partners#step-3-setup-in-emp-11).

### Step 4 - Get reporting

Read these articles to learn more about the available header bidding reporting:

- Big Data Reports - provides full, in-depth reporting with header bidding related dimensions and metrics.

---
layout: page_v2
title: Header Bidding Trafficking with Prebid Step by Step
head_title: Header Bidding Trafficking with Prebid Step by Step
description: Step-by-step instructions for setting up Header Bidding Trafficking in GAM for Prebid.
#note the sidebar type needs to reflect the section this file is displayed in. See _data/sidenav.yml for the side nav categories.
sidebarType: 3
---

# Header Bidding Trafficking with Prebid Step by Step
{: .no_toc }

- TOC
{: toc }

Publishers new to header bidding can use this guide to set up header bidding trafficking for Prebid in Google Ad Manager. Unlike a line item setup, header bidding trafficking provides publishers with precise bid prices to compete in the auction and no need for shell creatives. It also provides unified reporting, and a straightforward workflow. These instructions describe only the specific settings required for header bidding trafficking; they are not intended to be comprehensive instructions that replace or duplicate the GAM documentation.

- If you prefer to use line items to manage your header bidding setup, visit [Line item setup](/adops/step-by-step.html).
- For how to migrate from line items to header bidding trafficking, visit [Header bidding trafficking](https://support.google.com/admanager/answer/12273163) and the corresponding [FAQ](https://support.google.com/admanager/answer/12270263).  These instructions also describe how to run an experiment to show potential revenue uplift from migrating to header bidding trafficking from a line item setup. 

## Prerequisites

Before you begin, we recommend you read through our [Planning Guide](/adops/adops-planning-guide.html) to make sure you know what your configuration is going to look like and you’ve thoroughly documented your decisions.

## Requirements

To use header bidding trafficking, you must:

- Be on Google Ad Manager 360.
- Use a "[standard implementation](https://support.google.com/admanager/answer/12270263?sjid=14160336224257855972-NA#standard&zippy=%2Cwhats-a-standard-implementation-of-the-prebid-wrapper)" of Prebid.js.
- Use Google Publisher Tag (GPT) on your website.

Note: You don't have to set up any line items, including price priority line items, to use header bidding trafficking.

### Tagging
First, configure prebid to collect bids from your selected bidders and pass those bids onto Ad Manager. For details on tagging changes, visit [Getting Started for Developers](/dev-docs/getting-started.html). 

## Enable Header Bidding for you Ad Manager Network

1. Sign in to Google Ad Manager.
2. Click *Delivery*, then *Bidders*.
3. Click the *Header bidding* tab.
4. Click *Get started* to enable Prebid trafficking for the network, if it’s not already enabled.

![Get Started with Prebid](/assets/images/ad-ops/gam-hbt-sbs/hbt-start.png)

{:start="5"}
5. Review each detected bidder.

![Review Bidders](/assets/images/ad-ops/gam-hbt-sbs/hbt-bidders.png)

For each bidder, there are three configuration options:

- *Enable SafeFrame*: When enabled, ads returned by the bidder will render inside of a SafeFrame. Bidders may vary in their compatibility with SafeFrame.
- *Enable optimized Private Auction deals*: When enabled, bids that include a deal ID will enter the auction at the optimized Private Auction priority. If disabled, such bids will continue to work with any relevant line items in your network.
- *Allow ads on child-directed requests*: When enabled, the associated bidder’s ads may show on inventory that is classified in Ad Manager as child-directed.

{:start="6"}
6. Click *Continue*.
7. Select *Run Prebid on entire network*

![Run Prebid](/assets/images/ad-ops/gam-hbt-sbs/hbt-run-prebid.png)

{:start="8"}
8. Click *Finish*. Your Ad Manager UI should look like this, with your own bidders and specified configuration settings listed.

![Finished](/assets/images/ad-ops/gam-hbt-sbs/hbt-setup-finished.png)

## Header bidding reporting

Historical reporting in Ad Manager helps you understand how header bidding is performing.

- Use the Bidder dimension to see performance by exchange.
- Add the Demand Channel dimension to see whether buyers accessed your inventory through header bidding (the Demand Channel dimension has a value of “Header bidding”).

## Using protections with header bidding

To exclude the header bidders from the auction:

- Create an [inventory exclusion protection](https://support.google.com/admanager/answer/9376326).
- Select the header bidding demand source and appropriate targeting.

---
layout: page_v2
title: Professor Prebid
description: Professor Prebid User Guide
sidebarType: 8
---

# Professor Prebid User Guide

## Introduction

Professor Prebid is an open source Chrome extension to allow easy debugging and troubleshooting on publisher websites using Prebid.js.

## Installation

Simply visit the dedicated [Chrome Store link](https://chrome.google.com/webstore/detail/professor-prebid-v02/kdnllijdimhbledmfdbljampcdphcbdc) and click on `Add to Chrome`. Don't forget to pin it so you can have one-click access.

Alternatively, if you want to compile it yourself and run locally, please clone Github's [repository](https://github.com/prebid/professor-prebid) and follow the instructions.

## Usage

Professor Prebid will automatically detect if the page has one or more Prebid instances. It Prebid is found, the extension's icon will display a badge like: ![alt_text](/assets/images/tools/professor-prebid-icon.png)

Click on the icon to start interaction.

### Features

#### Adunits

This is the default view and allows you to quickly check all the adunit codes available to Prebid, along with the associated media types and bidders. 

![Professor Prebid AdUnits screen](/assets/images/tools/professor-prebid-2.png)


Each bidder entry is clickable, showing the associated input and bid response. You can easily copy a specific part of the JSON to the clipboard.

![AdUnits screen bidders detail](/assets/images/tools/professor-prebid-3.png)


Finally, you can also spot who is the winning bidder and whether its ad was rendered.
![AdUnits screen winning bidder](/assets/images/tools/professor-prebid-4.png)

#### Bids

This screen allows you to verify and compare all the bids placed via Prebid.js and their metadata including:

* Bid value
* Bid currency
* Response time
* Adserver Targeting keywords

![Professor Prebid bids screen](/assets/images/tools/professor-prebid-5.png)

#### Timeline

This view shows you the auction's main milestones:

* Auction start timestamp
* Bidders calling sequence and timestamp
* Each bidder response time
* Timeout threshold
* Auction end timestamp

![Professor Prebid timeline screen](/assets/images/tools/professor-prebid-6.png)

Professor Prebid renders different timeline views using the auction id as key. This can happen if the publisher has an auto-refresh or manages each adunit independently.

#### Config

You will find here the main modules and their configuration:

* Price Granularity: low/medium/high/auto/dense/custom
* Bidder settings: calling order, timeout, …
* Prebid Server: id, bidders, endpoints, …
* CMP: Support different compliance frameworks (TCF, CCPA...), encoded consent string, decoded consent string
* User ID modules

![Professor Prebid config screen](/assets/images/tools/professor-prebid-7.png)

#### User ID

This view displays the configuration and the outcome of the different id providers found on page.

![Professor Prebid user ID screen](/assets/images/tools/professor-prebid-8.png)

#### Tools

This tab provides advanced troubleshooting tools:

* Shortcut to GAM console
* Activation of Prebid Debug data on console
* Bid filtering: allowlist of bidders
* Bid CPM override
* Adunit overlay: shows details about the winner over the creative on page

![Professor Prebid tools screen](/assets/images/tools/professor-prebid-9.png)

Here's an example of an overlay:

![Overlay example](/assets/images/tools/professor-prebid-10.png)

## How can I submit a feature request ?

Please open an GitHub issue on [https://github.com/prebid/professor-prebid/issues](https://github.com/prebid/professor-prebid/issues).

## How can I report a bug ?

Please submit a GitHub issue on [https://github.com/prebid/professor-prebid/issues](https://github.com/prebid/professor-prebid/issues) providing as much details as possible:
* Steps to reproduce the issue
* Example of website where you face the issue
* Professor Prebid version

## Related Reading
- [Prebid.js troubleshooting guide](/troubleshooting/troubleshooting-guide.html)

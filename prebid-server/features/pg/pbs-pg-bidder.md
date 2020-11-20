---
layout: page_v2
sidebarType: 5
title: Prebid Server | Features | Programmatic Guaranteed | Adding a PG Bidder
---

# Prebid Server | Features | Programmatic Guaranteed | Adding a PG Bidder
{: .no_toc}

* TOC
{:toc}

## What is a PG Bidder?

The architecture of Prebid Programmatic Guaranteed (PG) is inherently multi-vendor. A `Host Company` runs a global distributed cluster of Prebid Servers. These servers handle all the 'real-time' requests. There are also a number of backend servers that manage the PG line items. One of them 
is called the `General Planner`. The General Planner can connect out to multiple sources of PG Line Items, and that's where you come in -- as a PG Bidder, you can contribute PG Line Items into the auction ecosystem for the publishers who utilize the Host Company's installation.
Here's a diagram from the [white paper](https://files.prebid.org/pg/Prebid_Programmatic_Guaranteed_White_Paper.pdf). This reference outlines the steps needed to build "PG Bidder 1" or "PG Bidder 2" in the diagram.

![PG High Level Framework](/assets/images/prebid-server/pg/pg-arch-2.png){: .pb-md-img :}

1. The PG Host Company runs clusters of Prebid Servers that receive requests from publishers.
2. Prebid Servers look up additional data for use in targeting.
3. The General Planner queries your PG Bidder endpoint and allocates your line items across the Prebid Server clusters.
4. The Delivery Stats Service is available for PG Bidders to obtain up-to-date reports on how line items are delivering.
5. The Dimension Value API should be used by bidders to create targeting values.
6. Each PG Bidder has it's own logic for pacing their line items in 1 or 5-minute increments called "plans".
7. The publisher or a service team enter the PG Line Items into the PG Bidder's user interface.

Notes:
- It's possible that you could deliver PG Line Items through more than one PG Host Company. Theoretically the same line item could 
- It will be your responsibility to manage the finances with each Publisher.
- It's possible that the Host Company may charge a fee to deliver PG Line Items through their infrastructure.

## What does it take to build a PG Bidder?

These are the high level steps for how to develop a PG Bidder and plug it into a Host Company's implementation.

1. Contact a PG Host Company to make sure they're ready to incorporate a new PG Bidder. They may have additional requirements.
1. Obtain access to the Host Company's Dimension Value API and Delivery Stats server. You will receive a "biddercode" similar to the codes used in Prebid.js. e.g. "pgExample".
1. Develop a User Interface for the customer to enter PG info: date range, targeting details, price, and pacing details. The targeting information comes from the Host Company's Dimension Value API.
1. Develop a pacing algorithm that uses data from the Host Company's Delivery Stats server and your own data stores.
1. Develop a report that uses data from the Host Company's Delivery Stats server and your own data stores.
1. Develop an external API that can respond to requests from the Host Company's General Planner for line item data.
1. Contact the Host Company to begin integration testing.

### Get targeting dimensions

The Host Company will give you access to their 'Dimension Value API' which will let you know what attributes and values their Prebid Servers can target at runtime for particular clients.
The values used will differ between Host Companies and publishers. For example, there may be different geographic and device info services. Publisher AdSlot and First Party Data fields will also vary.

Once granted authenticated access to the Dimension Value endpoint, you'll use the it to query it to get attribute names and values specific to the accounts you're working with. e.g.

- GET /dim-val/api/v2/attr/names?account=1001
- GET /dim-val/api/v2/attr/values?account=1001

There are various options for filtering data. See TBD-DimValueAPI(https://github.rp-core.com/ContainerTag/pg-dim-val-api/blob/master-rubicon/docs/server_endpoints.md) for more details.

Notes:
- In order to access client-specific targeting data, you'll need to know the account ID the Host Company uses for each publisher. You'll need to store a mapping of your internal account ID to the Host Company's internal account ID.

### Getting data from the Delivery Stats service

There are two reasons you'll want data from the Host Company's PG Delivery Stats Service:

1. Line Item reporting: you can get detailed info about where in the delivery funnel each Line Item is getting attention or running into problems. See TBD-Funnel-Stats to see which statistics you can expect.
1. Pacing algorithm: in order to write a robust and responsive pacing algorithm, you're going to need fresh data. If your bidder's impression data stream is real-time, that may be enough. If not, the Host Company's Delivery Stats server can provide recent (5-minute) summaries of important metrics like tokens spend and bidsWon. See the TBD-pacing-primer for more details.

Some example Delivery Stats queries:

- GET /del-stats-summ/api/v1/report/line-item-summary?startTime=YYYY-MM-DDT00:00:00.000Z -- this returns an hourly aggregration for all of your line items since the specified time.
- GET /del-stats-pa/api/v2/report/delivery?bidderCode=pgExample&startTime=YYYY-MM-DDT00:00:00.000Z -- this returns 5-minute aggregations for all of your line items since the specified time.

There are many other options for querying the data. See TBD-DelStats(https://github.rp-core.com/ContainerTag/pg-del-stats-svc/tree/master-rubicon/docs) for more details.

### Answering General Planner requests

When you're ready for integration with the Host Company, you'll provide them an authenticated secure endpoint that will answer requests from the Host Company's General Planner:

- /planner-adapter/api/v1/plans

At this point, your pacing algorithm needs to respond quickly with the most recently calculated set of line item pacing "plans". A plan is just a set
of instructions to Prebid Server saying "serve me X1 times from noon-12:05, X2 times from 12:05-12:10, ..."

See TBD https://github.rp-core.com/ContainerTag/pg-general-planner/blob/master-rubicon/docs/remote_endpoints.md for more details.

### General notes on writing a pacing algorithm

## Resources

- Prebid PG Intro Presentation: [recording](https://files.prebid.org/pg/PG_in_Prebid.mp4), [pdf](https://files.prebid.org/pg/PG_in_Prebid_Overview.pdf)
- [Prebid PG White Paper](https://files.prebid.org/pg/Prebid_Programmatic_Guaranteed_White_Paper.pdf)

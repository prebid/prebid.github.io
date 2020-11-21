---
layout: page_v2
sidebarType: 5
title: Adding a PG Bidder
---

# Adding a Programmatic Guaranteed Bidder
{: .no_toc}

* TOC
{:toc}

## What is a PG Bidder?

The architecture of Prebid Programmatic Guaranteed (PG) is inherently multi-vendor. A `Host Company` runs a global distributed cluster of Prebid Servers. These servers handle all the 'real-time' requests. There are also a number of backend servers that manage the PG line items. One of them 
is called the `General Planner`. The General Planner can connect out to multiple sources of PG Line Items, and that's where you come in -- as a PG Bidder, you can contribute PG Line Items into the auction ecosystem for the publishers who utilize the Host Company's installation.
Here's a diagram from the [white paper](https://files.prebid.org/pg/Prebid_Programmatic_Guaranteed_White_Paper.pdf). This reference outlines the steps needed to build "PG Bidder 1" or "PG Bidder 2" in the diagram.

![PG High Level Framework](/assets/images/prebid-server/pg/pg-arch-2.png){: .pb-lg-img :}

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

## What's Involved in building a PG Bidder?

These are the high level steps for how to develop a PG Bidder and plug it into a Host Company's implementation.

1. Contact a PG Host Company to make sure they're ready to incorporate a new PG Bidder. They may have additional requirements.
1. Obtain access to the Host Company's Dimension Value API and Delivery Stats server. You will receive a "biddercode" similar to the codes used in Prebid.js. e.g. "pgExample".
1. Develop a User Interface for the customer to enter PG info: date range, targeting details, price, and pacing details. The targeting information comes from the Host Company's Dimension Value API.
1. Develop a pacing algorithm that uses data from the Host Company's Delivery Stats server and your own data stores.
1. Develop a report that uses data from the Host Company's Delivery Stats server and your own data stores.
1. Develop an external API that can respond to requests from the Host Company's General Planner for line item data.
1. Contact the Host Company to begin integration testing.

### Obtain Targeting Dimensions

The Host Company will give you access to their 'Dimension Value API' which will let you know what attributes and values their Prebid Servers can target at runtime for particular clients.
The values used will differ between Host Companies and publishers. For example, there may be different geographic and device info services. Publisher AdSlot and First Party Data fields will also vary.

Once granted authenticated access to the Dimension Value endpoint, you'll use the it to query it to get attribute names and values specific to the accounts you're working with. e.g.

- GET /dim-val/api/v2/attr/names?account=1001
- GET /dim-val/api/v2/attr/values?account=1001

There are various options for filtering data. See the [Dimension Value API documentation](https://github.rp-core.com/ContainerTag/pg-dim-val-api/blob/master-rubicon/docs/server_endpoints.md) for more details.

{: .alert.alert-info :}
In order to access client-specific targeting data, you'll need to know the account ID the Host Company uses for each publisher.

### Getting data from the Delivery Stats Service

There are two reasons you'll want data from the Host Company's PG Delivery Stats Service:

1. **Line Item reporting**: you can get detailed info about where in the delivery funnel each Line Item is getting attention or running into problems. See TBD-Funnel-Stats to see which statistics you can expect.
1. **Inform the pacing algorithm**: in order to write a robust and responsive pacing algorithm, you're going to need fresh data. If your bidder's impression data stream is real-time, that may be enough. If not, the Host Company's Delivery Stats server can provide recent (5-minute) summaries of important metrics like tokens spend and bidsWon. See the TBD-pacing-primer for more details.

Some example Delivery Stats queries:

- GET /del-stats-summ/api/v1/report/line-item-summary?startTime=YYYY-MM-DDT00:00:00.000Z -- this returns an hourly aggregration for all of your line items since the specified time. See the [Line Item Summary Report endpoint documentation](https://github.rp-core.com/ContainerTag/pg-del-stats-svc/blob/master-rubicon/docs/line_item_summary_endpoint.md) for more info.
- GET /del-stats-pa/api/v2/report/delivery?bidderCode=pgExample&startTime=YYYY-MM-DDT00:00:00.000Z -- this returns 5-minute aggregations for all of your line items since the specified time. See the [Delivery Report endpoint documentation](https://github.rp-core.com/ContainerTag/pg-del-stats-svc/blob/master-rubicon/docs/delivery_report_endpoints.md)


### Answering General Planner Requests

When you're ready for integration with the Host Company, you'll provide an authenticated secure endpoint that will answer requests from the Host Company's General Planner.
The path of this endpoint can be anything you'd like. You may receive these query string parameters:

{: .table .table-bordered .table-striped }
| Parameter | Format | Required? | Description |
| --- | --- | --- | --- |
| since | string | no |  Timestamp in ISO-8601 format. For example, 2019-02-01T03:00:00.000Z. Service should respond with all meta data for active or nearly-active line items and schedules that got updated since this timestamp. Absence of this parameter signals request to return all active or nearly-active line items. |
| hours | string | no |  Number of hours of plans desired i.e. provide the next 3 hours worth of plans |

Here's an [example JSON response](https://github.rp-core.com/ContainerTag/pg-general-planner/blob/master-rubicon/docs/samples/pa_rsp.json) that might come from your bidder planner.

At this point, your endpoint needs to respond quickly with the most recently calculated set of line item pacing "plans". A plan is a set
of instructions to Prebid Server that tells the system how often to serve
a line item in a given period. e.g. "serve LineA 50 times from noon-12:05, 55 times from 12:05-12:10, ..."

The General Planner will be configured to call your endpoint every 1-10 minutes depending on the Host Company.

See [PG Plan Definition](/prebid-server/features/pg/pbs-pg-plan.html) for more details on what should be returned.

### General notes on writing a pacing algorithm

At a high level, pacing a line item can be simple:

```
NumberOfImpressionsEachHour=TotalImpressionsRemaining / NumberOfHoursRemaining
```

How it works at a Prebid Server level

## Related Topics

- [PG Home Page](/prebid-server/features/pg/pbs-pg-idx.html)
- [PG Plan Definition](/prebid-server/features/pg/pbs-pg-plan.html)

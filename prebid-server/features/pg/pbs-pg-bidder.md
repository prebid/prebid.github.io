---
layout: page_v2
sidebarType: 5
title: Building a PG Bidder
---

# Building a Programmatic Guaranteed Bidder
{: .no_toc}

* TOC
{:toc}

## What is a PG Bidder?

The architecture of Prebid Programmatic Guaranteed (PG) is inherently multi-vendor. A PG `Host Company` runs a global distributed cluster of Prebid Servers. These servers handle the 'real-time' requests... those that need to have millisecond response times. They also run a couple of backend servers that help manage the PG line items. One of them 
is called the `General Planner`. The General Planner can connect out to multiple sources of PG Line Items, and that's where you come in -- as a PG Bidder, you can contribute PG Line Items into the auction ecosystem for the publishers who utilize the Host Company's installation.
Here's a diagram from the [white paper](https://files.prebid.org/pg/Prebid_Programmatic_Guaranteed_White_Paper.pdf).

![PG High Level Framework](/assets/images/prebid-server/pg/pg-arch-2.png){: .pb-lg-img :}

1. The PG Host Company runs clusters of Prebid Servers that receive requests from publishers.
2. Prebid Servers look up additional data for use in targeting.
3. The General Planner queries your PG Bidder endpoint and allocates your line items across the Prebid Server clusters.
4. The `Delivery Stats Service` is available for PG Bidders to obtain up-to-date reports on how line items are delivering.
5. The `Dimension Value API` should be used by bidders to create targeting values.
6. Each PG Bidder has it's own logic for pacing their line items in 1 or 5-minute increments called "plans".
7. The publisher or a service team enter the PG Line Items into the PG Bidder's user interface.

Notes:
- It's possible that you could deliver PG Line Items through more than one PG Host Company.
- It it the responsibility of the PG Bidder to manage their own finance arrangements with each Publisher.
- It's possible that the Host Company may charge a fee to deliver PG Line Items through their infrastructure.

## What's involved in building a PG Bidder?

These are the high level steps for how to develop a PG Bidder and plug it into a Host Company's implementation.

1. Contact a PG Host Company to make sure they're ready to incorporate a new PG Bidder. They may have additional requirements.
1. Obtain access to the Host Company's Dimension Value API and Delivery Stats server. You will receive a "biddercode" similar to the codes used in Prebid.js. e.g. "pgExample".
1. Develop a User Interface for the customer to enter PG info: date range, targeting details, price, and pacing details. The targeting information comes from the Host Company's Dimension Value API.
1. Develop a pacing algorithm that uses data from the Host Company's Delivery Stats server and your own data stores.
1. Develop a report that uses data from the Host Company's Delivery Stats server and your own data stores.
1. Develop an external API that can respond to requests from the Host Company's General Planner for line item data.
1. Develop a method for estimating inventory forecast and availability. The Host Company may have data available.
1. Contact the Host Company to begin integration testing.

### Obtain targeting dimensions

The Host Company will give PG Bidders access to their Dimension Value API which will let them know what attributes and values their Prebid Servers can target at runtime for particular clients.
The values used will differ between Host Companies and publishers. For example, there may be different geographic and device info services. Publisher AdSlot and First Party Data fields will also vary.

Once granted authenticated access to the Dimension Value endpoint, you'll use the it to query it to get attribute names and values specific to the accounts you're working with. e.g.

- GET /dim-val/api/v2/attr/names?account=1001
- GET /dim-val/api/v2/attr/values?account=1001

There are various options for filtering data. See the [Dimension Value API documentation](https://github.com/prebid/pg-dim-val-api/blob/main/docs/server_endpoints.md) for more details.

{: .alert.alert-info :}
In order to access client-specific targeting data, you'll need to know the account ID the Host Company uses for each publisher.

See [PG Targeting Syntax](/prebid-server/features/pg/pbs-pg-targeting.html) for a list of targeting attributes you may be able
to get from the PG Host Company and how to format them as part of the [PG Plan](/prebid-server/features/pg/pbs-pg-plan.html).

### Getting data from the Delivery Stats Service

There are two reasons PG Bidders need data from the Host Company's PG Delivery Stats Service:

1. **Line Item reporting**: detailed info is available about where in the delivery funnel each Line Item is getting attention or running into problems. See the [PG Glossary](/prebid-server/features/pg/pbs-pg-glossary.html#metrics) for which statistics you can expect.
1. **Inform the pacing algorithm**: in order to write a robust and responsive pacing algorithm, the PG Bidder is going to need fresh data. If the bidder's impression data stream is real-time, that may be enough. If not, the Host Company's Delivery Stats server can provide recent (5-minute) summaries of important metrics like tokens spend and bidsWon. See [PG Plans](/prebid-server/features/pg/pbs-pg-plan.html) for more details.

Some example Delivery Stats queries:

- GET /del-stats-summ/api/v1/report/line-item-summary?startTime=YYYY-MM-DDT00:00:00.000Z -- this returns an hourly aggregration for all of your line items since the specified time. See the [Line Item Summary Report endpoint documentation](https://github.com/prebid/pg-del-stats/blob/main/docs/line_item_summary_endpoint.md) for more info.
- GET /del-stats-pa/api/v2/report/delivery?bidderCode=pgExample&startTime=YYYY-MM-DDT00:00:00.000Z -- this returns 5-minute aggregations for all of your line items since the specified time. See the [Delivery Report endpoint documentation](https://github.com/prebid/pg-del-stats/blob/main/docs/delivery_report_endpoints.md)


### Answering General Planner requests

When the PG Bidder is ready for integration with the Host Company, they'll provide an authenticated secure endpoint that will answer requests from the Host Company's General Planner.
The path of this endpoint can be anything you'd like. It will receive these query string parameters:

{: .table .table-bordered .table-striped }
| Parameter | Format | Required? | Description |
| --- | --- | --- | --- |
| since | string | no |  Timestamp in ISO-8601 format. For example, 2019-02-01T03:00:00.000Z. Service should respond with all meta data for active or nearly-active line items and schedules that got updated since this timestamp. Absence of this parameter signals request to return all active or nearly-active line items. |
| hours | string | no |  Number of hours of plans desired i.e. provide the next 3 hours worth of plans |

Here's an [example JSON response](https://github.com/prebid/pg-general-planner/blob/main/docs/samples/pa_rsp.json) that might come from your bidder planner.

At this point, your endpoint needs to respond quickly with the most recently calculated set of PG line item pacing plans. A `plan` is a set
of instructions to Prebid Server that tells the system how often to serve
a line item in a given period. e.g. "serve LineA 50 times from noon-12:05, 55 times from 12:05-12:10, ..."

The General Planner will be configured to call your endpoint every 1-10 minutes depending on the Host Company.

See [PG Plan Definition](/prebid-server/features/pg/pbs-pg-plan.html) for more details.

### General notes on writing a pacing algorithm

At a high level, pacing a line item seems like it might be simple:

```
NumberOfImpressionsEach5MinPeriod=TotalImpressionsRemaining+3percentBuffer / NumberOf5MinPeriodsRemaining
```

But this approach wouldn't perform well:
- When the line falls behind, it won't take advantage of higher traffic periods to catch up. It will fall behind during normal low-traffic periods, saving all impressions for the last minute.
- As covered in the description of [tokens](/prebid-server/features/pg/pbs-pg-plan.html#tokens), a PG line item cannot assume that it'll be chosen every time it's offered to the ad server. Prebid PG paces based on tokens, not impressions, so the pacing algorithm needs to estimate how many times each line item needs to be offered to the ad server in order to land a final certified impression.

Likewise, another naive approach is to try and immediately catch up to the "even delivery" line:
```
ImpressionDeficit=TotalImpressions+3percentBuffer - TotalImpressionsShouldHaveByNow

NumberOfImpressionsThis5MinPeriod=ImpressionDeficit * NoiseFactor
```

Potential problems with this algorithm:
- If it falls far behind, it could be overly aggressive in trying to catch up, affecting the delivery of other line items.
- If it gets ahead somehow, it will stop delivering entirely until time catches up to the delivery curve.

Here are some examples of desirable delivery patterns:

![Desirable delivery patterns](/assets/images/prebid-server/pg/pg-good-delivery.png){: .pb-lg-img :}

And these are examples of delivery patterns to avoid:

![Undesirable delivery patterns](/assets/images/prebid-server/pg/pg-bad-delivery.png){: .pb-lg-img :}

For more information, see the "Plans" section of the [Intro to PG Whitepaper](https://files.prebid.org/pg/Prebid_Programmatic_Guaranteed_White_Paper.pdf).

{: .alert.alert-warning :}
The PG Host Company may require periodic of testing with your pacing algorithm because undesirable
token management from on PG Bidder could affect line item delivery from other PG Bidders.

## Related Topics

- [PG Home Page](/prebid-server/features/pg/pbs-pg-idx.html)
- [PG Plans](/prebid-server/features/pg/pbs-pg-plan.html)
- [PG Glossary](/prebid-server/features/pg/pbs-pg-glossary.html)
- [PG Targeting](/prebid-server/features/pg/pbs-pg-targeting.html)

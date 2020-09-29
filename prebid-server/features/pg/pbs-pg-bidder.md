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
Here's a diagram from the [white paper](https://files.prebid.org/pg/Prebid_Programmatic_Guaranteed_White_Paper.pdf):

![PG High Level Framework](/assets/images/prebid-server/pg/pg-arch-2.png){: .pb-md-img :}

7. The publisher or a service team enter the PG Line Items into the PG Bidder's user interface.
6. The Bidder-Specific Planning Adapter does the strategic pacing work for the line items.

Notes:
- It's conceivable that you could deliver PG Line Items through more than one PG Host Company.
- It's possible that the Host Company may charge a fee to deliver PG Line Items through their infrastructure.

## What does it take to build a PG Bidder?

These are the high level steps for how to develop a PG Bidder and plug it into a Host Company's implementation:

1. Develop a User Interface for the customer to enter PG info: date range, targeting details, price, and pacing details. You will need to get targeting information from the Host Company's Dimension Value API.
2. Develop a pacing algorithm that uses data from the Host Company's Delivery Stats server and your own datastores.
3. Develop a report that uses data from the Host Company's Delivery Stats server and your own datastores.
4. Develop an external API that can respond to requests from the Host Company's General Planner for line item data.
5. Develop support for a special "Simulation" test environment.
6. Contact the Host Company to begin integration and testing.

### Get targeting dimensions

The Host Company can give you access to their 'Dimension Value API' which will let you know what attributes and values their Prebid Servers can target at runtime for particular clients.
This may differ between Host Companies. For example, they may use different geographic and device info databases. It may also vary across clients, since some of them may have First Party Data fields and they'll all have different AdSlots.

Once granted access to the Dimension Value endpoints, you'll be able to query it to get
attribute names and values. e.g.

- GET /dim-val/api/v2/attr/names
- GET /dim-val/api/v2/attr/values

There are various options for filtering data. See TBD for more details.

Notes:
- In order to access the client-specific targeting data, you'll need to know what account ID the Host Company uses for each publisher, storing a mapping of your internal account ID to the Host Company's internal account ID.

### Getting data from the Delivery Stats service

See TBD 

### Answering 

## Resources

- Intro Presentation: [video](https://files.prebid.org/pg/PG_in_Prebid.mp4), [pdf](https://files.prebid.org/pg/PG_in_Prebid_Overview.pdf)
- [Prebid PG White Paper](https://files.prebid.org/pg/Prebid_Programmatic_Guaranteed_White_Paper.pdf)

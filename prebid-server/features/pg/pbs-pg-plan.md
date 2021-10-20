---
layout: page_v2
sidebarType: 5
title: Programmatic Guaranteed Plans
---

# Programmatic Guaranteed Plans
{: .no_toc}

* TOC
{:toc}

## What is a PG Plan?

A `Plan` is a set of instructions to Prebid Server that tells it how often to serve a PG line item in a given period.

1. Plans are created by each [PG Bidder](/prebid-server/features/pg/pbs-pg-bidder.html) as an output of their bidder-specific pacing algorithm.
1. The 'General Planner' run by the Host Company will spread the Plan out across the cluster of Prebid Servers.
1. Each Prebid Server works to deliver its part of the Plan.

Here's what one looks like at a high level:

```
[
  {
    "lineItemId": "2291",
    ... other line item attributes ...
    deliverySchedule: [{
        "planId": "2656179",
        "startTimeStamp": "2020-08-28T11:50:00.000Z",
        "endTimeStamp": "2020-08-28T11:55:00.000Z",
        "updatedTimeStamp": "2020-08-28T10:04:12.000Z",
        "tokens": [{
            "class": 1,
            "total": 50
        }]
    },{
           ... next delivery schedule ...
    }]
  },
  ... next line item ...
  }
]
```

The key parts of the Plan are:
- Line item details. (See [example](#annotated-plan-example) below)
- An array of Delivery Schedules broken into 5-minute periods
- Each 5-minute period defines a number of `tokens` that need to be delivered

### Tokens

A `token` is an ad impression scaled up to overcome delivery obstacles.

When Prebid Server (PBS) sends a PG line item to the ad server, it might be
chosen to win, or maybe not. In either case, the act of sending a
line item to the ad server causes PBS to create a "cool down" period for that
line item. This is what pacing is all about -- making sure that delivery of the
daily impression goal doesn't complete 20 minutes after midnight. PG delivery
needs to be spread through the day, through the hour, and through each 5-minute period.

If we could guarantee that the ad server would choose the PG line item to win every time,
we wouldn't need tokens... PG could just use impressions. But that's not the case. There are several reasons why a candidate PG line item might not end up
getting a final certified ad impression:
- competing line items in the ad server
- competing PG line items from another vendor
- user leaves the page before ad render
- the impression may be discounted as non-human traffic

Basically, the pacing algorithms are working in a "noisy" environment. Not only are there
many things that can get in the way of delivering a certified an ad impression,
conditions can change rapidly, e.g. competing line items may start or stop, or the DSP may change its bidding pattern.

So a "token" is Prebid PG's way of dealing with noise in the system.
Instead of being satifisfied with offering a PG line item to the ad server
and assuming that it will become a certified impression, PG operates in tokens instead, knowing that some of those opportunities won't materialize.
You can think of it in terms of this basic formula:

```
Tokens = ImpressionsNeeded * Noise
```

Where the "noise" factor is how many tokens it's currently taking to get an ad
impression through the gauntlet of challenges. Determining this noise factor
is part of what the pacing algorithm needs to do -- adjusting it in real time
as needed. e.g. if it's been taking 2 trips to the ad server to get a "bid won", the noise factor is 2, so in a plan that requires 50 impressions, there would be 100 tokens.
You might wonder "why doesn't Prebid Server just take care of this?" Because Prebid Server is stateless... useful statistics are forwarded from hundreds of front-end servers and it's the job of the backend servers to aggregate and use that data.

Of course noise could be infinite. For example, if there's a 'roadblock'
ad in the ad server, it's possible that a PG line item will just stop delivering
entirely for a day or more, and that's ok. But even though noise can be infinite,
tokens cannot be. The Host Company will cap tokens at some reasonable level, 
but the best strategy for the infinite noise scenario is to give up and use a 
very small token count, waiting for when the problem has lifted.

A good real-time way to monitor noise is to compare two fields
in the Delivery Stats reports: sentToClientAsTopMatch vs events.bidsWon. (See the [glossary.](/prebid-server/features/pg/pbs-pg-glossary.html#metrics)) These values
are indications of how many times the line item was offered to the ad server
and accepted. But this value may also be tempered with data from your
clean financial pipeline that compares certified impressions with events.bidsWon.

### Plan Attributes

These are the attributes that are part of a Plan. See below for an [annotated example](#annotated-plan-example).

{: .table .table-bordered .table-striped }
| Attribute | Required? | Description | Data Type |
| --- | --- |--- |--- |
| lineItemId | yes | Bidder-specific ID for this line item | string |
| source | yes | Your PG bidder code. e.g. "pgBidderA" | string |
| status | yes | Whether this line item is currently "active" or not. The only value that matters to the General Planner is "active". Any other value will cause the line item to be ignored. | string |
| dealId | yes | Bidder-specific deal ID. Note that a Deal ID may be used by multiple line items. | string |
| accountId | yes | Host Company-specific value for the publisher. | string |
| price.cpm | yes | The CPM of the line item. | float |
| price.currency | yes | The currency for the CPM of the line item. | string |
| relativePriority | yes | Relative ranking specific to your pacing algorithm. You can put every line item at the same priority, or create 1000 different levels managed by your pacing algorithm. | integer |
| sizes | yes | An array of creative sizes associated with the line item. e.g. `[{"w": 468,"h": 60},{"w": 728,"h": 90}]` | array of objects |
| frequencyCaps.fcapId | no | Bidder-specific frequency cap ID. Needs to be uniqueo within your line items. | string |
| frequencyCaps.count | no | How many impressions can be served | integer |
| frequencyCaps.periods | no | Over how many periods | integer |
| frequencyCaps.periodType | no | Period length. E.g. "day" or "hour" | string |
| targeting | yes | Defines which ad requests are of interest to this line item. See [PG Targeting](/prebid-server/features/pg/pbs-pg-targeting.html) | object |
| startTimeStamp | yes | Line start time in UTC. e.g. 2020-08-28T07:22:14.000Z | string |
| endTimeStamp | yes | Line end time in UTC. | string |
| updatedTimeStamp | no | When this plan was last modified. | string |
| deliverySchedules | yes | array of objects |
| deliverySchedules.planId | yes? | Bidder-specific ID for use in debugging. Should be unique. | string |
| deliverySchedules.startTimeStamp | yes | Start time of plan period in UTC | string |
| deliverySchedules.endTimeStamp | yes | End time of plan period in UTC | string |
| deliverySchedules.updatedTimeStamp | no | When this plan period was last modified.| string |
| deliverySchedules.tokens.class | no | For future use. Set to 1 for now. | integer |
| deliverySchedules.tokens.total | yes | Token count (Impressions * Noise) for this plan period. | integer |

## Plans and the General Planner

The General Planner will poll the PG Bidder endpoint frequently - e.g. every minute or every 5-minutes. The exact period will be determined between you and the Host Company, but it needs to be often because pacing line items is a dynamic business.
Even though it will be contacted frequently, they should still generate
several hours worth of the delivery schedule in case communication breaks down somehow. 

Once it receives the Plan, the General Planner will split up the tokens across 
Prebid Servers. When a line item first starts, it does this in a really blunt way: just divides them evenly across the servers. But it will soon start adjusting for geographic differences
in line item delivery. e.g. if a line item only serves tokens in Europe, the Prebid Servers in Europe will get all the tokens within a few cycles.

## Plans and Prebid Server

Each PBS polls the General Planner once per minute, getting new and updated Plans.
Here's how it works:

1. When an auction request comes in, check to see if the account has any active PG line items. If it doesn't, process the request normally.
2. If it is an account with active PG line items, enhance the request with geographic, device, user, and frequency capping information
3. Find out which PG line items have targets that match the current request
4. Loop through the matching line items
    1. Increment the "targetMatched" metric.
    1. If the PG line item has a frequency cap and there's no user ID or the lookup failed, increment the "targetMatchedButFcapLookupFailed" metric and take it off the list.
    1. If the PG line item has a frequency cap and it's met the cap, increment the "targetMatchedButFcapped" metric and take it off the list.
    1. If the PG line item is in "cool-down", increment the "pacingDeferred" metric and take it off the list
5. Sort the remaining line items into priority order based on the PG-bidder-provided "relative priority", with a random secondary sort.
6. Take the first 3 PG line items for each PG Bidder and send them the relevant bid adapter, incrementing the "sentToBidder" metric for each, and the "sentToBidderAsTopMatch" metric for one of them.
7. Wait for the auction delay for the results. Increment "receivedFromBidder" and "receivedFromBidderInvalidated" metrics as appropriate.
8. Take the highest priority bid from each PG Bidder and prepare ad server targeting. Increment the "sentToClient" metric.
9. If there's more than one bid from a PG Bidder, randomly choose one to be the overall winner and increment the "sentToClientAsTopMatch" metric. Only this line item is considered to have spent a token and is put into "cool-down": PBS calculates how many milliseconds it needs to wait before offering this line item to the ad server again.

{: .alert.alert-info :}
Random numbers are used at a couple of points in the PG algorithm. This is to avoid choosing the same aggressive-but-blocked line item every time.

## Annotated Plan Example

Here's a complete example of a Plan with all line item and delivery schedule fields.

```
[				// each line item has a plan entry
  {
    "lineItemId": "2291",	// this is specific to your internal systems
    "dealId": "710216",		// also specific to your internal systems
    "accountId": "1001",	// the Host Company's account ID for the publisher
    "price": {
      "cpm": 7.29,
      "currency": "EUR"
    },
    "relativePriority": 2,	// relative stacking specific to your pacing algorithm
    "sizes": [{			// creative sizes
        "w": 468,
        "h": 60
      },
      {
        "w": 728,
        "h": 90
      }
    ],
    "frequencyCaps": [{		// Host Company may support multiple cap levels
        "fcapId": "LI-2291",	// ID specific to your system
        "count": 2,		// show no more than 2 times per 1 day
        "periods": 1,
        "periodType": "day"
      }
    ],
    "targeting": {		// Line Item targeting
      "$and": [{
          "adunit.size": {
            "$intersects": [{
                "h": 60,
                "w": 468
              },
              {
                "h": 90,
                "w": 728
              }
            ]
          }
        },{
          "adunit.mediatype": {
            "$intersects": [
              "banner"
            ]
          }
        },{
          "device.ext.deviceatlas.browser": {
            "$in": [
              "Chrome",
              "Firefox"
            ]
          }
        },{
          "device.geo.ext.netacuity.country": {
            "$in": [
              "us",
              "jp"
            ]
          }
        },{
          "adunit.adslot": {
            "$in": [
              "/1111/QA_Tests"
            ]
          }
        }
      ]
    },
    "startTimeStamp": "2020-08-28T07:22:14.000Z",	// line start time in UTC
    "endTimeStamp": "2020-08-30T17:22:14.000Z",		// line end time in UTC
    "updatedTimeStamp": "2020-08-28T06:22:15.000Z",
    "deliverySchedules": [				// now starts the plans
      {
        "planId": "2656177",				// ID is specific to your system
        "startTimeStamp": "2020-08-28T11:40:00.000Z",	// UTC 11:40 to 11:45
        "endTimeStamp": "2020-08-28T11:45:00.000Z",
        "updatedTimeStamp": "2020-08-28T11:36:30.000Z",
        "tokens": [
          {
            "class": 1,					// always 1 for now
            "total": 8					// number of tokens
          }
        ]
      },
      {
        "planId": "2656178",
        "startTimeStamp": "2020-08-28T11:45:00.000Z",	// UTC 11:45 to 11:50
        "endTimeStamp": "2020-08-28T11:50:00.000Z",
        "updatedTimeStamp": "2020-08-28T11:38:19.000Z",
        "tokens": [
          {
            "class": 1,
            "total": 10
          }
        ]
      },{
	... more plans ...
      }
    ],
    "source": "pgBidderCode",
    "status": "active"
  },
  {
     ... next line item ...
  }
]
```

## Related Topics

- [PG Home Page](/prebid-server/features/pg/pbs-pg-idx.html)
- [Becoming a PG Bidder](/prebid-server/features/pg/pbs-pg-bidder.html)
- [PG Targeting](/prebid-server/features/pg/pbs-pg-targeting.html)
- [PG Glossary](/prebid-server/features/pg/pbs-pg-glossary.html)

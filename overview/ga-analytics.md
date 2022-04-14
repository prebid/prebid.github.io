---
layout: page_v2
title: Prebid Analytics with GA
description: Prebid.js Analytics with GA for Header Bidding
pid: 10
top_nav_section: overview
nav_section: analytics
sidebarType: 1
---



# Prebid Analytics with GA
{:.no_toc}

> Are my header bidding demand partners generating more revenue for me? If not, is it because of latency or is it due to low bid CPM? How about discrepancies?

* TOC
{:toc}

## Prebid Analytics helps you better manage your header bidding partners

It includes:

- Bidder bid/win price analysis by geo, domain, with price range distribution.
- Bid latency by bidder, geo, and domain.
- Seamless integration with your Google Analytics account and scheduled reports delivered to your mailbox.

<br />

## Example reports by Prebid Analytics

The day starts from making sure the bidders are not generating less revenue:

![Blocking Ad Calls 1]({{ site.baseurl }}/assets/images/overview/analytics/revenue-by-date.png)

Something is not right here - total revenue from yesterday dropped quite a bit. This could be caused by certain bidders were down or experienced technical issues. Let's take a look at the bidder timeout rate:

![Blocking Ad Calls 1]({{ site.baseurl }}/assets/images/overview/analytics/timeout-by-date.png)

Bidder timeout seems okay. The problem might then be caused by bidders' lower bid rate:

![Blocking Ad Calls 1]({{ site.baseurl }}/assets/images/overview/analytics/bidrate-by-date.png)

Here we go. Bidder 1 and 4 bid much less than usual. You may want to drill down even further - Prebid.js Analytics also provides:

- More metrics such as: bid load time, avg bid CPM, bid rate, avg win CPM, win rate.
- Ability to filter the above metrics further by geo, domain, and OS

> **Explore an example dashboard <a href="https://docs.google.com/spreadsheets/d/11czzvF5wczKoWGMrGgz0NFEOM7wsnAISbp_MpmGzogU/edit?usp=sharing" target="_blank">here</a>**

<br />

## Histogram analysis of latency and CPM distribution

To understand exactly how much time per bidder spent, the Analytics Platform allows you to make the below query:

- For country X, what are bidders' bid load time, for mobile traffic on Android only?

<br />

![Blocking Ad Calls 1]({{ site.baseurl }}/assets/images/overview/analytics/loadtime-histogram.png)

You might derive:

- Bidder 1 is really fast, because 1/3 of its bids are in red, which is in the 200 - 300ms response time range.
- Bidder 5 is really slow, as 1/3 of its bids are in 800 - 1000ms.

<br />

Similar query for bidders' bid CPM:

<br />

![Blocking Ad Calls 1]({{ site.baseurl }}/assets/images/overview/analytics/cpm-histogram.png)

> **Try out the product and explore the demo dashboard <a href="https://docs.google.com/spreadsheets/d/11czzvF5wczKoWGMrGgz0NFEOM7wsnAISbp_MpmGzogU/edit?usp=sharing" target="_blank">here</a>!** This will be the base of your dashboard!

<br />

## How does it work?

Prebid.js has a seamless integration with Google Analytics and Google Spreadsheet, as well as [several other Analytics providers](/overview/analytics.html).

1. Prebid.js has a module for Google Analytics.
2. All data are sent as Events to Google Analytics. You can build reports and dashboards there just as you do today with web traffic data.
3. We've also built dashboards and data visualization in Spreadsheet (where all the above diagrams come from). You can copy our demo dashboard and link it to your Google Analytics account in a few minutes!
4. The Spreadsheet dashboard can be scheduled to run every morning (or in other intervals). You can get 7 day revenue lookback, latency/CPM distribution analysis and more every morning!

### Building the Prebid.js Package with GA

You can build the Google Analytics module into your Prebid package in two ways:

1. The "Easy Button" - use the handy web-based [Prebid.js Download](/download.html) tool, and check the Google Analytics adapter box along with the other modules and adapters desired.
2. From the command line

```
gulp build --modules=googleAnalyticsAdapter, OTHER_MODULES, OTHER_ADAPTERS, ...
```
### Enabling the GA Adapter in Your Page

1. First, make sure GA is on your page as directed by Google. Get the 'tracking code' from the GA interface. It will look something like:

```
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-1111111"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-1111111');
</script>
```

2. Enable the Prebid.js GA module:

```
pbjs.que.push(function() {
  pbjs.enableAnalytics({
    provider: 'ga',
    options: {
      sampling: 0.1
    }
  });
});
```

Here are the options available. None of them are required.

{: .table .table-bordered .table-striped }
| Option | Type | Example | Notes |
|---+---+---+---|
|global | string | ga | Name of the global analytics object. Default is `ga` |
|trackerName | string | "mytracker" | Use another tracker for prebid events. Default is the default tracker. |
|sampling | float | 0.1 | Choose a value from `0` to `1`, where `0` means 0% and `1` means 100% tracked. |
|enableDistribution | boolean | true | Enables additional events that track load time and cpm distribution by creating buckets for load time and cpm. Default is false. |
|cpmDistribution | (cpm: number => string) | | Customize the cpm bucketsfor the cpm distribution. |
|sendFloors | boolean | true | if set, will include floor data in the eventCategory field and include ad unit code in eventAction field. Defaults to false. |

## Further Reading

- [Analytics for Prebid](/overview/analytics.html) (Overview and list of analytics providers)
- [Integrate with the Prebid Analytics API](/dev-docs/integrate-with-the-prebid-analytics-api.html) (For developers)

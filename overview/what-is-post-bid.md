---
layout: page_v2
title: Intro to Post-Bid & Get Started
head_title: What is post-bid and when to use it vs. header bidding.
description: What is post-bid and when to use it vs. header bidding.
sidebarType: 1
---

# What is Post-Bid?

> Post-bid allows a publisher’s demand sources to compete in one auction based on price after the ad server has declined to choose a direct-sold or exchange-based line item.

`Post-bid` is the configuration scenario where a publisher loads and runs Prebid.js
in a winning line item's creative. In a post-bid setup,
demand sources compete _after_ the ad server has chosen the post-bid line item. Compare this to:

- header bidding, where demand sources compete _before_ the ad server has seen
the impression.
- a mediation solution, where post-bid demand sources don't run in a daisy chain;
they all compete in one single line item based on price.

This diagram summarizes the post-bid scenario:

![Add Creative to Line Item]({{ site.github.url }}/assets/images/overview/postbid-diagram.png){: .pb-lg-img :}

Steps:

1. The webpage sends an impression to the ad server.
2. The ad server chooses a winning line item among 'class 1' (direct-sold ads), exchanges, and the post-bid line items. In the case shown here, the post-bid line item wins.
3. The post-bid line item’s creative is served to the page. The creative runs an auction for the bidders using prebid.js, which then displays the highest price creative in that creative’s ad slot.


### Why Post-Bid?

The main reasons we have seen publishers opt for post-bid (instead of header bidding) are:

#### 1. A post-bid setup does not need engineering resources.

The post-bid creative is just a 3rd party tag. Once it’s served to the page, prebid.js runs an auction across all demand sources. The only technical work is to insert the tag Ids into the 3rd party tag’s JSON config for the demand sources. It’s trivial work.

#### 2. A post-bid setup adds no latency to standard ad delivery.

Because post-bid is just a 3rd party tag, the ad server receives the impressions as soon as the page loads. The post-bid setup does not affect other ad spend. Post-bid actually reduces latency compared to a daisy chain mediation setup, because in post-bid all demand sources are requested concurrently, instead of in a waterfall.

Additionally, post-bid does not need as many line items, so initial setup is easier than header bidding.

### Disadvantages of Post-Bid

We’ve listed the advantages of post-bid over header bidding in the previous section. The disadvantages include:

#### 1. No dynamic allocation across all demand sources.

The bid price on the post-bid line item is static (based on historical price). It thus has the typical problems of a 3rd party tag line item. Due to this downside, the post-bid setup cannot make header bidding demand partners compete on an even footing with  other types of demand.

#### 2. Prebid.js is loaded for each ad unit chosen for Post-Bid.

If there are multiple ad units on a page that fall into the post-bid scenario, each
creative loads and runs Prebid.js separately. This can cause more work for the
browser (or device) as it loads the code multiple times and runs separate auctions.
However, since this activity takes place after the ad calls, content is generally
already loaded.

#### 3. Reporting is harder.

In the ad server's post-bid line item report, you’d only get an aggregated report of all demand sources. You may need to rely on a 3rd party reporting service to record which demand partner wins how much inventory.

### Comparison of Monetization Solutions

{: .table .table-bordered .table-striped }
| Feature | Mediation Solution | Post-Bid Solution | Pre-Bid Solution |
| :--- | :---- | :---------- | :------ |
| Engineering Resources | Not required | Not required | Required |
| Ad Latency | No additional ad serving latency. Waterfall adds latency when networks do not fill. | No additional ad serving latency. Parallel auction for demand sources thus minimum latency. | Additional ad serving latency from the page's timeout setting. |
| Can compete among demand sources | No | Yes | Yes |
| Can compete with direct-sold ads & AdX dynamic allocation | No | No | Yes |
| Monetization Capability | Low | Medium | High |
| Block page content from loading? | No | No | No (with Prebid.js) |


### FAQ

#### 1. If none of the post-bid demand sources fill, can I still passback to another tag, say from Adsense?

Yes. Check out the [example](/dev-docs/examples/postbid.html).

#### 2. Can post-bid be used for mobile apps?

Yes, it works the same as for browsers. When utilizing a server-to-server architecture, the [app](/dev-docs/publisher-api-reference/setConfig.html#setConfig-app) config option can be used to forward the mobile app details.


## Getting Started

Please refer to the [example](/dev-docs/examples/postbid.html).

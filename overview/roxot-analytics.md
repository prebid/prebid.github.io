---
layout: page
title: Prebid Analytics by Roxot
description: Prebid Analytics by Roxot provides clean client-side data about all Prebid auctions running on the website and all demand partners participating.
permalink: /overview/prebid-analytics-by-roxot

top_nav_section: overview
nav_section: analytics

---
<div class="bs-docs-section" markdown="1">

# Prebid Analytics by Roxot

Prebid Analytics by Roxot provides client-side data about Prebid auctions running on a website as well as all demand partners participating. It allows you to monitor daily, hourly and real-time changes in header bidding performance and uncover issues with Prebid.js setup.

The following metrics are available for analysis:

- Sites and Ad Units: Requests, Impressions, Fill Rate, Impression Rate, eCPM, Revenue
- Bidders: Requests, Impressions, Bid Rate, Win Rate, eCPM, Revenue, avg. Bid Price, avg. Win Price, avg. Response Time, Timeout Rate

## Getting Started

1. Sign up for a free account <a href="http://prebidanalytics.com/" target="_blank">here</a>.
2. Log in to Prebid Analytics by Roxot and follow instructions to add the site domains where you wish to analyze prebid.js preformance.
3. Make sure you use official Prebid.js setup.
4. Build new Prebid.js with the Prebid Analytics by Roxot adapter. You can go to <a href="/download.html" target="_blank">Download page</a>, select the header bidding partners you already work with, check the Prebid Analytics by Roxot box under the Analytics Adapters section.
5. Update your config:
	- Upload your new prebid.js to the same location on your website/s as the old.
	- Edit the link to reflect the changes.
	- Add the following code to your prebid.js config to activate Prebid Analytics:

{% highlight js %}

// Add the below code snippet to your page
pbjs.que.push(function () {
  pbjs.enableAnalytics({
    provider: 'roxot',
    options: {
      publisherIds: ["YOUR-PUBLISHER-ID"]
    }
  });
});

{% endhighlight %}

Your publisher ID can be found <a href="http://panel.prebidanalytics.com/installation/step4" target="_blank">here</a>. You should be logged in to Prebid Analytics by Roxot to access the page.

As soon as you finish the installation and the system detects requests from the sites you added, your data will be displayed across all dashboards.

## Workflow Examples

### *Spot an issue*

Total Dashboard is a popular place to start your day. It reports the core metrics for all websites in your system and all bidders plugged in. You get a system overview without overwhelming details so you can easily spot any issues with a website or bidder.

{: .pb-lg-img :}
![Total dashboard prebid analytics by roxot]({{ site.github.url }}/assets/images/blog/analytics-by-roxot/total-dashboard.png)

In this example, Total Revenue & Total Impressions for today are much lower than the average for the previous week. The Total Impressions by Bidder graph shows that the number of impressions dropped for every bidder, which means you need to investigate possible issues on your sites.

{: .pb-lg-img :}
![Total sites performance prebid analytics by roxot]({{ site.github.url }}/assets/images/blog/analytics-by-roxot/total-sites-performance.png)

Scroll down to the Sites Performance table to find out which sites the issues may be coming from. Impressions Trend is a great way to quickly spot an underperforming site. In this example you can see that number of impressions for your-domain-name.com has significantly dropped. Also, the Fill Rate is extremely low.

{: .pb-lg-img :}
![Bidders performance prebid analytics by roxot]({{ site.github.url }}/assets/images/blog/analytics-by-roxot/bidders-performance.png)

Go to Sites>your-domain-name.com to access the Site Dashboard and analyze your-domain-name.com in more detail. So Bidders 1 and 4 have low Bid Rates and low Time Rates which means a lot of No Bid responses are coming from them. Seems like it's time to email their representatives to find out what's wrong. Also, Bidders 2 and 5 have Time Rates that are much higher than they should be. You may want to drill even further to find out why.

### *Testing a new bidder*

Assuming you plugged in a new bidder a week ago. How would you analyze its performance?

{: .pb-lg-img :}
![Bidder dashboard prebid analytics by roxot]({{ site.github.url }}/assets/images/blog/analytics-by-roxot/bidder-dashboard.png)

Based on data from the Bidder Dashboard, you can see that Revenue is below your expectations. Also, the bidder's Bid Rate is low and Timeout Rate in turn, is high. However, Win Rate and avg. Bid Price are higher than from your other bidders.

{: .pb-lg-img :}
![Response types part-to-whole prebid analytics by roxot]({{ site.github.url }}/assets/images/blog/analytics-by-roxot/part-to-whole.png)

Scroll down to the Response Types Part-to-Whole graph to analyze how the bidder responds to ad requests. The percentage of No Bid Responses is low, which means that the bidder doesn't participate in auctions mostly due to timeouts. As a result, you can decide to either unplug the bidder or slightly increase your Prebid Timeout and test how it affects this bidder and overall performance.

### *Monthly Report*

When you need to get monthly stats, go to Statistics and build a custom report. For instance, when you want to analyze monthly bidders performance.

{: .pb-lg-img :}
![Statistics prebid analytics by roxot]({{ site.github.url }}/assets/images/blog/analytics-by-roxot/statistics.png)

Filter by your site and device type, group the data by Bidders, and choose the following metrics to get a complete overview of a bidders performance: Bidder Requests, Impressions, Revenue, eCPM, Bid Rate, Avg. Bid Price, Win Rate, Timeout Rate, avg. Response Time. Export the results to csv and/or save the report to your presets so you can quickly build it next time.

</div>
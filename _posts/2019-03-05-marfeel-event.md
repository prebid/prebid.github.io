---
layout: post
title: 4 Ideas from the Barcelona Prebid Summit
description: 
permalink: /blog/marfeel-event-2019
---


<br>

(Originally [posted on Marfeel's site](https://www.marfeel.com/blog/prebid-leadership-summit-2019/), slightly edited for clarity.)

![Barcelona Summit](/assets/images/blog/2019-03-05-marfeel-event-1.jpg){: .pb-lg-img :}

As Mobile World Congress has brought the digital publishing world to us this week, we welcomed our industry partner Prebid.org to the Marfeel’s offices to host their third ever Prebid Leadership Summit. Led by the Chair of Prebid, Alexandra Smith, the mission of the day was to understand the changes leading the header bidding industry, and the role of the Prebid organization in driving these changes.

We were also joined by Remi Boudard from AppNexus, Enrique Blanc from Grupo Zeta, and Lucas Isern and Xavi Beumala from Marfeel, discussing the rise and challenges of adopting server-side header bidding.

To recap the key points for those that weren’t able to attend, we’ve collated everything publishers need to know.

Here are the key takeaways:

## 1. Header Bidding is still in the early-adopter phase, especially for Server Side

In Europe in 2017, 10-15% of display impressions were generated using header bidding. By the end of 2018, it was closer to 50%. Client-side is still the dominant method of implementation.

Client-side header bidding was always supposed to be a temporary phenomenon before a rapid migration to server-side. This was due to the impact of page-load on the user experience and the efficiency gains provided by server-side.

But, there are still limitations that prevent server-side from being rolled out across advertisers. One of the main challenges for adoption is user identification. When you add an additional step for cookie matching, match rates can go down and in turn, impact monetization. Buyers only bid high when they know who the user is, so losing match rates can severely impact monetization for many. Until universal ID solutions come to fruition, the industry is hindered.

Whats more, web publishers already have working systems for display. There is not currently enough incentive to apply wholesale changes to their approach. They don’t want to spend time and money shifting to a system that will be more advanced and more rigorously industry-tested in a year or so.

Publishers are waiting for companies and organizations such as Marfeel and Prebid to solve these issues before fully committing to server-side.

To bridge this gap, Marfeel has a dedicated team that has built our own header bidding solution, now incorporated into the Prebid open-source platform. Working alongside our publishers and the Prebid organization has allowed us to create one of the industry’s first server-side header bidding solutions, that is live across our publishers now.

## 2. Mobile will be the driving force for mass-adoption

Most major publishers operate with a hybrid solution, across their formats, such as web, mobile, app, and video. But, running different ad logic for every format is costly and difficult, as is running many SDKs.

However, mass-adoption of server-side header bidding will require a catalyst that proves its value and utility. For publishers, this revolution will start with mobile, since the Prebid Mobile SDK works hand in hand with Prebid Server. Since Prebid Mobile relies on Prebid Server, publishers will begin to adopt it and consider its use-case for web traffic as well. As more and more publishers adopt, the community will dedicate more time and energy to its development.

Once mobile proves the market for server-side header bidding, publishers will start to migrate towards it, making Prebid Server become a unified header bidding solution across all formats and devices.

## 3. Hybrid Models will dominate 2019 but after that…

No-one at the event was expecting server-side header bidding to be universally adopted by all publishers, across all formats this year. However, the increasing value of this technology and the rise of header bidding in mobile will lead to some major changes.

It’s expected that, with the adoption of EB (Google’s Exchange Bidding) and Prebid Server that SSPs will eventually become commoditized. This may force them to shift into more technology and service-focused companies, helping publishers navigate the complexities of the ecosystem and providing them with the latest developments.

Until this mass-migration to Server, publishers are able to incorporate different Prebid implementations to maximize their revenue, which is where the beauty of the platform lies. However, client-side will gradually evolve to be replaced by server-side header bidding and is likely to spread across all formats after a successful initial implementation across mobile.

## 4. Header Bidding and Machine Learning = Intelligent Ads

Finally, the results of mass-adoption—though the proving ground of mobile—will enable the development of more advanced systems of header bidding.

The combination of a unified platform like Prebid Server, alongside machine learning, will allow advertisers to break down impressions and revenue by demand partner, ad format, inventory, and region. Publishers and advertisers will be able to track deal performance across multiple exchanges with a single report to see who is winning, where, and be able to infer why.

Machine-learning powered algorithms will segment data by size, ad format, and Google Ad Manager ad unit. Automated systems will see through the entire monetization funnel to spot bottlenecks and eliminate inefficiencies in real-time. Effective server-side header bidding will help facilitate the development of these intelligent ads.

Prebid open-source tech: Deeper development through collaboration
The current challenges of Prebid Server go beyond just cookie matching. They stretch to scaling server infrastructure and building creative caching. However, the accelerated development of the Prebid open source tech will create advancements beyond reduced latency, including intelligent ads and ad delivery that comes directly from Prebid server.

The collaborative Prebid organization creates independent standards that benefit everyone. There is no bias because the technology is not created or operated by a single content provider and anyone can build on it and improve it. This collaboration is helping define a transparent industry standard that will ease the path for the implementation of header bidding into publisher’s platforms.

Marfeel’s product manager in our monetization department, Lucas Isern summarized what this ethos will help deliver:

{% highlight bash %}
‘Prebid Server is not just Prebid.js without its latencies. It’s an opening door to many more improvements and making crucial steps towards getting out of the browser.’
{% endhighlight %}

---
layout: page_v2
title: Intro to Header Bidding
head_title: Introduction to Header Bidding
description: An beginner's guide to header bidding.
sidebarType: 0
---


# Introduction to Header Bidding
{:.no_toc}

{: .alert.alert-success :}
This is a general overview of header bidding. If you’re interested in an overview specific to using Prebid for your header bidding, see our [Introduction to Prebid](/overview/intro.html).

Let’s start by saying that the term “header bidding” is a bit of a misnomer. At its inception it was somewhat accurate, but those days are long gone. We’ll explain that in just a bit, but let’s start at the beginning. What exactly is header bidding?

* TOC
{:toc}

## Overview

A video overview of header bidding.

<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/820684821?h=d55a008b4b&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Introduction to Header Bidding"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

Further Reading:
- [Transcript of this video overview](/overview/intro-to-header-bidding-video.html)
- [Header Bidding with Prebid](/overview/intro.html#header-bidding-with-prebid)

## Brief Description

Header bidding is a process that enables publishers to capture bids for ad units from demand sources that might otherwise have been missed. By implementing header bidding, a publisher can gather bids from multiple sources that will then compete directly with bids from the ad server. What this means is that header bidding can help you, as a publisher, make more money and improve your ad quality by making the auctions for your ad space more competitive and transparent.

## A History Lesson

Why should you care about the history of header bidding? Because it helps explain why you would want to use it today.

### The Power of the Ad Server

Think for a moment about the amount of power an ad server has over auctions for ad space.  A publisher signs on with an ad server and provides information on the space available (the ad units) and maybe some information about the types of ads that can go in each space. As a page is displayed, the ad server starts running through their inventory, picks an ad, and sends it back to the publisher.

Did the publisher get the best price possible for the ad? Did they get the most appropriate ad for the spot? Well, historically no one actually knew that for sure, the whole process was mostly invisible to the publisher (and also the buyer).

![Ad Server Black Box](/assets/images/intros/ad-server-black-box.png){: .center-image :}

Header bidding changed all that. With header bidding, publishers decide which suppliers can bid on their impressions, then send one or more of those bids to the ad server to compete with the ad server’s bidders. This gives publishers much more transparency and control in the process.

### More Than Headers

We mentioned at the start of this introduction that “header bidding” doesn’t really fit the process anymore. When header bidding began, it was targeted for display ads on web pages. The code required to implement header bidding was placed in the header section (between the `<head>` tags) of the HTML page. Thus, the term “header bidding” was adopted.

The code for bidding on web display ads still resides in the header, but with the ongoing addition of more formats, header bidding itself now encompasses much more. For example, video ad auctions happen in the video player; mobile apps call out to a server; and web pages can utilize server-side bidding. None of these processes involve code in the header. And with continual growth into additional areas such as DOOH (digital out-of-home), CTV (connected TV) and audio, the term “header bidding” becomes less and less applicable.

Today header bidding might more appropriately be referred to as pre-ad server bidding. But in the same way that people in the U.S. insist on calling a game played mostly with your hands “football,” people in the ad industry are going to continue to call this header bidding.


## How It Works

This is a very simplified version of how header bidding works with display ads on a website:

1. 	The page starts to load.
2. 	The header bidding code calls out to a set of demand partners asking for bids.
3. 	The demand partners reply with their bids.
4. 	The ad server is called, with some or all bids attached to the call.
5. 	The ad server considers all available ads that could be displayed, including the header bid(s).
6. 	The ad server displays the winner for each ad unit (which may or may not be one of the bids that resulted from the header bidding).

![Header Bidding](/assets/images/intros/header-bidding-intro.png){: .center-image :}

Again, this is very simplified. The details of this process vary depending on whether you’re working with mobile apps, working server-side rather than client-side, or working with video rather than display.

Here are a few details on the different aspects of header bidding.

### The Ad Server

Yes, you still need an ad server. As we explained in the History, header bidding means that bid gathering takes place before calling the ad server. The ad server will still determine the final winner for each ad unit. It will consider sponsorships, direct sold, guaranteed, and other types of ads along with the bids generated from the header bidding software.

{: .alert.alert-info :}
Header bidding can be done without an ad server, but that’s rare and out of scope for this discussion.

### Ad Ops

Because the bids collected through header bidding are being passed to the ad server, you need the ad server to be prepared to receive them. That’s where your ad ops team comes in. Your ad ops team will need to set up line items within the ad server for all ad units that are part of the header bidding auction. One or more bids will be sent to the ad server, and the ad server will look for line items matching the key values in those bids. If those line items aren’t set up correctly, the header bidding winners will not be considered in the final auction.

This process is where the core innovation of header bidding takes place. Line items are set up to allow external bids to be brought into the ad server algorithm and compete appropriately with ads that are entered directly into the system.

{: .alert.alert-info :}
Your team may go by a name other than ad ops (or ad operations). When we refer to ad ops, we’re talking about the people who login to the ad server software and manage the campaigns and accounts.

Ad ops will work with engineers to ensure they have the correct key values and ad units so that the line items they create in the ad server will correspond to the header bidding results.

### Engineering

Whether you’re working with a website or a mobile app, banner ads or video, your engineering team will need to add header bidding code. The header bidding gets started by running some JavaScript code before the ad server is called. The ad calls on the page will be delayed for a set period of time in order to allow the header bidding software to gather bids.

Engineers will have to work closely with ad ops to ensure the key value pairs that are being sent to the ad server with the bids from the header bidding process are included in the line items being created on the ad server.

### Revenue Operations

Header bidding does not compete with direct bidding; it enhances it. Bids that come in through the header bidding process work alongside all other inventory in a campaign. You get market intelligence, the ability to set CPMs and priorities, and you’re able to ensure bids coming from header bidding don’t interfere with higher priority inventory such as direct sold ads. Header bidding fits into the overall process without interfering with any contracted deals and obligations.


## Managed Services vs In House

To fully maximize your revenue and performance, header bidding can be a complicated and time-consuming task. Because of that, many companies choose to hire managed services companies to take on the work. Depending on the company you choose, they’ll implement and monitor your header bidding and make adjustments for you.

If you choose to keep everything in house, be prepared for your engineering and ad ops teams to spend time not only getting set up but also making adjustments and updates.

Both options require an investment, but it’s an investment that has been repeatedly proven to pay off for most publishers.


## Bidding Partners

Obviously, header bidding involves more than just putting code out there and expecting bids to come rolling in from random sources. You need to select your demand partners (SSPs and exchanges). If you’re using a managed service, they can help you with that. If you’re implementing your own system using a wrapper (such as Prebid), you need to specify which demand partners you’ll work with and how many to work with at a time. Select your partners thoughtfully, and periodically review and adjust based on results.

Along with your demand partners, you can optionally choose to work with additional bidding partners. You can select partners in yield management, user ids, real-time data, viewability, and more.

## Dealing with Latency

As we’ve mentioned, header bidding works by delaying the call to the ad server until after external bidders have been contacted, which allows these additional bids to be sent to the ad server when it does get called. This can cause some latency in loading the page and displaying the ads. The organizations that provide header bidding solutions are aware of this and have designed ways to minimize it.

## Header Bidding with Prebid

If you’re planning on creating your own header bidding implementation in-house, the most popular option is to use Prebid. (Many managed services also use Prebid.) Prebid is a free, open-source header bidding solution. Learn all the how’s and why’s of working with Prebid in our [Introduction to Prebid](/overview/intro.html).

---
layout: page_v2
title: Video Intro to Server-Side Header Bidding with Prebid.js
description: Video Intro to Server-Side Header Bidding with Prebid.js
sidebarType: 1
---

# Server-Side Header Bidding with Prebid.js

An introduction to using server-to-server header bidding with Prebid.js on websites.

<div style="padding:56.25% 0 0 0;margin: 1rem 0;position:relative;"><iframe src="https://player.vimeo.com/video/922780542?h=f7d8e81488&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Server-Side Header Bidding with Prebid.js"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

<p/>
Further Content:

- [Prebid Server Overview](/prebid-server/overview/prebid-server-overview.html)
- [Prebid Managed Services](https://prebid.org/managed-services/)
- [Header Bidding with Prebid](/overview/intro.html#header-bidding-with-prebid)

Related Videos:

- [Introduction to Prebid.js](/prebid/prebidjs-video.html)
- [Prebid.js Impression Flow](/prebid/prebidjs-flow-video.html)
- [Components of Prebid.js](/prebid/prebidjs-components-video.html)
- [Prebid Server Overview](/prebid-server/overview/prebid-server-overview-video.html)
- [All Videos](/overview/all-videos.html)

## Transcript

### Introduction

This video is for publishers interested in setting up server-side header bidding on websites running Prebid.js.

In this video, we’ll start by discussing what server-side header bidding is and why you might want to try it. Next, we’ll give an overview of how it works in a typical Prebid.js auction, then give you an introduction on how to get started.

Note that Prebid Server is a flexible product that is used in many types of Prebid integrations, including mobile app, long form video, and digital out-of-home. This video will focus specifically on the use of Prebid Server to monetize a website using Prebid.js.

For information on how Prebid Server helps monetize mobile apps, check out our video on the subject. You can find the link in the notes below.

This video assumes that you know how a typical Prebid.js auction works with client-side bidders. For an overview, check out our other videos on Prebid.js. You can find the links to these videos in the video description below.

Server-side header bidding is all about how bidders connect to Prebid.js. 

Unlike client-side header bidding, in which there is a direct connection between the browser and a bidder’s server, server-side header bidding adds an intermediary into the path. This intermediary is Prebid Server. When it’s time to run a header bidding auction, Prebid.js makes a request to Prebid Server, which communicates with bidders over a server-to-server connection.

Publishers that use Prebid.js have the flexibility to use client-side connections, server-side connections, or a mixture of the two. It’s common for publishers to set up auctions that contain a mix of client-side and server-side bidders.

Server-side header bidding is one of the many techniques publishers can use to maximize the performance of their Prebid.js auctions. It does so chiefly by reducing the workload that the Prebid auction places on the user’s device, because Prebid Server takes over some of the work of managing bidder connections and processing bid responses. Sharing labor between the user device and a server could help to deliver better ad experiences to users or allow you to increase revenue by adding new bidders.

Despite the benefits, most publishers have not migrated all of their bidders to server-side header bidding. This is because client-side bidders are more able to set and access third-party cookies that server-side bidders. This means that running a bidder through server-side header bidding will often cause the bidder to bid less often or at lower CPMs compared to a client-side integration.

The good news is that you don’t have to commit entirely to using server-side auctions. Most publishers who use server-side header bidding employ a hybrid approach, in which some bidders bid directly into Prebid.js through client-side bid adapters, while others bid through the server-side path.

The hybrid approach allows you to increase competition for your ad impressions by adding more bidders to the auction, without burdening the browser with the task of processing additional client-side bidders.

Most publishers who use a hybrid approach give their highest-value bidders client-side connections to Prebid.js. These are the bidders that deliver the most revenue. Meanwhile, lower priority bidders and bidders who are being tested can be run server-side.

### Prebid Server Auction Flow

Next, we’ll explain how server-side header bidding works.

Like any Prebid.js auction, auctions that include server-side bidding have three stages: Pre-Auction, Auction and Post-Auction.

Server-side header bidding largely affects the Auction stage, because it has to do with how Prebid.js communicates with bidders. Some other tasks like user syncing are also influenced by the bidder connection type. We’ll touch on these at the end of this video.
When you set up Prebid.js for server-side header bidding, you’ll indicate which bidders you want to bid through the server-side path. All other bidders will use the standard client-side method.

This example has one client-side bidder and two server-side bidders. When Prebid.js makes bid requests, it will make a direct request to the client-side bidder’s server, and it will use the Prebid Server bid adapter to make a request to a server that is running Prebid Server.

Prebid Server receives the request and begins its own internal Pre-Auction phase. It gathers information about the page and user and prepares to make bid requests to bidders.

Prebid Server will then make bid requests to the server-side bidders’ servers, then Prebid Server gathers the responses and returns them to Prebid.js.

Separately, any client-side bidders that have been set up will also return their responses to Prebid.js.

Having concluded the auction, Prebid.js’s Post Auction stage begins. Prebid.js will process bids and create ad server targeting key-value pairs. The ad server is called, and the ad renders.

### Getting Started with Server-Side Header Bidding

Now, let’s talk about how you can start using server-to-server header bidding with Prebid.js.

The first component to discuss is the server. To use the Prebid.js server-to-server solution, you’ll need a server running the Prebid Server code. You can set this up yourself, or use someone else’s.

The Prebid community includes many managed service providers that specialize in operating Prebid Server. 

These managed services will take care of running a global, high scale low-latency, 24x7 tier of servers, keep them upgraded, and manage the server-side bidders.

Links to more information about Prebid Server Managed Services and to instructions on Prebid Server setup and installation can be found in the notes below this video.

Once you’re set up and running Prebid Server, you’ll configure the parameters of your setup in the Prebid.js configuration.

You can find the documentation for server-to-server header bidding at docs.prebid.org. The link to this document can be found in the notes below. The server-to-server configuration allows you to choose which bidders will bid through the server-side path. You can also set the timeout duration that sets the auction time for Prebid Server bids. This is an important setting, because it controls how quickly Prebid Server responds to Prebid.js.

Because Prebid Server’s auction occurs within the Prebid.js timeout window, it’s important to make sure that Prebid Server responds to Prebid.js in a timely fashion. 

If Prebid Server fails to respond to Prebid.js before the Prebid.js bid timeout, then all of the Prebid Server bids will be lost.

A good rule of thumb is to set your Prebid Server timeout 200 to 300 milliseconds less than the Prebid.js bid timeout. This gives Prebid Server bidders enough time to respond while leaving a healthy cushion for signals to flow between Prebid.js and Prebid Server.

The endpoint parameter tells Prebid.js the location of the server that is running Prebid Server.

There are also user sync settings that allow you to configure how Prebid Server performs user syncs for server-side bidders. Prebid Server will store cookies under the publisher’s domain on behalf of bidders. When an auction runs, it retrieves the stored cookies so that bidders are able to value the impression more effectively.

Once you’ve got bidders set up in Prebid Server, you can start to test the performance. It’s a good idea to start testing in a development or staging environment, then move on to limited testing on production traffic.

With Prebid’s Server-to-Server Testing Module, you can set up A/B tests that help you measure the influence that server-to-server header bidding has on your header bidding performance.

The testing module has powerful features that allow you to set the proportion of a bidder’s bid requests that flow through the client and server paths. This proportion can even be set at the ad unit level for specific scenarios.

That’s it for this walkthrough of server-to-server header bidding in Prebid.js. Check the links in the notes below this video for more information.

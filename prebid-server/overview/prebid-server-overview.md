---
layout: page_v2
title: Prebid Server Overview
description: Prebid Server Overview
sidebarType: 5
---

# Prebid Server Overview
{:.no_toc}

Prebid Server is an open-source solution for server-to-server header bidding. It supports a number of key use cases: [mobile app](/prebid-server/use-cases/pbs-sdk.html), [AMP](/prebid-server/use-cases/pbs-amp.html), [server-side web with Prebid.js](/prebid-server/use-cases/pbs-pbjs.html), and server-side ad inclusion scenarios such as [long-form video](/prebid-server/use-cases/pbs-lfv.html) and audio.

![Prebid Server Architecture](/assets/images/flowcharts/prebid-server/pbs-basic-flow.png){:class="pb-xlg-img"}

Prebid Server is a header bidding server with a growing list of features. At a high level, it works like this:

1. Prebid Server validates and enhances incoming requests
  - Resolves dynamic stored requests
  - Enforces privacy regulations
2. Next, it calls server-side bid adapters
  - There are 140+ server-side bid adapters available
3. After everyone's responded (or the timeout period has expired), it formulates an appropriate response
  - Handles currency conversion
  - Quantizes bids
  - Caches VAST XML or creatives as needed

It also has optional analytics support.

The Prebid Cache is an adjunct to Prebid Server that stores VAST and bids as needed, supporting video and AMP use cases.

Explore [Prebid Server features](/prebid-server/features/pbs-feature-idx.html) in more detail.

## Where to Run Prebid Server

Unlike Prebid.js, Prebid Server is a server. It needs somewhere to run, and that somewhere ought to be scaleable, distributed, and fast.

### Hosted

The simplest route to working with Prebid Server is to sign up for a hosted solution. Several [Prebid.org members](https://prebid.org/product-suite/managed-services/) host up-to-date server software with a global footprint, and provide tools to manage stored requests.

### DIY

But of course this is open source, so you're welcome to do this on your own. If you'd like to explore implementing your own Prebid Server solution, check out the [Prebid Server host company overview](/prebid-server/hosting/pbs-hosting.html). Be warned that installing PBS is not nearly as easy as Prebid.js.

## Which Server-Side Bidders to Utilize

We've provided a [full list of Prebid Server bidders](/dev-docs/pbs-bidders.html), including various details about those bidders, such as media types supported and contact info.

If you're a demand source, we also have information about [creating your own server-side adapter](/prebid-server/developers/add-new-bidder-go.html).

## Where to Find Help

If you need help with Prebid Server, the best ways to communicate with us are:

- [Post an issue](https://github.com/prebid/prebid-server/issues) in the prebid-server GitHub repo.
- [Join prebid.org](https://prebid.org/membership/) and get access to our Slack workspace.

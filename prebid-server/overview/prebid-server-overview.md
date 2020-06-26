---
layout: page_v2
title: Prebid Server Overview
description: Prebid Server Overview
sidebarType: 5
---

# Prebid Server Overview
{:.no_toc}

Prebid Server is an open-source solution for server-to-server header bidding. It supports a number of key use cases: [mobile app](/prebid-server/use-cases/pbs-sdk.html), [AMP](/prebid-server/use-cases/pbs-amp.html), [server-side web with Prebid.js](/prebid-server/use-cases/pbs-pbjs.html), and [long-form video](/prebid-server/use-cases/pbs-lfv.html).

![Prebid Server Architecture](/assets/images/prebid-server/pbs-architecture.png)

At a high level, Prebid Server is basically an intelligent proxy server with a growing list of features:
- Completes and validates incoming requests
  - Dynamic stored requests
  - Privacy regulation support
- Calls server-side bid adapters
  - There are currently 70+ server-side bid adapters available
- Forumulates an appropriate response
  - Currency conversion
  - Bid quantization
  - VAST XML caching
- Optional analytics support

The Prebid Cache Server is an adjunct to Prebid Server that stores VAST and bids as needed, supporting video and AMP use cases.

Explore [Prebid Server features in more detail](/prebid-server/pbs-features.html).

## Where will you run Prebid Server?

Unlike Prebid.js, Prebid Server is a server. It needs somewhere to run, and that somewhere ought to be scaleable, distributed, and fast.

### Hosted

Your simplest route to working with Prebid Server is to sign up for a hosted solution. Several [Prebid.org members host](/prebid-server/hosted-servers.html) up-to-date server software with a global footprint, and provide tools to manage stored requests.

### DIY

But of course this is open source, so you're welcome to do this on your own. If you decide to implement your own Prebid Server solution, there are two
options:

- [Prebid Server (Go)](/prebid-server/versions/pbs-versions-go.html) - the original Prebid Server is written in the Go language.
- [Prebid Server (Java)](/prebid-server/versions/pbs-versions-java.html) - we also support a Java language port.

To choose between them, see the [FAQ entry](http://prebid.org/faq/prebid-server-faq.html#why-are-there-two-versions-of-prebid-server-are-they-kept-in-sync) and the [Prebid Server Feature Matrix](/prebid-server/versions/pbs-versions-overview.html)

## Which Server-Side Bidders will you utilize?

Here's the [full list of Prebid Server bidders](/dev-docs/prebid-server-bidders.html), including various details like media types supported and contact info.

You can also find [additional information](/prebid-server/developers/pbs-bidder-info.html) for some of the Prebid Server bidders that will help with implementation.

If you're a demand source, there's information about [creating your own server-side adapter](/prebid-server/bidders/pbs-build-a-bid-adapter.html).

## Have more questions?

If you need help with Prebid Server...

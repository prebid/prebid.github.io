---
layout: page_v2
title: Prebid Server FAQ | Prebid
description: Display Format
sidebarType: 5
---

# Prebid Server FAQ
{:.no_toc}

This page has answers to some frequently asked questions about Prebid Server. If you don't find what you're looking for here, there are other ways to [get help](/support/index.html).

* TOC
{:toc}

## How can I debug Prebid Server requests?

+ When invoking Prebid Server through Prebid.js, this can be done just by adding `?pbjs_debug=true` to the page URL.
+ Through AMP, you can put `test: 1` in the stored request, or add `debug=1` to the query string of Prebid Server's AMP endpoint.
+ If calling directly, add `test: 1` to the JSON.

## Why are there two versions of Prebid Server? Are they kept in sync?

The original version of Prebid Server was the Go-Lang version. Rubicon Project
ported it to Java because they had more Java talent than Go.

+ [Prebid Server - Go](https://github.com/prebid/prebid-server)
+ [Prebid Server - Java](https://github.com/rubicon-project/prebid-server-java)

Both versions are live in production, and they are kept identical in external APIs
and quite close in functionality. See [https://github.com/rubicon-project/prebid-server-java/blob/master/docs/differenceBetweenPBSGo-and-Java.md](https://github.com/rubicon-project/prebid-server-java/blob/master/docs/differenceBetweenPBSGo-and-Java.md) for the list of differences.

There are no plans at this point to stop development on either version.

## How can I use Prebid Server in a mobile app post-bid scenario?

Just schedule a [post-bid creative]({{site.baseurl}}/dev-docs/examples/postbid.html) in the ad server.

1. Load the production Prebid JS package
1. Set up the AdUnit
1. Set the app and device objects with setConfig(). e.g.

```
pbjs.setConfig({
    s2sConfig: {
    ...
    },
    app: {
        bundle: "com.test.app"
    },
    device: {
         ifa: "6D92078A-8246-4BA4-AE5B-76104861E7DC"
    }
});
```

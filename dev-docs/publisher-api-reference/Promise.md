---
layout: api_prebidjs
title: pbjs.Promise
description: Promise setting
sidebarType: 1
---

By default, Prebid uses a version of `Promise` that runs callbacks synchronously when it can (i.e. after it's been fulfilled or rejected).

This hogs the main thread, but has the advantage that Prebid auctions run faster and ads can be served quicker.

You can disable this behavior and switch to regular Javascript `Promise`s by either:

* Building using the `gulp build --disable GREEDY` command
* Calling `pbjs.Promise = window.Promise` before Prebid loads

Disabling this behavior should have the effect of breaking up long running tasks, 
but it might also potentially break things.
The timing of configuration changes taking effect, event handlers running, etc. all change (relative to when their setup code runs).
Do some proper A/B testing when you change this setting.

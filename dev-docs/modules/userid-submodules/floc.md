---
layout: userid
title: FLoC ID
description: FLoC ID User ID sub-module
useridmodule: flocIdSystem
---


The [Federated Learning of Cohorts (FLoC)](https://web.dev/floc/) system provides a privacy-preserving mechanism for interest-based ad selection. As a user moves around the web, their browser uses the FLoC algorithm to work out an "interest cohort", which will be the same for thousands of browsers with a similar recent browsing history. The user's browser is associated with one interest cohort at a time and recalculates its cohort periodically (currently once every seven days during this initial origin trial) on the user's device, without sharing individual browsing data with the browser vendor or anyone else.

There are two important things to note when using the FLoC Userid Sub adapter.

1. Unlike other user id subadapters FLoC ids cannot be stored in a cookie or Local Storage. FLoC ids change periodically and should always be fetched from the FLoC API

2. The function `(getGlobal()).getUserIds` returns `userId.flocId.id=value` into the bid request **NOT** `userid.userIdAsEids`.

To include the FLoC user id module use:

`$ gulp build --modules=flocIdSystem`

{: .alert.alert-info :}
Note: FLoC is still in a trial period. [How to take part in the FLoC origin trial](https://developer.chrome.com/blog/floc/). During the trial, a token is
required. Publishers may get their own token or use sharedid's token if they choose. Use this without the line breaks:
A3dHTSoNUMjjERBLlrvJSelNnwWUCwVQhZ5tNQ+sll7y+LkPPVZXtB77u2y7CweRIxiYaGw
GXNlW1/dFp8VMEgIAAAB+eyJvcmlnaW4iOiJodHRwczovL3NoYXJlZGlkLm9yZzo0NDMiLC
JmZWF0dXJlIjoiSW50ZXJlc3RDb2hvcnRBUEkiLCJleHBpcnkiOjE2MjYyMjA3OTksImlzU
3ViZG9tYWluIjp0cnVlLCJpc1RoaXJkUGFydHkiOnRydWV9

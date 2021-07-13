---
layout: api_prebidjs
title: pbjs.getNoBids()
description: 
---


Use this method to get all of the bid requests that resulted in a NO_BID.  These are bid requests that were sent to a bidder but, for whatever reason, the bidder decided not to bid on.  Used by debugging snippet in [Tips for Troubleshooting](/dev-docs/troubleshooting-tips.html).

+ `pbjs.getNoBids()`: returns an array of bid request objects that were deliberately not bid on by a bidder.
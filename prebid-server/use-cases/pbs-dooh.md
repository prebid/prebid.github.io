---
layout: page_v2
sidebarType: 5
title: Prebid Server | Use Cases | Digital Out Of Home

---

# Use Case: Prebid Server | Digital Out Of Home

Prebid Server (PBS) supports Digital Out Of Home (DOOH) advertising with this architecture:

## Workflow

Here's a workflow diagramming how this works.

![Prebid Server DOOH](/assets/images/flowcharts/prebid-server/pbs-dooh-flow.png){:class="pb-xlg-img"}

1. DOOH screen makes request for an ad either directly (1a) or through a Content Management System (1b)
2. The DOOH ad server sends an OpenRTB request to PBS, specifying the screen requirements.
3. PBS sends a request for bids to selected demand partners by relaying OpenRTB requests to them.
4. Demand partners return a bid response to PBS. Bid creative assets may be stored in Prebid Cache.
5. PBS returns the resulting bids to the DOOH ad server.
6. The ad server retrieves the cached DOOH bid assets as necessary.
7. The ad server returns the bid to the CMS or device.

## OpenRTB and DOOH

These are the fields in OpenRTB 2.6 that support the Digital Out Of Home use case:

- `dooh` - an object containing many values such as the venue type, publisher, etc.
- imp.qty - impression quantity
- imp.dt - estimated impression timestamp

Bidders generally expect these values to be present in the original Prebid Server request.

## Further Reading
- [DOOH in OpenRTB 2.6](https://github.com/InteractiveAdvertisingBureau/openrtb2.x/blob/main/2.6.md#objectdooh)

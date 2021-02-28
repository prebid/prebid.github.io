---
layout: page_v2
sidebarType: 5
title: Prebid Server | Endpoints | /getuids

---

# Prebid Server | Endpoints | /getuids

This endpoint is used to get the existing user IDs stored in the browser.

## GET /getuids

This endpoint parses the PBS cookie and returns the existing UserIDs for each bidder. This information can be used by publishers in server to server requests where the originating server doesn't have access to the PBS cookie.

### Sample Response

It returns JSON like:

```
{
  "buyeruids": {
    "adform": "588029602335910034",
    "adnxs": "4982333816692476501",
    "beachfront": "89332b37e7aa005103077666c383fe1f29dd125e",
    "indexExchange": "XE8m2dHM6qQAAAXtbYgAAACn&470",
    "ix": "XE8m2dHM6qQAAAXtbYgAAACn%26470",
    "pubmatic": "7C5B3A69-C579-4BB4-B859-50A2154F8391",
    "pulsepoint": "P1Lxj7xIFaNi",
    "rubicon": "JRGIQC4N-12-77A4",
    "somoaudience": "2b94f291c5a44e6e94f291c5a49e6ef6"
  }
}
```
{% include alerts/alert_note.html content="If there doesn't exist a cookie then this endpoint will return an empty JSON response." %}

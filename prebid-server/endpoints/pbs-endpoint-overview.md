---
layout: page_v2
sidebarType: 5
title: Prebid Server | Endpoints | Overview

---

# Prebid Server Endpoints Overview

Here's a summary of the API endpoints recognized by Prebid Server:

{: .table .table-bordered .table-striped }
| Endpoint | Purpose |
|----------+---------|
| [/openrtb2/auction](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html) | The main header bidding auction endpoint |
| [/openrtb2/amp](/prebid-server/endpoints/openrtb2/pbs-endpoint-amp.html) | The [AMP](/prebid-server/use-cases/pbs-amp.html) endpoint |
| [/openrtb2/video](/prebid-server/endpoints/openrtb2/pbs-endpoint-video.html) | Supports long-form video requests |
| [/cookie_sync](/prebid-server/endpoints/pbs-endpoint-cookieSync.html) | Responds with an array of pixels the client can use to initiate cookie-matching requests. |
| [/setuid](/prebid-server/endpoints/pbs-endpoint-setuid.html) | The other side of /cookie_sync, this is what actually updates the `uids` cookie. |
| [/getuids](/prebid-server/endpoints/pbs-endpoint-getuids.html) | Parses the `uids` cookie and returns JSON. |
| [/status](/prebid-server/endpoints/pbs-endpoint-status.html) | A health check. |
| [/info](/prebid-server/endpoints/info/pbs-endpoint-info.html) | Returns various information about how the server is configured. |
| [/event](/prebid-server/endpoints/pbs-endpoint-event.html) | (PBS-Java only) Alerts Prebid Server to process an event. |
| [/vtrack](/prebid-server/endpoints/pbs-endpoint-event.html) | (PBS-Java only) Cache VAST XML after inserting tracking string. |
| [/currency/rates](/prebid-server/endpoints/pbs-endpoint-admin.html) | (Admin port only) Retrieves the server's current currency conversion rates. |

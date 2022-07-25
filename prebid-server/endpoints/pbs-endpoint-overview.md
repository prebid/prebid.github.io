---
layout: page_v2
sidebarType: 5
title: Prebid Server | Endpoints | Overview

---

# Prebid Server Endpoints Overview

## Prebid Server

The API endpoints recognized by Prebid Server:

{: .table .table-bordered .table-striped }
| Endpoint | Purpose |
|----------+---------|
| [POST /openrtb2/auction](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html) | The main header bidding auction endpoint |
| [GET /openrtb2/amp](/prebid-server/endpoints/openrtb2/pbs-endpoint-amp.html) | The [AMP](/prebid-server/use-cases/pbs-amp.html) endpoint |
| [POST /openrtb2/video](/prebid-server/endpoints/openrtb2/pbs-endpoint-video.html) | Supports long-form video requests |
| [POST /cookie_sync](/prebid-server/endpoints/pbs-endpoint-cookieSync.html) | Responds with an array of pixels the client can use to initiate cookie-matching requests. |
| [GET /setuid](/prebid-server/endpoints/pbs-endpoint-setuid.html) | The other side of /cookie_sync, this is what actually updates the `uids` cookie. |
| [GET /getuids](/prebid-server/endpoints/pbs-endpoint-getuids.html) | Parses the `uids` cookie and returns JSON. |
| [GET /status](/prebid-server/endpoints/pbs-endpoint-status.html) | A health check. |
| [GET /info](/prebid-server/endpoints/info/pbs-endpoint-info.html) | Returns various information about how the server is configured. |
| [GET /event](/prebid-server/endpoints/pbs-endpoint-event.html) | Alerts Prebid Server to process an event. |
| [POST /vtrack](/prebid-server/endpoints/pbs-endpoint-event.html) | Cache VAST XML after inserting tracking string. |
| [/currency/rates](/prebid-server/endpoints/pbs-endpoint-admin.html) | (Admin port only) Retrieves the server's current currency conversion rates. |

## Prebid Cache

The API endpoints recognized by the [Prebid Cache](/prebid-server/features/pbs-caching.html) Server:

{: .table .table-bordered .table-striped }
| Endpoint | Purpose |
|----------+---------|
| [POST /cache](/prebid-server/endpoints/pbs-endpoints-pbc.html) | Store a creative or bid in Prebid Cache |
| [GET /cache](/prebid-server/endpoints/pbs-endpoints-pbc.html#get-cache) | Retrieve a creative or bid from Prebid Cache |

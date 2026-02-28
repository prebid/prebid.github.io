---
title: Prebid Server | Endpoints | Overview

---

# Prebid Server Endpoints Overview

## Prebid Server

The API endpoints recognized by Prebid Server:


| Endpoint | Purpose |
|----------+---------|
| [POST /openrtb2/auction](/dev-docs/prebid-server/endpoints/openrtb2/pbs-endpoint-auction) | The main header bidding auction endpoint |
| [GET /openrtb2/amp](/dev-docs/prebid-server/endpoints/openrtb2/pbs-endpoint-amp) | The [AMP](/dev-docs/prebid-server/use-cases/pbs-amp) endpoint |
| [POST /openrtb2/video](/dev-docs/prebid-server/endpoints/openrtb2/pbs-endpoint-video) | Supports long-form video requests |
| [POST /cookie_sync](/dev-docs/prebid-server/endpoints/pbs-endpoint-cookieSync) | Responds with an array of pixels the client can use to initiate cookie-matching requests. |
| [GET /setuid](/dev-docs/prebid-server/endpoints/pbs-endpoint-setuid) | The other side of /cookie_sync, this is what actually updates the `uids` cookie. |
| [GET /getuids](/dev-docs/prebid-server/endpoints/pbs-endpoint-getuids) | Parses the `uids` cookie and returns JSON. |
| [GET /status](/dev-docs/prebid-server/endpoints/pbs-endpoint-status) | A health check. |
| [GET /info](/dev-docs/prebid-server/endpoints/info/pbs-endpoint-info) | Returns various information about how the server is configured. |
| [GET /event](/dev-docs/prebid-server/endpoints/pbs-endpoint-event) | Alerts Prebid Server to process an event. |
| [POST /vtrack](/dev-docs/prebid-server/endpoints/pbs-endpoint-event) | Cache VAST XML after inserting tracking string. |
| [/currency/rates](/dev-docs/prebid-server/endpoints/pbs-endpoint-admin) | (Admin port only) Retrieves the server's current currency conversion rates. |

## Prebid Cache

The API endpoints recognized by the [Prebid Cache](/dev-docs/prebid-server/features/pbs-caching) Server:


| Endpoint | Purpose |
|----------+---------|
| [POST /cache](/dev-docs/prebid-server/endpoints/pbs-endpoints-pbc) | Store a creative or bid in Prebid Cache |
| [GET /cache](/dev-docs/prebid-server/endpoints/pbs-endpoints-pbc#get-cache) | Retrieve a creative or bid from Prebid Cache |

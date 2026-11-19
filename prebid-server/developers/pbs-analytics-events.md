---
layout: page_v2
sidebarType: 5
title: Prebid Server | Developers | Analytics Events
---

# Prebid Server - Analytics Events
{: .no_toc}

- TOC
{:toc }

## Overview

Prebid Server passes one event object to its analytics modules each time certain endpoints finish a request. This page lists those events for PBS-Go and PBS-Java: the request that triggers each one, the fields it carries, and how privacy settings filter what a module receives. It's written for analytics module authors, and for publishers who want to know what a host's analytics modules can see.

See [Building an Analytics Adapter](/prebid-server/developers/pbs-build-an-analytics-adapter.html) for how to write and register a module.

{: .alert.alert-info :}
The event objects are internal types, not a stable wire format. Field lists below were taken from PBS-Go commit [`9b8ab68`](https://github.com/prebid/prebid-server/tree/9b8ab68c8c64e145c592f615af36a2435cc98c11) (after 4.11.1) and PBS-Java commit [`9ac3345`](https://github.com/prebid/prebid-server-java/tree/9ac33456c4d57336fdb2514fa15b792fdfb3d20d) (after 4.5.1). PBS-Go's [`analytics/core.go`](https://github.com/prebid/prebid-server/blob/9b8ab68c8c64e145c592f615af36a2435cc98c11/analytics/core.go) advises modules to map these objects into their own model rather than serializing them directly.

## Event summary

Events are listed in the order they usually occur for a user: syncs first, then auctions, then win and impression notifications.

{: .table .table-bordered .table-striped }
| Event | Endpoint | PBS-Go type | PBS-Java type |
| --- | --- | --- | --- |
| Cookie sync | [`/cookie_sync`](/prebid-server/endpoints/pbs-endpoint-cookieSync.html) | `CookieSyncObject` | `CookieSyncEvent` |
| Set UID | [`/setuid`](/prebid-server/endpoints/pbs-endpoint-setuid.html) | `SetUIDObject` | `SetuidEvent` |
| Auction | [`/openrtb2/auction`](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html) | `AuctionObject` | `AuctionEvent` |
| AMP | [`/openrtb2/amp`](/prebid-server/endpoints/openrtb2/pbs-endpoint-amp.html) | `AmpObject` | `AmpEvent` |
| Video | [`/openrtb2/video`](/prebid-server/endpoints/openrtb2/pbs-endpoint-video.html) | `VideoObject` | `VideoEvent` |
| Notification | [`/event`](/prebid-server/endpoints/pbs-endpoint-event.html) | `NotificationEvent` | `NotificationEvent` |

Both servers emit the same six events. Neither emits an analytics event for `/vtrack`, `/info`, `/status` or other endpoints. `/vtrack` only adds `/event` impression URLs to VAST; the notification event fires later, when the player calls that URL.

The interfaces are:

- **PBS-Go**: `analytics.Module` in [`analytics/core.go`](https://github.com/prebid/prebid-server/blob/9b8ab68c8c64e145c592f615af36a2435cc98c11/analytics/core.go) has one method per event: `LogCookieSyncObject`, `LogSetUIDObject`, `LogAuctionObject`, `LogAmpObject`, `LogVideoObject` and `LogNotificationEventObject`, plus `Shutdown`.
- **PBS-Java**: [`AnalyticsReporter`](https://github.com/prebid/prebid-server-java/blob/9ac33456c4d57336fdb2514fa15b792fdfb3d20d/src/main/java/org/prebid/server/analytics/AnalyticsReporter.java) has one generic method, `<T> Future<Void> processEvent(T event)`. The reporter switches on the event class from [`org.prebid.server.analytics.model`](https://github.com/prebid/prebid-server-java/tree/9ac33456c4d57336fdb2514fa15b792fdfb3d20d/src/main/java/org/prebid/server/analytics/model). It also implements `vendorId()` (its IAB GVL ID, used for TCF checks) and `name()`.

## Cookie sync

Emitted once per `/cookie_sync` request, after PBS has chosen which bidders to sync, or when the request fails.

{: .table .table-bordered .table-striped }
| Field | PBS-Go `CookieSyncObject` | PBS-Java `CookieSyncEvent` | Description |
| --- | --- | --- | --- |
| Status | `Status int` | `status Integer` | HTTP status returned. |
| Errors | `Errors []error` | `errors List<String>` | Set on failure, such as an invalid request or user opt-out. |
| Bidder status | `BidderStatus []*CookieSyncBidder` | `bidderStatus List<BidderUsersyncStatus>` | One entry per bidder in the response: `bidder`, `no_cookie`/`noCookie`, and `usersync` with the sync `url` and `type` (`iframe` or `redirect`). Java also has `error`. Empty on failure. |

- **PBS-Go**: [`endpoints/cookie_sync.go`](https://github.com/prebid/prebid-server/blob/9b8ab68c8c64e145c592f615af36a2435cc98c11/endpoints/cookie_sync.go#L463-L470) (errors) and [`handleResponse`](https://github.com/prebid/prebid-server/blob/9b8ab68c8c64e145c592f615af36a2435cc98c11/endpoints/cookie_sync.go#L553-L556) (success).
- **PBS-Java**: [`CookieSyncHandler`](https://github.com/prebid/prebid-server-java/blob/9ac33456c4d57336fdb2514fa15b792fdfb3d20d/src/main/java/org/prebid/server/handler/CookieSyncHandler.java#L217-L223), after the response is written.

## Set UID

Emitted once per `/setuid` call, which a bidder's sync pixel triggers to store its user ID in the `uids` cookie.

{: .table .table-bordered .table-striped }
| Field | PBS-Go `SetUIDObject` | PBS-Java `SetuidEvent` | Description |
| --- | --- | --- | --- |
| Status | `Status int` | `status Integer` | HTTP status returned, e.g. 200, 400, or 451 when TCF blocks the cookie write. |
| Bidder | `Bidder string` | `bidder String` | Syncer key from the `bidder` query parameter. Java leaves it empty on errors. |
| UID | `UID string` | `uid String` | User ID the bidder asked PBS to store. |
| Success | `Success bool` | `success Boolean` | Whether the cookie was updated. Go also sets it to true when an empty `uid` removes the bidder's ID. |
| Errors | `Errors []error` | n/a | Go only. Java error events carry the status only. |

- **PBS-Go**: [`endpoints/setuid.go`](https://github.com/prebid/prebid-server/blob/9b8ab68c8c64e145c592f615af36a2435cc98c11/endpoints/setuid.go#L45-L50), in a deferred call, so every exit path emits it.
- **PBS-Java**: [`SetuidHandler`](https://github.com/prebid/prebid-server-java/blob/9ac33456c4d57336fdb2514fa15b792fdfb3d20d/src/main/java/org/prebid/server/handler/SetuidHandler.java#L310-L318) on success and `handleErrors` on failure.

## Auction

Emitted once per `/openrtb2/auction` request, when the request ends: after the response is sent, or after a validation failure, a hook rejection or an internal error.

{: .table .table-bordered .table-striped }
| Field | PBS-Go `AuctionObject` | PBS-Java `AuctionEvent` | Description |
| --- | --- | --- | --- |
| Status | `Status int` | `status Integer` | HTTP status returned. |
| Errors | `Errors []error` | `errors List<String>` | Request errors and warnings. |
| Request | `RequestWrapper *openrtb_ext.RequestWrapper` | `auctionContext.bidRequest` | The OpenRTB request after stored-request merging and PBS processing, filtered per module (see [Privacy](#privacy-and-activity-controls)). |
| Response | `Response *openrtb2.BidResponse` | `bidResponse` | The OpenRTB response returned to the client. |
| Account | `Account *config.Account` | `auctionContext.account` | Resolved account configuration. |
| Rejected bids | `SeatNonBid []openrtb_ext.SeatNonBid` | `auctionContext.bidRejectionTrackers` | Bids and imps that didn't produce a bid, with [non-bid status codes](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#seat-non-bid). Java keeps a tracker per bidder. |
| Module results | `HookExecutionOutcome []hookexecution.StageOutcome` | `auctionContext.hookExecutionContext` | Hook outcomes per stage, including [analytics tags](/prebid-server/developers/module-atags.html). |
| Start time | `StartTime time.Time` | `auctionContext.timeoutContext.startTime` | When PBS received the request. Use it to compute total auction time. |
| HTTP request | n/a | `httpContext` | Java only: method, URI, query parameters and headers, including `Cookie`. |
| Other context | n/a | `auctionContext` | Java only: privacy, GPP and debug context, the `uids` cookie, bidder participation and debug HTTP calls. |

- **PBS-Go**: [`endpoints/openrtb2/auction.go`](https://github.com/prebid/prebid-server/blob/9b8ab68c8c64e145c592f615af36a2435cc98c11/endpoints/openrtb2/auction.go#L185-L189), in a deferred call, so every exit path emits it.
- **PBS-Java**: [`AuctionHandler`](https://github.com/prebid/prebid-server-java/blob/9ac33456c4d57336fdb2514fa15b792fdfb3d20d/src/main/java/org/prebid/server/handler/openrtb2/AuctionHandler.java#L292-L303), only if the response was written. No event is emitted when the client connection fails, or when the auction is skipped because the request carries a top-level `ext.prebid.storedauctionresponse`.

## AMP

Emitted once per `/openrtb2/amp` request, at the same point as the auction event.

{: .table .table-bordered .table-striped }
| Field | PBS-Go `AmpObject` | PBS-Java `AmpEvent` | Description |
| --- | --- | --- | --- |
| Status | `Status int` | `status Integer` | HTTP status returned. |
| Errors | `Errors []error` | `errors List<String>` | Request errors and warnings. |
| Request | `RequestWrapper` | `auctionContext.bidRequest` | The OpenRTB request built from the AMP stored request. |
| Response | `AuctionResponse *openrtb2.BidResponse` | `bidResponse` | The OpenRTB response of the underlying auction. |
| Targeting | `AmpTargetingValues map[string]string` | `targeting Map<String, JsonNode>` | Targeting key-values returned to the AMP page. Java sets it from the AMP response in [`AmpHandler`](https://github.com/prebid/prebid-server-java/blob/9ac33456c4d57336fdb2514fa15b792fdfb3d20d/src/main/java/org/prebid/server/handler/openrtb2/AmpHandler.java#L196). |
| Origin | `Origin string` | `origin String` | The `__amp_source_origin` query parameter. |
| Rejected bids | `SeatNonBid` | `auctionContext.bidRejectionTrackers` | As for auction. |
| Module results | `HookExecutionOutcome` | `auctionContext.hookExecutionContext` | As for auction. |
| Start time | `StartTime time.Time` | `auctionContext.timeoutContext.startTime` | As for auction. |
| Account | n/a | `auctionContext.account` | Go doesn't include the account. Read it from `RequestWrapper`'s publisher ID. |
| HTTP request | n/a | `httpContext` | Java only. |

- **PBS-Go**: [`endpoints/openrtb2/amp_auction.go`](https://github.com/prebid/prebid-server/blob/9b8ab68c8c64e145c592f615af36a2435cc98c11/endpoints/openrtb2/amp_auction.go#L137-L141), deferred.
- **PBS-Java**: [`AmpHandler`](https://github.com/prebid/prebid-server-java/blob/9ac33456c4d57336fdb2514fa15b792fdfb3d20d/src/main/java/org/prebid/server/handler/openrtb2/AmpHandler.java#L448-L458), only if the response was written.

## Video

Emitted once per `/openrtb2/video` (long-form video ad pod) request.

{: .table .table-bordered .table-striped }
| Field | PBS-Go `VideoObject` | PBS-Java `VideoEvent` | Description |
| --- | --- | --- | --- |
| Status | `Status int` | `status Integer` | HTTP status returned. |
| Errors | `Errors []error` | `errors List<String>` | Request errors. |
| Video request | `VideoRequest *openrtb_ext.BidRequestVideo` | n/a | Go only: the original pod request. |
| OpenRTB request | `RequestWrapper` | `auctionContext.bidRequest` | The OpenRTB request generated from the pod request. |
| OpenRTB response | `Response *openrtb2.BidResponse` | `auctionContext.bidResponse` | The response of the underlying auction. |
| Video response | `VideoResponse *openrtb_ext.BidResponseVideo` | `bidResponse VideoResponse` | `adPods[]` with per-pod targeting and errors, as returned to the client. Note that Java's `bidResponse` is the video response, not the OpenRTB response. |
| Rejected bids | `SeatNonBid` | `auctionContext.bidRejectionTrackers` | As for auction. |
| Start time | `StartTime time.Time` | `auctionContext.timeoutContext.startTime` | As for auction. |
| Account | n/a | `auctionContext.account` | Go doesn't include the account. |
| Module results | n/a | `auctionContext.hookExecutionContext` | Go doesn't include hook outcomes for video. |

- **PBS-Go**: [`endpoints/openrtb2/video_auction.go`](https://github.com/prebid/prebid-server/blob/9b8ab68c8c64e145c592f615af36a2435cc98c11/endpoints/openrtb2/video_auction.go#L161-L171), deferred.
- **PBS-Java**: [`VideoHandler`](https://github.com/prebid/prebid-server-java/blob/9ac33456c4d57336fdb2514fa15b792fdfb3d20d/src/main/java/org/prebid/server/handler/openrtb2/VideoHandler.java#L290-L293), only if the response was written.

## Notification

Emitted when a `/event` URL is called, for example a win URL or an impression pixel that PBS added to a bid (see [Events](/prebid-server/endpoints/pbs-endpoint-event.html)). This is the only post-auction event, and it carries `bidid` and `bidder` so analytics systems can join it to the auction that produced the bid.

PBS skips the event when the request has `x=0`, and rejects it when events aren't enabled for the account (`events.enabled` in PBS-Go, `auction.events.enabled` in PBS-Java).

{: .table .table-bordered .table-striped }
| Field | PBS-Go `NotificationEvent` | PBS-Java `NotificationEvent` | Description |
| --- | --- | --- | --- |
| Type | `Request.Type` | `type` | `win` or `imp`. Go also accepts `vast`. |
| VAST event | `Request.VType` | n/a | Go only: `start`, `firstQuartile`, `midPoint`, `thirdQuartile` or `complete` when `type` is `vast`. |
| Bid ID | `Request.BidID` | `bidId` | The `b` parameter. |
| Bidder | `Request.Bidder` | `bidder` | The `bidder` parameter. |
| Account | `Account *config.Account` (ID also in `Request.AccountID`) | `account` | Resolved account. |
| Timestamp | `Request.Timestamp` | `timestamp` | The `ts` parameter: auction time in milliseconds. |
| Integration | `Request.Integration` | `integration` | The `int` parameter. |
| Format | `Request.Format` | n/a | Response format: `b` (blank) or `i` (pixel). |
| Analytics flag | `Request.Analytics` | n/a | Always `1`, since no event is emitted for `0`. |
| HTTP request | n/a | `httpContext` | Java only. |

- **PBS-Go**: [`endpoints/events/event.go`](https://github.com/prebid/prebid-server/blob/9b8ab68c8c64e145c592f615af36a2435cc98c11/endpoints/events/event.go#L120-L126); fields in [`analytics/event.go`](https://github.com/prebid/prebid-server/blob/9b8ab68c8c64e145c592f615af36a2435cc98c11/analytics/event.go).
- **PBS-Java**: [`NotificationEventHandler`](https://github.com/prebid/prebid-server-java/blob/9ac33456c4d57336fdb2514fa15b792fdfb3d20d/src/main/java/org/prebid/server/handler/NotificationEventHandler.java#L153-L167).

## Privacy and activity controls

PBS core decides which modules receive each event, and filters the request each module sees. The two servers apply different rules.

{: .table .table-bordered .table-striped }
| Control | PBS-Go | PBS-Java |
| --- | --- | --- |
| TCF Purpose 7 | Not checked for analytics. | Checked against each reporter's `vendorId()` for every event except notification. Uses host-level TCF settings; account `gdpr` overrides aren't applied. A reporter without legal basis doesn't receive the event. |
| [`reportAnalytics`](/prebid-server/features/pbs-activitycontrols.html) | Checked for auction, AMP, video and notification events. | Checked for auction, AMP and notification events. |
| `transmitUfpd` | Auction, AMP and video: user first party data, EIDs and device IDs are removed from the module's copy of the request. | Auction only: user first party data and device IDs are removed from the module's copy. |
| `transmitEids` | Covered by `transmitUfpd`. | Auction only: `user.eids` is removed. |
| `transmitPreciseGeo` | Auction, AMP and video: geo and IP are rounded. | Auction only: geo and IP are rounded. |
| `ext.prebid.analytics` | Auction, AMP and video: each module only sees its own entry. | Auction only: each module only sees its own entry. |
| Exempt modules | None. | `logAnalytics` receives the auction request without masking or `ext.prebid.analytics` filtering. |
| Cookie sync and set UID | No filtering. Every module receives them. | TCF Purpose 7 only. |

Notes:

- Activity control rules for analytics use `componentType: ["analytics"]` and the module's name as `componentName`. PBS-Go names are `filelogger`, `pubstack` and `agma`. PBS-Java names come from `name()`: `logAnalytics`, `pubstack`, `greenbids`, `agmaAnalytics` and `liveintentAnalytics`.
- Masking applies only to the OpenRTB request. Other fields are passed as they are: the response, the account, the `uid` in set UID events, and in PBS-Java the `httpContext` headers (including `Cookie`, `User-Agent` and forwarded IP headers).
- Account activity controls are only applied once the account is loaded. Events for requests that fail before that point aren't filtered by them.

## Delivery and configuration

{: .table .table-bordered .table-striped }
| Topic | PBS-Go | PBS-Java |
| --- | --- | --- |
| Delivery | Synchronous. Each module's `Log*` method runs in the request goroutine, from a deferred call in the endpoint handler, before the handler returns. Modules must hand work off quickly: the bundled `pubstack` and `agma` modules serialize the event and pass it to a background goroutine that batches and sends. | Asynchronous. After the response is written and the TCF check completes, each reporter's `processEvent` is scheduled on the Vert.x event loop. Reporters must not block, and return a `Future`. |
| Delivery metrics | None from core. | Per reporter and event type: `ok`, `timeout`, `badinput` or `err`, from the returned `Future`. |
| Enabling a module | Host config, e.g. `analytics.file.filename`, `analytics.pubstack.enabled`, `analytics.agma.enabled`. Modules are registered in [`analytics/build/build.go`](https://github.com/prebid/prebid-server/blob/9b8ab68c8c64e145c592f615af36a2435cc98c11/analytics/build/build.go). | Host config `analytics.<name>.enabled` creates the Spring bean. `analytics.global.adapters` lists the reporters that receive auction, AMP, video and notification events by default. Cookie sync and set UID events go to every enabled reporter. |
| Account control | None besides activity controls. | `analytics.modules.<name>.enabled` in account config overrides `analytics.global.adapters`. For auction, AMP and video events, other keys under `analytics.modules.<name>` are merged into `ext.prebid.analytics.<name>` on the request the module sees. |

## Cross-product analytics

These events are the server-side counterpart of the Prebid.js analytics events. Prebid.js analytics adapters receive a different set of events with different payloads: see [Integrate with the Prebid Analytics API](/dev-docs/integrate-with-the-prebid-analytics-api.html) and [pbjs.getEvents](/dev-docs/publisher-api-reference/getEvents.html).

To join server-side auctions to client-side activity:

- Prebid.js sends `ext.prebid.channel` and, when allowed, transaction IDs (`source.tid`, `imp[].ext.tid`) to PBS, so they appear in the request of the auction event.
- PBS returns [analytics tags](/prebid-server/developers/module-atags.html) to the client in `ext.prebid.analytics.tags` when both the account and the request allow it.
- Notification events carry the `bidid` and `bidder` of the winning bid.

## Known issues

These issues were found while writing this page and are open at the time of writing:

- PBS-Go: [#5107](https://github.com/prebid/prebid-server/issues/5107) (scrubbed request leaks between modules), [#5108](https://github.com/prebid/prebid-server/issues/5108) (hook-rejected auctions skip account activity controls), [#5109](https://github.com/prebid/prebid-server/issues/5109) (setuid passes the raw `uid` without activity controls).
- PBS-Java: [#4715](https://github.com/prebid/prebid-server-java/issues/4715) (AMP and video events skip activity controls applied to auction events), [#4716](https://github.com/prebid/prebid-server-java/issues/4716) (shared `ext.prebid.analytics` node is modified), [#4717](https://github.com/prebid/prebid-server-java/issues/4717) (cookie sync and setuid events ignore enablement config), [#4718](https://github.com/prebid/prebid-server-java/issues/4718) (setuid passes the raw `uid` with only the TCF check).

## Further reading

- [Building an Analytics Adapter](/prebid-server/developers/pbs-build-an-analytics-adapter.html)
- [Activity Controls](/prebid-server/features/pbs-activitycontrols.html)
- [Module Analytics Tags Conventions](/prebid-server/developers/module-atags.html)
- [Events endpoint](/prebid-server/endpoints/pbs-endpoint-event.html)

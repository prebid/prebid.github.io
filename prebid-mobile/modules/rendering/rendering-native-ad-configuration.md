---

layout: page_v2
title: Native Ad Configuration
description: Properties and structure of native ads
sidebarType: 2

---

# Native Ad Configuration


The `NativeAdConfiguration` class provides an ability to set *assets*, *event trackers* and other *OpenRTB parameters* required for Native Ads.

## Parameters

{: .table .table-bordered .table-striped }

| Property      | Default | Required    | Description |
|:---------------|:--------|:------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| context        | Undefined | recommended | The context in  which the ad appears                                                                                                                                                                                                                                                                                       |
| contextsubtype | Undefined | optional    | A more detailed context in which the ad appears                                                                                                                                                                                                                                                                            |
| plcmttype      | Undefined | recommended | The design/format/layout of the ad unit being offered                                                                                                                                                                                                                                                                      |
| seq            | -         | optional    | 0 for the first ad, 1 for the second ad, and so on. Note this would generally NOT be used in combination with plcmtcnt - either you are auctioning multiple identical placements (in which case plcmtcnt>1, seq=0) or you are holding separate auctions for distinct items in the feed (in which case plcmtcnt=1, seq=>=1) |
| assets         | -         | required    | An array of Asset Objects.                                                                                                                                                                                                                                                                                                 |
| eventtrackers  | -         | optional    | Specifies what type of event tracking is supported                                                                                                                                                                                                                                                                         |
| privacy        | false     | recommended | Set to 1 when the native ad supports buyer-specific privacy notice. Set to 0 when the native ad doesn’t support custom  privacy links or if support is unknown                                                                                                                                                             |
| ext            | -         | optional    | This object is a placeholder that may contain custom  JSON                                                                                                                                                                                                                                                                 |

> **Note:** `plcmtcnt`, `aurlsupport` and `durlsupport` OpenRTB fields are not supported

## Event Trackers

`NativeEventTracker` class is used to set up the `eventtrackers` field for the Native bid request respectively to the OpenRTB docs. 

The event tracker object specifies the kinds of events the bidder can request to be tracked in the bid response, and which types of tracking are available for each event type.

### Event Trackers Properties

{: .table .table-bordered .table-striped }

| Name                 | Description                                                  |
|:---------------------|:-------------------------------------------------------------|
| eventType            | Type of event available for tracking                         |
| eventTrackingMethods | Array of the types of tracking available for the given event |
| ext                  | The custom extension available to the publisher |


###  Event Trackers Enums

#### NativeEventType

{: .table .table-bordered .table-striped }

| Name             | ID   | Description                                                                    |
|:-----------------|:-----|:-------------------------------------------------------------------------------|
| Impression       | 1    | Impression                                                                     |
| MRC50            | 2    | Visible impression using MRC definition at 50% in view for 1second             |
| MRC100           | 3    | 100% in view for 1 second (ie GroupM  standard)                                |
| Video50          | 4    | Visible impression for video using MRC definition at 50% in view for 2 seconds |
| ExchangeSpecific | 500+ | Exchange specific                                                              |

#### NativeEventTrackingMethod

{: .table .table-bordered .table-striped }

| Name   | ID   | Description                                                                                                                               |
|:-------|:-----|:------------------------------------------------------------------------------------------------------------------------------------------|
| Image             | 1    | Image-pixel tracking - URL provided will be inserted as a 1x1 pixel at the time of the event                                              |
| JS                | 2    | Javascript-based tracking - URL provided will be inserted as a js tag at the time of the event                                            |
| ExchangeSpecific  | 500+ | Could include custom  measurement companies such as moat, double verify, IAS, etc - in this case additional elements will often be passed |


## Enums

### NativeContextType

{: .table .table-bordered .table-striped }

| Name            | ID   | Description                                                                                  |
|:----------------|:-----|:---------------------------------------------------------------------------------------------|
| Undefined       | 0    | Unset |
| ContentCentric  | 1    | Content-centric context such as news feed, article, image gallery, video gallery, or similar |
| SocialCentric   | 2    | Social-centric context such as social network feed, email, chat, or similar                  |
| Product         | 3    | Product context such as product listings, details, recommendations, reviews, or similar      |
| ExchangeSpecific| 500+ | To be defined by the exchange                                                                                             |

### NativeContextSubtype

> **NOTE**: SubType should only be combined with the primary context type as indicated (ie for a context type of 1, only context subtypes that start with 1 are valid).

{: .table .table-bordered .table-striped }

| Name                 | ID   | Description                                                                                  |
|:---------------------|:-----|:---------------------------------------------------------------------------------------------|
| Undefined            | 0    | Unset|
| GeneralOrMixed       | 10   | General or mixed content                                                                     |
| Article              | 11   | Primarily article content (which of course could include images, etc as part of the article) |
| Video                | 12   | Primarily video content                                                                                             |
| Audio                | 13   | Primarily audio content                                                                                             |
| Image                | 14   | Primarily image content                                                                                             |
| UserGenerated        | 15   | User-generated content - forums, comments, etc                                                                                             |
| Social               | 20   | General social content such as a general social network                                                                                     |
| Email                | 21   | Primarily email content                                                                                             |
| Chat                | 22   | Primarily chat/IM content                                                                                             |
| SellingProducts     | 30   | Content focused on selling products, whether digital or physical                                                                                             |
| ApplicationStore    | 31   | Application store/marketplace                                                                                             |
| ProductReview       | 32   | Product reviews site primarily (which may sell product secondarily)                                                                                             |
| ExchangeSpecific    | 500+ | To be defined by the exchange                                                                                             |

### NativePlacementType

{: .table .table-bordered .table-striped }

| Name                  | ID   | Description                                                                                                                    |
|:----------------------|:-----|:-------------------------------------------------------------------------------------------------------------------------------|
| Undefined             | 0    ||
| FeedGridListing       | 1    | In the feed of content - for example as an item inside the organic feed/grid/listing/carousel                                  |
| AtomicUnit            | 2    | In the atomic unit of the content - IE in the article page or single image page                                                |
| OutsideCoreContent    | 3    | Outside the core content - for example in the ads section on the right rail, as a banner-style placement near the content, etc |
| RecommendationWidget  | 4    | Recommendation widget, most commonly presented below the article content                                                       |
| ExchangeSpecific      | 500+ | To be defined by the exchange                                                                                                                               |

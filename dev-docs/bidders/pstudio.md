---
layout: bidder
title: PStudio
description: Prebid PStudio Bidder Adapter
biddercode: pstudio
gdpr_supported: false
gvl_id: none
usp_supported: false
coppa_supported: true
gpp_supported: false
schain_supported: false
dchain_supported: false
userId: UID 2.0
media_types: banner, video
safeframes_ok: false
deals_supported: false
floors_supported: false
fpd_supported: true
pbjs: true
pbs: false
prebid_member: false
multiformat_supported: will-not-bid
ortb_blocking_supported: false
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|---------------|----------|-----------------------|-----------|-----------|
| `pubid` | required | UUID of the publisher | `'7ccf149e-06e4-4fdc-80a8-426374010b4a'` | `string (UUID)` |
| `floorPrice` | required | Minimum price for the impression expressed in CPM in USD currency. | `1.15` | `float` |
| `bcat` | optional | Blocked advertiser categories using the IAB content categories | `['IAB1-1', 'IAB1-3']` | `Array<string>` |
| `bapp` | optional | Block list of applications by their platform-specific exchange-independent application identifiers | `['com.foo.mygame']` | `Array<string>` |
| `badv` | optional | Block list of advertisers by their domains | `['ford.com']` | `Array<string>` |

### First-Party Data

PStudio adapter supports below described first-party data passed as configuration options to the adapter itself.
These are the standard objects that are also well described in the OpenRTB 2.5 specification but
not all of the properties from the OpenRTB standard are supported.

- `user`
  - `yob` - Year of birth as a 4-digit integer.
  - `gender` - Gender, where "M" = male, "F" = female, "O" = known to be other (i.e., omitted is unknown).
- `device`
  - `ua` - Browser user agent string.
  - `dnt` - Standard “Do Not Track” flag as set in the header by the browser, where 0 = tracking is unrestricted, 1 = do not track.
  - `lmt` - "Limit Ad Tracking" signal commercially endorsed (e.g., iOS, Android), where 0 = tracking is unrestricted, 1 = tracking must be limited per commercial guidelines.
  - `ip` - IPv4 address closest to device.
  - `ipv6` - IP address closest to device as IPv6.
  - `devicetype` - General device type as specified in OpenRTB 2.5.
  - `make` - Device make (e.g., "Apple").
  - `model` - Device model (e.g., "iPhone").
  - `os` - Device operating system.
  - `osv` - Device operating system version (e.g., "8.0.3").
  - `js` - Support for JavaScript.
  - `language` - Browser language using ISO-639-1-alpha-2.
  - `carrier` - Carrier or ISP (e.g., "Verizon"). "WiFi" is often used in mobile to indicate high bandwidth.
  - `connectiontype` - Network connection type. See OpenRTB 2.5 docs for valid values.
  - `ifa` - ID sanctioned for advertiser use like IDFA or AAID (not hashed).
  - `geo`
    - `lat` - Latitude from -90.0 to +90.0, where negative is south.
    - `lon` - Longitude from -180.0 to +180.0, where negative is west.
    - `country` - Country code using ISO-3166-1-alpha-3.
    - `region` - Region code using ISO-3166-2; 2-letter state code if USA.
    - `regionfips104` - Region of a country using FIPS 10-4 notation (alternative to ISO 3166-2).
    - `metro` - Google metro code.
    - `city` - City using United Nations Code for Trade & Transport Locations.
    - `zip` - Zip or postal code.
    - `type` - Source of location data (GPS, IP address, user provided), recommended when passing lat / lon. Values as specified in OpenRTB 2.5.
  - `ext`
    - `ifatype` - IFA type as described by IAB.
- `site`
  - `id` - Exchange-specific site ID.
  - `name` - Site name.
  - `domain` - Domain of the site (e.g., "mysite.foo.com").
  - `page` - URL of the page where the impression will be shown.
  - `cat` - Array of IAB content categories of the site.
  - `sectioncat` - Array of IAB content categories that describe the current section of the site.
  - `pagecat` - Array of IAB content categories that describe the current page or view of the site.
  - `ref` - Referrer URL that caused navigation to the current page.
  - `publisher`
    - `name` - Publisher name.
    - `cat` - Array of IAB content categories that describe the publisher.
    - `domain` - Highest level domain of the publisher.
  - `content`
    - `id` - ID uniquely identifying the content.
    - `episode` - Episode number.
    - `title` - Content title.
    - `series` - Content series.
    - `artist` - Artist credited with the content.
    - `genre` - Genre that best describes the content (e.g., rock, pop, etc).
    - `album` - Album to which the content belongs; typically for audio.
    - `isrc` - International Standard Recording Code conforming to ISO-3901.
    - `season` - Content season (e.g., "Season 3").
  - `mobile` - Indicates if the web page is viewed on a mobile platform, where 0 = desktop, 1 = mobile.
- `app`
  - `id` - Exchange-specific app ID.
  - `name` - App name.
  - `bundle` - On Android, this should be a bundle or package name (e.g., com.foo.mygame). On iOS, it is typically a numeric ID.
  - `domain` - Domain of the app (e.g., "mygame.foo.com").
  - `storeurl` - App store URL for an installed app; for IQG 2.1 compliance.
  - `cat` - Array of IAB content categories of the app.
  - `sectioncat` - Array of IAB content categories that describe the current section of the app.
  - `pagecat` - Array of IAB content categories that describe the current page or view of the app.
  - `ver` - Application version.
  - `privacypolicy` - Indicates if the app has a privacy policy, where 0 = no, 1 = yes.
  - `paid` - Indicates if the app is paid, where 0 = app is free, 1 = app is paid.
  - `publisher` - Same as described in the `site` object.
  - `keywords` - Comma separated list of keywords about the app.
  - `content` - Same as described in the `site` object.
- `regs`
  - `coppa` - Inndicates whether this request is subject to the United States Children’s Online Privacy Protection Act (COPPA Regulations established by the USA FTC. Possible values include the following - 0(no) or 1 (yes)

**Note:** Publisher id for `app.publisher.id` or `site.publisher.id` is already sent in `params` as `pubid`, since it's a required parameter.

**Note:** Devicetype needs to be provided in `device.devicetype` field.
Otherwise the ad server is not able to determine a platform type for a prebid bid reqeust. If a request is sent from a mobile device, then `device.os` field needs to be provided too.

**Note:** User id is automatically assigned by the adapter to `user.id`. Adapter retrieves user.id from pstudio cookie. When user visits the publisher page for the first time the cookie is not present so user.id is not sent.

### User ID Data

PStudio adapter supports below described userIds data passed as configuration options to the adapter itself.

- `user_ids`
  - `uid2_token` - Advertising token of Unified ID 2.0

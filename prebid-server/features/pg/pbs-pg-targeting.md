---
layout: page_v2
sidebarType: 5
title: Programmatic Guaranteed Targeting Syntax
---

# Programmatic Guaranteed Targeting Syntax
{: .no_toc}

* TOC
{:toc}

## Overview

Targeting is the ability for Prebid Server (PBS) to match PG line items with
incoming OpenRTB auction requests.

Here's a simple example target that says this line item will match any request for a 300x250 banner:

```
{
  "$and": [
    {
      "adunit.size": {"$intersects": [{"w": 300,"h": 250}]}
    },
    {
      "adunit.mediatype": {"$intersects": ["banner"]}
    }
  ]
}
```

In general, the syntax is:
```
{
  "$and/$or": [
    { "ATTRIBUTE": { "OPERATOR": CONDITION } },
    "$and/$or": [ ... ],
    "$not": { "ATTRIBUTE": { "OPERATOR": CONDITION } }
  ]
}
```
Here are the supported OPERATORs:

{: .table .table-bordered .table-striped }
| Operator | Description | Attribute Datatype | Condition Datatype | Example |
| --- | --- | --- | --- |
| $matches | True if the scalar ATTRIBUTE is the same as the CONDITION, or matches with an asterisk wildcard. | string | string | "$matches": "{::nomarkdown}*sports*{:/}" |
| $in | True if the scalar ATTRIBUTE is on the CONDITION's array. | string | array of strings | "$in": ["a","b"] |
| $intersects | True if at least one value from the ATTRIBUTE's array is on the CONDITION's array | array of strings | array of strings | "$intersects": ["hockey","soccer"] |
| $within | True if user's lat/long are available and within the circle defined by the CONDITION. | from geolookup service | object with attributes: lat, lon, and radiusMiles | "$within": {"lat": 123.456,"lon": 789.123,"radiusMiles": 50} |

## Targeting Attributes

The full list of attributes supported by Prebid Server may differ by PG Host Company because they might use different geographic and device information services. But here's an example list:

{: .table .table-bordered .table-striped }
| Attribute | Description | Encoding | PBS Source | OpenRTB path | Operators |
| --- | --- | --- | --- | --- | --- |
| adunit.size | Ad Sizes | [{w: 300, h: 250},...] | OpenRTB | imp[].banner.format[] OR (imp[].video.w AND imp[].video.h) | intersects |
| adunit.mediatype | Mediatype | string | OpenRTB | mediatype="banner" if imp.banner exists. mediatype="video-instream" if imp.video exists and placement is 1. mediatype="video-outstream" if imp.video exists and placement is <> 1. mediatype="native" if imp.native exists | intersects |
| adunit.adslot | The ad server slot name | string | OpenRTB | imp[].ext.data.pbadslot OR imp[].ext.gpid OR imp[].tagid OR imp[].ext.data.adserver.adslot | in, matches |
| site.domain | Site domain | string | OpenRTB | site.domain | in, matches |
| site.referrer | Referring URL | string | OpenRTB | site.page | in, matches |
| app.bundle | Mobile application bundle | string | OpenRTB | app.bundle | in, matches |
| pos | Page position | 0=unknown, 1=ATF, 3=BTF | OpenRTB | imp.banner.pos | in |
| geo.distance | User's lat/lon is within a defined circle | none | Geo vendor | device.geo.lat, device.geo.lon | within |
| device.geo.ext.VENDOR.country | Country | string | Geo vendor | device.geo.ext.VENDOR.country | in|
| device.geo.ext.VENDOR.region | Region | string | Geo vendor | device.geo.ext.VENDOR.region | in|
| device.geo.ext.VENDOR.metro | Metro (DMA) | string | Geo vendor | device.geo.ext.VENDOR.metro | in|
| device.geo.ext.VENDOR.city | City | string | Geo vendor | device.geo.ext.VENDOR.city | in|
| device.geo.ext.VENDOR.zip | Postal Code | string | Geo vendor | device.geo.ext.VENDOR.zip | in|
| device.ext.VENDOR.connspeed | Connection Speed | string | Device vendor | device.ext.VENDOR.connspeed | in|
| device.ext.VENDOR.type | Device Type | string | Device vendor | device.ext.VENDOR.type | in|
| device.ext.VENDOR.make | Device Make | string | Device vendor | device.ext.VENDOR.make | in|
| device.ext.VENDOR.model | Device Model | string | Device vendor | device.ext.VENDOR.model | in|
| device.ext.VENDOR.os | Operating System | string | Device vendor | device.ext.VENDOR.os | in|
| device.ext.VENDOR.browser | Browser | string | Device vendor | device.ext.VENDOR.browser | in|
| device.ext.VENDOR.browserver | Browser Version | string | Device vendor | device.ext.VENDOR.browserver | in|
| device.ext.VENDOR.language | Device Language | string | Device vendor | device.ext.VENDOR.language | in|
| device.ext.VENDOR.osver | Operating System Version | string | Device vendor | device.ext.VENDOR.osver | in|
| device.ext.VENDOR.carrier | Internet Carrier | string | Device vendor | device.ext.VENDOR.carrier | in|
| user.ext.time.userdow | User Day of Week | 1=sun, 7=sat | Geo vendor + clock | user.ext.time.userdow | in|
| user.ext.time.userhour | User Hour | 0-23 |Geo vendor + clock | user.ext.time.userhour | in|
| ufpd.ATTR | User First Party Data | string | OpenRTB | user.ATTR or user.ext.data.ATTR | in, matches, intersects |
| sfpd.ATTR | Site First Party Data | string | OpenRTB | imp[].ext.data.ATTR=VAL OR imp[].ext.context.data.ATTR=VAL OR site.ext.data.ATTR=VAL OR app.ext.data.ATTR=VAL | in, matches, intersects |
| segment.SOURCE | User Segment Data | string | OpenRTB | user.data[].id=SOURCE AND VALUE in user.data[].segment[].id | intersects |
| bidp.BIDDER.ATTR | Bid Parameter Data | string | OpenRTB | imp[].ext.BIDDER.ATTR | in, matches, intersects|

## Targeting Syntax

Here's an example of a ridiculously specific target that uses most of the
attributes and specific geographic and device info services:

```
{
  "$and": [
    {
      "adunit.size": {"$intersects": [{"w": 300,"h": 250},{"w": 300,"h": 600}]}
    },
    {
      "adunit.mediatype": {"$intersects": ["banner"]}
    },
    {
      "$or": [
        {"site.ext.domain": {"$matches": "*.example.com"}},
        {"site.ext.domain": {"$in": ["prebid.org"]}}
      ]
    },
    {
      "$or": [
        {"site.referrer": {"$matches": "*sports*"}},
        {"site.referrer": {"$matches": "*prebid*"}}
      ]
    },
    {
      "$or": [
        {"adunit.adslot": {"$matches": "/home/top*"}},
        {"adunit.adslot": {"$in": ["/home/bottom"]}}
      ]
    },
    {
      "pos": {"$in": [1,3]}
    },
    {
      "device.geo.ext.netacuity.country": {"$in": ["us","de"]}
    },
    {
      "device.geo.ext.netacuity.region": {"$in": ["de-bw","de-by"]}
    },
    {
      "device.geo.ext.netacuity.metro": {"$in": ["111","222"]}
    },
    {
      "device.geo.ext.netacuity.city": {"$in": ["444","555"]}
    },
    {
      "geo.distance": {"$within": {"lat": 123.456,"lon": 789.123,"radiusMiles": 50}}
    },
    {
      "device.ext.deviceatlas.type": {"$in": ["tablet","phone"]}
    },
    {
      "$or": [
        {"bidp.rubicon.siteId": {"$in": [123,321]}},
        {"bidp.appnexus.placementName": {"$matches": "*99999*"}},
      ]
    },
    {
      "$or": [
        {"segment.rp": {"$intersects": [123,234,345]}},
        {"segment.bluekai": {"$intersects": [123,234,345]}}
      ]
    },
    {
      "sfpd.sport": {"$intersects": ["hockey","soccer"]}
    },
    {
      "user.ext.time.userdow": {"$in": [5,6]}
    },
    {
      "user.ext.time.userhour": {"$in": [10,11,12,13,14]}
    },
    {
      "$not": {
        "ufpd.registered": {"$matches": ["false"]}
      }
    }
  ]
}
```


## Related Topics

- [PG Home Page](/prebid-server/features/pg/pbs-pg-idx.html)
- [PG Plans](/prebid-server/features/pg/pbs-pg-plan.html)

---
layout: page_v2
sidebarType: 5
title: Prebid Server | Features | Interstitials

---

# Prebid Server | Features | Interstitials

Support for interstitial ads is enabled with the addition of two fields to the OpenRTB request: `device.ext.prebid.interstitial.minwidthperc`
and `device.ext.interstitial.minheightperc` The values will be numbers that indicate the minimum allowed
size for the ad, as a percentage of the base side. For example, a width of 600 and "minwidthperc": 60
would allow ads with widths from 360 to 600 pixels inclusive.

Example:

```
{
  "imp": [{
    ...
    "banner": {
      "format": [
        {"w":1, "h":1}
      ],
      ...
    }
    "instl": 1,
    ...
  }]
  "device": {
    ...
    "h": 640,
    "w": 320,
    "ext": {
      "prebid": {
        "interstitial": {
          "minwidthperc": 60,
          "minheightperc": 60
        }
      }
    }
  }
}
```

Upon receiving a request for an interstitial impression (`instl:1`) and these parameters set, PBS will rewrite the
`format` object within the interstitial imp object.

1. If the `format` array's first object is a size, PBS will take it as the max size for the interstitial.
2. If the first entry in `format` is 1x1, it will use the device's size as the max size.
3. Likewise, if `format` is not present, PBS will also use the device size as the max size.
4. Each PBS host company configures a list of common interstitial ad sizes, generally organized by weighing the larger and more common sizes first.
5. PBS generates a new format list for the interstitial imp by traversing this configured list and picking the first 10 sizes that fall within the imp's max size and minimum percentage size.
6. There's no attempt to favor aspect ratios closer to the original size's aspect ratio.
7. The limit of 10 is enforced to ensure we don't overload bidders with an overlong list.
8. The `minwidthperc` and `minheightperc` parameters are passed to bidder adapters, so if desired, they may use their own size matching algorithms.


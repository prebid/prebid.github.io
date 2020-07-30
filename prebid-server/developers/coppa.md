---
layout: page_v2
sidebarType: 5
title: Prebid Server | Developers | COPPA Support

---

# COPPA Support

The [Children's Online Privacy Protection Act (COPPA)](https://www.ftc.gov/enforcement/rules/rulemaking-regulatory-reform-proceedings/childrens-online-privacy-protection-rule) is a law created to protect the privacy of children under 13. The Act was passed by the U.S. Congress in 1998 and took effect in April 2000. COPPA is managed by the Federal Trade Commission (FTC).

Prebid-Server supports COPPA compliance by enabling developers to set a flag in the bid request. Developers can do so by setting:
```javascript
 `request.regs.coppa`
```
Once the flag is set the bid request object is modified and the following changes occur:

-  All Device ID fields are removed: `device.ifa`, `device.macsha1`, `device.macmd5`, `device.dpidsha1`, `device.dpidmd5`, `device.didsha1`, `device.didmd5`
-  Truncate `device.ip` field - remove lowest 8 bits.
-  Truncate `device.ipv6` field - remove lowest 32 bits.
-  Remove `geo.lat`, `geo.lon`, `geo.metro`, `geo.city`, and `geo.zip`
-  Remove `user.id`, `user.buyeruid`, `user.yob`, and `user.gender`

## Further Reading

- [Prebid Server Overview](/prebid-server/prebid-server-overview.html)
- [Prebid Server Default Request](/prebid-server/developers/default-request.html)

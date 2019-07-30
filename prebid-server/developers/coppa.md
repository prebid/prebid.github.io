# COPPA Support

Prebid-Server supports [COPPA (Children's Online Privacy Protection Rule)](http://www.coppa.org/) compliance and so, if `request.regs.coppa` flag is set in the bid request then the bid request object is modified as follows as per OpenRTB recommendation:

-   Remove `device.ifa`, `device.macsha1`, `device.macmd5`, `device.dpidsha1`, `device.dpidmd5`, `device.didsha1`, `device.didmd5`
-   Truncate `device.ip` field - remove lowest 8 bits.
-   Truncate `device.ipv6` field - remove lowest 32 bits.
-   Remove `geo.lat`, `geo.lon`, `geo.metro`, `geo.city`, and `geo.zip`
-   Remove `user.id`, `user.buyeruid`, `user.yob`, and `user.gender`

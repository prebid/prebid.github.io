---
layout: page_v2
page_type: module
title: Module - dmd
description: Reads first party cookie.
module_code : userId
display_name : DMD
sidebarType : 1
---

# DMD Module

This module reads first party cookies. It is the default behavior of module.

## Overview:

DMD ID module provides access healthcare professional (HCP) identity data to the pharmaceutical, health system and medical publishing industries using first-party cookies.

This module checks whether api_key, dmd-dgid(first party cookie) are present with valid values, if not logs an error message that these are not present.


#### Example:

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'dmdId',
            params: {
                partnerId: '123-45-67AK89' // provided to you by DMD
            }
        }]
    }
});
{% endhighlight %}


## Further Reading

[Prebid.js](http://prebid.org/dev-docs/getting-started.html)  
[Prebid Video](http://prebid.org/prebid-video/video-overview.html)

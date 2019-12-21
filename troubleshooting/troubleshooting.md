---
layout: page_v2
title: Troubleshooting Overview
description: Troubleshooting Overview
sidebarType: 7
---

# Troubleshooting

## Prebid.js

Enable javascript console trace messages by adding ```?pbjs_debug=true``` to the end of the page's URL. These messages can help isolate issues and improve debugging efforts.

+ [Prebid.js Developer Troubleshooting Guide]({{site.baseurl}}/troubleshooting/troubleshooting-guide.html)
+ [Prebid.js Troubleshooting Videos](/videos/)
+ [Debug Extension](/debugging/debugging.html)

## AdOps

+ [Common Setup Issues]({{site.github.url}}/dev-docs/common-issues.html)

## Prebid Server

There are several ways to get more debug info from Prebid Server:

### Direct Prebid Server Invocation

One of these parameters needs to be added to the OpenRTB:
- `"test":1` -- this will inform the bidders that this should be treated as a test (non-billable) request, and also provide additional debug info in the OpenRTB response.
- `"debug":1` -- this just adds the additional debug info.

{% highlight bash %}
POST https://prebid-server.rubiconproject.com/openrtb2/auction
{
    ...
    "test":1
}
{% endhighlight %}

### Invoked from Prebid.js

There are two ways to turn on the OpenRTB `test` flag from Prebid.js:

1) Add ?pbjs_debug=true to the URL of the page.

2) Add the following `setConfig` to the page:

{% highlight bash %}
    pbjs.setConfig({"debug":true});
{% endhighlight %}

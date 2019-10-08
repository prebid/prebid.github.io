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

To return debug data for Prebid Server add `&debug=1` to the end of the URL. A 'url_override' parameter is also available to help further isolate issues.

{% highlight bash %}
https://prebid-server.rubiconproject.com/auction?url_override=rubiconproject.com&debug=1
{% endhighlight %}

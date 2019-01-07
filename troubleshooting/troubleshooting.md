---
layout: page_v2
title: Troubleshooting Overview
description: Troubleshooting Overview
sidebarType: 7
---

# Troubleshooting

### Prebid.js

The most important tip is to add ```?pbjs_debug=true``` to the end of the page's URL -- you'll get a bunch of javascript console trace messages that will help pin down the issue.


Other references:

<br/>
AdOps

+ [Common Setup Issues]({{site.github.url}}/dev-docs/common-issues.html)

Developers

+ [Prebid.js Developer Troubleshooting Guide]({{site.baseurl}}/dev-docs/prebid-troubleshooting-guide.html)
+ [Developer Troubleshooting Tips]({{site.baseurl}}/dev-docs/troubleshooting-tips.html)
+ [Debug Extension](/debugging/debugging.html)

<hr>

### Prebid Server

The best way to get debug info for Prebid Server is to add `&debug=1` to the end of the URL. A 'url_override' parameter is also available. e.g.

<br/>
{% highlight bash %}
https://prebid-server.rubiconproject.com/auction?url_override=rubiconproject.com&debug=1
{% endhighlight %}


Additional debugging references are under construction.


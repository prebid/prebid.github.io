---
layout: page_v2
title: Prebid Video | JW Player (Platform) Example
description: Prebid client side video example for JW Player
top_nav_section: pbjs-video
nav_section: pbjs-video-examples
sidebarType: 4

---

## {{ page.title }}

An example of instream video being displayed with JW Player.

<div class="container pb-video-example">

  <div class="row" style="width:100%">
    {% include alerts/alert_important.html content="This example uses a test version of Prebid.js hosted on our CDN that is not recommended for production use.  It includes all available adapters.  Production implementations should build from source or customize the build using the <a href='http://prebid.org/download.html'>Download</a> page to make sure only the necessary bidder adapters are included." %}
  </div>

  <div class="pb-video-frame">
    <iframe width="640" height="500" src="//jsfiddle.net/vhp98ked/embedded/html,result/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
  </div>
</div>

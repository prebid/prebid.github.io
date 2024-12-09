---
layout: page_v2
title: Download Prebid.js
description: Documentation on how to download Prebid.js for header bidding.
sidebarType: 0
---

<style>
a.tip {
    border-bottom: 1px dashed;
    text-decoration: none
}
a.tip:hover {
    cursor: help;
    position: relative
}
a.tip span {
    display: none
}
a.tip:hover span {
    border: #c0c0c0 1px dotted;
    padding: 5px 20px 5px 5px;
    display: block;
    z-index: 100;
    left: 0px;
    background: #f0f0f0;
    margin: 10px;
    width: 300px;
    position: absolute;
    top: 10px;
    text-decoration: none
}
</style>

<script src="https://cdn.firebase.com/js/client/2.4.2/firebase.js"></script>
<script src="/assets/js/download.js"></script>

<style>
.disabled {
  color: #aaa;
}
</style>

<div class="bs-docs-section" markdown="1">

# Customize and Download Prebid.js

{: .lead :}

{: .alert.alert-warning :}
Prebid.js is open source software that is offered for free as a convenience. While it is designed to help companies address legal requirements associated with header bidding, we cannot and do not warrant that your use of Prebid.js will satisfy legal requirements. You are solely responsible for ensuring that your use of Prebid.js complies with all applicable laws.  We strongly encourage you to obtain legal advice when using Prebid.js to ensure your implementation complies with all laws where you operate.

{: .alert.alert-danger :}
**Note:** recommended modules are now checked by default. Please uncheck them as desired.

## Option 1: Customize your download here

{% assign bidder_pages = site.pages | where: "layout", "bidder" %}
{% assign module_pages = site.pages | where: "page_type", "module" %}
{% assign analytics_pages = site.pages | where: "layout", "analytics" %}
{% assign userid_pages = site.pages | where: "layout", "userid" %}

<form>
<h4>Select Prebid Version</h4>
<select id="version_selector" class="selectpicker">
</select>
<br>
<h4>Select Bidder Adapters</h4>
<div class="row adapters">
{% for page in bidder_pages %}{% if page.pbjs == true %}{% if page.enable_download == false %}{% continue %}{% endif %}
<div class="col-md-4">
 <div class="checkbox">
  <label>
  {% if page.filename %} <input type="checkbox" id="{{ page.filename }}" moduleCode="{{ page.filename }}" {% elsif page.aliasCode %} <input type="checkbox" id="{{ page.biddercode }}BidAdapter" moduleCode="{{ page.aliasCode }}BidAdapter" {% else %} <input type="checkbox" id="{{ page.biddercode }}BidAdapter" moduleCode="{{ page.biddercode }}BidAdapter" {% endif %} class="bidder-check-box module-check-box"><a href="{{page.url}}"> {{ page.title }}</a>
  {% if page.pbjs_version_notes %}<br/><div style="font-size:80%">{{page.pbjs_version_notes}}</div>{% endif %}
  </label>
</div>
</div>
{% endif %}{% endfor %}
</div>

<br>
<h4>Analytics Adapters</h4>
<div class="row">
{% for page in analytics_pages %}{% if page.enable_download == false %}{% continue %}{% endif %}<div class="col-md-4"><div class="checkbox"><label><input type="checkbox" id="{{ page.modulecode }}AnalyticsAdapter" moduleCode="{{ page.modulecode }}AnalyticsAdapter" class="analytics-check-box module-check-box"><a href="{{page.url}}"> {{ page.title }}</a></label></div></div>{% endfor %}
</div>
<br/>
<h4>Recommended Modules</h4>
Prebid.org highly recommends that publishers utilize the following modules:
<br/>
{% for page in module_pages %}{% if page.recommended == true %}<div class="row"><div class="checkbox" style="background-color: #e1fce2;"><label> <input type="checkbox" CHECKED id="{{ page.module_code }}" moduleCode="{{ page.module_code }}" minVersion="{{ page.min_js_version }}" class="bidder-check-box module-check-box"> <a href="{{page.url}}" class="tip"><strong>{{ page.display_name }}</strong></a> - {{page.description}}</label></div></div>{% endif %}{% endfor %}
<br/>
<h4>General Modules</h4>
<div class="row">
 {% for page in module_pages %}{% if page.enable_download == false or page.recommended == true or page.vendor_specific == true %}{% continue %}{% endif %}<div class="col-md-4"><div class="checkbox">
  <label> <input type="checkbox" id="{{ page.module_code }}" moduleCode="{{ page.module_code }}" minVersion="{{ page.min_js_version }}" class="bidder-check-box module-check-box"> <a href="{{page.url}}" class="tip">{{ page.display_name }}<span>{{page.description}}</span></a></label>
</div></div>{% endfor %}
</div>

<h4>Vendor-Specific Modules</h4>
These modules may require accounts with a service provider.<br/>
<div class="row">
 {% for page in module_pages %}{% if page.enable_download == false or page.recommended == true %}{% continue %}{% endif %}{% if page.vendor_specific == true %}<div class="col-md-4"><div class="checkbox"><label> <input type="checkbox" id="{{ page.module_code }}" moduleCode="{{ page.module_code }}" minVersion="{{ page.min_js_version }}" class="bidder-check-box module-check-box"> <a href="{{page.url}}" class="tip">{{ page.display_name }}<span>{{page.description}}</span></a></label>
</div></div>{% endif %}{% endfor %}
</div>

<h4>User ID Modules</h4>
<div class="row">
 {% for page in userid_pages %}{% if page.enable_download == false %}{% continue %}{% endif %}<div class="col-md-4"><div class="checkbox"><label> <input type="checkbox" id="{{ page.useridmodule }}" moduleCode="{{ page.useridmodule }}" class="bidder-check-box module-check-box"> <a href="{{page.url}}">{{ page.title }}</a></label>{% if page.pbjs_version_notes %}<br/><div style="font-size:80%">{{page.pbjs_version_notes}}</div>{% endif %}
</div></div>{% endfor %}
</div>

<br>

<div class="form-group">

<button id="download-button" type="button" class="btn btn-lg btn-primary">Get Prebid.js! </button>

</div>

</form>

<br>

{: .alert.alert-info :}
Note: If you receive an error during download you most likely selected a configuration that is not supported. Verify that each bidder / module is available in the selected version. Also please note that even though you can download older versions of Prebid.js,
Prebid only supports the most recent major version. Within a month or so after a major release (e.g. 3.x), we won't patch the previous major release (e.g. 2.x).

</div>

<div class="bs-docs-section" markdown="1">

## Option 2: Build from Source Code (More Advanced)

{: .lead :}
Alternatively, you can build Prebid.js from the source code. For instructions, see the [Prebid.js README on GitHub](https://github.com/prebid/Prebid.js/blob/master/README.md).

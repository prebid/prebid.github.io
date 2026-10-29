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
<script src="/assets/js/prebidBundler.js"></script>
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
<br/>
<label for="configFileInput"><strong>Upload Configuration</strong></label>
<input type="file" id="configFileInput" accept="application/json" />
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

</div>

<div class="bs-docs-section" markdown="1">

## Option 3: Load from the jsDelivr CDN

{: .lead :}
Since Prebid.js 11.40.0, each release includes a loader, `bundle.js`, that assembles Prebid.js in the browser from individual modules hosted on [jsDelivr](https://www.jsdelivr.com/package/npm/prebid.js). No build step is needed: list the modules you want in the script URL.

```html
<script async src="https://cdn.jsdelivr.net/npm/prebid.js@11.40.0/dist/bundle.js?modules=rubiconBidAdapter,consentManagementTcf,tcfControl"></script>
```

Replace `11.40.0` with the Prebid.js version you want to use (11.40.0 or later). The loader:

1. Fetches the manifest for that release, which lists every module, its dependencies, and its checksum. The manifest itself is verified against a checksum built into `bundle.js`.
1. Works out which files are needed: `prebid-core`, the requested modules and their dependencies, plus the `.metadata.js` disclosure files if `storageControl` is one of the requested modules.
1. Adds a `<script>` tag for each file, with an `integrity` attribute set to the file's checksum.
1. Once all files have loaded, processes the command queue of the Prebid.js global (`pbjs.que` by default; see `globalVarName` below).

The following query parameters are supported:

{: .table .table-bordered .table-striped }
| Parameter | Description |
| --- | --- |
| `modules` | Modules to include, using their file names in `dist/chunks/` without the `.js` extension (for example `rubiconBidAdapter`). Separate names with commas, or repeat the parameter (`modules=a&modules=b`). `prebid-core` and module dependencies are added automatically. |
| `globalVarName` | Name of the Prebid.js global variable. Default is `pbjs`. |
| `distUrlBase` | Base URL to load the manifest and module files from. Default is `https://cdn.jsdelivr.net/npm/prebid.js@<version>/dist/chunks/`. The files must be identical to the ones published with that release, as each is checked against its checksum. |

The `defineGlobal` build option is not supported, since the global variable is the only way to interact with Prebid.js when it is loaded this way.

If any module in the list cannot be found, no modules are loaded and the loader fails with a `Cannot find modules: ...` error. If a Prebid.js instance using the same global variable is already on the page, the loader aborts without loading anything, and logs a console warning if `debug` is enabled.

### Cross-Origin Storage

Module scripts are added with `crossorigin="anonymous"` and `crossoriginstorage="*"` attributes. `crossoriginstorage` comes from the [Cross-Origin Storage](https://github.com/WICG/cross-origin-storage) proposal, which aims to let browsers keep a single cached copy of a file, identified by its checksum, and share it across sites. Because every site using the same Prebid.js version loads byte-identical module files, those files could be served from that shared cache. Browsers that do not support the attribute ignore it and load the files normally.

### Notes

- Your Content Security Policy (if any) must allow scripts from `https://cdn.jsdelivr.net`, or from your `distUrlBase` host. Because files are loaded with `crossorigin="anonymous"` and an `integrity` check, a custom `distUrlBase` host must also send CORS headers (`Access-Control-Allow-Origin`).
- Always use a specific version in the URL. Each `bundle.js` only works with the manifest and module files of its own release.
- Builds from source also produce `prebid.web.js`, a drop-in replacement for `prebid.js` that contains only the names and checksums of the selected modules and loads them from `distUrlBase` in the same way. In the npm package it can be found under `dist/not-for-prod/`. It only works when built from a tagged release: when the version ends in `-pre` (for example, a build of the `master` branch), the default `distUrlBase` points to `latest`, whose files will not match the checksums.

</div>

## Option 4: Use Prebid.js as an npm Dependency

{: .lead :}
If your project is already built with a JavaScript bundler, you can install Prebid.js from npm and bundle it with the rest of your code.

```bash
npm install prebid.js
```

Instead of choosing modules with `--modules` or the checkboxes above, you choose them by importing them, using their names from Prebid's [modules directory](https://github.com/prebid/Prebid.js/tree/master/modules):

```javascript
import pbjs from 'prebid.js';

import 'prebid.js/modules/rubiconBidAdapter';
import 'prebid.js/modules/userId';         // parent module of sharedIdSystem
import 'prebid.js/modules/sharedIdSystem';

pbjs.processQueue();
```

- Since Prebid.js 10, the npm package contains precompiled code, so it works with any bundler or compiler (webpack, SWC, Bun, Rollup, Vite, ...) without Babel or any Prebid-specific configuration. Earlier versions required Prebid's Babel settings.

For complete webpack + SWC and Bun examples, see [Usage (as a npm dependency)](https://github.com/prebid/Prebid.js/blob/master/README.md#Usage) in the Prebid.js README.

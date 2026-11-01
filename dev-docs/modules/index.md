---
layout: page_v2
title: Prebid.js Modules
description: Module Documentation
sidebarType: 1
---

# Prebid.js Module Overview
{:.no_toc}

The core of Prebid.js contains only the foundational code needed for header bidding. Any functionality that could be considered an add-on is part of a module. These are the major categories:

- [Bidder adapters](/dev-docs/bidders.html)
- [Analytics adapters](/overview/analytics.html)
- Any other extensible functionality - documented on this page

- TOC
{:toc}

{% assign module_pages = site.pages | where: "page_type", "module" %}

## Recommended Modules

Prebid.org highly recommends that publishers utilize the following modules:
<br/>
<table class="table table-bordered table-striped">
  <thead>
    <tr>
      <th>Module</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
{% for page in module_pages %}{% if page.recommended == true %}
    <tr>
      <td><a href="{{page.url}}"><strong>{{page.display_name}}</strong></a></td>
      <td>{{page.description}}</td>
    </tr>
{% endif %}{% endfor %}
</tbody>
</table>

## General Modules

Modules in the Real-Time Data (RTD) category conform to
a consistent set of publisher controls. The publisher can choose to run multiple
RTD modules, define an overall amount of time they're willing to wait for
results, and even flag some of the modules as being higher priority
than others. See [the realTimeData setConfig](/dev-docs/publisher-api-reference/setConfig.html#setConfig-realTimeData) reference for more details.

<table class="table table-bordered table-striped">
  <thead>
    <tr>
      <th>Module</th>
      <th>Description</th>
      <th>RTD?</th>
    </tr>
  </thead>
  <tbody>
{% for page in module_pages %}{% if page.recommended == true or page.vendor_specific == true or page.enable_download == false %}{% continue %}{% endif %}
    <tr>
      <td><a href="{{page.url}}"><strong>{{page.display_name}}</strong></a></td>
      <td>{{page.description}}</td>
      {% if page.module_type == "rtd" %}<td>yes</td>{% else %}<td>no</td>{% endif %}
    </tr>
{% endfor %}
</tbody>
</table>

## Vendor-Specific Modules

These modules may require accounts with a service provider.
<table class="table table-bordered table-striped">
  <thead>
    <tr>
      <th>Module</th>
      <th>Description</th>
      <th>RTD?</th>
    </tr>
  </thead>
  <tbody>
{% for page in module_pages %}{% if page.recommended == true or page.enable_download == false %}{% continue %}{% endif %}{% if page.vendor_specific == true %}
    <tr>
      <td><a href="{{page.url}}"><strong>{{page.display_name}}</strong></a></td>
      <td>{{page.description}}</td>
      {% if page.module_type == "rtd" %}<td>yes</td>{% else %}<td>no</td>{% endif %}
    </tr>
{% endif %}{% endfor %}
</tbody>
</table>

## User ID Modules

UserID modules conform to a consistent set of publisher controls. The publisher can choose to run multiple user id modules, define an overall amount of time they're willing to wait for
results. See [the userSync setConfig](/dev-docs/publisher-api-reference/setConfig.html#setConfig-ConfigureUserSyncing-UserSyncProperties) reference and the [User ID Module](/dev-docs/modules/userId) for more details.

{% assign userid_module_pages = site.pages | where: "layout", "userid" %}

<table class="table table-bordered table-striped">
  <thead>
    <tr>
      <th>Module</th>
      <th>Description</th>
      <th>EID Source</th>
    </tr>
  </thead>
  <tbody>
{% for page in userid_module_pages %}
    <tr>
      <td><a href="{{page.url}}"><strong>{{page.title}}</strong></a></td>
      <td>{{page.description}}</td>
      <td>{{page.eidsource}}</td>
    </tr>
{% endfor %}
</tbody>
</table>

## Loading modules separately

There are situations where a publisher uses different modules depending on various factors, such as specific pages or locations. This creates the inconvenience of having to load a Prebid build that is larger than what a particular page actually needs. While it’s possible to work around this by creating separate Prebid builds for different pages, that approach doesn’t scale well. Since a Prebid build is composed of concatenated chunks, it’s possible to load modules separately, allowing you to have a main Prebid file that contains only the modules shared across all pages.

{: .alert.alert-info :}
Since Prebid.js 11.40.0, you can also load Prebid.js directly from jsDelivr with only the modules a page needs, without hosting or building anything: the `bundle.js` loader resolves module dependencies and loads each file for you. See [Load from the jsDelivr CDN](/download.html#option-3-load-from-the-jsdelivr-cdn).

### Build a small bundle or reuse compiled modules

To include one bidder adapter and its required core code, build with the module
**filename** (without `.js`):

```sh
npm ci
npx gulp build --modules=openxBidAdapter
```

This generates a usable Prebid.js bundle with core, the selected adapter, and
its dependencies. It does **not** produce a standalone bidder script that can
run without Prebid core. An adapter alias may share another adapter's module
file; select the actual module filename when that is the case.

If you need several different selections from the **same** Prebid.js version,
compile once, then use `gulp bundle` to concatenate the already-built chunks:

```sh
npx gulp build
npx gulp bundle --modules=openxBidAdapter --tag openx
npx gulp bundle --modules=rubiconBidAdapter --tag rubicon
```

The tagged files are written to `build/dist/prebid.openx.js` and
`build/dist/prebid.rubicon.js`. Unlike `gulp build`, `gulp bundle`
**does not recompile** sources or generate a bidder adapter in isolation;
it requires the build output to exist. Each tagged file is a complete
Prebid.js bundle, not an add-on to an already loaded instance.

### Conditionally load a module after an event (npm)

If your site bundles the npm package with a tool that supports dynamic
`import()` (such as Webpack, Rollup, or Vite), the adapter can be placed in a
separate network chunk. Only import it when the page needs it, then wait for
the import to finish **before** requesting bids that depend on it:

```javascript
import pbjs from 'prebid.js';
// Import any required privacy and consent-control modules up front.
pbjs.processQueue();

// Replace with the relevant CMP or publisher-specific event/decision.
async function optionalBidderIsAllowed() {
  return false; // Fail closed until the real integration is implemented.
}

async function onOptionalBidderReady(adUnits) {
  if (!(await optionalBidderIsAllowed())) return;

  try {
    // The module registers its bidder when the import resolves.
    await import('prebid.js/modules/openxBidAdapter');
  } catch (error) {
    console.error('Could not load optional Prebid bidder', error);
    return;
  }

  // The queue ensures the core is ready; this auction waits for the adapter.
  pbjs.que.push(function () {
    pbjs.requestBids({ adUnits });
  });
}

// Call onOptionalBidderReady(adUnits) from your actual CMP or page event.
```

Keep the module out of other static imports or eager bundler imports if you
want a separate chunk. The ad units must reference the bidder you loaded.
`processQueue()` is required for npm consumers; the generated standalone
bundles already call it. Configure consent management and required activity
controls **before** auctions, and do not treat delaying a script download as
a substitute for enforcing the user's privacy choices. Where consent or ID
availability changes, use the current CMP or publisher signal and do not start
an affected auction until its required modules are loaded.

For self-hosted precompiled chunks (rather than npm imports), see the example
below. Those scripts must match the Prebid core build and include any
dependent chunks; loading another full `prebid.js` bundle onto an already
initialized page is not a way to add a module.

### Self-hosted precompiled chunks

This example loads the module chunks before the main script, from the same
Prebid.js build. The code for these chunks is generated by `gulp build`.

1. Perform full Prebid build `gulp build`
1. Generate the main `prebid.js` file containing only the modules required across all pages: `gulp bundle --modules=<...>`
1. Host `build/dist` folder content on your server or CDN
1. Check the dependencies of the modules you plan to load dynamically on the current page [Dependency tree](https://cdn.jsdelivr.net/npm/prebid.js@latest/dist/chunks/dependencies.json)
1. Load the required modules, their dependencies using script tags:

```html
<html>
<head>
    <title>Page 1</title>>
    <script src="https://<your-cdn>/prebid/ortbConverter.js"></script> <!-- Depedency of openxBidAdapter !-->
    <script src="https://<your-cdn>/prebid/openxBidAdapter.js"></script> <!-- Bid adapter module !-->
    <script src="https://<your-cdn>/prebid/id5IdSystem.js"></script> <!-- Another module (doesn't require any additional dependencies) !-->
    <script src="https://<your-cdn>/prebid/prebid.js"></script> <!-- Load prebid.js last !-->
</head>
```

### Storage control usage

When working with the `storageControl` module you will need to explicitly import disclosure metadata. To do this, pair each module import with its corresponding metadata file `<module>.metadata.js`

```html
<html>
<head>
    <title>Page 1</title>>
    <script src="https://<your-cdn>/prebid/ortbConverter.js"></script> <!-- Depedency of openxBidAdapter !-->
    <script src="https://<your-cdn>/prebid/openxBidAdapter.js"></script> <!-- Bid adapter module !-->
    <script src="https://<your-cdn>/prebid/openxBidAdapter.metadata.js"></script> <!-- Bid adapter module's metadata !-->
    <script src="https://<your-cdn>/prebid/id5IdSystem.js"></script> <!-- Another module (doesn't require any additional dependencies) !-->
    <script src="https://<your-cdn>/prebid/id5IdSystem.metadata.js"></script> <!-- Another module's metadata !-->
    <script src="https://<your-cdn>/prebid/prebid.js"></script> <!-- Load prebid.js last !-->
</head>
```

## Further Reading

- [Source code of all modules](https://github.com/prebid/Prebid.js/tree/master/modules)
- [How to add a Bid Adapter](/dev-docs/bidder-adaptor.html)
- [How to add an Analytics Adapter](/dev-docs/integrate-with-the-prebid-analytics-api.html)
- [How to add a Real Time Data Submodule](/dev-docs/add-rtd-submodule.html)

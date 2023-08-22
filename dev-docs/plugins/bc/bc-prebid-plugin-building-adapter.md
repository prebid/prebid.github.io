---
layout: page_v2
title: How To Build An Adapter for Prebid Plugin
description: Ad Unit Reference
top_nav_section: dev_docs
nav_section: plugins
pid: 10
---

# How To Build An Adapter for Prebid Plugin

## Overview

An adapter is a mechanism supported by the Brightcove Prebid Plugin that gives a publisher the ability to add some specific behavior to customize the behavior of the plugin at run-time.

Using an adapter is particularly helpful when the plugin is defined and configured in Brightcove Studio.  While configuring the plugin in the Studio is very convenient and removes the need to define the plugin on the publisher's page, it limits the ability to make decisions about the prebid process at run-time.  Building adapters is a way to add custom behavior to the plugin based on run-time conditions.

## How Adapters Work

A publisher defines custom behavior using an external Javascript file.  The plugin is informed about the existence of the adapter file in the plugin configuration. The plugin loads the specified adapter(s) using the URL cited in the adapter definition (see below).

Once the adapter script has been loaded, the adapter will attach itself to the window object of the document where the plugin has been loaded.  The adapter uses its unique identifier (the same one that is also specified in the Prebid configuration) to store a reference to itself on the window object. The plugin uses this reference to query the adapter for status.  As an example, if the identifier (`id`) in the configuration is defined as `"myPluginAdapter"`, the reference to the loaded adapter can be retrieved from `window.myPluginAdapter` in the same document where the plugin has been loaded.

At certain points during the running of the plugin, points that correspond to the known API entry points of adapters, the plugin will query the adapter for status using one of the API entry points supported by the adapter. Depending on the outcome of the query, the Prebid plugin may or may not change its default behavior.

## How to Define an Adapter to the Plugin

Adapters are defined in the `adapters` prebid configuration option.  This is an optional configuration setting.  If you do want to define one or more adapters, you need to set the value of the `adapters` option to an array of one or more adapter definitions, as shown below.

### Adapter Definition

Each adapter definition is an object, which should contain the following fields:

* `id` - this is the unique identifier of the adapter.
  * This value should be a string; it should be the same value that the adapter is going to use to store the references to itself after it has been loaded.
  * This is also the same identifier that the Prebid plugin is going to use to communicate with the adapter once it has been loaded.
* `url` - this is the URL that the plugin will use to load in the adapter script.

### Example Adapter Configuration

```javascript
 options.adapters = [{id : 'myPluginAdapter', url : 'https://my-path/my-plugin-adapter.js'}];
```

### More Information

For more information about adapter configuration, see  **[Prebid Options]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-prebid-options.html#pb-adapters)**.

## Adapter API

By default, the Brightcove Prebid Plugin supports the following adapter API method:

* `enablePrebidPlugin`

If you are customizing the general behavior of the plugin and want to support other adapter entry points, you can do so in your own build of the Prebid plugin.

### `enablePrebidPlugin`

#### Description

The plugin will call `enablePrebidPlugin` to determine if the adapter wants to block the prebid process by the plugin.  If the adapter returns a `true` status, then the Prebid plugin will continue with its normal processing of the Prebid configuration.  If, however, the adapter returns a `false` status, then the Prebid plugin will **not** continue with the prebid process and no ad will be played.

#### Entry Point Prototype

`enablePrebidPlugin()`

This is a synchronous call.  This entry point should return a value as described in the **Return Value** section below.

#### Return Value

The `enablePrebidPlugin` method of the adapter should return one of the following values:

* `true`: The Prebid plugin processing has been enabled and the plugin will continue its handling of the Prebid configuration provided to it.  If everything else proceeds without any errors, then the "winning" ad should play.
* `false`: The prebid plugin processing has been disabled.  The plugin will terminate its processing and no ad should play.
* `pending object`: The adapter does not yet know whether to enable the Prebid plugin or not.  In this case, the contents of the `pending object` should be:
  * timeout: The maximum time in milliseconds that the adapter is requesting that the plugin should wait for a final answer.
  * default: A boolean (`true` or `false`) that represents the final answer from the adapter if the adapter cannot return an explicit answer before the timeout occurs.
  * poll: A function that the plugin can use to continue to query the adapter for a final decision as often as needed during the timeout period.
    * poll function prototype:  function()
    * poll function will return one of the following values:
      * true: enable the Prebid plugin as above
      * false: disable the Prebid plugin as above
      * null: adapter is still undecided
    * sample pending object response:

    ```javascript
        {timeout: 5000, default: true, poll: adapterPollingFunction}
    ```

## Sample Plugin Code to Query Adapter

The following sample code illustrates how the Prebid plugin checks for input from an adapter that implements the `enablePrebidPlugin` entry point.  You can find this code in the `AdapterManager` module in the Prebid plugin repository.

```javascript
var checkPluginEnabledForAdapter = function (adapterResponse, callback) {
        var endTime = Date.now() + adapterResponse.timeout;
        var timer = setInterval(function () {
            if (Date.now() > endTime) {
                            // stop checking for disabling plugin
                            clearInterval(timer);
                callback(adapterResponse.default);
            }
            else {
                var enabled = adapterResponse.poll();
                // call the callback only when we get an explicit true or false value
                if (enabled === true || enabled === false) {
                    clearInterval(timer);
                    callback(enabled);
                }
            }
        }, 200);
    };

    // checking the adapter response
    // the response can be
    // - false = disable prebid plugin
    // - true = enable the prebid plugin processing
    // - object indicating that the decision is not ready - this object will contain
    //   - timeout = max time to wait in milliseconds for a decision from the adapter
    //   - default = the answer to use if an explicit answer is not returned before the timeout
    //   - poll = a function the plugin can use to poll the adapter repeatedly before the timeout looking for an answer
    var adapterResponse = _adapters.enablePrebidPlugin();
    if (adapterResponse === false) {
        // disable prebid plugin here
        // ...
        return;
    }
    if (adapterResponse === true) {
        // enable prebid plugin here
        // ...
    }
    if (typeof adapterResponse === 'object' &&
        adapterResponse.hasOwnProperty('timeout') &&
        adapterResponse.hasOwnProperty('default') &&
        adapterResponse.hasOwnProperty('poll')) {
            checkPluginEnabledForAdapter(adapterResponse, function (enabled) {
                if (!enabled) {
                                            // disable prebid plugin here
                                            // ...
                }
                else {
                                            // enable prebid plugin here
                                            // ...
                }
            });
    }
```

## Sample Adapter Code

The following code is a sample adapter script which implements the `enablePrebidPlugin` entry point. The Prebid plugin will call `enablePrebidPlugin()` to query the adapter about whether the prebid process should be enabled or not.

```javascript
/**
* Example disable prebid plugin adapter.
*
* adapter id: test.disablePrebidPlugin.adapter
*/

var _prebidPluginEnabled = true;
var _gotDisableMessage = false;

function checkForPrebidEnabled() {
                if (_gotDisableMessage) {
                                return _prebidPluginEnabled;
                }
                // if status of disable/enable prebid plugin is unknown,
                // returns object which describes the following rule:
                // 1. try to check disable/enable prebid plugin status during 5 seconds by invoking poll function.
                // 2. if could not get disable/enable status during 5 seconds use default value 'true' to enable prebid plugin
                return {timeout: 5000, default: true, poll: function () {
                                if (_gotDisableMessage) {
                                                return _prebidPluginEnabled;
                                }
                                else {
                                                return null;         // status unknown
                                }
                }};
}

// listening for 'message' event with 'disablePrebidPlugin' data
// the message will most likely arrive via a postMessage event
window.addEventListener('message', function (msgEvent) {
                if (msgEvent.data === 'disablePrebidPlugin') {
                                _prebidPluginEnabled = false;     // set flag to disable prebid plugin
                                _gotDisableMessage = true;
                }
});

//////////////////////////////////////////////////////////////////////
// DEFINING THE ADAPTER INSTANCE
var testAdapter = {
                enablePrebidPlugin : function () {
                                return checkForPrebidEnabled();
                }
};

// this is going to store the reference to the adapter instance at window.test.disablePrebidPlugin.adapter
window.test = {disablePrebidPlugin: {adapter: testAdapter}};
```

## Links

### Prebid Options

Information about the Prebid Options supported by the plugin can be found at: **[Prebid Options]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-prebid-options.html)**

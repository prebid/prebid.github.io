---
layout: api_prebidjs
title: pbjs.getConfig([string])
description: getConfig API
sidebarType: 1
---

## Overview

The `getConfig` function is used for retrieving the current configuration object or subscribing to configuration updates. When called with no parameters, the entire config object is returned. When called with a string parameter, a single configuration property matching that parameter is returned. Be careful with use of this function, as it returns a reference to the configuration instead of a clone. The readConfig function has been introduced for safer use.

```javascript
/* Get config object */
config.getConfig()

/* Get debug config */
config.getConfig('debug')
```

### Subscribe

The `getConfig` function contains a `subscribe` feature that adds a callback function to a set of listeners that are invoked whenever `setConfig` is called. The `subscribed` function will be passed the `options` object that was used in the `setConfig` call. Individual topics can be subscribed to by passing a string as the first parameter and a callback function as the second.  For example:

```javascript
/* Subscribe to all configuration changes */
getConfig((config) => console.log('config set:', config));

/* Subscribe to only 'logging' changes */
getConfig('logging', (config) => console.log('logging set:', config));

/* Unsubscribe */
const unsubscribe = getConfig(...);
unsubscribe(); // no longer listening
```

<hr class="full-rule" />

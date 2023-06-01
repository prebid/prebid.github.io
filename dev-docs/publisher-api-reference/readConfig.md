---
layout: api_prebidjs
title: pbjs.readConfig([string])
description: readConfig API
sidebarType: 1
---


The `readConfig` function is used for retrieving the current configuration object or subscribing to configuration updates. When called with no parameters, the entire config object is returned. When called with a string parameter, a single configuration property matching that parameter is returned.  The readConfig function has been introduced for safer use of the getConfig functionality, as it returns a clone. 

```javascript
/* Get config object */
config.readConfig()

/* Get debug config */
config.readConfig('debug')
```

<hr class="full-rule" />

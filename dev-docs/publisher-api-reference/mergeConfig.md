---
layout: api_prebidjs
title: pbjs.mergeConfig(options)
description: mergeConfig API
sidebarType: 1
---

This is the same as [`setConfig(options)`](/dev-docs/publisher-api-reference/setConfig.html) except that it merges the supplied config into the structure rather than replacing it.

This is a convenience function, particularly useful to real time data modules, so one doesn't have to read the
config structure, update it, then call setConfig.

## `setConfig` versus `mergeConfig`

Both methods update the runtime config:

* `setConfig` replaces values
* `mergeConfig` keeps existing values and merges new ones into them recursively.

### Object/scalar properties

`setConfig` iterates each top-level key in the incoming object and assigns it directly.

```js
config = {
  bidderTimeout: 3000,
  debug: false
};

setConfig({
  bidderTimeout: 5000
});
```

Result:

```js
{
  bidderTimeout: 5000,
  debug: false
}
```

`mergeConfig` deep-merges the object into the current config.

```js
config = {
  bidderTimeout: 3000,
  ortb2: {
    site: { page: 'old.example.com' }
  }
};

mergeConfig({
  bidderTimeout: 5000,
  ortb2: {
    site: { domain: 'example.com' }
  }
});
```

Result:

```js
{
  bidderTimeout: 5000,
  ortb2: {
    site: {
      page: 'old.example.com',
      domain: 'example.com'
    }
  }
}
```

Note that the merge is recursive for objects.

### Arrays

`setConfig` has the exact same behavior for array properties as for scalar/object properties.
It will replace the value.

```js
setConfig({
  bidders: ['appnexus', 'rubicon']
});

setConfig({
  bidders: ['pubmatic']
});
```

Result:

```js
{
  bidders: ['pubmatic']
}
```

`mergeConfig` will append new items to the existing array, and ignore duplicates.

```js
config = {
  bidders: ['appnexus']
};

mergeConfig({
  bidders: ['rubicon', 'appnexus']
});
```

Result:

```js
{
  bidders: ['appnexus', 'rubicon']
}
```

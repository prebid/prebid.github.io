---
title: pbjs.aliasRegistry
description: aliasRegistry API
---


Exposes the aliasRegistry. It can be used to fetch the entire aliasRegistry object or an individual adapter code by alias name.

```javascript
pbjs.aliasRegistry; 
// or 
pbjs.aliasRegistry['aliasName'];
```

:::warning
Note that by default, the alias registry will be made public.  If you would like the registry to be private, you can utilize the `setConfig` option below:
:::

```javascript
pbjs.setConfig({aliasRegistry: 'private'})
```

<hr class="full-rule" />

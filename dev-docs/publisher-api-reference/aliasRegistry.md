---
layout: api_prebidjs
title: pbjs.aliasRegistry
description:
sidebarType: 1
---


Exposes the aliasRegistry. It can be used to fetch the entire aliasRegistry object or an individual adapter code by alias name.

{% highlight js %}

pbjs.aliasRegistry; or pbjs.aliasRegistry[aliasName];

{% endhighlight %}

{: .alert.alert-warning :}
Note that by default, the alias registry will be made public.  If you would like the registry to be private, you can utilize the `setConfig` option below:

```
pbjs.setConfig({aliasRegistry: 'private'})
```

<hr class="full-rule" />

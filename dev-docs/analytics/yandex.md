---
layout: analytics
title: Yandex Metrica
description: Track your Prebid.js in Yandex Metrica
modulecode: yandexAnalytics
---

# Description

This adapter is designed to work with [Yandex Metrica](https://metrica.yandex.com/about) - a web analytics tool.

{: .alert.alert-warning :}
Disclosure: provider loads Metrica Tag build based on [github.com/yandex/metrica-tag](https://github.com/yandex/metrica-tag), ~60 kB gzipped.

## How to setup provider

Register your application on [metrica.yandex.com](https://metrica.yandex.com/) and get counter id

Init provider like this, where `123` is your counter id

Note: If you have Single Page Application (SPA), [configure your tag](https://yandex.com/support/metrica/code/counter-spa-setup.html).

```javascript
pbjs.enableAnalytics({
    provider: 'yandexAnalytics',
    options: {
        counters: [123],
    },
});
```

## Where to find data

Go to [metrika.yandex.ru/dashboard](https://metrika.yandex.ru/dashboard) -> Prebid Analytics

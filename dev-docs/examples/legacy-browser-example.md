---
layout: example
title: Legacy Browser Support
description: Legacy Browser Support

sidebarType: 1

about:
- In Prebid 6.0, support for legacy browsers is no longer assured.
- Publishers may conditionally deploy the 5.x branch and add polyfills
- One strategy to do this is simply the module/nomodule approach discussed here https://philipwalton.com/articles/deploying-es2015-code-in-production-today/
- Another strategy is to detect the user agent or the 'currentScript' mechanism as described here https://stackoverflow.com/questions/29987969/how-to-load-a-script-only-in-ie
- Another strategy is to conditionally serve one file or another based on instructions to your cdn

jsfiddle_link: jsfiddle.net/bau975xy/2/embedded/html,result

code_height: 3050

---

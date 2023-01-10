---
layout: example
title: Legacy Browser Support
description: Legacy Browser Support

sidebarType: 1

about:
- In Prebid 6.0, support for legacy browsers is no longer assured.
- Publishers may conditionally deploy the 5.x branch and add polyfills
- One strategy to do this is simply the module/nomodule approach discussed here <a href=https://philipwalton.com/articles/deploying-es2015-code-in-production-today/>https://philipwalton.com/articles/deploying-es2015-code-in-production-today/</a>
- Another strategy is to detect the user agent or the 'currentScript' mechanism as described here <a href=https://stackoverflow.com/questions/29987969/how-to-load-a-script-only-in-ie>https://stackoverflow.com/questions/29987969/how-to-load-a-script-only-in-ie</a>
- Another strategy is to conditionally serve one file or another based on instructions to your cdn

jsfiddle_link: jsfiddle.net/Prebid_Examples/kqe8L2jf/embedded/html,result

code_height: 3050

---

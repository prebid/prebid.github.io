---
layout: userid
title: ID+
description: ID+ User ID sub-module
useridmodule: zeotapIdPlusIdSystem
---


ID+, powered by zeotap, enables the marketing ecosystem to overcome challenges posed by the demise of identifiers and a fast-changing regulatory landscape. ID+ is an open invitation to the entire industry to build the future of identity together.

This sub-module enables the user’s ID+ to be available in the bid request.

More information on ID+ can be found here: [https://idplus.io/](https://idplus.io/)

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=zeotapIdPlusIdSystem

## ID+ Registration

You can set up your ID+ account by contacting our support team at [support.idplus@zeotap.com](mailto:support.idplus@zeotap.com) or via [https://idplus.io/contact-us](https://idplus.io/contact-us.html) and we will get back to you.

ID+ is covered under zeotap privacy policy: [Zeotap Privacy Policy](https://zeotap.com/website-privacy-policy).

## ID+ Example

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "zeotapIdPlus"
        }]
    }
});
```

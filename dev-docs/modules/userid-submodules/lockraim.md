---
layout: userid
title: lockr AIM
description: lockr Alternative Identity Manager sub-module
useridmodule: lockrAIMIdSystem
---

Alternative Identity Manager (AIM) is a unified container for identity and data management.
AIM includes a self-service platform for publishers seamlessly integrate and activate alternative IDs like LiveRamp’s Authenticated Traffic Solution (ATS), Unified ID 2.0 (UID2), ID5. The self-service component allows the publisher to easily enable or disable IDs and to send identity clusters to CDPs or cleanrooms without engaging engineering teams.  For more information about AIM and detailed integration docs, please visit [our documentation](https://sso.loc.kr/api/lockr_reference.html#tag/Alternate-Identity-Management-(AIM)).

### **Account Creation | AIM**

1. Sign up for an [Identity lockr account.](https://sso.loc.kr/console/signup)
2. Setup your app and activate the AIM library.
3. Compile Prebid with the appropriate configurations, and deploy.

### **Configuration | AIM**

Add the lockr’s AIM submodule to your Prebid.js package by running:
`gulp build –modules=lockrAIMIdSystem`

The following configuration parameters are available:
{: .table .table-bordered .table-striped }
| Param          | Scope    | Type   | Description                            | Example               |
|----------------|----------|--------|----------------------------------------|-----------------------|
| name           | Required | String | The name of this module: `"lockrAIMId"`| `"lockrAIMId"`        |
| params         | Required | Object | Details for the configuration.         |                       |
| params.email   | Required | String | Email address for identity tokens.     | `test@example.com`    |
| params.appID   | Required | String | Identity lockr appID                   | `e84afc5f-4adf-4144-949f-1de5bd151fcc`    |

**Google oAuth:**
If you are using Google oAuth (_as an example_), the onSignIn function will subsequently call window.lockr.setAdditionalData function and include a raw email.

```
function onSignIn(googleUser) {
   pbjs.setConfig({
      userSync: {
         userIds: [{
            name: 'lockrAIMId',
            params: {
               email: 'john@example.com',
               appID: 'e84afc5f-4adf-4144-949f-1de5bd151fcc'
            }
         }]
      }
    });
}
```

**Facebook oAuth:**
If you are using Facebook Login (_as an example_), the statusChangeCallback function will subsequently call window.lockr.setAdditionalData function and include a raw email.

```
function statusChangeCallback(response) {
   console.log('statusChangeCallback');
   console.log(response);
   if(response.status === 'connected'){
     pbjs.setConfig({
        userSync: {
           userIds: [{
              name: 'lockrAIMId',
              params: {
                 email: 'john@example.com',
                 appID: 'e84afc5f-4adf-4144-949f-1de5bd151fcc'
              }
           }]
        }
      });
   }else{
     document.getElementById('status').innerHTML = 'Please login';
   }
}
```

**Note:** The above code can be triggered from anywhere on the domain (i.e. a subscription form).


**lockr AIM Example**

```
pbjs.setConfig({
    userSync: {
       userIds: [{
          name: 'lockrAIMId',
          params: {
             email: 'test@example.com',
             appID: 'e84afc5f-4adf-4144-949f-1de5bd151fcc'
          }
       }]
    }
});
```

_Note_: lockr’s AIM self-service interface empowers publishers with the ability to pass the alternative IDs activated back to the client as local storage or as a first party cookie. Each Identity Provider can be individually set to restrict from client-side delivery and instead be retained as an authentication event within Identity lockr. In this case no data is lost, but instead maintained for automated or manual sharing to any Data Endpoint.

**Troubleshooting and Error handling:**

1. Navigate to the domain where Prebid.js Library is integrated.
2. Go to the 'Network' tab of your Developer Tools. Search for “prebid.js”
3. In the application tab, you can confirm any activated Identity Provider (if client-side storage is turned on in AIM’s Identity Provider settings).
4. Debugging:
   Enable the debug flag to true in the setConfig call:

```
pbjs.setConfig({
    debug: true,
    userSync: {
       userIds: [{
          name: 'lockrAIMId',
          params: {
             email: 'test@example.com',
             appID: 'e84afc5f-4adf-4144-949f-1de5bd151fcc'
          }
       }]
    }
});
```
---
layout: userid
title: netID
description: netID User ID sub-module
useridmodule: netIdSystem
---


The [European netID Foundation (EnID)](https://developerzone.netid.de/index.html) aims to establish with the netID an independent European alternative in the digital market for Demand and Supply side. With the netID Single-Sign-On, the EnID established an open standard for consumer logins for services of Buyers and Brands, that also includes user-centric consent management capabilities that results in a standardized, EU-GDPR compliant, IAB TCF aware, cross-device enabled Advertising Identifier, which can be leveraged by publishers and advertisers (and vendors supporting them) to efficiently deliver targeted advertising through programmatic systems to already more than 38 million Europeans on mobile and desktop devices.

The EnID is a non-profit organization which is open to any contributing party on both, the demand and supply side to make identity work for consumers as well as the advertising ecosystem.

## netID Examples

1) Publisher stores netID via his own logic

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "netId",
            value: {
               "netId":"fH5A3n2O8_CZZyPoJVD-eabc6ECb7jhxCicsds7qSg"
            }
        }]
    }
});
```

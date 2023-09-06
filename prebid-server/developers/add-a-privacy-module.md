---
layout: page_v2
sidebarType: 5
title: Prebid Server | Developers | Adding a Privacy Module

---

# Prebid Server - Adding a Privacy Module
{: .no_toc}

{: .alert.alert-warning :}
This feature is currently only available in PBS-Java.

* TOC
{:toc }

## Overview

Privacy Modules are different than [Request Modules](/prebid-server/developers/add-a-module.html). They work in this way:

1. Privacy Modules are called by the [Activity Control System](/prebid-server/features/pbs-activitycontrols.html)
1. They are meant to use aspects of the request to determine whether a particular activity is `allowed`, `disallowed`, or `abstain`.

Here are the use cases envisioned for Privacy Modules:

- Prebid will publish privacy modules for major IAB privacy protocols such as the [US National Privacy Specification](/prebid-server/features/pbs-usgen.html).
- PBS host companies can develop custom versions of privacy modules for their publishers that may meet special legal requirements more efficiently.
- Anyone can contribute privacy modules in support of regulations not addressed by Prebid or the IAB.

### Terminology

- **PBS**: short for **P**re**b**id **S**erver
- **PBS-core**: The inner workings of Prebid Server -- not part of a module, bid adpater, or analytics adapter
- **PBS-Java**: the Java version of Prebid Server
- **PBS-Go**: the Go-Lang version of Prebid Server
- **Host Company**: the entity running the PBS cluster, e.g. one of the ones on [this list](https://prebid.org/product-suite/managed-services/).
- **Activity Controls**: a [centralized mechanism](/prebid-server/features/pbs-activitycontrols.html) for managing privacy-sensitive activities.
- **Privacy Module**: a block of code that plugs into Prebid Server that enhances the functionality of the Activity Controls.
- **Allow**: If the module returns this value, it has determined that the requested activity in the specified context is allowable.
- **Disallow**: If the module returns this value, it has determined that the requested activity in the specified context is **not** allowable.
- **Abstain**: If the module returns this value, it does not have a definitive answer about whether the requested activity in the specified context is allowable.

## Building Your Privacy Module

### 1. Define the Behavior With Your Lawyers

As with any legally sensitive thing, you should have the desired behavior fully documented and signed off in conjunction with legal counsel.

{: .alert.alert-warning :}
Prebid cannot guarantee that the Activity Controls and Privacy Modules enable all possible legal scenarios. Please submit an [issue](https://github.com/prebid/prebid-server/issues/new) to discuss
enhancements to this system.

### 2. Review the Module Rules

There are a number of things modules in general are not allowed to do
without disclosing prominently on their documentation. Please review
the [Module Rules](/dev-docs/module-rules.html) page.

Privacy Modules are particularly constrained in what they can do. Basically all they can do is answer `allow`, `disallow`, or `abstain` to a request from an Activity Control.
They cannot make HTTP requests, log analytics, or affect the request/response in any way.

### 2. Define a Module Code

The module code is how Activity Control configuration will refer to this 
privacy module. For example, if the module is named **host1.publisherA.emea**,
it could be activated in the `privacy` config in any of these ways:

```
{
  "privacy": {
    "allowactivities": {
      "ACTIVITY1": {
        "privacyreg": ["*"]
      },
      "ACTIVITY2": {
        "privacyreg": ["host1.*"]
      },
      "ACTIVITY3": {
        "privacyreg": ["host1.publisherA.*"]
      },
      "ACTIVITY4": {
        "privacyreg": ["host1.publisherA.emea"]
      }
    }
  }
}
```

To choose the name, you should consider how the publisher may want to invoke 
the privacy modules that are available.

- If you're not going to open source the privacy module, we recommend prefixing the name with your host company so it doesn't clash with open source modules as they become available.
- If the module is publisher-specific, we recommend placing the publisher name in the module code.

### 3. Determine What Should be Configurable

Your module may not need any configuration, or it may have a complex configuration.
Here are the kind of things to consider:

- Does it need to identify or prioritize privacy parameters differently? (e.g. which consent and scope strings to use and prefer?)
- Does it need to provide different exceptions? (e.g. if a particular publisher wants to allow or disallow certain scenarios.)

### 4. Write the Code, Config, and Unit Tests

The details of the implementation depend on the platform.

- PBS-Java: see [Adding a PBS-Java Privacy Module](/prebid-server/developers/add-a-privacy-module-java.html)
- PBS-Go: TBD

If you plan on open sourcing your privacy module, other rules for open source PBS pull request:

- Unit test coverage must exceed 90%.
- A maintainer email address must be provided and be a group, not an individual. e.g. "support@example.com rather than jsmith@example.com

### 5. Write the Module Documentation

If this is an open source module, fork the [documentation repo](https://github.com/prebid/prebid.github.io) and
create a file in /prebid-server/pbs-modules. You can start by copying one of the existing files. It should contain:

- A description of the module functionality: why people might be interested in using it.
- Prerequisites: any necessary account activation, other required modules, etc.
- Configuration

### 6. Submit the Pull Requests

If open sourcing the module, submit the PRs for review when everything looks good in your test environment.

## Further Reading

- [PBS Activity Controls](/prebid-server/features/pbs-activitycontrols.html)
- [US Gen Privacy Module](/prebid-server/features/pbs-usgen.html)

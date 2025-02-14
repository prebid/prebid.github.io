---
layout: page_v2
sidebarType: 5
title: Prebid Server | Developers | Adding a Java Privacy Module
---

# Prebid Server - Adding a Java Privacy Module
{: .no_toc}

* TOC
{:toc }

## Overview

This document details how to make a 'privacy module' for PBS-Java. This type of
module is not related to the [main workflow modules](/prebid-server/pbs-modules/). Rather, it's a specialized type of module that

You will want to be familiar with the following background information:

* [Privacy Modules](/prebid-server/developers/add-a-privacy-module.html)
* [Prebid Server Activity Controls](/prebid-server/features/pbs-activitycontrols.html)

## Coding Standards

The module’s code style should correspond to
the [PBS-Java project code style](https://github.com/prebid/prebid-server-java/blob/master/docs/developers/code-style.md).

### Privacy Module Directory Layout

The source code of your privacy module must be inside packages:

```text
// Privacy Module provider
org.prebid.server.activity.infrastructure.creator.privacy.YOUR_PRIVACY_MODULE_NAME

// Privacy Module implementation
org.prebid.server.activity.infrastructure.privacy.YOUR_PRIVACY_MODULE_NAME
    
// Account config for your Privacy Module (if presented as a single class, then a separate package isn’t required)
org.prebid.server.settings.model.activity.privacy.YOUR_PRIVACY_MODULE_NAME
```

### Module Code

The quick start is to take a look in three places:

* the [USNat Privacy Module](https://github.com/prebid/prebid-server-java/tree/master/src/main/java/org/prebid/server/activity/infrastructure/privacy/usnat)
* the [USNat Privacy Module creator](https://github.com/prebid/prebid-server-java/tree/master/src/main/java/org/prebid/server/activity/infrastructure/creator/privacy/usnat)
* the [account config for USNat Privacy Module](https://github.com/prebid/prebid-server-java/blob/master/src/main/java/org/prebid/server/settings/model/activity/privacy/AccountUSNatModuleConfig.java)

{: .alert.alert-info :}
The 'usnat' code is documented on the website as [usgen](/prebid-server/features/pbs-usgen.html)

## Privacy Module interface

Among the Prebid server processing workflow, there are several 'activities' that require permission from the Activity
Infrastructure to run.

The available activities that the Activity Infrastructure can control can be found in the corresponding
enum: [Activity](https://github.com/prebid/prebid-server-java/blob/master/src/main/java/org/prebid/server/activity/Activity.java).

Whenever a workflow asks permission to perform an activity, the configured rules will be processed. All rules implement
the `Rule` interface. In accordance with this, every privacy module implements `PrivacyModule` interface, which
inherits `Rule` interface, with methods should be implemented:

* `proceed(...)` - returns one of the privacy module answers: `ALLOW`, `DISALLOW`, `ABSTAIN`.

### Privacy Module example

```java
public class MyPrivacyModule implements PrivacyModule {

    private final GppModel gppModel;
    private final int forbiddenSection;

    private MyPrivacyModule(GppModel gppModel, int forbiddenSection) {
        this.gppModel = gppModel;
        this.forbiddenSection = forbiddenSection;
    }

    @Override
    public Result proceed(ActivityInvocationPayload activityInvocationPayload) {
        return gppModel != null && gppModel.hasSection(forbiddenSection) 
                ? Result.DISALLOW 
                : Result.ABSTAIN;
    }
}
```

## Privacy Module Creator Interface

The lifecycle of a privacy module is defined by `PrivacyModuleCreator`. Possible life cycles:

* one for the server - if the creator always returns the same privacy module that was created when the server started
* one for a period of time (cached) - (for example) if the creator will create a new privacy module every time the
  associated account is updated
* one per request - if the creator always returns a new privacy module

`PrivacyModuleCreator` consists of methods that must be implemented:

* `qualifier()` - returns privacy module qualifier.
* `from(...)` - returns created privacy module.

### Privacy Module Creator Example

```java
public class MyPrivacyModuleCreator implements PrivacyModuleCreator {

    @Override
    public PrivacyModuleQualifier qualifier() {
        return PrivacyModuleQualifier.MY_PRIVACY_MODULE;
    }

    @Override
    public PrivacyModule from(PrivacyModuleCreationContext creationContext) {
        final MyPrivacyModuleConfig moduleConfig = moduleConfig(creationContext);
        final GppModel gppModel = creationContext.getGppContext().scope().getGppModel();

        final List<PrivacyModule> innerPrivacyModules = SetUtils.emptyIfNull(moduleConfig.getForbiddenSections())
                .stream()
                .filter(Objects::nonNull)
                .map(forbiddenSection -> new MyPrivacyModule(gppModel, forbiddenSection))
                .toList();

        return new AndPrivacyModules(innerPrivacyModules);
    }

    private static MyPrivacyModuleConfig moduleConfig(PrivacyModuleCreationContext creationContext) {
        return (MyPrivacyModuleConfig) creationContext.getPrivacyModuleConfig();
    }
}
```

## Privacy Module Qualifier

`PrivacyModuleQualifier` is an enumeration containing all possible unique names of the privacy modules supported by this
server instance.

### Privacy Module Qualifier Example

```java
public enum PrivacyModuleQualifier {

    // other qualifiers
    
    @JsonProperty(Names.MY_PRIVACY_MODULE)      // required when adding MY_PRIVACY_MODULE
    MY_PRIVACY_MODULE(Names.MY_PRIVACY_MODULE); // required when adding MY_PRIVACY_MODULE

    // fields and methods

    public static class Names {

        // other names
        
        public static final String MY_PRIVACY_MODULE = "privacy.my-module"; // required when adding MY_PRIVACY_MODULE
    }
}

```

## Privacy Module Account Configuration

Any privacy module must be configured in the account configuration to affect Prebid server processing workflow.

When adding a new privacy module, it is important to create an appropriate configuration class. The configuration class
must implement the `AccountPrivacyModuleConfig` interface, with methods should be implemented:

* `getCode()` - returns privacy module qualifier.
* `enabled()` - returns boolean. `null` or `true` means that this privacy module is 'on'.

IMPORTANT. Because the Prebid server can merge account configurations from different locations, make sure:

```text
deserializeFromJson(serializeToJson(config object)) == config object
```

### Privacy Module Account Configuration Example

```java
@Value(staticConstructor = "of")
public class MyPrivacyModuleConfig implements AccountPrivacyModuleConfig {

    @Accessors(fluent = true)
    Boolean enabled;

    Set<Integer> forbiddenSections;

    @Override
    public PrivacyModuleQualifier getCode() {
        return PrivacyModuleQualifier.MY_PRIVACY_MODULE;
    }
}
```

```java
package org.prebid.server.settings.model.activity.privacy;


@JsonSubTypes({
        // other privacy modules
        
        @JsonSubTypes.Type(                                                 // relationship between configuration class and privacy module name
                value = MyPrivacyModuleConfig.class,                        // configuration class
                name = PrivacyModuleQualifier.Names.MY_PRIVACY_MODULE)})    // privacy module name
public sealed interface AccountPrivacyModuleConfig permits
        // other privacy modules
        
        MyPrivacyModuleConfig { // configuration class must be listed after 'permits' keyword 

    // methods
}
```

## Privacy Module Bean Configuration

Privacy module beans must be inside the destined configuration class: `ActivityInfrastructureConfiguration.PrivacyModuleCreatorConfiguration`

### Privacy Module Bean Configuration Example

If there is only one bean associated with the privacy module:

```java
@Configuration
static class PrivacyModuleCreatorConfiguration {

    // other privacy modules
    
    @Bean
    MyPrivacyModuleCreator myPrivacyModuleCreator() {
        return new MyPrivacyModuleCreator();
    }
}
```

If there are multiple beans associated with the privacy module:

```java
@Configuration
static class PrivacyModuleCreatorConfiguration {

    // other privacy modules
    
    @Configuration
    static class MyPrivacyModuleCreatorConfiguration {

        @Bean
        MyPrivacyModuleDependency myPrivacyModuleDependency() {
            return new MyPrivacyModuleDependency();
        }

        @Bean
        MyPrivacyModuleCreator myPrivacyModuleCreator(MyPrivacyModuleDependency myPrivacyModuleDependency) {
            return new MyPrivacyModuleCreator(myPrivacyModuleDependency);
        }
    }
}
```

## Adding support for trace log

To be able to debug the Activity Infrastructure and be able to track interactions with your privacy module, it is recommended that your `PrivacyModule` implement the `Loggable` interface.

`Loggable` consists of methods that must be implemented:

* `asLogEntry(...)` - returns `JsonNode` that can represent any desired structure to include in the trace log.

For example:

```java
public class MyPrivacyModule implements PrivacyModule, Loggable {

    // privacy module code

    @Override
    public JsonNode asLogEntry(ObjectMapper mapper) {
        return TextNode.valueOf(
                "%s forbidding %d section.".formatted(
                        MyPrivacyModule.class.getSimpleName(),
                        forbiddenSection));
    }
}
```

## Privacy Trace Log and Analytics

The privacy module interface logs information that analytics adapters may want to consume. For example, if you're an analytics provider
and want to check whether there was a skipRate config present, you can read the log for `skipped:true` and log however your analytics requires.

For example:

```json
         {
            "description": "Invocation of Activity Infrastructure.",
            "activity": "transmitUfpd",
            "activity_invocation_payload": {
              "component_type": "BIDDER",
              "component_name": "bidderA"
            }
          },
          {
            "description": "Setting the default invocation result.",
            "allow_by_default": true
          },
          {
            "description": "Processing rule.",
            "rule_configuration": {
              "and": [
                {
                  "privacy_module": "iab.usgeneral",
                  "skipped": true,
                  "result": "ABSTAIN"
                }
              ]
            },
            "result": "ABSTAIN"
          },
```

## Further Reading

* [Building a privacy module](/prebid-server/developers/add-a-privacy-module.html)

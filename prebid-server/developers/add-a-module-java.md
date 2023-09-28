---
layout: page_v2
sidebarType: 5
title: Prebid Server | Developers | Adding a Java Module

---

# Prebid Server - Adding a Java Module
{: .no_toc}

* TOC
{:toc }

## Overview

This document details how to make a module for PBS-Java.

You will want to be familiar with the following background information:

- the [module overview](/prebid-server/developers/add-a-module.html) 
- the [PBS-Java Modularity Tech Spec](https://docs.google.com/document/d/1VP_pi7L5Iy3ikHMbtC2_rD5RZTVSc3OkTWKvtRS5x5Y/edit#heading=h.oklyk2bogkx4)

### Coding standards

The module’s code style should correspond to the [PBS-Java project code style](https://github.com/prebid/prebid-server-java/blob/master/docs/developers/code-style.md).

## Module Directory Layout

The Prebid Server repository contains a maven submodule called `all-modules` located in the `extra/modules` folder. It includes all available PBS modules. So, in order to add a new module, fork the repository and create a folder with the desired name inside the modules folder with the following structure:

```
+- prebid-server-java/
  +- extra/
    +- modules/
      +- YOUR_MODULE_NAME/
        +- pom.xml <- POM of your module
      +- pom.xml <- POM of all included modules
```

A benefit of open sourcing your module in this way is that it can use the parent `all-modules` as a maven dependency. It simplifies management of the PBS-Core and other commonly used dependencies and you will be confident that it works well with the current version of Prebid Server. 

### Your module's build file

Here's a partial example of your module-specific `pom.xml` file:

```
<?xml ...>
<project ...>
   <parent>
       <groupId>org.prebid.server.hooks.modules</groupId>
       <artifactId>all-modules</artifactId>
       <version>PREBID_SERVER_VERSION</version>
   </parent>

   <artifactId>YOUR_MODULE_ARTIFACT_ID</artifactId>

   <name>YOUR_MODULE_TEXTUAL_NAME</name>
   <description>YOUR_MODULE_DESCRIPTION</description>
</project>
```

where:
- PREBID_SERVER_VERSION is the current version of Prebid Server. The release team will update this value for all modules with each release, but you need to set it to the version of PBS that you're developing with.
- YOUR_MODULE_ARTIFACT_ID is the name of your module JAR file without version and extension. e.g. ortb2-blocking
- YOUR_MODULE_TEXTUAL_NAME is unique within the space of all other modules. e.g. instead of naming a module "blocking", a better name would be "ortb2blocking".

### Add your module to the add-modules build file

Add your module within `extra/modules/pom.xml` in the "modules" section:

```
<modules>
    ...
    <module>YOUR_MODULE_ARTIFACT_ID</module>
</modules>
```

### Your directory layout

The structure of your module source code inside the modules directory must have a standard maven-compatible structure:

```
+- src/
  +- main/
    +- java/ <- source code
      +- org.prebid.server.* <- The package path needs to include "org.prebid.server"
    +- resources/ <- required resources
  +- test/
    +- java/ <- tests
    +- resources/ <- required test resources
+- pom.xml <- POM of your module
+- README.md <- documentation
```

## Module Code

The quick start is to take a look in two places:
- the [ortb2-blocking module](https://github.com/prebid/prebid-server-java/tree/master/extra/modules/ortb2-blocking)
- the [module test cases](https://github.com/prebid/prebid-server-java/tree/master/src/test/java/org/prebid/server/it/hooks)

### Adding module documentation
It is required to add a "README.md" file to the root of your module folder. Recommended this file contains the description of what the implemented module does, links to external documentation and includes maintainer contact info (email, slack, etc).

The documentation must also live on the docs.prebid.org site. Please add a markdown file to https://github.com/prebid/prebid.github.io/tree/master/prebid-server/pbs-modules

### Hook Interfaces

The Prebid server processing workflow is divided into several 'stages' where module authors can code agaist a specific function signature called a 'hook'.

The Prebid Server host company will define which modules to run in which order by setting up a configuration defining which hooks run, and which can run in parallel.

The supported stages are described in the [general module overview](/prebid-server/developers/add-a-module.html#2-understand-the-endpoints-and-stages) and in PBS-Core source code at the "org.prebid.server.hooks" package.

These are the available hooks that can be implemented in a module:

- org.prebid.server.hooks.v1.entrypoint.EntrypointHook
- org.prebid.server.hooks.v1.auction.RawAuctionRequestHook
- org.prebid.server.hooks.v1.auction.ProcessedAuctionRequestHook
- org.prebid.server.hooks.v1.bidder.BidderRequestHook
- org.prebid.server.hooks.v1.bidder.RawBidderResponseHook
- org.prebid.server.hooks.v1.bidder.AllProcessedBidResponsesHook
- org.prebid.server.hooks.v1.auction.AuctionResponseHook

In a module it is not necessary to implement all mentioned interfaces but only one (or several) required by your functionality.

Each hook interface internally extends org.prebid.server.hooks.v1.Hook basic interface with methods should be implemented:
- `code()` - returns module code.
- `call(...)` - returns result of hook invocation.

### Examples

1. To **update** the request in the `RawAuctionRequestHook` you would return:

    ```java
    Future.succeededFuture(
        InvocationResultImpl.<AuctionRequestPayload>builder()
            .status(InvocationStatus.success)
            .action(InvocationAction.update)
            .payloadUpdate(payload ->
              AuctionRequestPayloadImpl.of(payload.bidRequest().toBuilder()
                      .id("updated request ID")
                      .build()))
        .build()
    );
    ```

    Please note that the `InvocationStatus` is only considered when the status is set to `InvocationStatus.success`. That means the `payloadUpdate` is only applied with `InvocationStatus.success` **and** `InvocationAction.update`

2. To **reject** the request in the `RawAuctionRequestHook` you would return:

    ```java
    Future.succeededFuture(
        InvocationResultImpl.rejected(“The rejection reason”)
    );
    ```

3. To supply [analytics tags](/prebid-server/developers/module-atags.html) in the `RawAuctionRequestHook` you would return:

    ```java
    Future.succeededFuture(
        InvocationResultImpl.<AuctionRequestPayload>builder()
            ...
            .analyticsTags(TagsImpl.of(
                Collections.singletonList(ActivityImpl.of(
                    "device-id",
                    "success",
                    Collections.singletonList(ResultImpl.of(
                        "success",
                        mapper.mapper().createObjectNode()
                            .put("some-field", "some-value"),
                    AppliedToImpl.builder()
                          .impIds(Collections.singletonList("impId1"))
                          .request(true)
                          .build()))))))
            ...
        .build()
    );
    ```

More test implementations for each hook can be found in unit-tests at https://github.com/prebid/prebid-server-java/tree/master/src/test/java/org/prebid/server/it/hooks folder.

### Applying results asynchronously

Please note method call() returns a Future object. This means it won’t apply changes immediately but rather when PBS-Core executes it in org.prebid.server.hooks.execution.GroupExecutor#executeHook method.

### Do not block the main thread

Prebid Server Java uses Vert.x in its core, so developers need to keep an eye on blocking the main thread. See the [Vert.x documentation](https://vertx.io/docs/vertx-core/java/#_dont_block_me).

Thus, for any kind of blocking operations it is recommended to use a Vert.x built-in (for example, io.vertx.core.http.HttpClient) or even better - PBS wrapper components (for example, org.prebid.server.vertx.http.HttpClient).

To see how to proceed with async operations, please see similar PBS-Core functionality, for example Currency Conversion Service implementation (class “org.prebid.server.currency.CurrencyConversionService”).

### Available Functions

#### Getting the localhost CPU

To support modules that need to obtain information about the local CPU environment (e.g. a traffic-shaping), the code can call this function:

```java
cpuLoadAverageStats.getCpuLoadAverage();  // returns a float
```

### Configuration

It's possible to define default module configuration which can be read by the module at PBS startup. Please see the [Configuration](https://docs.google.com/document/d/1VP_pi7L5Iy3ikHMbtC2_rD5RZTVSc3OkTWKvtRS5x5Y/edit#heading=h.mh3urph3k1mk) section of the technical specification.

### Testing

Unit tests are required. Each implemented hook must be at least 90% covered by unit tests.

### How to build and install a module

Read about the bunding of modules with PBS in the [bundling section](https://docs.google.com/document/d/1VP_pi7L5Iy3ikHMbtC2_rD5RZTVSc3OkTWKvtRS5x5Y/edit#heading=h.o8dv0neoq4xm) of the technical specification.

## Analytics Adapters and Modules

Each module can inject analytics tags into the request as described in the analytics tags section.

Analytics adapters can receive these tags in a parameter that's been added to the Auction/AMP endpoints. The org.prebid.server.analytics.model.AuctionEvent event object which includes AuctionContext with HookExecutionContext inside.

To get analytics tag you need to go into:

```
AuctionEvent 
  -> AuctionContext 
    -> HookExecutionContext 
      -> stageOutcomes (select stage)
        -> groups (iterate through groups)
          -> hooks (go through hooks and find interested one)
            -> analyticsTags
```

The AnalyticsTags object has activities with collection of  org.prebid.server.hooks.v1.analytics.Result objects inside. Each Result has the values() method which returns com.fasterxml.jackson.databind.node.ObjectNode. 

It depends on the particular module implementation how to parse their analytics tags, since the internal structure is custom and depends on the module. Therefore, analytics modules that want to report on specific behavior need to be coded to know about that module. See the ortb2blocking module for an example of what analytics tags may be available.


## Further Reading

- [PBS Module Overview](/prebid-server/developers/add-a-module.html)
- [PBS Module Analytics Tags Conventions](/prebid-server/developers/module-atags.html)

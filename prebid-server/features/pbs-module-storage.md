---
layout: page_v2
sidebarType: 5
title: Prebid Server | Features | Module Storage
---

# Prebid Server | Features | Module Storage

Prebid Server supports storing of data for [Module Feature](/prebid-server/pbs-modules/#the-modules)

Sometimes it becomes necessary to store data inside your module. For this purpose, we propose a few solutions:

1.	Use internal application data structures like `com.github.benmanes.caffeine.cache.Caffeine`:
This provides the fastest approach but is not suitable if you have large amounts of data or need a centralized cache.
2.	Using module cache via PBC:
Check the [Module Storage endpoints](/prebid-server/endpoints/pbs-endpoints-pbc.html#module-storage). This approach provides a centralized caching solution that will be available from each PBS instance configured to connect to the PBC application.


To use this approach, you need to inject `ModuleCacheService` into your module. You can do this in your module configuration class.

```java
@ConditionalOnProperty(prefix = "hooks." + {ModuleName}Module.CODE, name = "enabled", havingValue = "true")
@Configuration
public class {ModuleName}ModuleConfiguration {

    @Bean
    {ModuleName}Module {moduleName}Module(ModuleCacheService cacheService) {
    
        ...
    }
}
```

Then you can use the functions below for storing and retrieving data.

```java
Future<Void> storeModuleEntry(String key,
                                  String value,
                                  ModuleCacheType type,
                                  Integer ttlseconds,
                                  String application,
                                  String moduleCode);

    Future<ModuleCacheResponse> retrieveModuleEntry(String key, String moduleCode, String application);
```
Here is an explanation of the parameters for the `storeModuleEntry` function:


{: .table .table-bordered .table-striped }
| Parameter | Description |
| --- | --- |
|	key | A name that will be used to reference the stored value. |
|	value | String representation of the data you need to store. |
|	type | Represents the format stored inside the value. Can be one of `JSON`, `XML`, `TEXT`. |
|	ttlseconds | How long (in seconds) the data will be available in the module store. |
|	application | Configured name of your module storage. Check the configuration section of [Module Storage endpoints](/prebid-server/endpoints/pbs-endpoints-pbc.html#configuration). |
|	moduleCode | Use this constant from your module `{ModuleName}Module.CODE`. |


Here is an explanation of the parameters for the `retrieveModuleEntry` function:

{: .table .table-bordered .table-striped }
| Parameter | Description |
| --- | --- |
|	key | A name that will be used to reference the stored value. |
|	application | Configured name of your module storage. Check the configuration section of [Module Storage endpoints](/prebid-server/endpoints/pbs-endpoints-pbc.html#configuration). |
|	moduleCode | Use this constant from your module `{ModuleName}Module.CODE`. |


## Related Reading

- [Module Feature](/prebid-server/pbs-modules/#the-modules)
- [Prebid Cache Module Storage Endpoints](/prebid-server/endpoints/pbs-endpoints-pbc.html#module-storage)

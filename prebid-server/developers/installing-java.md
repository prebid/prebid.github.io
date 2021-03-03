---
layout: page_v2
sidebarType: 5
title: Prebid Server | Versions | Java | Installing

---

# Installing PBS-Java

## Development

This project is built upon [Vert.x](http://vertx.io) to achieve high request throughput.
We use [Maven](https://maven.apache.org) and attempt to introduce minimal dependencies.

## Getting Started

To start the Prebid Server you need to do the following steps:
- Build all-in-one JAR file from sources as described in the [build documentation](https://github.com/prebid/prebid-server-java/blob/master/docs/build.md).
- Check minimal needed configuration file `sample/prebid-config.yaml`.
- Also, check the Data Cache settings file `sample/sample-app-settings.yaml`.
For more information how to configure the server follow the [config documentation](https://github.com/prebid/prebid-server-java/blob/master/docs/config.md).

- Run your server with:
```
java -jar target/prebid-server.jar --spring.config.additional-location=sample/prebid-config.yaml
```
For more information how to start the server follow the [run documentation](https://github.com/prebid/prebid-server-java/blob/master/docs/run.md).

- To verify everything is OK go to `http://localhost:8080/status` and check response status is `200 OK`.

More project documentation can be found [here](/prebid-server/versions/pbs-versions-java.html).

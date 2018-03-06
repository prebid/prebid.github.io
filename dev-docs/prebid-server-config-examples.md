---
layout: page
title: Prebid Server Config Examples
description: Prebid Server Config Examples
pid: 29
top_nav_section: dev_docs
nav_section: prebid-server
---

<div class="bs-docs-section" markdown="1">

# Prebid Server Config Examples
{:.no_toc}

## Go Prebid Server Config

From https://github.com/prebid/prebid-server/blob/master/docs/developers/configuration.md
{% highlight bash %}
Configuration is handled by Viper, which supports many ways of setting config values.

As a general rule, Prebid Server will log its resolved config values on startup and exit immediately if they're not valid.
{% endhighlight %}

Example config:
{% highlight json %}
{
    "port": 80,
    "external_url": "EXTERNAL_URL",
    "adapters": {
        "rubicon": {
            "endpoint": "RP_ENDPOINT",
	    "usersync_url": "RP_USER_SYNC",
            "XAPI": {
                "Username": "RP_LOGIN",
                "Password": "RP_PASSWORD",
                "tracker": "RP_TRACKER"
            }
        }
    },
    "metrics": {
        "type": "influx",
        "host": "METRICS_HOST",
        "interval": 60
    },
    "cache": {
	"scheme": "http",
	"host": "CACHE_HOST",
	"query": "uuid=%PBS_CACHE_UUID%"
    },
    "stored_requests": {
	"filesystem": false,
	"postgres": {
            "dbname": "DB_NAME",
            "host": "DB_HOST",
            "port": 5432,
            "user": "",
            "password": "",
	    "query": "SELECT uuid, config FROM stored_requests WHERE uuid IN %ID_LIST%"
	}
    },
    "datacache": {
        "type": "postgres",
	"ttl_seconds": 3600,
	"cache_size": 1000000
    },
    "optout_cookie": {
      "name": "optout",
      "value": "true"
    }
}
{% endhighlight %}

## Java Prebid Server Config

The open source repo has both [basic](https://github.com/rubicon-project/prebid-server-java/blob/master/docs/config.md) and [detailed](https://github.com/rubicon-project/prebid-server-java/blob/master/docs/config-app.md) documention.

Here's the runtime layout for the Java version of Prebid Server:

- /app/prebid-server directory
  - the JAR file contains application.yaml - static settings global to all instances of Prebid Server. See src/main/resources/application.yaml
  - prebid-server.conf - startup instructions
- /app/prebid-server/conf dir
  - application.yaml - environmentally-dependent config
  - logback-spring.xml - config needed by logback module
  - application-default.yaml - static settings for local installation


Sample files below.

prebid-server.conf
{% highlight bash %}
MODE=service
LOG_FOLDER=/app/prebid-server/log
JAVA_OPTS="-Dspring.profiles.active=dev,default \
    -Dspring.config.location=/app/prebid-server/conf/ \
    -Dlog.dir=/app/prebid-server/log/ \
    -Dlogging.path=/app/prebid-server/log/ \
    -Dcom.sun.management.jmxremote \
    -Dcom.sun.management.jmxremote.port=8005 \
    -Dcom.sun.management.jmxremote.authenticate=false \
    -Dlogging.config=/app/prebid-server/conf/logback-spring.xml \
    -Xms4G \
    -Xmx4G \
    -XX:+UseParallelGC \
    -Dcom.sun.management.jmxremote.ssl=false"
{% endhighlight %}
application.yaml
{% highlight bash %}
http:
  port: 8000
vertx:
  verticle:
    instances: 4
external-url: EXTERNAL_URL
adapters:
  rubicon:
    endpoint: RP_ENDPOINT
metrics:
  host: METRICS_HOST
  prefix: METRICS_PREFIX
cache:
  scheme: http
  host: CACHE_HOST
stored-requests:
  host: DB_HOST
{% endhighlight %}
application-default.yaml
{% highlight bash %}
adapters:
  rubicon:
    usersync-url: https://pixel.rubiconproject.com/exchange/sync.php?p=GET_FROM_RP
metrics:
  type: influx
  host: INFLUX_HOST
  interval: 60
cache:
  query: uuid=%PBS_CACHE_UUID%
datacache:
  type: mysql
stored-requests:
  type: mysql
  query: SELECT uuid, config FROM stored_requests WHERE uuid IN %ID_LIST%
recaptcha-url: https://www.google.com/recaptcha/api/siteverify
recaptcha-secret: secret_value
{% endhighlight %}
# Related Topics

+ [Getting started with Prebid Server]({{site.baseurl}}/dev-docs/get-started-with-prebid-server.html)
+ [Running your own Prebid Server]({{site.baseurl}}/dev-docs/running-your-own-prebid-server.html)
+ [Add a Bidder Adapter to Prebid Server]({{site.baseurl}}/dev-docs/add-a-prebid-server-adapter.html)

</div>

---
layout: page_v2
sidebarType: 5
title: Prebid Server | Versions | Go | Installing

---

# Installing PBS-Go

## Installation

First install [Go](https://golang.org/doc/install) version 1.13 or newer.

Note that prebid-server is using [Go modules](https://blog.golang.org/using-go-modules).
We officially support the most recent two major versions of the Go runtime. However, if you'd like to use a version <1.13 and are inside GOPATH `GO111MODULE` needs to be set to `GO111MODULE=on`.

Download and prepare Prebid Server:

```bash
cd YOUR_DIRECTORY
git clone https://github.com/prebid/prebid-server src/github.com/prebid/prebid-server
cd src/github.com/prebid/prebid-server
```

Run the automated tests:

```bash
./validate.sh
```

Or just run the server locally:

```bash
go build .
./prebid-server
```

Load the landing page in your browser at `http://localhost:8000/`.
For the [full API reference](/prebid-server/endpoints/pbs-endpoint-overview.html)

## Packaging

Prebid Server is [packaged with Docker](https://www.docker.com/what-docker) and
optimized to create [lightweight containers](https://blog.codeship.com/building-minimal-docker-containers-for-go-applications/).

[Install Docker](https://www.docker.com/community-edition#/download) and build a container:

```bash
docker build -t prebid-server .
```

Test locally with:

```bash
docker run -p 8000:8000 -t prebid-server
```

The server can be reached at `http://localhost:8000`.

## Contributing

Want to [add a bidding adapter](/prebid-server/developers/add-new-bidder-go.html)?

Report bugs, request features, and suggest improvements [on Github](https://github.com/prebid/prebid-server/issues).

Or better yet, [open a pull request](https://github.com/prebid/prebid-server/compare) with the changes you'd like to see.

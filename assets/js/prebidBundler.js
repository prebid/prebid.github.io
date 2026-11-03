/**
 * Builds Prebid.js bundles in the browser, from the chunks that each Prebid.js release publishes to npm under
 * `dist/chunks` (Prebid.js 10.0.0 and later), as served by jsdelivr.
 *
 * The bundle has the same shape as the output of `gulp bundle`: a banner, the chunks for the requested modules and
 * everything they depend on, and a call to `processQueue()`. Chunks register with the webpack runtime in
 * `prebid-core.js` and each module runs only once all the chunks it needs are present, so their order in the bundle
 * does not matter.
 *
 * Exposes `window.prebidBundler`:
 *  - `getVersions()` resolves to `{versions: [...]}`, newest first: the 20 highest releases plus the 20 most recently
 *    published, which is what the bundler service at js-download.prebid.org keeps built;
 *  - `download({version, modules})` resolves to `{source, disclosures}`: the bundle's source code and its storage
 *    disclosure summary, in the format of the `<bundle>_disclosures.json` file that `gulp build` generates (null if
 *    the metadata could not be retrieved).
 */
(function () {
    var CDN_BASE = 'https://cdn.jsdelivr.net/npm/prebid.js@';
    // the npm registry, rather than jsdelivr's API, because publish times are needed
    var REGISTRY_URL = 'https://registry.npmjs.org/prebid.js';
    var VERSIONS_TO_LIST = 20;
    // first release that publishes dist/chunks
    var MIN_VERSION = [10, 0, 0];
    var CORE_MODULE = 'prebid-core';
    var METADATA_SUFFIX = '.metadata.js';
    // mirrors MODULES_REQUIRING_METADATA in Prebid.js' web-bundler/dependencies.mjs
    var MODULES_REQUIRING_METADATA = ['storageControl'];
    // Both become part of a URL path. Neither pattern admits '/', '\', '.' segments or '%', so a request cannot
    // reach files outside the release's own directory on the CDN, which also serves every other npm package and
    // GitHub repository.
    var VERSION_PATTERN = /^\d+\.\d+\.\d+$/;
    var MODULE_PATTERN = /^[A-Za-z0-9_][A-Za-z0-9_-]*$/;

    function parseVersion(version) {
        return version.split('.').map(Number);
    }

    function compareVersions(a, b) {
        return a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
    }

    function getVersions() {
        return fetch(REGISTRY_URL)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Could not retrieve the list of Prebid.js versions (HTTP ' + response.status + ')');
                }
                return response.json();
            })
            .then(function (data) {
                var published = data.time;
                var releases = Object.keys(data.versions).filter(function (version) {
                    return /^\d+\.\d+\.\d+$/.test(version);
                });
                function byVersion(a, b) {
                    return compareVersions(parseVersion(b), parseVersion(a));
                }
                var highest = releases.slice().sort(byVersion).slice(0, VERSIONS_TO_LIST);
                var mostRecent = releases.slice().sort(function (a, b) {
                    return Date.parse(published[b]) - Date.parse(published[a]);
                }).slice(0, VERSIONS_TO_LIST);
                var versions = Array.from(new Set(highest.concat(mostRecent)))
                    .filter(function (version) {
                        return compareVersions(parseVersion(version), MIN_VERSION) >= 0;
                    })
                    .sort(byVersion);
                return {versions: versions};
            });
    }

    /**
     * Fetch a file from a Prebid.js release. A missing file rejects with an error whose `status` is 404.
     * `integrity`, when given, is checked by the browser and a mismatch rejects.
     */
    function fetchFile(version, path, integrity) {
        var base = CDN_BASE + version + '/';
        var url = new URL(base + path).href;
        if (url.indexOf(base) !== 0) {
            return Promise.reject(new Error('Refusing to fetch ' + url + ', which is outside ' + base));
        }
        return fetch(url, integrity ? {integrity: integrity} : undefined)
            .then(function (response) {
                if (!response.ok) {
                    var error = new Error('Could not retrieve ' + path + ' for Prebid.js ' + version + ' (HTTP ' + response.status + ')');
                    error.status = response.status;
                    throw error;
                }
                return response.arrayBuffer();
            })
            .then(function (buffer) {
                // keep a leading byte order mark, if any, so that chunks are copied byte for byte
                return new TextDecoder('utf-8', {ignoreBOM: true}).decode(buffer);
            });
    }

    function fetchJSON(version, path) {
        return fetchFile(version, path).then(JSON.parse);
    }

    /**
     * Releases before 11.40.0 do not publish checksums; resolves to null for those.
     */
    function fetchChecksums(version) {
        return fetchJSON(version, 'dist/chunks/checksums.json').catch(function (error) {
            if (error.status === 404) {
                return null;
            }
            throw error;
        });
    }

    /**
     * Submodules need their parent module (e.g. id5IdSystem needs userId); add any that are missing to the front of
     * the list, as `gulp bundle` does.
     */
    function addParentModules(modules, parentModules) {
        modules = modules.slice();
        function parentOf(module) {
            return Object.keys(parentModules).find(function (parent) {
                return parentModules[parent].includes(module);
            });
        }
        new Set(
            modules.map(parentOf).filter(function (parent) {
                return parent != null && !modules.includes(parent);
            })
        ).forEach(function (parent) {
            modules.unshift(parent);
        });
        return modules;
    }

    /**
     * The chunks needed for `modules`: prebid-core, the modules themselves, their metadata when a module that
     * requires it is included, and all of their dependencies. Mirrors `resolveDependencies` in Prebid.js'
     * web-bundler/dependencies.mjs.
     */
    function resolveChunks(modules, dependencies, hasMetadata) {
        var metadataChunks = modules.some(function (module) {
            return MODULES_REQUIRING_METADATA.includes(module);
        }) ? modules.concat([CORE_MODULE]).filter(hasMetadata).map(function (module) {
            return module + METADATA_SUFFIX;
        }) : [];
        var chunks = new Set(
            [CORE_MODULE + '.js']
                .concat(modules.map(function (module) {
                    return module + '.js';
                }))
                .concat(metadataChunks)
        );
        function addDependencies(chunk) {
            (dependencies[chunk] || []).forEach(function (dependency) {
                chunks.add(dependency);
                addDependencies(dependency);
            });
        }
        chunks.forEach(addDependencies);
        return Array.from(chunks);
    }

    function header(pkg, modules) {
        var g = pkg.globalVarName;
        return '/* ' + pkg.name + ' v' + pkg.version + '\n' +
            'Updated: ' + new Date().toISOString().substring(0, 10) + '\n' +
            'Modules: ' + modules.join(', ') + ' */\n' +
            'if(window.' + g + '&&window.' + g + '.libLoaded)try{window.' + g + '.getConfig("debug")&&console.warn("Attempted to load a copy of Prebid.js that clashes with the existing \'' + g + '\' instance. Load aborted.")}catch(e){}else (function(){';
    }

    function footer(pkg) {
        return '})(),' + pkg.globalVarName + '.processQueue();';
    }

    /**
     * Validate a `{version, modules}` request and work out what goes in its bundle: resolves to
     * `{version, pkg, modules, chunks, checksums, hasMetadata}`, where `modules` includes any parent modules that were
     * added and `chunks` are all the chunk files to concatenate.
     */
    function resolveBundle(request) {
        var version = request.version;
        if (typeof version !== 'string' || !VERSION_PATTERN.test(version)) {
            return Promise.reject(new Error('Not a valid Prebid.js version: ' + version));
        }
        if (!Array.isArray(request.modules) || request.modules.length === 0) {
            return Promise.reject(new Error('No modules selected'));
        }
        var invalid = request.modules.filter(function (module) {
            return typeof module !== 'string' || !MODULE_PATTERN.test(module);
        });
        if (invalid.length > 0) {
            return Promise.reject(new Error('Not valid module names: ' + invalid.join(', ')));
        }
        var modules = Array.from(new Set(request.modules));
        return Promise.all([
            fetchJSON(version, 'package.json'),
            fetchJSON(version, 'dist/chunks/dependencies.json'),
            fetchJSON(version, 'modules/.submodules.json'),
            fetchChecksums(version)
        ]).then(function (results) {
            var pkg = results[0];
            var dependencies = results[1];
            var parentModules = results[2].parentModules;
            var checksums = results[3];
            modules = addParentModules(modules, parentModules);
            var available = checksums || dependencies;
            // Leave out modules the release doesn't have, and report them, instead of failing the whole download:
            // the docs can list a module (or a stale alias page) that a given release doesn't include.
            var missing = [];
            if (checksums) {
                missing = modules.filter(function (module) {
                    return !checksums.hasOwnProperty(module + '.js');
                });
                modules = modules.filter(function (module) {
                    return missing.indexOf(module) === -1;
                });
            }
            function hasMetadata(module) {
                return available.hasOwnProperty(module + METADATA_SUFFIX);
            }
            return {
                version: version,
                pkg: pkg,
                modules: modules,
                missing: missing,
                chunks: resolveChunks(modules, dependencies, hasMetadata),
                checksums: checksums,
                hasMetadata: hasMetadata
            };
        });
    }

    function bundleSource(bundle) {
        var version = bundle.version;
        var checksums = bundle.checksums;
        return Promise.all(bundle.chunks.map(function (chunk) {
            return fetchFile(version, 'dist/chunks/' + chunk, checksums && checksums[chunk]).catch(function (error) {
                if (error.status === 404) {
                    throw new Error(chunk.replace(/\.js$/, '') + ' is not available in Prebid.js ' + version);
                }
                throw error;
            });
        })).then(function (sources) {
            return [header(bundle.pkg, bundle.modules)].concat(sources, [footer(bundle.pkg)]).join('\n');
        });
    }

    /**
     * Port of libraries/storageDisclosure/summary.mjs in Prebid.js.
     */
    function getStorageDisclosureSummary(moduleNames, getModuleMetadata) {
        var summary = {};
        moduleNames.forEach(function (moduleName) {
            var metadata = getModuleMetadata(moduleName);
            var disclosure = metadata && metadata.disclosures;
            if (!disclosure) return;
            Object.keys(disclosure).forEach(function (url) {
                // before Prebid.js 10.2.0 each entry is the identifier array itself
                var identifiers = Array.isArray(disclosure[url]) ? disclosure[url] : disclosure[url].disclosures;
                if (summary.hasOwnProperty(url)) {
                    summary[url].forEach(function (entry) {
                        entry.disclosedBy.push(moduleName);
                    });
                } else if (identifiers && identifiers.length > 0) {
                    summary[url] = identifiers.map(function (identifier) {
                        return Object.assign({disclosedIn: url, disclosedBy: [moduleName]}, identifier);
                    });
                }
            });
        });
        return [].concat.apply([], Object.keys(summary).map(function (url) {
            return summary[url];
        }));
    }

    /**
     * Unlike `gulp build`, which only summarizes prebid-core and the requested modules, this covers every module in
     * the bundle, including the parent modules added for them and the modules they depend on.
     */
    function bundleDisclosures(bundle) {
        var moduleNames = bundle.chunks.filter(function (chunk) {
            return !chunk.endsWith(METADATA_SUFFIX);
        }).map(function (chunk) {
            return chunk.replace(/\.js$/, '');
        }).filter(bundle.hasMetadata);
        return Promise.all(moduleNames.map(function (module) {
            return fetchJSON(bundle.version, 'metadata/modules/' + module + '.json');
        })).then(function (metadata) {
            return getStorageDisclosureSummary(moduleNames, function (module) {
                return metadata[moduleNames.indexOf(module)];
            });
        });
    }

    function download(request) {
        return resolveBundle(request).then(function (bundle) {
            var disclosures = bundleDisclosures(bundle).catch(function (error) {
                console.error(error);
                return null;
            });
            return Promise.all([bundleSource(bundle), disclosures]).then(function (results) {
                return {source: results[0], disclosures: results[1], missing: bundle.missing};
            });
        });
    }

    window.prebidBundler = {
        getVersions: getVersions,
        download: download
    };
})();

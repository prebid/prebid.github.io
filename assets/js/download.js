(function () {
    var currentUrl = new URL(window.location);
    var searchParams = currentUrl.searchParams;

    getVersionList();

    $(function () {
        // show all adapters
        $(".adapters .col-md-4").show();
        setPrepickedModules();

        var configInput = document.getElementById('configFileInput');
        if (configInput) {
            configInput.addEventListener('change', function(event) {
                var file = event.target.files[0];
                if (!file) return;
                var reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        var cfg = JSON.parse(e.target.result);
                        applyConfig(cfg);
                    } catch (err) {
                        alert('Invalid configuration file');
                    }
                };
                reader.readAsText(file);
            });
        }

        document.getElementById('download-button').addEventListener('click', function (event) {
            event.preventDefault();
            submit_download();
        });
    });

    function getVersionList() {
        prebidBundler.getVersions()
            .then(function (data) {
                try {
                    var versions = data.versions;
                    if (!versions || versions.length === 0) {
                        showError();
                        return;
                    }
                    versions.forEach(function (version, index) {
                        if (index === 0) {
                            $(".selectpicker").append(
                                '<option value="' +
                                version +
                                '">' +
                                version +
                                " - latest </option>"
                            );
                        } else {
                            if (version.match(/\d\.\d+\.\d+/i)) {
                                $(".selectpicker").append(
                                    '<option value="' + version + '">' + version + "</option>"
                                );
                            } else {
                                // $('.selectpicker').append('<option value="'+version+'">'+version+' - deprecated</option>');
                            }
                        }
                    });
                    setPrepickedVersion();
                    filterModulesForVersion();
                } catch (e) {
                    console.log(e);
                    showError();
                }
            }, function (e) {
                console.log(e);
                showError();
            });
        function showError() {
            // the request can fail before the rest of the page has been parsed
            $(function () {
                $(".selectpicker").append(
                    '<option value="error">Error generating version list. Please try again later</option>'
                );
                $("#version-error").show();
                $("#download-button").addClass("disabled").prop("disabled", true);
            });
        }
    }

    function submit_download() {
        if (moduleFilterPending) {
            return;
        }
        $('#download-button').html('<i class="glyphicon glyphicon-send"></i> Sending Request...').addClass('disabled');

        var form_data = get_form_data();
        const removedModules = form_data.removedModules;
        delete form_data.removedModules;
        prebidBundler.download(form_data)
        .then(function (data) {
            $('#download-button').html('<i class="glyphicon glyphicon-ok"></i> Prebid.js download successfully prepared!');
            setTimeout(function () {
                $('#download-button').html('<i class="glyphicon glyphicon-download-alt"></i> Download Prebid.js').removeClass('disabled');
            }, 5000);
            var filename = "prebid" + form_data["version"] + ".js";

            var jsBlob = new Blob([data.source], { type: "text/javascript" });
            var configData = JSON.stringify({ version: form_data.version, modules: form_data.modules }, null, 2);

            triggerDownload(jsBlob, filename);
            triggerDownload(new Blob([configData], { type: "application/json" }), "prebid-config.json");
            if (data.disclosures) {
                triggerDownload(
                    new Blob([JSON.stringify(data.disclosures, null, 2)], { type: "application/json" }),
                    filename.replace(/\.js$/, "") + "_disclosures.json"
                );
            } else {
                alert("Prebid.js was downloaded, but the storage disclosure file couldn't be generated. Download again to retry.");
            }

            if (removedModules.length > 0) {
                alert(
                    "The following modules were removed from your download because they aren't present in Prebid.js version " +
                    form_data["version"] +
                    ": " +
                    JSON.stringify(removedModules)
                );
            }
        }, function (e) {
            console.log(e);
            alert("Ran into an issue: " + e.message);
        });
    }

    function triggerDownload(blob, filename) {
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function get_form_data() {
        var modules = [];
        var version = $(".selectpicker").val();
        var removedModules = [];

        document
            .querySelectorAll("input[type=checkbox][moduleCode]:checked")
            .forEach(function (box) {
                var moduleCode = box.getAttribute("moduleCode");
                var minVersion = box.getAttribute("minVersion");
                modules.push(moduleCode);

                if (box.hasAttribute("data-not-in-version")) {
                    removedModules.push(moduleCode);
                    return;
                }

                if (minVersion) {
                    var module_version_array = minVersion.split(".");
                    var pbjs_version_array = version.split(".");
                    if (
                        Number(pbjs_version_array[0]) < Number(module_version_array[0]) ||
                        (Number(pbjs_version_array[0]) == Number(module_version_array[0]) &&
                            Number(pbjs_version_array[1]) < Number(module_version_array[1]))
                    ) {
                        removedModules.push(moduleCode);
                    }
                }
            });

        return {
            modules: modules.filter(mod => !removedModules.includes(mod)),
            version,
            removedModules,
        };
    }

    function setPrepickedModules() {
        var moduleCheckboxes = document.querySelectorAll(".module-check-box");
        var modules = [];
        var modulesParam = searchParams.get("modules");
        if (modulesParam) {
            modules = modulesParam.split(",");
        }
        if (modules && modules.length) {
            moduleCheckboxes.forEach(function (checkbox) {
                checkbox.checked = false;
            });
            modules.forEach(function (module) {
                var checkbox = document.getElementById(module);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }

        moduleCheckboxes.forEach(function (checkbox) {
            if (checkbox.checked) {
                var module = checkbox.id;
                if (!modules.includes(module)) {
                    modules.push(module);
                }
            }
            checkbox.addEventListener("change", function (event) {
                var module = event.target.id;
                if (event.target.checked) {
                    modules.push(module);
                } else {
                    modules = modules.filter(function (m) {
                        return m !== module;
                    });
                }
                if (modules.length) {
                    searchParams.set("modules", modules.join(","));
                } else {
                    searchParams.delete("modules");
                }
                window.history.replaceState(null, "", currentUrl);
            });
        });
    }

    function applyConfig(cfg) {
        if (!cfg) return;
        if (cfg.version) {
            var versionOption = document.querySelector('#version_selector option[value="' + cfg.version + '"]');
            if (versionOption) {
                versionOption.selected = true;
                searchParams.set("version", cfg.version);
                filterModulesForVersion();
            }
        }

        if (Array.isArray(cfg.modules)) {
            var moduleCheckboxes = document.querySelectorAll('.module-check-box');
            moduleCheckboxes.forEach(function(cb){ cb.checked = false; });
            cfg.modules.forEach(function(module){
                var cb = document.getElementById(module);
                if (cb) cb.checked = true;
            });
            if (cfg.modules.length) {
                searchParams.set("modules", cfg.modules.join(','));
            } else {
                searchParams.delete("modules");
            }
            window.history.replaceState(null, "", window.location.pathname + "?" + searchParams.toString());
        }
    }

    // Module names (file names under modules/) in each Prebid.js version, from the package listing on jsDelivr.
    // Published versions never change, so each listing is fetched at most once per page view (and cached by the browser).
    var modulesByVersion = {};

    function getModulesInVersion(version) {
        if (!modulesByVersion[version]) {
            modulesByVersion[version] = $.ajax({
                type: "GET",
                url: "https://data.jsdelivr.com/v1/packages/npm/prebid.js@" + encodeURIComponent(version) + "?structure=flat",
                dataType: "json",
                timeout: 20000,
            }).then(function (data) {
                var modules = {};
                (data.files || []).forEach(function (file) {
                    var match = /^\/modules\/([^/]+?)(?:\/index)?\.(?:js|ts)$/.exec(file.name);
                    if (match && !/\.d$/.test(match[1])) {
                        modules[match[1]] = true;
                    }
                });
                if (Object.keys(modules).length === 0) {
                    return $.Deferred().reject();
                }
                return modules;
            });
            // don't cache failures, so that the next selection retries
            modulesByVersion[version].fail(function () {
                delete modulesByVersion[version];
            });
        }
        return modulesByVersion[version];
    }

    // Show only the modules that are part of the selected version. If the module list can't be loaded, show everything.
    // While the selected version's module list is loading, the checklist still reflects the previous version,
    // so downloads are blocked until the lookup succeeds or falls back.
    var moduleFilterPending = false;

    function setModuleFilterPending(pending) {
        moduleFilterPending = pending;
        $(function () {
            $("#download-button").toggleClass("disabled", pending).prop("disabled", pending);
        });
    }

    function filterModulesForVersion() {
        var version = $(".selectpicker").val();
        var status = $("#module-filter-status");
        if (!version || version === "error") {
            return;
        }
        setModuleFilterPending(true);
        status.text("Checking which modules are available in Prebid.js " + version + "...");
        getModulesInVersion(version).then(function (available) {
            if ($(".selectpicker").val() !== version) {
                return; // a different version was selected in the meantime
            }
            setModuleFilterPending(false);
            var shown = {};
            document.querySelectorAll("input[type=checkbox][moduleCode]").forEach(function (box) {
                var inVersion = available[box.getAttribute("moduleCode")] === true;
                $(box).closest(".col-md-4, .row").toggle(inVersion);
                if (inVersion) {
                    box.removeAttribute("data-not-in-version");
                    shown[box.getAttribute("moduleCode")] = true;
                } else {
                    box.setAttribute("data-not-in-version", "");
                }
            });
            status.text("Showing the " + Object.keys(shown).length + " modules available in Prebid.js " + version + ".");
        }, function () {
            if ($(".selectpicker").val() !== version) {
                return;
            }
            setModuleFilterPending(false);
            document.querySelectorAll("input[type=checkbox][moduleCode]").forEach(function (box) {
                box.removeAttribute("data-not-in-version");
                $(box).closest(".col-md-4, .row").show();
            });
            status.text("Couldn't check which modules are available in Prebid.js " + version + ", so all modules are shown.");
        });
    }

    function setPrepickedVersion() {
        var version = searchParams.get("version");
        if (version) {
            var versionOption = document.querySelector(
                '#version_selector option[value="' + version + '"]'
            );
            if (versionOption) {
                versionOption.selected = true;
            }
        }
        var versionSelector = document.getElementById("version_selector");
        if (versionSelector) {
            versionSelector.addEventListener("change", function (event) {
                var version = event.target.value;
                filterModulesForVersion();
                searchParams.set("version", version);
                window.history.replaceState(
                    null,
                    "",
                    window.location.pathname + "?" + searchParams.toString()
                );
            });
        }
    }
})();

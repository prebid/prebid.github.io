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
        $.ajax({
            type: "GET",
            url: "https://js-download.prebid.org/versions",
        })
            .success(function (data) {
                try {
                    data = JSON.parse(data);
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
                } catch (e) {
                    console.log(e);
                    showError();
                }
            })
            .fail(function (e) {
                console.log(e);
                showError();
            });
        function showError() {
            $(".selectpicker").append(
                '<option value="error">Error generating version list. Please try again later</option>'
            );
        }
    }

    function triggerDownload(blob, filename) {
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function submit_download() {
        $('#download-button').html('<i class="glyphicon glyphicon-send"></i> Sending Request...').addClass('disabled');

        var form_data = get_form_data();
        $.ajax({
            type: "POST",
            url: "https://js-download.prebid.org/download",
            dataType: "text",
            data: form_data,
        })
        .success(function (data, textStatus, jqXHR) {
            $('#download-button').html('<i class="glyphicon glyphicon-ok"></i> Prebid.js download successfully prepared!');
            setTimeout(function () {
                $('#download-button').html('<i class="glyphicon glyphicon-download-alt"></i> Download Prebid.js').removeClass('disabled');
            }, 5000);
            var filename = "prebid" + form_data["version"] + ".js";
            var disposition = jqXHR.getResponseHeader("Content-Disposition");
            if (disposition && disposition.indexOf("attachment") !== -1) {
                var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                var matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1])
                    filename = matches[1].replace(/['"]/g, "");
            }
            var jsBlob = new Blob([data], { type: "text/javascript" });
            var configData = JSON.stringify({ version: form_data.version, modules: form_data.modules }, null, 2);

            triggerDownload(jsBlob, filename);
            triggerDownload(new Blob([configData], { type: "application/json" }), "prebid-config.json")
            if (window.pako) {
                try {
                    var gz = pako.gzip(data);
                    var kb = (gz.length / 1024).toFixed(1);
                    document.getElementById('package-size').innerText = 'Estimated gzipped size: ' + kb + ' kB';
                } catch(e) {
                    console.log('pako gzip failed', e);
                }
            }
            if (form_data["removedModules"].length > 0) {
                alert(
                    "The following modules were removed from your download because they aren't present in Prebid.js version " +
                    form_data["version"] +
                    ": " +
                    JSON.stringify(form_data["removedModules"])
                );
            }
        })
        .fail(function (e) {
            console.log(e);
            alert("Ran into an issue.");
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

    const renameModules = (function() {
        const RENAMES = [
            [
                /^8\./,
                {
                    tcfControl: 'gdprEnforcement',
                    consentManagementTcf: 'consentManagement',
                    paapiForGpt: 'fledgeForGpt'
                }
            ]
        ];
        return function(version, modules) {
            const renames = RENAMES.find(([pat]) => pat.test(version))?.[1] || {};
            return modules.map(mod => renames.hasOwnProperty(mod) ? renames[mod] : mod)
        }
    })();

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
            modules: renameModules(version, modules),
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

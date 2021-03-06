// SaleSpark V2 2020 - Version 1.0.1
//Changed on 27-August-2020
function scriptInjection(src, callback) {

    var script = document.createElement('script');
    script.type = "text/javascript";

    script.src = src;
    script.async = false;
    if (typeof callback == 'function') {
        script.addEventListener('load', callback);
    }

    document.getElementsByTagName('head')[0].appendChild(script);
}

function cssFileInjection(href) {
    var link = document.createElement("link");
    link.href = href;
    link.type = "text/css";
    link.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link);
}

function transformToAssocArray(prmstr) {
    var params = {};
    var prmarr = prmstr.split("&");
    for (var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
}

function getQueryParameters() {
    var prmstr = window.location.search.substr(1);
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function removeGDPR() {
    $("#gdprdiv").remove();
}

function globalJavascript() {

    const webApi = "https://" + window.location.hostname + "/apps/storefront/api/storefront/";
    const scriptBase = "https://cdn.jsdelivr.net/gh/salespark/salesparkv2@1.1.9/";
    var sweetAlertIncluded = false;
    var store = {};
    this.init = function (callback, callbackArgs) {
        scriptInjection("https://code.jquery.com/jquery-3.4.1.min.js", function () {
            window.salesparkJquery = jQuery.noConflict(true);
            if (typeof callback == 'function') {
                callback.apply(this, callbackArgs);
            }
        });
    }
    this.process = function (callBack) {
        globalJavascript.webApi = webApi;
        globalJavascript.scriptBase = scriptBase;
        globalJavascript.sweetAlertIncluded = sweetAlertIncluded;
        var data = {
            store: store,
        };

        if (localStorage.getItem('sp_globalSettings') != 'undefined') {
            salesparkJquery.ajax({
                url: webApi + "get_shop_settings?shop=" + Shopify.shop,
                dataType: 'json',
                type: 'GET',
                data: {},
                crossDomain: true,
                async: false,
                success: function (response) {
                    if (response._metadata.message == 'success') {
                        globalJavascript.globalSettingsAndData = response.records;
                        localStorage.setItem('sp_globalSettings', globalJavascript.globalSettingsAndData);
                        // if(globalJavascript.globalSettingsAndData.emailCollector != null) {
                        if (!globalJavascript.sweetAlertIncluded) {
                            cssFileInjection(globalJavascript.scriptBase + "saleSpark-sweetalert2.css");
                            scriptInjection(globalJavascript.scriptBase + "saleSpark-sweetalert2.all.js");
                            globalJavascript.sweetAlertIncluded = true;
                        }
                        //}
                        if (globalJavascript.globalSettingsAndData.exitpopup != null && globalJavascript.globalSettingsAndData.exitpopup.length > 0) {
                            if (globalJavascript.globalSettingsAndData.exitpopup.popup_is_active == '1') {
                                if (!globalJavascript.sweetAlertIncluded) {
                                    cssFileInjection(globalJavascript.scriptBase + "saleSpark-sweetalert2.css");
                                    scriptInjection(globalJavascript.scriptBase + "saleSpark-sweetalert2.all.js");
                                    globalJavascript.sweetAlertIncluded = true;
                                }
                                scriptInjection(globalJavascript.scriptBase + "active-timeout.min.js");
                                scriptInjection(globalJavascript.scriptBase + "donleeve.min.js");
                            }
                            if (globalJavascript.globalSettingsAndData.exitpopup.popup_is_active == '1' || globalJavascript.globalSettingsAndData.exitpopup.notif_is_active == '1') {
                                scriptInjection(globalJavascript.scriptBase + "saleSparkexitSale.min.js");
                            }
                        }
                        if (globalJavascript.globalSettingsAndData.carteminder != null && globalJavascript.globalSettingsAndData.carteminder.length > 0) {
                            scriptInjection(globalJavascript.scriptBase + "pushnotif/bin/push.min.js", function () {
                                scriptInjection(globalJavascript.scriptBase + "cartreminder.js");
                            });
                        }
                        if (globalJavascript.globalSettingsAndData.gdpr != null) {
                            var gdprlocal = localStorage.getItem('gdpr');
                            if (globalJavascript.globalSettingsAndData.gdpr.status == '1' && gdprlocal != 'yes') {
                                $("#gdprdiv").remove();
                                localStorage.setItem('gdpr', 'yes');
                                var html = '<div id="gdprdiv" style="position: fixed; z-index:9999999999;background:' + globalJavascript.globalSettingsAndData.gdpr.options.backgroundcolor + ';width: 100%;bottom: 0;padding: ' + globalJavascript.globalSettingsAndData.gdpr.options.padding + 'rem;"><button style="border: 0;background:' + globalJavascript.globalSettingsAndData.gdpr.options.buttoncolor + '; color:' + globalJavascript.globalSettingsAndData.gdpr.options.buttontextcolor + '; float:right;width: 100px;padding: 10px;" onclick="removeGDPR();">' + globalJavascript.globalSettingsAndData.gdpr.options.buttonText + '</button><div style="overflow: hidden;"> ' + globalJavascript.globalSettingsAndData.gdpr.options.maintext + '</div></div>';
                                $("body").append(html);
                            }
                        }
                        var queryParametersArray = getQueryParameters();
                        if (queryParametersArray.tryTitleBar == 'yes') {
                            scriptInjection(globalJavascript.scriptBase + "pushnotif/bin/push.min.js", function () {
                                scriptInjection(globalJavascript.scriptBase + "cartreminder.js");
                            });
                        }
                        if (globalJavascript.globalSettingsAndData.pushCampaign) {
                            scriptInjection("https://www.gstatic.com/firebasejs/7.17.2/firebase-app.js", function () {
                                scriptInjection("https://www.gstatic.com/firebasejs/7.17.2/firebase-messaging.js", function () {
                                    scriptInjection("https://www.gstatic.com/firebasejs/7.17.2/firebase-analytics.js", function () {
                                        scriptInjection(globalJavascript.scriptBase + "notification/firebase-init.js");
                                    });
                                });
                            });
                        }
                    }
                }
            });
        } else {
            globalJavascript.globalSettingsAndData = localStorage.getItem('sp_globalSettings');
        }
        scriptInjection(globalJavascript.scriptBase + "saleSpark-cartTrigger.js");
    };

}

var globalJavascript = new globalJavascript();
globalJavascript.init(globalJavascript.process, [0]);

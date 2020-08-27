function checkPermissions() {
    if ('permissions' in navigator) {
        navigator.permissions.query({name: 'notifications'}).then(function (notificationPerm) {
            notificationPerm.onchange = async function () {
                if (notificationPerm.state === 'prompt' || notificationPerm.state === 'denied') {
                    console.log("prompt || denied")
                    deleteToken();
                } else {
                    // var token = await window.firebaseMessage.getToken();
                    console.log("allow")
                    fcm();
                }
            };
        });
    }
}

function fcm() {
    var config = {
        apiKey: "AIzaSyCENFv-5fGiBssMFtH0Nu13gBoqLIMqYzo",
        authDomain: "salespark-b0069.firebaseapp.com",
        databaseURL: "https://salespark-b0069.firebaseio.com",
        projectId: "salespark-b0069",
        storageBucket: "salespark-b0069.appspot.com",
        messagingSenderId: "277756429917",
        appId: "1:277756429917:web:774e57daf171826970efb4",
        measurementId: "G-LHB8CHV6FF"
    };
    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
    firebase.analytics();
    window.firebaseMessage = firebase.messaging();
    registerSw();
    message();
}

function requestPer() {
    window.firebaseMessage.getToken().then((token) => {
        registerToken(token);
    }).catch(err => {
        deleteToken();
    });
}

function registerSw() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/apps/storefront/sw.js?shop=' + Shopify.shop)
            .then((registration) => {
                window.firebaseMessage.useServiceWorker(registration);
                requestPer();
            }).catch(function (err) {
            console.log(err)
        });
    }
}

function registerToken(currentToken) {
    var data = {};
    data.store = Shopify.shop;
    data.token = currentToken;
    var json = JSON.stringify(data);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", globalJavascript.webApi + "notification/token", true)
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            localStorage.setItem('spk_token', currentToken);
        }
    });
    xhr.send(json);
}

function deleteToken() {
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", globalJavascript.webApi + "notification/token/destroy/" + Shopify.shop, true);
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            unregisterSw();
            localStorage.removeItem('spk_token')
        }
    });
    xhr.send(null);
}

function getSw() {
    return navigator.serviceWorker.getRegistrations();
}

function unregisterSw() {
    getSw().then((r) => {
        return Promise.all(r.map(reg => reg.unregister()));
    });
}

function message() {
    window.firebaseMessage.onMessage((payload) => {
        const {title, ...options} = payload.notification;
        getSw().getRegistrations().then(registration => {
            registration[0].showNotification(title, options);
        });
    });
}

function run() {
    // checkPermissions();
    fcm();
}

if (document.readyState === "interactive" || document.readyState === "complete") {
    run();
} else {
    window.addEventListener('DOMContentLoaded', run);
}

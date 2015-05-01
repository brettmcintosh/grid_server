window.gridServer = {};

(function() {
    var host = window.location.host;
    var length = window.location.pathname;
    gridServer.ws = new WebSocket("ws://" + host + "/websocket" + length);

    gridServer.ws.onmessage = function (event) {

        var data = JSON.parse(event.data);

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                document.getElementById(key).textContent = data[key];
            }
        }
    };
})();
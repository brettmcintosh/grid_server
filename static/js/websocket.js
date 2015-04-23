var host = window.location.host;
var length = window.location.pathname;
var ws = new WebSocket("ws://" + host + "/websocket" + length);

ws.onmessage = function(event){

    var data = JSON.parse(event.data)

    for (var key in data){
        if (data.hasOwnProperty(key)){
            document.getElementById(key).textContent = data[key];
        }
    }
};

function xToggle(e){

    var cell = e.target;

    if (cell.innerHTML === '') {
        cell.innerHTML = 'x';
    }else{
        cell.innerHTML = '';
    }
}
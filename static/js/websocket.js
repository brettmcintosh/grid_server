var length = window.location.pathname;
var ws = new WebSocket("ws://192.168.44.144:8888/websocket" + length);

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
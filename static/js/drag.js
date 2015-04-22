function drag(event){

    event.dataTransfer.setData("text/plain", event.target.textContent);
    event.dataTransfer.dropEffect = "move";
}

function dragOver(event){

    if (event.target.textContent !== 'x'){
        event.preventDefault();
    }
}

function drop(event){

    var data = event.dataTransfer.getData("text/plain");

    event.target.textContent = data;
    sendUpdate(event, data);
}

function dragEnd(event){

    if (event.dataTransfer.dropEffect === "move"){
        event.target.textContent = '';
        sendUpdate(event, '');
    }
}

function sendUpdate(event, data){

    var update = {};

    update[event.target.id] = data;
    ws.send(JSON.stringify(update));
}
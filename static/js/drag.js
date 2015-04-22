var grid = document.getElementById('grid');
var touchMoving = false;

grid.addEventListener('dragstart', drag);
grid.addEventListener('dragover', dragOver);
grid.addEventListener('drop', drop);
grid.addEventListener('dragend', dragEnd);

grid.addEventListener('touchmove', touchMove);
grid.addEventListener('touchend', touchEnd);

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
    sendUpdate(event.target.id, data);
}

function dragEnd(event){

    if (event.dataTransfer.dropEffect === "move"){
        event.target.textContent = '';
        sendUpdate(event.target.id, '');
    }
}

function sendUpdate(id, data){

    var update = {};

    update[id] = data;
    ws.send(JSON.stringify(update));
}

function touchMove(event){

    var sourceValue = event.target.textContent;

    if (sourceValue === 'x'){
        touchMoving = true;
    }

    event.preventDefault();
}

function touchEnd(event){
    var destinationX = event.changedTouches[0].pageX;
    var destinationY = event.changedTouches[0].pageY;
    var destination = document.elementFromPoint(destinationX, destinationY);

    if (touchMoving && destination.textContent !== 'x' && destination.nodeName === 'TD'){
        touchMoving = false;
        destination.textContent = 'x';
        event.target.textContent = '';
        sendUpdate(destination.id, 'x');
        sendUpdate(event.target.id, '');
    }
}
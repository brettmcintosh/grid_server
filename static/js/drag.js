gridServer.touchMoving = false;

gridServer.drag = function(event){

    event.dataTransfer.setData("text/plain", event.target.textContent);
    event.dataTransfer.dropEffect = "move";
};

gridServer.dragOver = function(event){

    if (event.target.textContent !== 'x'){
        event.preventDefault();
    }
};

gridServer.drop = function(event){

    var data = event.dataTransfer.getData("text/plain");

    event.target.textContent = data;
    gridServer.sendUpdate(event.target.id, data);
};

gridServer.dragEnd = function(event){

    if (event.dataTransfer.dropEffect === "move"){
        event.target.textContent = '';
        gridServer.sendUpdate(event.target.id, '');
    }
};

gridServer.sendUpdate = function(id, data){

    var update = {};

    update[id] = data;
    gridServer.ws.send(JSON.stringify(update));
};

gridServer.touchMove = function(event){

    var sourceValue = event.target.textContent;

    if (sourceValue === 'x'){
        gridServer.touchMoving = true;
    }

    event.preventDefault();
};

gridServer.touchEnd = function(event){
    var destinationX = event.changedTouches[0].pageX;
    var destinationY = event.changedTouches[0].pageY;
    var destination = document.elementFromPoint(destinationX, destinationY);

    if (gridServer.touchMoving && destination.textContent !== 'x' && destination.nodeName === 'TD'){
        gridServer.touchMoving = false;
        destination.textContent = 'x';
        event.target.textContent = '';
        gridServer.sendUpdate(destination.id, 'x');
        gridServer.sendUpdate(event.target.id, '');
    }
}

gridServer.grid.addEventListener('dragstart', gridServer.drag);
gridServer.grid.addEventListener('dragover', gridServer.dragOver);
gridServer.grid.addEventListener('drop', gridServer.drop);
gridServer.grid.addEventListener('dragend', gridServer.dragEnd);
gridServer.grid.addEventListener('touchmove', gridServer.touchMove);
gridServer.grid.addEventListener('touchend', gridServer.touchEnd);
gridServer.grid = document.getElementById('grid');

gridServer.xToggle = function(e) {

    var cell = e.target;

    if (cell.innerHTML === '') {
        cell.innerHTML = 'x';
    } else {
        cell.innerHTML = '';
    }
};

gridServer.grid.addEventListener('click', function(e){

    if (e.target && e.target.nodeName === 'TD'){
        gridServer.xToggle(e);
        var gridState = {};
        gridState[e.target.id] = e.target.textContent;
        gridServer.ws.send(JSON.stringify(gridState));
    }
});

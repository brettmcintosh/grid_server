var grid = document.getElementById('grid');

grid.addEventListener('click', function(e){

    if (e.target && e.target.nodeName === 'TD'){
        xToggle(e);
        var gridState = {};
        gridState[e.target.id] = e.target.textContent;
        ws.send(JSON.stringify(gridState));
    }
});


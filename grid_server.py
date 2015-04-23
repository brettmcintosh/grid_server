from tornado.web import RequestHandler, Application, StaticFileHandler
from tornado.ioloop import IOLoop
from tornado.template import Loader
from tornado.websocket import WebSocketHandler

import json
from copy import copy
import os


class Grid(object):
    """
    Keeps track of each grid's state and its websocket connections.
    """

    def __init__(self, side):
        self.side = side
        self.state = {}
        self.socket_connections = set()


class GridManager(object):
    """
    Manages all active grids.  There's only one grid of each size; all requests
    for the same sized grid will get the same grid object.
    """
    grid_collection = {}

    def get_or_create(self, side):
        if side in self.grid_collection:
            return self.grid_collection[side]
        else:
            grid = Grid(side)
            self.grid_collection[side] = grid
            return grid


class GridHome(RequestHandler):
    """
    Returns a rendered grid template of the requested size.
    """

    def get(self, *args, **kwargs):
        loader = Loader("templates")
        template = loader.load("grid.html")
        self.write(template.generate(length=int(kwargs['side'])))


class GridSocket(WebSocketHandler):
    """
    Represents a connection from a single client.
    """

    def __init__(self, application, request, **kwargs):
        self.grid = None
        super(GridSocket, self).__init__(application, request, **kwargs)

    def open(self, *args, **kwargs):
        """Open new connection, get or create a grid, and update the grid's state."""
        self.grid = gridmgr.get_or_create(kwargs['side'])
        self.grid.socket_connections.add(self)
        self.write_message(self.grid.state)

    def on_message(self, message):
        """Whenever a grid state is received, broadcast the new state to all of the grid's active connections."""
        data = json.loads(message)

        for key, value in data.items():
            self.grid.state[key] = value

        for connection in copy(self.grid.socket_connections):
            if connection.ws_connection:
                connection.write_message(self.grid.state)
            else:
                self.grid.socket_connections.remove(connection)

        # print(self)
        # print(self.grid)
        # print(self.grid.state)

    def on_close(self):
        self.grid.socket_connections.remove(self)


def main():
    global gridmgr
    gridmgr = GridManager()

    app = Application([
        (r"^/(?P<side>\d+)", GridHome),
        (r"^/websocket/(?P<side>\d+)", GridSocket),
        (r"^/static/(.*)", StaticFileHandler, {'path': os.path.dirname(__file__) + '/static'}),
    ])
    app.listen(8888)
    IOLoop.current().start()


if __name__ == '__main__':
    main()
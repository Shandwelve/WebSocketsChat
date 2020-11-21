import asyncio
import websockets


class Server:
    users = set()

    async def add_user(self, websocket):
        self.users.add(websocket)

    async def remove_user(self, websocket):
        self.users.remove(websocket)

    async def socket(self, websocket, path):
        await self.add_user(websocket)

        try:
            while True:
                message = await websocket.recv()
                await asyncio.wait([user.send(message) for user in self.users])
        except Exception:
            print('user logged out')
        finally:
            await self.remove_user(websocket)
            print(len(self.users))

    def run(self, ip: str, port: int):
        server = websockets.serve(self.socket, ip, port)
        asyncio.get_event_loop().run_until_complete(server)
        asyncio.get_event_loop().run_forever()


if __name__ == '__main__':
    socket = Server()
    socket.run('localhost', 5678)

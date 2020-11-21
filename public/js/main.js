class Client {
    name = null

    constructor() {
        this.socket = new WebSocket("ws://localhost:5678")
        this.makeBinds()
    }

    login() {
        this.name = prompt('Enter name')
        while (!this.name) {
            this.name = prompt('Enter name')
        }

        return true
    }

    makeBinds() {
        this.socket.onopen = () => {
            this.onOpen()
        };

        this.socket.onerror = () => {
            console.log('Connect error!!')
        };

        this.socket.onmessage = (e) => {
            this.onMessage(e)
        };
    }

    onOpen() {
        document.querySelector(".message_input").addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage()
            }
        });

        document.querySelector('.send_message').addEventListener('click', () => {
            this.sendMessage()
        })
    }

    onMessage(event) {
        const data = JSON.parse(event.data)
        const align = data.name !== this.name ? 'left' : 'right'
        const textAlign = data.name !== this.name ? 'text-left' : 'text-right'
        const div = document.createElement('div');

        div.innerHTML = `<li class="message ${align} appeared">
                <div class="avatar"></div>
                <div class="text_wrapper">
                    <div class="text">
                       <div style="font-size: 12px" class="${textAlign}">${data.name}</div>
                        ${data.message}
                    </div>
                </div>
            </li>`

        document.querySelector(".messages").append(div);
        document.querySelector('.messages').scrollTo({
            top: 1000,
            behavior: "smooth"
        })
    }

    sendMessage() {
        const message = document.querySelector(".message_input");
        const data = {
            name: this.name,
            message: message.value.trim()
        }

        if (!message.value.trim().length) {
            return false
        }

        this.socket.send(JSON.stringify(data))
        message.value = "";

        return true
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const client = new Client()
    client.login()
})
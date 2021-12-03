import {LitElement, html, css} from 'lit';

const EnterKeyCode = 13;

export class chatRoom extends LitElement {

    static properties = {
        socket: {},
        userName: {},
        roomName: {}
    };

    firstUpdated() {
        this.addEventListener("keyup", function(event) {
            if (event.keyCode === EnterKeyCode) {
                event.preventDefault();
                this.newMessage();
            }
        });

        this.socket.on('broadcast-bot-message', (data) => {
            this.addMessage(data, false)
        });

        this.socket.on('broadcast-message', (data) => {
            this.addMessage(data, false)
        });

        this.socket.on('logout', () => {
            this.chatContainer.innerText = '';     
            this.newMessageInput.value = ''; 
        });
    }

    render() {
        return html`
        <link rel="stylesheet" href="../styles/chat-room.css">
            <section class="msger">
                <header class="msger-header">
                    <div class="msger-header-title">
                        <i class="fas fa-comment-alt"></i>
                        <h1 id="chatRoomName">Chat room name: ${this.roomName}</h1>
                    </div>
                </header>

                <div class="chat">
                    <div class="chat-history">
                        <ul id="chatContainer"></ul>  
                    </div>
                </div>

                <div class="msger-inputarea">
                    <input type="text" class="msger-input" placeholder="Enter your message..." id="newMessage">
                    <button type="button" class="msger-send-btn" @click=${this.newMessage}>Send</button>
                </div>
            </section>
        `;
    }

    get newMessageInput() {
        return this.shadowRoot.querySelector('#newMessage') ?? null;
    }

    get chatContainer() {
        return this.shadowRoot.querySelector('#chatContainer') ?? null;
    }

    set chatContainer(newString) {
        this.shadowRoot.querySelector('#chatContainer') = newString;
    }

    get messageForm() {
        return this.shadowRoot.querySelector('#messageForm') ?? null;
    }

    get sendBtn() {
        return this.shadowRoot.querySelector('#sendBtn') ?? null;
    }

    newMessage() {
        this.socket.emit('chat', { userId: this.socket.id, userName: this.userName, message: this.newMessageInput.value, roomName: this.roomName });
        this.addMessage({userName: this.userName, message : this.newMessageInput.value}, true);
        this.newMessageInput.value = ''; 
    }

    addMessage(data, isSelf = false) {
        var alignSelf = '';
        var floatSelf = '';
        var user = '';
        const today = new Date();
        const date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
        const time = today.getHours() + ":" + today.getMinutes();

        if (isSelf) {
            floatSelf = 'my-message';
            user = data.userName;
        } else {  
           alignSelf = 'align-right';
           floatSelf = 'other-message float-right';

            if (data.userName === 'bot') {
                user = 'Bot';
            } else {
                user = data.userName;
            }
        }

        const msgElement = document.createElement('li');
        msgElement.classList.add('clearfix');
        msgElement.innerHTML = `<div class="message-data ${alignSelf}">
                                        <span class="message-data-name" >${data.userName}</span>
                                        <span class="message-data-time" >${time+' '+date}</span> &nbsp; &nbsp;
                                    </div>
                                    <div class="message ${floatSelf}">
                                        ${data.message}
                                    </div>`;
        this.chatContainer.append(msgElement); 
    }
}

customElements.define('chat-room-page', chatRoom);
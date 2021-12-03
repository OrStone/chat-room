import {LitElement, html, css} from 'lit';

const avatarImgs = ["https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_01.jpg",    
                    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_02.jpg",
                    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_03.jpg",
                    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_04.jpg",
                    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_05.jpg",
                    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_06.jpg",
                    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_07.jpg",
                    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_08.jpg",
                    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_09.jpg",
                    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_10.jpg"]

export class OnlineUsers extends LitElement {
    static properties = {
        socket: {},
    };

    firstUpdated() {
        this.socket.on('online-users', (data) =>{
            this.updateOnlineUsers(data);
        })
    }

    render() {
        return html`
        <link rel="stylesheet" href="../styles/online-users.css">
        <div class="users-list">
            <div class="people-list" id="people-list">
                <ul class="list" id="online">
                </ul>
            </div>
        </div>
        `;
    }

    get onlineUsersList() {
        return this.shadowRoot.querySelector('#online') ?? null;
    }

    updateOnlineUsers(data) {
        this.onlineUsersList.innerHTML = '';
        var index = 0;

        data.forEach(user => { 
            const userElement = document.createElement('li');
            userElement.classList.add('clearfix');
            const avatarImg = avatarImgs[index];
            
            userElement.innerHTML = `<img src="${avatarImg}" alt="avatar" />
                                        <div class="about">
                                            <div class="name">${user}</div>
                                            <div class="status">
                                                <img src="../styles/icons/circle_green.png" alt="" style="width: 12px; height: 12px;"> online
                                            </div>
                                        </div>`;

            this.onlineUsersList.append(userElement); 
            index++;

            if (index === 10){
                index = 0;
            }
        });
    }
}

customElements.define('online-user-page', OnlineUsers);
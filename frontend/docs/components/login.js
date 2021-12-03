import {LitElement, html, css } from 'lit';

const EnterKeyCode = 13;

class Login extends LitElement {

    static properties = {
        loggedIn: {}
    };

    firstUpdated() {
        this.addEventListener("keyup", function(event) {
            if (event.keyCode === EnterKeyCode) {
                event.preventDefault();
                this.login();
            }
        });
    }

    render() {
        return html`
        <link rel="stylesheet" href="../styles/login.css">
        <div class="container" ?hidden=${this.loggedIn}>
            <input id="userName" aria-label="UserName" placeholder="user name">
            <input id="roomName" aria-label="RoomName" placeholder="room name">
            <button id="loginBtn" @click=${() => this.login()}>Login</button>
        </div>
        <div class="container logout" ?hidden=${!this.loggedIn}>
            <button @click=${() => this.logout()}>Logout</button>
        </div>
        `;
    }

    get nameInput() {
        return this.shadowRoot.querySelector('#userName') ?? null;
    }

    get roomInput() {
        return this.shadowRoot.querySelector('#roomName') ?? null;
    }

     get chatRoomName() {
        return this.shadowRoot.querySelector('#chatRoomName') ?? null;
    }

    get onlineUsersList() {
        return this.shadowRoot.querySelector('#online') ?? null;
    }

    login(e) {
        const loginEvent = new CustomEvent('login', {
            detail:{
                userName: this.nameInput.value,
                roomName: this.roomInput.value
            },
            bubbles: false,
            composed: false,
            cancelable: true,
        });

        this.nameInput.value = '';
        this.roomInput.value = '';

        this.dispatchEvent(loginEvent);
    }

    logout() {
        const logoutEvent = new CustomEvent('logout', {
            detail:{},
            bubbles: false,
            composed: false,
            cancelable: true,
        });

        this.dispatchEvent(logoutEvent);
    }
}

customElements.define('login-page', Login);
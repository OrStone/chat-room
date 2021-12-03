import {html, LitElement, css} from 'lit';
 import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';

import './components/login.js';
import './components/online-users.js';
import './components/chat-room.js';

 var socket = io('http://localhost:3000');

export class App extends LitElement {

  static properties = {
    userId: '',
    userName: '',
    roomName: '',
    loggedIn: false,
  };

  async firstUpdated() {
    //Displaying if new user has joined the room
    socket.on('joined-user', (data)=>{
      this.userId = data.userId;
      this.loggedIn = true;
    });

    socket.on('logout', () => {
      this.userId = '';
      this.userName = '';
      this.roomName = '';
      this.loggedIn = false;    
    });
        
  }

   render() {
    return html`
    <link rel="stylesheet" href="./styles.css">
    <header>
      <login-page @login=${this.login} @logout=${this.logout} .loggedIn="${this.loggedIn}"></login-page>
    </header>
    <body>
      <div id="loggedIn" ?hidden=${!this.loggedIn} >
        <div class="container">
          <div class="center" style="display: inline-block;">
            <chat-room-page @newMessage=${this.newMessage}
                          .socket="${socket}" .roomName="${this.roomName}" .userName="${this.userName}"></chat-room-page>
          </div>
          <div class="center" style="display: inline-block;">
            <online-user-page .socket="${socket}"></online-user-page>
          </div>
        </div>
      </div>
    </body>
      <footer>
        <!-- <div class="container">
          <span>Made with ❤️  by Forter Engineering</span>
        </div> -->
      </footer>`;
  }

  login(e) {
    this.userName = e.detail.userName;
    this.roomName = e.detail.roomName;

    socket.emit('joined-user', {
      userName: this.userName,
      roomName: this.roomName
    });

    this.loggedIn = true;   
  }

  logout(e){
    socket.emit('logout', {
        userId: '',
        userName: '',
        roomName: '',
        loggedIn: false
    });
  }
}


customElements.define('app-index', App);
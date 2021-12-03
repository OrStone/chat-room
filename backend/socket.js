const {getUsers, users} = require('./getUsers');
const {getBotMessages, messages} = require('./getMessages');

function socket(io) {
    io.on('connection', (socket) => {
        console.log('👾 New socket connected! >>', socket.id);

        //Add user to memory on login
        socket.on('joined-user', (data) =>{
            //Storing users connected in a room in memory
            var user = {};
            user[socket.id] = data.userName;

            if(users[data.roomName]){
                users[data.roomName].push(user);
            }
            else{
                users[data.roomName] = [user];
            }
                    
            //Joining the Socket Room
            socket.join(data.roomName);
            
            //Emitting New Username to Clients
            io.to(data.roomName).emit('joined-user', {userName: data.userName, userId: socket.id});
            //Send online users array
            io.to(data.roomName).emit('online-users', getUsers(users[data.roomName]));
        })

        //Handle user message 
        socket.on('chat', (data) => {

            if(messages[data.roomName]){
                messages[data.roomName].push(data.message);
            }
            else{
                messages[data.roomName] = [data.message];
            }
        
            var a = users[data.roomName].filter( s => Object.keys(s)[0] !== data.userId);
            socket.broadcast.to(data.roomName).emit('broadcast-message', {
                userId: data.userId,
                userName: data.userName,
                message: data.message
            })

            getBotMessages(data, io);
        });

        //Remove user from memory when they disconnect
        socket.on('logout', ()=>{
            var rooms = Array.from(socket.rooms);
            var socketId = rooms[0];
            var roomName = rooms[1];
            
            if (users[roomName] !== undefined) {
                users[roomName].forEach((user, index) => {
                    if(user[socketId]){
                        users[roomName].splice(index, 1)
                    }
                });
            }
            
            //Send online users array
            io.to(roomName).emit('online-users', getUsers(users[roomName]))

            io.to(socketId).emit('logout');
        }) 
    });
}

module.exports = socket;
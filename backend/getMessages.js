var messages = [];

var botMessages = ["Someone already asked that question, the answer is ",
                    "Too slow everyone else, I can answer: ",
                    "I know !!! ",
                    "You asked me? right? ",
                    "Sorry, I dozed off for a second. "];

function getBotMessages(data, io) {
    if ((data.message.length !== 0) && (data.message[data.message.length - 1] === '?')) {
        const indexMessage = messages[data.roomName].indexOf(data.message);
        if ((indexMessage !== -1) && (indexMessage < messages[data.roomName].length - 1)) {
            io.in(data.roomName).emit('broadcast-bot-message', {
                userName: 'bot',
                message: botMessages[getRandomInt(botMessages.length)] + messages[data.roomName][indexMessage+1]
            })
        }
                
    }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

module.exports = {getBotMessages, messages};
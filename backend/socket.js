const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('join', async (data) => {
            try {
                const { userId, userType } = data;

                if (!userId || !userType) {
                    console.log('Invalid join data:', data);
                    return;
                }

                if (userType === 'user') {
                    const user = await userModel.findByIdAndUpdate(
                        userId,
                        { socketId: socket.id },
                        { new: true }
                    );

                    console.log(
                        'User socket saved:',
                        user?._id,
                        user?.socketId
                    );
                }

                else if (userType === 'captain') {
                    const captain = await captainModel.findByIdAndUpdate(
                        userId,
                        { socketId: socket.id },
                        { new: true }
                    );

                    console.log(
                        'Captain socket saved:',
                        captain?._id,
                        captain?.socketId
                    );
                }

            } catch (error) {
                console.error('Join error:', error.message);
            }
        });


        socket.on('update-location-captain', async (data) => {
            try {
                const { userId, location } = data;

                if (
                    !location ||
                    typeof location.ltd !== 'number' ||
                    typeof location.lng !== 'number'
                ) {
                    return socket.emit('error', {
                        message: 'Invalid location data'
                    });
                }

                await captainModel.findByIdAndUpdate(
                    userId,
                    {
                        'vehicle.location': {
                            ltd: location.ltd,
                            lng: location.lng
                        }
                    }
                );

                console.log(
                    'Captain location updated:',
                    userId,
                    location
                );

            } catch (error) {
                console.error(
                    'Captain location update error:',
                    error.message
                );
            }
        });


        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}


const sendMessageToSocketId = (socketId, messageObject) => {

    console.log('Sending socket message:', {
        socketId,
        event: messageObject.event
    });

    if (io) {
        io.to(socketId).emit(
            messageObject.event,
            messageObject.data
        );
    } else {
        console.log('Socket.io not initialized.');
    }
};


module.exports = {
    initializeSocket,
    sendMessageToSocketId
};
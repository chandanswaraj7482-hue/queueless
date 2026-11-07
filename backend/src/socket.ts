import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

let io: SocketIOServer | null = null;

export function initSocket(server: HTTPServer) {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    // Client joins a clinic-specific room to receive updates
    socket.on('join_clinic', (clinicId: string) => {
      socket.join(`clinic_${clinicId}`);
    });

    socket.on('disconnect', () => {});
  });

  return io;
}

export function broadcastQueueUpdate(clinicId: string, event: string, data?: any) {
  if (io) {
    io.to(`clinic_${clinicId}`).emit(event, data);
    io.emit('global_queue_change', { clinicId, event, data });
  }
}


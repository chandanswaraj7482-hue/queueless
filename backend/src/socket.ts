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

    // Real-time Clinical Intercom & Live Desk Messages (Doctor ⇄ Reception ⇄ Patient)
    socket.on('send_intercom_message', (payload: any) => {
      if (!payload || !payload.clinicId) return;
      const messageObj = {
        id: payload.id || `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        clinicId: payload.clinicId,
        fromRole: payload.fromRole, // 'RECEPTION' | 'DOCTOR' | 'PATIENT'
        fromName: payload.fromName || 'Staff',
        toTarget: payload.toTarget || 'ALL', // 'ALL' | 'DOCTOR_1' | 'RECEPTION' | token ID
        doctorCabin: payload.doctorCabin,
        token: payload.token,
        patientName: payload.patientName,
        text: payload.text || payload.message || '',
        timestamp: payload.timestamp || new Date().toISOString(),
      };

      // Broadcast to all participants in this hospital's room and globally with clinicId tag
      io?.to(`clinic_${payload.clinicId}`).emit('intercom_message', messageObj);
      io?.emit('intercom_message', messageObj);
    });

    socket.on('disconnect', () => {});
  });

  return io;
}

export function broadcastQueueUpdate(clinicId: string, event: string, data?: any) {
  if (io) {
    const payload = typeof data === 'object' && data !== null ? { ...data, clinicId } : { payload: data, clinicId };
    io.to(`clinic_${clinicId}`).emit(event, payload);
    io.emit(event, payload);
    io.emit('global_queue_change', { clinicId, event, data: payload });
  }
}


import {
  setMockBookingSession,
  type MockBookingSession,
} from '../../../utils/mock-booking-flow';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.rate_key) {
    throw createError({ statusCode: 400, message: 'rate_key is required' });
  }

  const sessionId = Math.floor(Math.random() * 900000) + 100000; // random 6 digit ID
  const simulatedPrice =
    body._mockPrice ?? Math.floor(Math.random() * 500) + 100;

  const newSession: MockBookingSession = {
    id: sessionId,
    rate_key: body.rate_key,
    check_in: body.check_in,
    check_out: body.check_out,
    current_net_rate: simulatedPrice,
    mockHotel: body._mockHotel,
    mockRoom: body._mockRoom,
    status: 'selected',
  };

  // Simular latencia de red para API de hotel
  await new Promise((resolve) => setTimeout(resolve, 800));

  await setMockBookingSession(sessionId, newSession);

  setResponseStatus(event, 201);
  return {
    id: sessionId,
    current_net_rate: String(simulatedPrice),
    status: 'selected',
  };
});

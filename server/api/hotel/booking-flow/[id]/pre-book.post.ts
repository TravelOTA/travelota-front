import { getMockBookingSession, setMockBookingSession } from "../../../../utils/mock-booking-flow";

export default defineEventHandler(async (event) => {
  const flowId = getRouterParam(event, "id");
  if (!flowId) {
    throw createError({ statusCode: 400, message: "Missing id" });
  }

  const session = await getMockBookingSession(Number(flowId));
  if (!session) {
    throw createError({ statusCode: 404, message: "Session not found" });
  }

  const body = await readBody(event);
  if (!body.passengers || !Array.isArray(body.passengers)) {
    throw createError({ statusCode: 400, message: "Passengers array required" });
  }

  session.passengers = body.passengers;
  session.status = "pre-booked";

  await new Promise((resolve) => setTimeout(resolve, 500)); // Latencia db

  await setMockBookingSession(session.id, session);

  setResponseStatus(event, 200);
  return {
    id: session.id,
    status: "pre-booked",
  };
});

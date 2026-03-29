// Mock booking flow session utilities for dev/testing

export type MockBookingSession = {
  id: number;
  rate_key: string;
  check_in: string;
  check_out: string;
  current_net_rate: number;
  mockHotel?: {
    id: string;
    name: string;
    stars: number;
    image: string;
    address: string;
  };
  mockRoom?: {
    id: string;
    name: string;
    regimen: string;
    cancellation: string;
    cancellationPolicy?: any;
  };
  passengers?: { first_name: string; last_name: string; is_child: boolean }[];
  status: "selected" | "pre-booked" | "confirmed";
};

export async function getMockBookingSessions(): Promise<Record<number, MockBookingSession>> {
  const storage = useStorage("data");
  return (await storage.getItem<Record<number, MockBookingSession>>("mock_booking_sessions")) ?? {};
}

export async function getMockBookingSession(id: number): Promise<MockBookingSession | null> {
  const sessions = await getMockBookingSessions();
  return sessions[id] ?? null;
}

export async function setMockBookingSession(id: number, session: MockBookingSession): Promise<void> {
  const storage = useStorage("data");
  const sessions = await getMockBookingSessions();
  sessions[id] = session;
  await storage.setItem("mock_booking_sessions", sessions);
}

export async function deleteMockBookingSession(id: number): Promise<void> {
  const storage = useStorage("data");
  const sessions = await getMockBookingSessions();
  delete sessions[id];
  await storage.setItem("mock_booking_sessions", sessions);
}

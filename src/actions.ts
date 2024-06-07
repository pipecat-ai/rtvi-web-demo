export const fetch_meeting_token = async (roomUrl: string) => {
  const roomName = roomUrl?.split("/").pop();
  const req = await fetch(
    `${
      import.meta.env.VITE_DAILY_API_URL || "https://api.daily.co/v1"
    }/meeting-tokens`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_DAILY_API_KEY}`,
      },
      body: JSON.stringify({
        properties: { room_name: roomName, is_owner: true },
      }),
    }
  );
  return await req.json();
};

export const fetch_start_agent = async (roomUrl: string, serverUrl: string) => {
  const req = await fetch(`${serverUrl}start_bot`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ room_url: roomUrl }),
  });

  if (!req.ok) {
    return { error: true, detail: req.statusText };
  }
  return await req.json();
};

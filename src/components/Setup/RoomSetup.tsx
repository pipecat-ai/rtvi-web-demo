import React from "react";

import { Alert } from "../ui/alert";

import { RoomInput } from "./RoomInput";
import { SettingsList } from "./SettingsList";

interface RoomSetupProps {
  serverUrl: string;
  roomQs: string | null;
  roomQueryStringValid: boolean;
  roomError: boolean;
  handleCheckRoomUrl: (url: string) => void;
}

export const RoomSetup: React.FC<RoomSetupProps> = ({
  serverUrl,
  roomQs,
  roomQueryStringValid,
  roomError,
  handleCheckRoomUrl,
}) => {
  return (
    <>
      {import.meta.env.DEV &&
        (!import.meta.env.VITE_SERVER_URL ||
          !import.meta.env.VITE_DAILY_API_KEY) && (
          <Alert title="Missing environment settings" intent="danger">
            <p>
              You have not set a server URL for local development, or a Daily
              API Key if you're bypassing starting an agent. Please set{" "}
              <samp>VITE_SERVER_URL</samp> in <samp>.env.local</samp>. Without
              this, the client will attempt to start the bot by calling
              localhost on the same port.
            </p>
          </Alert>
        )}
      <SettingsList
        serverUrl={serverUrl}
        roomQueryString={roomQs}
        roomQueryStringValid={roomQueryStringValid}
      />

      {import.meta.env.VITE_MANUAL_ROOM_ENTRY && !roomQs && (
        <RoomInput
          onChange={handleCheckRoomUrl}
          error={roomError && "Please enter valid room URL"}
        />
      )}
    </>
  );
};

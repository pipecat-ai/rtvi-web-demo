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

const manualStartBot = import.meta.env.VITE_MANUAL_START_BOT;
const manualRoomCreation = import.meta.env.VITE_MANUAL_ROOM_ENTRY;

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
        !manualStartBot &&
        !import.meta.env.VITE_SERVER_URL && (
          <Alert title="Missing environment settings" intent="danger">
            <p className="text-sm">
              You have not set a server URL for local development. Please set{" "}
              <samp>VITE_SERVER_URL</samp> in <samp>.env.local</samp>. Without
              this, the client will attempt to start the bot by calling
              localhost on the same port. Alternatively, set{" "}
              <samp>VITE_MANUAL_START_BOT</samp> if you want to start your bot
              manually.
            </p>
          </Alert>
        )}
      <SettingsList
        serverUrl={serverUrl}
        manualStartBot={manualStartBot}
        manualRoomCreation={manualRoomCreation}
        roomQueryString={roomQs}
        roomQueryStringValid={roomQueryStringValid}
      />

      {((manualRoomCreation && !roomQs) || !manualStartBot) && (
        <RoomInput
          onChange={handleCheckRoomUrl}
          error={roomError && "Please enter valid room URL"}
        />
      )}
    </>
  );
};

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

const serverURL = import.meta.env.VITE_SERVER_URL;
const manualRoomCreation = !!import.meta.env.VITE_MANUAL_ROOM_ENTRY;

export const RoomSetup: React.FC<RoomSetupProps> = ({
  serverUrl,
  roomQs,
  roomQueryStringValid,
  roomError,
  handleCheckRoomUrl,
}) => {
  return (
    <>
      {import.meta.env.DEV && !serverURL && (
        <Alert title="Warning: no server URL set">
          <p className="text-sm">
            You have not set a server URL for local development. Please set{" "}
            <samp>VITE_SERVER_URL</samp> in <samp>.env.local</samp>. You will
            need to launch your bot manually at the same room URL.
          </p>
        </Alert>
      )}
      {import.meta.env.DEV && !serverURL && !manualRoomCreation && (
        <Alert
          title="Error: Auto room creation without server URL"
          intent="danger"
        >
          <p className="text-sm">
            You have not set `VITE_MANUAL_ROOM_ENTRY` (auto room creation mode)
            without setting `VITE_SERVER_URL`
          </p>
        </Alert>
      )}
      <SettingsList
        serverUrl={serverUrl}
        manualRoomCreation={manualRoomCreation}
        roomQueryString={roomQs}
        roomQueryStringValid={roomQueryStringValid}
      />

      {manualRoomCreation && !roomQs && (
        <RoomInput
          onChange={handleCheckRoomUrl}
          error={roomError && "Please enter valid room URL"}
        />
      )}
    </>
  );
};

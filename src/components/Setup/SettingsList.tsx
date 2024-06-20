import { Check, X } from "lucide-react";

import { cn } from "@/utils/tailwind";

interface SettingsList {
  serverUrl: string;
  manualRoomCreation?: boolean;
  roomQueryString: string | null;
  roomQueryStringValid: boolean | null;
}

const rowCx =
  "grid grid-cols-subgrid col-span-2 gap-6 p-2 text-xs items-center overflow-hidden [&:nth-child(even)]:bg-white bg-primary-50";
const titleCx = "font-semibold w-max";
const valueCx =
  "text-right font-mono truncate text-primary-600 [&>svg]:ml-auto";

export const SettingsList: React.FC<SettingsList> = ({
  serverUrl,
  manualRoomCreation = false,
  roomQueryString,
  roomQueryStringValid,
}) => {
  return (
    <div className="grid w-full border border-primary-100 rounded-lg overflow-hidden">
      {import.meta.env.VITE_SERVER_URL ? (
        <div className={rowCx}>
          <span className={titleCx}>Server URL</span>
          <span className={valueCx}>{serverUrl}</span>
        </div>
      ) : (
        <div className={rowCx}>
          <span className={titleCx}>Start bot manually</span>
          <span className={valueCx}>
            <Check size={14} />
          </span>
        </div>
      )}
      <div className={rowCx}>
        <span className={titleCx}>Auto room creation</span>
        <span className={valueCx}>
          {!manualRoomCreation ? <Check size={14} /> : <X size={14} />}
        </span>
      </div>
      {import.meta.env.VITE_MANUAL_ROOM_ENTRY && (
        <div className={rowCx}>
          <span className={titleCx}>Room URL</span>
          <span className={valueCx}>
            {roomQueryString ? <>{roomQueryString}</> : <X size={14} />}
          </span>
        </div>
      )}
      {roomQueryString && (
        <div className={cn(rowCx, !roomQueryStringValid ? "text-red-500" : "")}>
          <span className={titleCx}>Valid room URL</span>
          <span className={valueCx}>
            {roomQueryStringValid ? (
              <Check size={14} />
            ) : (
              <X size={14} className="text-red-500" />
            )}
          </span>
        </div>
      )}
      <div className={rowCx}>
        <span className={titleCx}>Mic input mode</span>
        <span className={valueCx}>
          {import.meta.env.VITE_OPEN_MIC ? "Open Mic" : "Round-robin"}
        </span>
      </div>
      <div className={rowCx}>
        <span className={titleCx}>User video enabled:</span>
        <span className={valueCx}>
          {import.meta.env.VITE_USER_VIDEO ? (
            <Check size={14} />
          ) : (
            <X size={14} />
          )}
        </span>
      </div>
    </div>
  );
};

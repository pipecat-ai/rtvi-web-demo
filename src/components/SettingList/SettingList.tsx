import { Check, X } from "lucide-react";

import styles from "./styles.module.css";

interface SettingList {
  serverUrl: string;
  roomQueryString: string | null;
  roomQueryStringValid: boolean | null;
}

export const SettingList: React.FC<SettingList> = ({
  serverUrl,
  roomQueryString,
  roomQueryStringValid,
}) => {
  return (
    <div className={styles.container}>
      {import.meta.env.VITE_SERVER_URL && (
        <div className={styles.row}>
          <span>Server URL</span>
          <span>{serverUrl}</span>
        </div>
      )}
      <div className={styles.row}>
        <span>Auto room creation</span>
        <span>
          {!import.meta.env.VITE_MANUAL_ROOM_ENTRY ? (
            <Check size={14} />
          ) : (
            <X size={14} />
          )}
        </span>
      </div>
      {import.meta.env.VITE_MANUAL_ROOM_ENTRY && (
        <div className={styles.row}>
          <span>room_url querystring</span>
          <span>
            {roomQueryString ? <>{roomQueryString}</> : <X size={14} />}
          </span>
        </div>
      )}
      {roomQueryString && (
        <div className={styles.row}>
          <span className={!roomQueryStringValid ? styles.danger : ""}>
            Valid room URL
          </span>
          <span>
            {roomQueryStringValid ? (
              <Check size={14} />
            ) : (
              <X size={14} className={styles.danger} />
            )}
          </span>
        </div>
      )}
      <div className={styles.row}>
        <span>Mic input mode</span>
        <span>
          {import.meta.env.VITE_OPEN_MIC ? "Open Mic" : "Round-robin"}
        </span>
      </div>
      <div className={styles.row}>
        <span>User video enabled:</span>
        <span>
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

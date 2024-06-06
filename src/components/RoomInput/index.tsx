import { Input } from "../input";

import styles from "./styles.module.css";

interface RoomInputProps {
  onChange: (url: string) => void;
  error: boolean;
}

export const RoomInput: React.FC<RoomInputProps> = ({
  onChange,
  error = false,
}) => {
  return (
    <div className={styles.roomInput}>
      <label className="label">Enter room URL:</label>
      <Input
        type="text"
        variant={error ? "danger" : "default"}
        placeholder="E.g. https://yourdomain.daily.co/room_name"
        onChange={(e) => onChange(e.target.value)}
      />
      {error && (
        <p className="input-error-text">Please enter a valid room URL</p>
      )}
    </div>
  );
};

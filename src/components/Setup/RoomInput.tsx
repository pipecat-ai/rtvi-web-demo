import { Field } from "../ui/field";
import { Input } from "../ui/input";

interface RoomInputProps {
  onChange: (url: string) => void;
  error?: string | undefined | boolean;
}

export const RoomInput: React.FC<RoomInputProps> = ({ onChange, error }) => {
  return (
    <Field label="Enter room URL:" error={error}>
      <Input
        type="text"
        variant={error ? "danger" : "default"}
        placeholder="E.g. https://yourdomain.daily.co/room_name"
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
      />
    </Field>
  );
};

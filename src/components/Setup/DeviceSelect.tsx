import { useEffect } from "react";
import { Mic } from "lucide-react";
import { useVoiceClientMediaDevices } from "realtime-ai-react";

import { AudioIndicatorBar } from "../AudioIndicator";
import { Field } from "../ui/field";
import { Select } from "../ui/select";

interface DeviceSelectProps {
  hideMeter: boolean;
}

export const DeviceSelect: React.FC<DeviceSelectProps> = ({
  hideMeter = false,
}) => {
  const { availableMics, selectedMic, updateMic } =
    useVoiceClientMediaDevices();

  useEffect(() => {
    updateMic(selectedMic?.deviceId);
  }, [updateMic, selectedMic]);

  return (
    <div className="flex flex-col flex-wrap gap-4">
      <Field label="Microphone:" error={false}>
        <Select
          onChange={(e) => updateMic(e.currentTarget.value)}
          value={selectedMic?.deviceId}
          icon={<Mic size={24} />}
        >
          {availableMics.length === 0 ? (
            <option value="">Loading devices...</option>
          ) : (
            availableMics.map((mic) => (
              <option key={mic.deviceId} value={mic.deviceId}>
                {mic.label}
              </option>
            ))
          )}
        </Select>
        {!hideMeter && <AudioIndicatorBar />}
      </Field>

      {/*}
      <Field label="Speakers:">
        <Select
          icon={<Speaker size={24} />}
          onChange={(e) => handleSpeakerChange(e.target.value)}
          defaultValue={currentSpeaker?.device.deviceId}
        >
          {speakers.length === 0 ? (
            <option value="default">Use system default</option>
          ) : (
            speakers.map((m) => (
              <option key={m.device.deviceId} value={m.device.deviceId}>
                {m.device.label}
              </option>
            ))
          )}
        </Select>
      </Field>
      */}
    </div>
  );
};

export default DeviceSelect;

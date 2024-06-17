import { useEffect } from "react";
import { DailyMeetingState } from "@daily-co/daily-js";
import { useDaily, useDevices } from "@daily-co/daily-react";
import { Mic, Speaker } from "lucide-react";

import { AudioIndicatorBar } from "../AudioIndicator";
import { Alert } from "../ui/alert";
import { Field } from "../ui/field";
import { Select } from "../ui/select";

interface DeviceSelectProps {
  hideMeter: boolean;
}

export const DeviceSelect: React.FC<DeviceSelectProps> = ({
  hideMeter = false,
}) => {
  const daily = useDaily();
  const {
    currentMic,
    hasMicError,
    micState,
    microphones,
    setMicrophone,
    currentSpeaker,
    speakers,
    setSpeaker,
  } = useDevices();

  const handleMicrophoneChange = (value: string) => {
    setMicrophone(value);
  };

  const handleSpeakerChange = (value: string) => {
    setSpeaker(value);
  };

  useEffect(() => {
    if (microphones.length > 0 || !daily || daily.isDestroyed()) return;
    const meetingState = daily.meetingState();
    const meetingStatesBeforeJoin: DailyMeetingState[] = [
      "new",
      "loading",
      "loaded",
    ];
    if (meetingStatesBeforeJoin.includes(meetingState)) {
      daily.startCamera({ startVideoOff: true, startAudioOff: false });
    }
  }, [daily, microphones]);

  return (
    <div className="flex flex-col flex-wrap gap-4">
      {hasMicError && (
        <Alert intent="danger" title="Device error">
          {micState === "blocked" ? (
            <>
              Please check your browser and system permissions. Make sure that
              this app is allowed to access your microphone and refresh the
              page.
            </>
          ) : micState === "in-use" ? (
            <>
              Your microphone is being used by another app. Please close any
              other apps using your microphone and restart this app.
            </>
          ) : micState === "not-found" ? (
            <>
              No microphone seems to be connected. Please connect a microphone.
            </>
          ) : micState === "not-supported" ? (
            <>
              This app is not supported on your device. Please update your
              software or use a different device.
            </>
          ) : (
            <>
              There seems to be an issue accessing your microphone. Try
              restarting the app or consult a system administrator.
            </>
          )}
        </Alert>
      )}

      <Field label="Microphone:" error={hasMicError}>
        <Select
          onChange={(e) => handleMicrophoneChange(e.target.value)}
          defaultValue={currentMic?.device.deviceId}
          icon={<Mic size={24} />}
        >
          {microphones.length === 0 ? (
            <option value="">Loading devices...</option>
          ) : (
            microphones.map((m) => (
              <option key={m.device.deviceId} value={m.device.deviceId}>
                {m.device.label}
              </option>
            ))
          )}
        </Select>
        {!hideMeter && <AudioIndicatorBar />}
      </Field>

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
    </div>
  );
};

export default DeviceSelect;

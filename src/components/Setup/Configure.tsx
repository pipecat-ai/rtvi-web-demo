import React from "react";

import Configuration from "../Configuration";
import HelpTip from "../ui/helptip";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

import DeviceSelect from "./DeviceSelect";

interface ConfigureProps {
  startAudioOff: boolean;
  handleStartAudioOff: () => void;
}

export const Configure: React.FC<ConfigureProps> = ({
  startAudioOff,
  handleStartAudioOff,
}) => {
  return (
    <>
      <section className="flex flex-col flex-wrap gap-3 lg:gap-4">
        <DeviceSelect hideMeter={false} />
        <Configuration showAllOptions={false} />
      </section>

      <section className="flex flex-col gap-4 border-y border-primary-hairline py-4 mt-4">
        <div className="flex flex-row justify-between items-center">
          <Label className="flex flex-row gap-1 items-center">
            Join with mic muted{" "}
            <HelpTip text="Start with microphone muted (click to unmute)" />
          </Label>
          <Switch
            checked={startAudioOff}
            onCheckedChange={handleStartAudioOff}
          />
        </div>
      </section>
    </>
  );
};

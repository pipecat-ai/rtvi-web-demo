import React from "react";
import { Package } from "lucide-react";

import { llmModels } from "../../config";
import { Field } from "../ui/field";
import { Select } from "../ui/select";

type ModelSelectProps = {
  onSelect: (model: string) => void;
};

const ModelSelect: React.FC<ModelSelectProps> = ({ onSelect }) => {
  return (
    <Field label="LLM Model:">
      <Select
        onChange={(e) => onSelect(e.currentTarget.value)}
        icon={<Package size={24} />}
      >
        {llmModels.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </Select>
    </Field>
  );
};

export default ModelSelect;

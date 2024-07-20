import React from "react";
import { Languages } from "lucide-react";

import { Language, languages } from "../../config";
import { Field } from "../ui/field";
import { Select } from "../ui/select";

type LanguageSelectProps = {
  onSelect: (lang: Language) => void;
};

const LanguageSelect: React.FC<LanguageSelectProps> = ({ onSelect }) => {
  return (
    <Field label="Language:">
      <Select
        onChange={(e) => onSelect(languages[e.target.selectedIndex])}
        icon={<Languages size={24} />}
      >
        {languages.map((l) => (
          <option key={l.code} value={l.language}>
            {l.language}
          </option>
        ))}
      </Select>
    </Field>
  );
};

export default LanguageSelect;

const defaultLanguage = "English";

export function composeSystemPrompt(language: string) {
  return `You are a helpful assistant named Gary. Keep responses short and legible. Respond in ${language}.`;
}

export const defaultConfig = {
  llm: {
    model: "llama3-70b-8192",
    messages: [
      {
        role: "system",
        content: composeSystemPrompt(defaultLanguage),
      },
    ],
  },
  tts: {
    voice: "79a125e8-cd45-4c13-8a67-188112f4dd22",
  },
};

export type Language = {
  language: string;
  model_id: string;
  code: string;
  voice: string;
};

export const languages: Language[] = [
  {
    language: "English",
    model_id: "sonic-english",
    code: "en",
    voice: "79a125e8-cd45-4c13-8a67-188112f4dd22",
  },
  {
    language: "French",
    model_id: "sonic-multilingual",
    code: "fr",
    voice: "a8a1eb38-5f15-4c1d-8722-7ac0f329727d",
  },
];

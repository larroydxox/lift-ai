/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Web Speech API (não incluída nos tipos padrão do DOM)
interface Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

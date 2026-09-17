# 🏋️ LIFT AI

Rastreador de fitness **voice-first**: você fala o que treinou/comeu, o app transcreve, o
Claude estrutura os dados e tudo é salvo no **Supabase** (PostgreSQL + Auth + Realtime).

> Stack: **React Native + TypeScript · Supabase · Claude API**

---

## ✨ Funcionalidades

- 🎤 **Entrada por voz** — fale "supino 3x10 com 40kg" e vira exercício estruturado
- 💪 **Treinos** — workouts com múltiplos exercícios (sets, reps, peso, RPE)
- 🍔 **Nutrição** — refeições com calorias e macros, total diário
- 📏 **Métricas** — peso corporal e medidas ao longo do tempo
- 🏃 **Atividades** — caminhada, corrida, bike (manual ou HealthKit/Google Fit)
- 🔐 **Auth + RLS** — cada usuário só vê os próprios dados
- ⚡ **Realtime** — mudanças refletem em todos os dispositivos

---

## 📁 Estrutura

```
lift ai/
├── App.tsx                     # Entry point
├── index.js
├── app.json
├── package.json
├── tsconfig.json
├── .env.example                # Modelo de variáveis (copie para .env)
├── supabase/
│   └── schema.sql              # Schema completo + RLS (cole no SQL Editor)
└── src/
    ├── services/
    │   ├── supabaseClient.ts   # Client + tipos do banco
    │   ├── authService.ts      # Signup / login / logout
    │   ├── workoutService.ts   # CRUD de treinos e exercícios
    │   ├── mealService.ts      # CRUD de refeições
    │   ├── metricService.ts    # Métricas corporais
    │   └── voiceLogService.ts  # Log de entradas por voz
    ├── hooks/
    │   ├── useWorkouts.ts      # Workouts + Realtime (supabase-js v2)
    │   ├── useMeals.ts         # Refeições + Realtime
    │   └── useVoiceInput.ts    # Fluxo de voz (stub p/ integrar Claude)
    ├── components/
    │   ├── VoiceButton.tsx     # Botão de gravação (stub)
    │   ├── VoiceStatus.tsx     # Indicador de status
    │   └── ConfirmationModal.tsx
    └── screens/
        └── HomeScreen.tsx      # Tela principal
```

---

## 🚀 Setup

### 1. Supabase
1. Crie um projeto em <https://supabase.com>.
2. Em **SQL Editor**, cole e rode o conteúdo de [`supabase/schema.sql`](supabase/schema.sql).
3. Em **Project Settings → API**, copie a `URL` e a `anon key`.

### 2. Variáveis de ambiente
```bash
cp .env.example .env
# preencha REACT_APP_SUPABASE_URL e REACT_APP_SUPABASE_ANON_KEY
```

### 3. Dependências e run
```bash
npm install
npm run ios      # ou: npm run android
```

---

## ⚠️ Notas importantes

- **A `anon key` do Supabase é pública** — a proteção real vem das políticas de **RLS**
  no `schema.sql`. Não é segredo, mas mantenha o `.env` fora do git (já está no `.gitignore`).
- **A `CLAUDE_API_KEY` é secreta.** Nunca embuta a chave da Claude API no app cliente.
  Chame o Claude a partir de um **backend / Supabase Edge Function** e retorne só o resultado.
- Os arquivos `useVoiceInput.ts` e `VoiceButton.tsx` são **stubs**: a interface está pronta,
  falta plugar o reconhecimento de fala (`@react-native-voice/voice`) e a chamada ao Claude.
- O Realtime já usa a API **v2** do `supabase-js` (`supabase.channel(...).on('postgres_changes', ...)`).

---

## 🗺️ Roadmap

- [ ] Reconhecimento de fala real (`@react-native-voice/voice`)
- [ ] Edge Function que classifica o transcript com o Claude
- [ ] Telas de histórico e gráficos de progressão
- [ ] Integração HealthKit / Google Fit
- [ ] Storage para fotos de progresso

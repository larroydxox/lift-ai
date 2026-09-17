# 🏋️ LIFT AI

Rastreador de fitness **voice-first** que roda no **navegador** (inclusive no celular):
você fala o que treinou/comeu, o app transcreve por voz, estrutura os dados e salva no
**Supabase** (PostgreSQL + Auth + Realtime).

> Stack: **Vite + React + TypeScript · Supabase · Web Speech API** · deploy na **Vercel**

---

## ✨ Funcionalidades

- 🎤 **Entrada por voz** no navegador (Web Speech API — funciona no Chrome desktop/Android)
- 🔐 **Login / cadastro** com Supabase Auth
- 💪 **Treinos** — exercícios com sets, reps, peso
- 🍔 **Nutrição** — refeições e total de calorias do dia
- ⚡ **Realtime** — mudanças refletem em todos os dispositivos
- 🔒 **RLS** — cada usuário só vê os próprios dados

---

## 📁 Estrutura

```
lift ai/
├── index.html              # Entry do Vite
├── vite.config.ts
├── vercel.json             # Rewrites SPA
├── package.json
├── tsconfig.json
├── .env.example            # VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
├── supabase/
│   └── schema.sql          # Schema + RLS (cole no SQL Editor do Supabase)
└── src/
    ├── main.tsx  App.tsx  index.css
    ├── services/           # supabaseClient, auth, workout, meal, metric, voiceLog
    ├── hooks/              # useWorkouts, useMeals (Realtime), useVoiceInput
    ├── components/         # Auth, VoiceButton, VoiceStatus, ConfirmationModal
    └── screens/HomeScreen.tsx
```

---

## 🚀 Rodar local

```bash
npm install
cp .env.example .env      # preencha as chaves do Supabase (VITE_*)
npm run dev               # http://localhost:5173
```

O `vite.config.ts` usa `host: true`, então dá pra abrir do celular na mesma rede pelo IP
da máquina (ex: `http://192.168.0.10:5173`). Sem `.env` o app abre, mas as chamadas ao
Supabase falham (login não funciona até configurar).

### Supabase
1. Crie um projeto em <https://supabase.com>.
2. Em **SQL Editor**, rode [`supabase/schema.sql`](supabase/schema.sql).
3. Em **Project Settings → API**, copie a `URL` e a `anon key` para o `.env`.

---

## ☁️ Deploy na Vercel

1. Importe o repositório na Vercel (framework detectado: **Vite**).
2. Em **Settings → Environment Variables**, adicione:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Build command `npm run build`, output `dist` (padrão do Vite). Deploy.
4. No celular, abra a URL da Vercel no navegador. Para a voz funcionar, use **HTTPS**
   (a Vercel já serve em HTTPS) e permita o microfone.

---

## 🧠 Voz + Claude (próximo passo)

Hoje o `useVoiceInput` faz um **parse heurístico local** do transcript (reconhece
"nome 3x10 com 40kg"). O plano é substituir por uma **Serverless Function** na Vercel
(`/api/parse`) que:
1. recebe o transcript,
2. chama a **Claude API** com a `CLAUDE_API_KEY` (secreta, só no servidor — nunca `VITE_`),
3. devolve `{ categoria, confidence, items }` estruturado.

---

## ⚠️ Segurança

- A `anon key` do Supabase é pública por design — a proteção real é o **RLS** do `schema.sql`.
- A `CLAUDE_API_KEY` é **secreta**: só em Serverless Function, sem prefixo `VITE_`.
- `.env` está no `.gitignore` — nenhuma chave real vai pro git.

---

## 🗺️ Roadmap

- [ ] Serverless Function `/api/parse` com Claude
- [ ] Categorias métricas e atividades no fluxo de voz
- [ ] Histórico e gráficos de progressão
- [ ] PWA (instalar na tela inicial do celular)

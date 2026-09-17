import { useState } from 'react';
import { authService } from '../services/authService';

export function Auth() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      if (mode === 'signup') {
        await authService.signUp(email.trim(), password, username.trim() || email.split('@')[0]);
        setInfo('Conta criada! Se a confirmação por e-mail estiver ativa, verifique sua caixa de entrada.');
      } else {
        await authService.signIn(email.trim(), password);
      }
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 24,
        gap: 16,
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: 1 }}>🏋️ LIFT AI</div>
        <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>
          {mode === 'signin' ? 'Entrar na sua conta' : 'Criar conta'}
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {mode === 'signup' && (
          <Field
            placeholder="Nome de usuário"
            value={username}
            onChange={setUsername}
            autoComplete="username"
          />
        )}
        <Field
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          required
        />
        <Field
          type="password"
          placeholder="Senha"
          value={password}
          onChange={setPassword}
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          required
        />

        {error && <div style={{ color: '#ff6b6b', fontSize: 13 }}>{error}</div>}
        {info && <div style={{ color: '#4caf7d', fontSize: 13 }}>{info}</div>}

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 4,
            padding: 14,
            borderRadius: 12,
            border: 'none',
            background: 'var(--accent)',
            color: '#fff',
            fontWeight: 600,
            fontSize: 15,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? '...' : mode === 'signin' ? 'Entrar' : 'Cadastrar'}
        </button>
      </form>

      <button
        onClick={() => {
          setMode(mode === 'signin' ? 'signup' : 'signin');
          setError(null);
          setInfo(null);
        }}
        style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 14 }}
      >
        {mode === 'signin' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entrar'}
      </button>
    </div>
  );
}

function Field(props: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <input
      type={props.type || 'text'}
      placeholder={props.placeholder}
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
      autoComplete={props.autoComplete}
      required={props.required}
      style={{
        padding: 14,
        borderRadius: 12,
        border: '0.5px solid var(--border)',
        background: 'var(--card)',
        color: 'var(--text)',
        fontSize: 15,
        outline: 'none',
      }}
    />
  );
}

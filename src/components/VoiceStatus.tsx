interface VoiceStatusProps {
  status: string;
  message?: string;
}

const LABELS: Record<string, string> = {
  listening: 'Ouvindo…',
  processing: 'Processando…',
  confirming: 'Confirme os itens',
  error: 'Algo deu errado',
};

export function VoiceStatus({ status, message }: VoiceStatusProps) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 108,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(448px, calc(100% - 32px))',
        background: 'var(--card)',
        borderRadius: 12,
        padding: 12,
        border: '0.5px solid var(--border)',
        zIndex: 20,
      }}
    >
      <div style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 600 }}>
        {LABELS[status] || status}
      </div>
      {!!message && <div style={{ color: 'var(--text)', fontSize: 14, marginTop: 4 }}>{message}</div>}
    </div>
  );
}

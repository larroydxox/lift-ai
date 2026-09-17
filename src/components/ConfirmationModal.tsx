import { VoiceResult } from '../hooks/useVoiceInput';

interface ConfirmationModalProps {
  result: VoiceResult | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({ result, onConfirm, onCancel }: ConfirmationModalProps) {
  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 30,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(480px, 100%)',
          background: 'var(--card)',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: '20px 20px 32px',
          maxHeight: '70vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ color: 'var(--text)', fontSize: 20, fontWeight: 600 }}>Confirmar</div>
        <div style={{ color: 'var(--muted)', fontSize: 13, margin: '4px 0 12px' }}>
          {result?.categoria} · {result?.items?.length ?? 0} item(ns)
        </div>

        <div style={{ marginBottom: 16 }}>
          {result?.items?.map((item, idx) => (
            <div
              key={idx}
              style={{ background: 'var(--card-2)', borderRadius: 8, padding: 12, marginBottom: 8 }}
            >
              <div style={{ color: 'var(--text)', fontSize: 14, fontWeight: 500 }}>
                {item.nome || item.alimento || JSON.stringify(item)}
              </div>
              {(item.sets || item.reps || item.peso) && (
                <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
                  {item.sets ?? '?'}×{item.reps ?? '?'}
                  {item.peso ? ` · ${item.peso} ${item.unidade || 'kg'}` : ''}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              borderRadius: 12,
              padding: 14,
              border: 'none',
              background: '#2a2a2a',
              color: '#fff',
              fontWeight: 600,
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              borderRadius: 12,
              padding: 14,
              border: 'none',
              background: 'var(--accent)',
              color: '#fff',
              fontWeight: 600,
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

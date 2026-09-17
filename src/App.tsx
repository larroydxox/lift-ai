import { useEffect, useState } from 'react';
import { authService } from './services/authService';
import { Auth } from './components/Auth';
import { HomeScreen } from './screens/HomeScreen';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    authService
      .getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setReady(true));

    const unsubscribe = authService.onAuthStateChange((u) => {
      setUser(u);
      setReady(true);
    });
    return () => unsubscribe?.();
  }, []);

  return (
    <div className="app-shell">
      {!ready ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
          Carregando…
        </div>
      ) : user ? (
        <HomeScreen user={user} />
      ) : (
        <Auth />
      )}
    </div>
  );
}

import { useAuth } from '../hooks/useAuth';

export function LoginButton() {
  const { user, login, isLoginPending } = useAuth();

  if (user) {
    return <div>Connected: {user.address}</div>;
  }

  return (
    <button 
      onClick={() => login()} 
      disabled={isLoginPending}
    >
      {isLoginPending ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}

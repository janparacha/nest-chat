import React, { useState } from 'react';

interface RegisterProps {
  onRegister: (username: string, email: string, password: string) => Promise<void>;
  onSwitchToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onRegister, onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    setError('');
    await onRegister(username, email, password);
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>Inscription</h2>
        {error && <div className="error-message">{error}</div>}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Pseudo"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
        />
        <button type="submit">S'inscrire</button>
        <button type="button" onClick={onSwitchToLogin} className="switch-button">
          Si vous avez déjà un compte, connectez-vous
        </button>
      </form>
    </div>
  );
}; 
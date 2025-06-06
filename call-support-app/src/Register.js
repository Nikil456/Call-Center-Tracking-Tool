import React, { useState } from 'react';

function Register({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text(); // get raw response text

      let data;
      try {
        data = JSON.parse(text); // try parse JSON
      } catch {
        alert('Server returned non-JSON response:\n' + text);
        return;
      }

      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (error) {
      alert('Network or server error: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;

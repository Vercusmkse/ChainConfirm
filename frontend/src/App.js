import React, { useState, useEffect } from 'react';

function App() {
  const [status, setStatus] = useState('DOWN');

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(() => setStatus('ERROR'));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>ChainConfirm</h1>
        <p>Backend Status: {status}</p>
      </header>
    </div>
  );
}

export default App;

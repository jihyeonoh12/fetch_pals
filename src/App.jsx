import { useCallback, useState } from 'react'
import { login } from './utils/api'
import SignIn from './pages/SignIn'
import SearchPage from './pages/SearchPage'
import './App.css'

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      await login(name, email, setAuthenticated);
    },
    [name, email] 
  );

  return (
    <>
    <div className="full-height bg-light py-5 text-center">
    {!authenticated ? (
      <SignIn 
      setName={setName}
      setEmail={setEmail}
      handleLogin={handleLogin}
      />
    ) : (
        <SearchPage />
    )
    }
  </div>
    </>
  )
}

export default App

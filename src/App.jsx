import { useState } from 'react'
import SignIn from './pages/SignIn'
import SearchPage from './pages/SearchPage'
import './App.css'

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <>
    <div className="full-height bg-light py-5 text-center">
    {!authenticated ? (
      <SignIn 
      email={email}
      name={name}
      setAuthenticated={setAuthenticated}
      setName={setName}
      setEmail={setEmail}
      // handleLogin={handleLogin}
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

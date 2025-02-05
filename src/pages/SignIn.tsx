import React, { useState, useCallback } from "react"
import { login } from '../utils/api'

const SignIn = ({name, email, setName, setEmail, setAuthenticated }) =>{
  const [error, setError] = useState("");

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();

      if (!email) {
        setError("Email is required");
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        setError("Please enter a valid email");
      } else if(!name) {
        setError("Name is required");
      } else {
        setError("");
      }
      await login(name, email, setAuthenticated);
    },
    [name, email] 
  );

    return (
      <div className="container">
        <div className="w-400 mx-auto">
          <div className="my-5">
            <h1 className='text-primary'><strong>Let’s kick things off!</strong></h1>
            <p>Enter your name and email to continue.</p>
            <p className="text-secondary"><small>And don't worry—we'd never spill your secrets. <br/> Your email stays safe with us!😉</small></p>
          </div>
             <div>
              <form>
                <div className="mb-3 text-start">
                  <label className="">Email address</label>
                  <input type="email" className="form-control" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                  onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <div className="mb-3 text-start">
                  <label className="form-label">Name</label>
                  <input type="name" className="form-control"  
                  onChange={(e) => setName(e.target.value)} required/>
                </div>
                {error && <span className="text-danger"><small>{error}</small></span>}
                <button type="submit" className="btn btn-primary container-fluid" onClick={handleLogin}>Submit</button>
              </form>
            </div>
        </div>
      </div>
    )
}

export default SignIn
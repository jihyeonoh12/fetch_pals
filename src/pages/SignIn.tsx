import React from "react"

const SignIn = ({setName, setEmail, handleLogin}) =>{
    return (
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
                  <input type="email" className="form-control" aria-describedby="emailHelp" 
                  onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="mb-3 text-start">
                  <label className="form-label">Name</label>
                  <input type="name" className="form-control"  
                  onChange={(e) => setName(e.target.value)}/>
                </div>
        
                <button type="submit" className="btn btn-primary container-fluid" onClick={handleLogin}>Submit</button>
              </form>
            </div>
        </div>
    )
}

export default SignIn
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import i1 from '../assets/i4.jpg'

export default function signUp() {

  const [formData, setFormData] = useState({})
  const [result, setResult] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }
  // console.log(formData)

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginUrl = formData.role === "Candidate" ? "http://127.0.0.1:8000/c_signup/" : "http://127.0.0.1:8000/i_signup/";

    try {
      const res = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResult(data); 
      console.log(data);
      if (data.message && formData.role == "Candidate") {
        navigate('/signIn');
      }
      if (data.message && formData.role == "Interviewer") {
        navigate(`/form/${data.id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };


  return (

    <div className=" bg-gray-100 flex justify-center items-center p-10">
      <div className="w-4/5 bg-white rounded-lg shadow-lg flex flex-row flex-wrap">
        {/* Left side - Decorative Image */}
        <div className="w-1/2 bg-black rounded-r-lg flex items-center justify-center">
          {/* This is a placeholder for the abstract image */}
          <img src={i1} alt="" className='w-full  rounded-lg' />
        </div>


        {/* Right side - SignUp Form */}
        <div className="w-1/2 p-12">
          {/* <div className="mb-6">
          <svg className="w-10 h-10 text-indigo-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
        </div> */}
          <h1 className="text-3xl font-bold mb-9">Welcome !!</h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Username *
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="Name" type="text" placeholder="Enter your Username" onChange={handleChange} />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email *
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="Email" type="email" placeholder="Enter your mail address" onChange={handleChange} />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Phone No. *
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="Phno" type="number" placeholder="Enter your Phone Number" onChange={handleChange} />
            </div>
            <div className="mb-4 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password *
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="Password" type="password" placeholder="Enter password" onChange={handleChange} />
              {/* <span className="absolute right-3 top-9 text-gray-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </span> */}
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Sign Up as:
              </label>
              <div className='flex justify-evenly'>

                <div className="mb-4">
                  {/* Radio Button for Candidate */}
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="role"
                      id="role"
                      value="Candidate"
                      // checked={selectedRole === "Candidate"}
                      onChange={handleChange}
                      className="form-radio"
                    />
                    <span className="ml-2">Candidate</span>
                  </label>
                </div>

                <div className="mb-4">
                  {/* Radio Button for Interviewer */}
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="role"
                      id='role'
                      value="Interviewer"
                      // checked={selectedRole === "Interviewer"}
                      onChange={handleChange}
                      className="form-radio"
                    />
                    <span className="ml-2">Interviewer</span>
                  </label>
                </div>
              </div>
            </div>
            {result && result.error ?
              <div className="mb-4 text-center text-red-500">{result.error}</div>
              :
              <div className="mb-4 text-center text-green-500">{result.message}</div>
            }
            {/* <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input type="checkbox" id="remember" className="mr-2" />
                <label htmlFor="remember" className="text-sm text-gray-700">Remember me</label>
              </div>
              <a className="text-sm text-indigo-600 hover:text-indigo-800" href="#">
                Forgot your password ?
              </a>
            </div> */}
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="submit">
              Sign Up
            </button>
          </form>

      

          <p className="text-center mt-8 text-sm text-gray-600">
            Have an account ? <Link to={'/signIn'} className="text-indigo-600 font-bold">Login here</Link>
          </p>
        </div>


      </div>
    </div>
  )
}

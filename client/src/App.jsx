import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import SignIn from './pages/signIn'
import SignUp from './pages/signUp'
import Form from './pages/form'
import Layout from './components/layout'
import Home from './pages/home';
import Report1 from './pages/report1';
import Payment from './pages/payment';
import PendingInt from './pages/pendingInt';
import Lobby from './screens/lobby'
import Room from './screens/room'
import Report from './pages/report'

function App() {
  return (
    <>
      <BrowserRouter >
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route index element={<Home />} />
            <Route path='/reports' element={<Report1 />} />
            <Route path='/payments' element={<Payment />} />
            <Route path='/pendingInterviews' element={<PendingInt />} />
          </Route>
          <Route path='/signIn' element={<SignIn />} />
          <Route path='/signUp' element={<SignUp />} />
          <Route path='/form/:interviewer_id' element={<Form />} />
          <Route path='/lobby' element={<Lobby />} />
          <Route path='/room/:id' element={<Room />} />
          <Route path='/report/:intId' element={<Report />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

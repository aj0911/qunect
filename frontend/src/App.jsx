import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/HomePage/Home'
import Auth from './Pages/AuthPage/Auth'
import Register from './Pages/AuthPage/Register'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Auth/>} />
        <Route path='/register' element={<Register/>} />
      </Routes>
      <Toaster position="top-right" />
    </div>
  )
}

export default App

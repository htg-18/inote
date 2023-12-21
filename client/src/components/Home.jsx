import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import noteContext from '../context/notes/NoteContext';
import { useContext } from 'react';

const Home = () => {
    const {name,grade}=useContext(noteContext)
  return (
    <div>
    <Navbar/>
    {`${name} Home ${grade}`}
    </div>
  )
}

export default Home
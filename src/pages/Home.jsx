import React from 'react';
import ImportExcel from './ImportExcel.jsx';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className='bg-gradient-to-br from-zinc-900/40 via-neutral-100 to-white h-screen'>
        <div className='flex justify-center items-center text-white gap-5 text-2xl h-15'>
            <Link to='/'>Home</Link>
            <Link to="/print">Print</Link>
        </div>
        <div className='flex justify-center'>
          <img src="/matalan.png"/>
        </div>
        <div>
            <ImportExcel />
        </div>

    </div>
  )
}

export default Home
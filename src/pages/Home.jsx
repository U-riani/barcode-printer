import React from 'react';
import ImportExcel from './ImportExcel.jsx';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
        <div style={{display: 'flex', gap: '20px', marginBottom: '20px'}}>
            <Link to='/'>Home</Link>
            <Link to="/print">Print</Link>
        </div>
        <div>
            <ImportExcel />
        </div>

    </div>
  )
}

export default Home
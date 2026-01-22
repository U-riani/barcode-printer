import React from "react";
import ImportExcel from "./ImportExcel.jsx";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <div className="flex justify-center items-center p-3 text-2xl gap-5">
        <Link className="cursor-pointer" to="/">
          Home
        </Link>
        <Link className="cursor-pointer" to="/print-enza">
          Print
        </Link>
      </div>
      <div>
        <ImportExcel />
      </div>
    </div>
  );
};

export default Home;

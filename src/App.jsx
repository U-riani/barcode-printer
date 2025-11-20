import "./index.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import PrintPage from "./pages/PrintPage.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="print" element={<PrintPage />} />
      </Routes>
    </>
  );
}

export default App;

import "./index.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import PrintPage from "./pages/PrintPage.jsx";
import PrintPageForEnza from "./pages/PrintPageForEnza.jsx";
import PrintPageMatalanNew from "./pages/PrintPageMatalanNew.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Home />} />
        {/* <Route path="print" element={<PrintPage />} /> */}
        <Route path="print-enza" element={<PrintPageForEnza />} />
        <Route path="print" element={<PrintPageMatalanNew />} />
      </Routes>
    </>
  );
}

export default App;

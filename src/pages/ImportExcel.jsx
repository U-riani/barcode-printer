import React, { useContext } from "react";
import * as XLSX from "xlsx";
import { ExcelContext } from "../context/ExcelContext";
import { useNavigate } from "react-router-dom";

const ImportExcel = () => {
  const { setExcelData } = useContext(ExcelContext);
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      setExcelData(jsonData);

      setTimeout(() => navigate("/print"), 200);
    };
    reader.readAsArrayBuffer(file);
  };
  return (
    <div className="flex flex-col hustify-center items-center">
      <div>
        <h4 className="import-button p-3 text-xl">Import Excel</h4>
      </div>
      <div>
        <div className="flex flex-col justify-center items-center py-3">
          <p className="animate-press text-lg">press</p>
          <div className="text-4xl animate-finger">👇</div>
        </div>

        <input
          className="border rounded p-3 flex justify-center cursor-pointer"
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
        />
      </div>
    </div>
  );
};

export default ImportExcel;

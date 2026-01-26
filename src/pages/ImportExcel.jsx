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
    <div className=" w-full grid place-items-center ">
      {/* Card */}
      <div
        className="
  w-[340px]
  rounded-2xl
  bg-black/40
  backdrop-blur-xl
  border border-white/10
  shadow-xl
  p-8
  flex flex-col
  items-center
  justify-center
  gap-6
"
      >
        {/* Title */}
        <h4 className="text-xl font-semibold text-white tracking-wide ">
          Import Excel
        </h4>

        {/* Animated Finger */}
        <div className="text-5xl animate-finger select-none ">👇</div>

        {/* File Input */}
        <label
          className="w-75 cursor-pointer rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 transition px-4 py-3 text-center text-white text-sm "
        >
          Choose Excel File
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {/* Helper Text */}
        <p className="text-xs text-white/60">Supported: .xlsx, .xls</p>
      </div>
    </div>
  );
};

export default ImportExcel;

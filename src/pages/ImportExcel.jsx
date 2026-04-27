// src/pages/ImportExcel.jsx
import React, { useContext } from "react";
import * as XLSX from "xlsx";
import { ExcelContext } from "../context/ExcelContext";
import { useNavigate } from "react-router-dom";
import templateFile from "../assets/sabechdi_forma_3_template.xlsx";

const COLS = 5;
const ROWS = 13;
const ITEMS_PER_PAGE = COLS * ROWS;

const getQty = (row) => {
  const value =
    row["Quantity"] ?? row["quantity"] ?? row["რაოდენობა"] ?? row["Qty"] ?? 1;

  const qty = Number(value);
  return Number.isFinite(qty) && qty > 0 ? Math.floor(qty) : 1;
};

const expandRowsByQuantity = (rows) => {
  const expanded = [];

  rows.forEach((row) => {
    const qty = getQty(row);

    for (let i = 0; i < qty; i++) {
      const index = expanded.length;

      expanded.push({
        ...row,
        Quantity: qty,
        გვერდი: Math.floor(index / ITEMS_PER_PAGE) + 1,
        სექცია: Math.floor((index % ITEMS_PER_PAGE) / COLS) + 1,
      });
    }
  });

  return expanded;
};

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
      const expandedData = expandRowsByQuantity(jsonData);

      setExcelData(expandedData);

      setTimeout(() => navigate("/print-enza"), 200);
    };

    reader.readAsArrayBuffer(file);
  };

  const downloadTemplate = () => {
    const link = document.createElement("a");
    link.href = templateFile;
    link.download = "sabechdi_forma_3_template.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div>
        <button
          type="button"
          onClick={downloadTemplate}
          className="text-sm border rounded p-2 mb-4 cursor-pointer"
        >
          &gt;&gt; Download Excel Template &lt;&lt;
        </button>
      </div>
      <div>
        <h4 className="import-button p-3 text-xl">Import Excel</h4>
      </div>

      <div>
        <div className="flex flex-col justify-center items-center py-3">
          <p className="animate-press text-lg">press</p>
          <div className="text-4xl animate-finger">👇</div>
        </div>
        <div className="p-2 border border-slate-400 rounded mt-2">
          <label htmlFor="import">Import Excel File to print barcodes</label>
          <input
            id="import"
            name="import"
            className="border border-slate-400 rounded p-3 flex justify-center cursor-pointer text-2xl mt-3"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
          />
        </div>
      </div>
    </div>
  );
};

export default ImportExcel;

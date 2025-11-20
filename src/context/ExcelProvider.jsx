// ExcelProvider.jsx
import { useState, useEffect } from "react";
import { ExcelContext } from "./ExcelContext";

export const ExcelProvider = ({ children }) => {
  const [excelData, setExcelData] = useState([]);
  
  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("excelData");
    if (saved) setExcelData(JSON.parse(saved));
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("excelData", JSON.stringify(excelData));
  }, [excelData]);

  // Update prices only based on matching Sku Code or Barcode
  const updatePrices = (priceOnlyData) => {
    if (!excelData.length) {
      // No existing data, just load prices
      setExcelData(priceOnlyData);
      return;
    }

    const updated = excelData.map((item) => {
      const match =
        priceOnlyData.find(
          (p) =>
            p["Sku Code"] === item["Sku Code"] ||
            p["Barcode"] === item["Barcode"]
        ) || {};
      if (match["Adjusted Shablon unit price"]) {
        return {
          ...item,
          "Adjusted Shablon unit price": match["Adjusted Shablon unit price"],
        };
      }
      return item;
    });

    setExcelData(updated);
  };

  return (
    <ExcelContext.Provider value={{ excelData, setExcelData, updatePrices }}>
      {children}
    </ExcelContext.Provider>
  );
};

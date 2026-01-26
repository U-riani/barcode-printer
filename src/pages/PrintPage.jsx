import React, { useContext, useEffect, useRef, useState, useMemo } from "react";
import { ExcelContext } from "../context/ExcelContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Link } from "react-router-dom";
import "../styles/PrintPage.css"; // 👈 add this line for spinner styles

const PrintPage = () => {
  const { excelData } = useContext(ExcelContext);
  const containerRef = useRef();
  const [priceOnly, setPriceOnly] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false); // ✅ spinner state

  // ✅ Collect all prices (keep duplicates)
  const allPrices = useMemo(() => {
    return excelData
      .map((item) => item["Adjusted Shablon unit price"])
      .filter(Boolean);
  }, [excelData]);

  // ✅ Save all prices to localStorage
  useEffect(() => {
    if (allPrices.length > 0) {
      try {
        localStorage.setItem("allPrices", JSON.stringify(allPrices));

        console.log("💾 Stored all prices:", allPrices.length);
      } catch (err) {
        console.warn("⚠️ Could not save to localStorage:", err);
      }
    }
  }, [allPrices]);

  // ✅ Load saved prices if Excel data missing
  const savedPrices = useMemo(() => {
    const saved = localStorage.getItem("allPrices");
    return saved ? JSON.parse(saved) : [];
  }, []);

  const effectivePrices = allPrices.length > 0 ? allPrices : savedPrices;

  if ((!excelData || excelData.length === 0) && effectivePrices.length === 0) {
    return <p>No data loaded or saved prices found.</p>;
  }

  // Pagination constants
  const itemsPerPage = 65;
  const itemsPerRow = 5;

  // ✅ Pair prices: [0,1], [2,3], [4,5]...
  const printableData = priceOnly
    ? (() => {
        const paired = [];
        for (let i = 0; i < effectivePrices.length; i += 2) {
          paired.push({
            right: effectivePrices[i] ?? "",
            left: effectivePrices[i + 1] ?? "",
          });
        }
        return paired;
      })()
    : excelData;

  // Split into pages
  const pages = [];
  for (let i = 0; i < printableData.length; i += itemsPerPage) {
    pages.push(printableData.slice(i, i + itemsPerPage));
  }

  const chunkIntoRows = (pageData) => {
    const rows = [];
    for (let i = 0; i < pageData.length; i += itemsPerRow) {
      rows.push(pageData.slice(i, i + itemsPerRow));
    }
    return rows;
  };

  // ✅ PDF generation
  const generatePDF = async () => {
    if (!containerRef.current) return;
    setIsGenerating(true);

    try {
      const pdf = new jsPDF("p", "mm", "a4");

      for (let i = 0; i < pages.length; i++) {
        const pageElement = containerRef.current.querySelector(`#page-${i}`);
        if (!pageElement) continue;

        const canvas = await html2canvas(pageElement, {
          scale: 2,
          useCORS: true,
        });
        const imgData = canvas.toDataURL("image/jpeg", 0.9);
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
        await new Promise((r) => setTimeout(r, 100));
      }

      pdf.save(priceOnly ? "price-labels.pdf" : "barcode-labels.pdf");
    } catch (err) {
      console.error("❌ PDF generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      className="pt-2 px-2 bg-gradient-to-br from-zinc-900/10 via-neutral-100 to-white"
      style={{ position: "relative" }}
    >
      {/* Controls */}
      <div
        className="flex items-center justify-between pt-2 pb-4"
      >
        <Link to="/" style={{ pointerEvents: isGenerating ? "none" : "auto" }}>
          ⬅️ Back
        </Link>
        <button
          className="bg-gradient-to-br from-zinc-900/10 via-neutral-100 to-white   p-2 rounded-lg border border-gray-400 cursor-pointer shadow-md"
          onClick={generatePDF}
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate PDF"}
        </button>
        <label className="cursor-pointer" style={{ opacity: isGenerating ? 0.5 : 1 }}>
          <input
            type="checkbox"
            checked={priceOnly}
            disabled={isGenerating}
            onChange={() => setPriceOnly(!priceOnly)}
          />{" "}
          Print prices only
        </label>
      </div>

      {/* Spinner overlay */}
      {isGenerating && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
          <p>Generating PDF...</p>
        </div>
      )}

      {/* Printable content */}
      <div ref={containerRef} style={{ opacity: isGenerating ? 0.5 : 1 }}>
        {pages.map((pageData, pageIndex) => {
          const rows = chunkIntoRows(pageData);
          return (
            <table
              id={`page-${pageIndex}`}
              key={pageIndex}
              className={priceOnly ? "price-only" : ""}
            >
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr className="rows" key={rowIndex}>
                    {row.map((item, cellIndex) => {
                      if (priceOnly) {
                        return (
                          <td key={cellIndex}>
                            <div className="price-split">
                              <p className="price-left">
                                {item.left ? `${item.left}₾` : ""}
                              </p>
                              <p className="price-right">
                                {item.right ? `${item.right}₾` : ""}
                              </p>
                            </div>
                          </td>
                        );
                      }

                      return (
                        <td key={cellIndex}>
                          <p>{item["Barcode"]}</p>
                          <p>{item["Sku Code"]}</p>
                          <p>{item["Adjusted Shablon unit price"]}₾</p>
                        </td>
                      );
                    })}
                    {row.length < 5 &&
                      Array.from({ length: 5 - row.length }).map((_, i) => (
                        <td key={`empty-${i}`} />
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          );
        })}
      </div>
    </div>
  );
};

export default PrintPage;

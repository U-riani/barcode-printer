import React, { useContext, useEffect, useRef, useState, useMemo } from "react";
import { ExcelContext } from "../context/ExcelContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Link } from "react-router-dom";
// import { useBarcode } from "../hooks/useBarcode.jsx";
import BarcodeCell from "../components/BarcodeCell";

const COLS = 5;
const ROWS = 13;
const ITEMS_PER_PAGE = COLS * ROWS; // 65
const CELL_H = "21mm";

export default function PrintPageMatalanNew() {
  const { excelData } = useContext(ExcelContext);
  const containerRef = useRef(null);

  const [priceOnly, setPriceOnly] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  /* ---------- prices ---------- */

  const allPrices = useMemo(
    () =>
      excelData.map((i) => i["Adjusted Shablon unit price"]).filter(Boolean),
    [excelData],
  );

  useEffect(() => {
    if (allPrices.length) {
      localStorage.setItem("allPrices", JSON.stringify(allPrices));
    }
  }, [allPrices]);

  const savedPrices = useMemo(() => {
    const raw = localStorage.getItem("allPrices");
    return raw ? JSON.parse(raw) : [];
  }, []);

  const effectivePrices = allPrices.length ? allPrices : savedPrices;

  if (!excelData?.length && !effectivePrices.length) {
    return <p className="p-6">No data loaded.</p>;
  }

  /* ---------- data ---------- */

  const printableData = priceOnly
    ? (() => {
        const out = [];
        for (let i = 0; i < effectivePrices.length; i += 2) {
          out.push({
            left: effectivePrices[i + 1] ?? "",
            right: effectivePrices[i] ?? "",
          });
        }
        return out;
      })()
    : excelData;

  const pages = [];
  for (let i = 0; i < printableData.length; i += ITEMS_PER_PAGE) {
    pages.push(printableData.slice(i, i + ITEMS_PER_PAGE));
  }

  const rowsFromPage = (page) => {
    const rows = [];
    for (let i = 0; i < page.length; i += COLS) {
      rows.push(page.slice(i, i + COLS));
    }
    while (rows.length < ROWS) rows.push([]);
    return rows;
  };

  /* ---------- PDF ---------- */

  const generatePDF = async () => {
    if (!containerRef.current) return;
    setIsGenerating(true);

    try {
      // wait for fonts
      await document.fonts.ready;

      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
        compress: false,
      });

      const pagesEls = containerRef.current.querySelectorAll("[id^='page-']");

      for (let i = 0; i < pagesEls.length; i++) {
        const pageEl = pagesEls[i];

        // force exact size before capture
        pageEl.style.width = "210mm";
        pageEl.style.height = "297mm";

        const canvas = await html2canvas(pageEl, {
          scale: window.devicePixelRatio || 2,
          backgroundColor: "#ffffff",
          useCORS: true,
          logging: false,
          imageTimeout: 0,
          removeContainer: true,
          foreignObjectRendering: false,
          windowWidth: pageEl.scrollWidth,
          windowHeight: pageEl.scrollHeight,
        });

        const imgData = canvas.toDataURL("image/png");

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
      }

      pdf.save(priceOnly ? "price-labels.pdf" : "barcode-labels.pdf");
    } finally {
      setIsGenerating(false);
    }
  };

  /* ---------- render ---------- */

  return (
    <div className="relative bg-neutral-100 min-h-screen">
      {/* Controls */}
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-2 flex gap-4 items-center">
        <Link to="/">⬅ Back</Link>

        <button
          onClick={generatePDF}
          disabled={isGenerating}
          className="px-3 py-1 border rounded"
        >
          {isGenerating ? "Generating…" : "Generate PDF"}
        </button>

        <label className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={priceOnly}
            disabled={isGenerating}
            onChange={() => setPriceOnly(!priceOnly)}
          />
          Print prices only
        </label>
      </div>

      {/* Pages */}
      <div
        ref={containerRef}
        className="flex flex-col items-center gap-6 py-6 print:bg-white"
      >
        {pages.map((pageData, pageIndex) => {
          const rows = rowsFromPage(pageData);

          return (
            <div
              key={pageIndex}
              id={`page-${pageIndex}`}
              className="
                w-[210mm]
                h-[297mm]
                bg-white
                p-[11mm_10mm]
                box-border
                shadow
                print:shadow-none
                print:break-after-page
              "
            >
              <div className="flex flex-col">
                {rows.map((row, r) => (
                  <div
                    key={r}
                    className="grid grid-cols-5"
                    style={{ height: CELL_H }}
                  >
                    {row.map((item, i) => {
                      //   <BarcodeCell value={item["Barcode"]} />;

                      if (priceOnly) {
                        return (
                          <div
                            key={i}
                            className="relative border flex items-center justify-center"
                            style={{ height: CELL_H }}
                          >
                            <p
                              className="
                              absolute top-1/2 left-0
                              -translate-y-1/2 translate-x-[22%]
                              rotate-[-90deg]
                              font-bold text-[16px] ml-3
                            "
                            >
                              {item.left && `${item.left}₾`}
                            </p>
                            <p
                              className="
                              absolute top-1/2 right-0
                              -translate-y-1/2 -translate-x-[22%]
                              rotate-[90deg]
                              font-bold text-[16px] mr-3
                            "
                            >
                              {item.right && `${item.right}₾`}
                            </p>
                          </div>
                        );
                      }

                      console.log(item["Adjusted Shablon unit price"]);
                      if (item["Adjusted Shablon unit price"]) {
                        return (
                          <div
                            key={i}
                            className="relative border flex flex-col items-center justify-center"
                            style={{ height: CELL_H }}
                          >
                            <div className="mt-1 w-full absolute left-[50%] top-0 -translate-x-[50%] ">
                              <BarcodeCell value={item["Barcode"]} />
                            </div>
                            <p className="mb-1 absolute left-[50%] bottom-0 -translate-x-[50%]  text-[20px] font-bold mt-[5px]">
                              {item["Adjusted Shablon unit price"]}₾
                            </p>
                          </div>
                        );
                      } else {
                        return (
                          <div
                            key={i}
                            className="relative border flex flex-col items-center justify-center"
                            style={{ height: CELL_H }}
                          >
                            <div className="w-full absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]">
                              <BarcodeCell value={item["Barcode"]} />
                            </div>
                            {/* <p className="text-[20px] font-bold mt-[5px]">
                            {item["Adjusted Shablon unit price"]}₾
                          </p> */}
                          </div>
                        );
                      }
                    })}

                    {row.length < COLS &&
                      Array.from({ length: COLS - row.length }).map((_, i) => (
                        <div
                          key={i}
                          className="border"
                          style={{ height: CELL_H }}
                        />
                      ))}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {isGenerating && (
        <div className="fixed inset-0 bg-white/80 flex flex-col items-center justify-center z-50">
          <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full" />
          <p className="mt-2">Generating PDF…</p>
        </div>
      )}
    </div>
  );
}

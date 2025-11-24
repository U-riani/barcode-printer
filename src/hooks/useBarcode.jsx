import { useRef } from "react";
import Barcode from "react-barcode";

export function useBarcode(value) {
  const ref = useRef(null);

  const clean = String(value || "").replace(/\D/g, "");

  const BarcodeComponent = (
    <div style={{ width: "100%", padding: "0 2px" }}>
      <Barcode
        value={clean}
        format="EAN13"
        width={0.9}        // thinner bars because 5 labels per row
        height={20}        // 28px ≈ ~1cm visually → fits 2.1cm cell
        fontSize={10}      // small EAN13 digits
      />
    </div>
  );

  return { BarcodeComponent, ref };
}

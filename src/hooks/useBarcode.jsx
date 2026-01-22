import { useRef } from "react";
import Barcode from "react-barcode";

export function useBarcode(value) {
  const ref = useRef(null);

  const clean = String(value || "").trim();

  const BarcodeComponent = clean ? (
    <div className="w-full  flex justify-center items-center">
      <Barcode
        value={clean}
        format="CODE128"   // ✅ correct
        width={0.9}
        height={20}
        fontSize={10}
        displayValue={true}
      />
    </div>
  ) : null;

  return { BarcodeComponent, ref };
}

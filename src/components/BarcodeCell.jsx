// components/BarcodeCell.jsx
import Barcode from "react-barcode";

export default function BarcodeCell({ value }) {
  const clean = String(value || "").trim();

  if (!clean) return null;

  return (
    <div className="w-full flex justify-center items-center">
      <Barcode
        value={clean}
        format="CODE128"
        width={0.9}
        height={20}
        fontSize={10}
        displayValue={true}
      />
    </div>
  );
}

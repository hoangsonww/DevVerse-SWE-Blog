import { FaSpinner } from "react-icons/fa";

export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <FaSpinner className="spinner" size={48} />
    </div>
  );
}

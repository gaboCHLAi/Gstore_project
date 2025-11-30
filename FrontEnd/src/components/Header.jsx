import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  return (
    <header className="min-h-[70px] w-full flex items-center justify-around border-b border-b-[#DDE2E9]">
      <h1 onClick={() => navigate("/")} className="cursor-pointer">
        Gstore
      </h1>

      <button
        onClick={() => navigate("/")}
        className="m-0 text-small bg-transparent border-none text-[#0C1220]  cursor-pointer hover:text-[#3A6FF8] hover:underline "
      >
        ვაკანსიები
      </button>

      <button
        onClick={() => navigate("/admin/authorization")}
        className="m-0  text-small bg-transparent border-none text-[#0C1220]  cursor-pointer hover:text-[#3A6FF8] hover:underline"
      >
        ადმინ პანელი
      </button>
    </header>
  );
}

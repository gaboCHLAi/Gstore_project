import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Authorization() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === "chlaidzegabriel@gmail.com" && password === "AdminPanel@1") {
      navigate("/admin/applications");
    } else {
      alert("არასწორი მონაცემები");
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div>
        <p>Email: chlaidzegabriel@gmail.com</p>
        <p>Password: AdminPanel@1</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3  ">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-[300px] p-2 border rounded-[8px] focus:outline-1 focus:outline-[#3A6FF8]"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="w-[300px] p-2 border rounded-[8px] focus:outline-1 focus:outline-[#3A6FF8]"
          />

          <button
            type="submit"
            className="w-[300px] p-2 bg-[#3A6FF8] border border-[red]  rounded-[8px] rounded-[red] text-[white] 
              "
          >
            შესვლა
          </button>
        </form>
      </div>
    </div>
  );
}

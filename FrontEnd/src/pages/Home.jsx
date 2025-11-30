import axios from "axios";
import Header from "../components/Header";
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/VacancyData`
        );
        setData(res.data);
      } catch (err) {
 
      }
    };

    fetchData();
  }, []);
 

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="w-full flex justify-center items-center  flex-1   ">
        <div className="flex justify-between w-4/5 gap-4   flex-wrap">
          {data.map((vacancy) => {
            return (
              <div
                className="w-[300px] h-[auto] border-2 border-[#DDE2E9] rounded-[15px] p-4  flex flex-col justify-between h-64 text-[#0C1220]"
                key={vacancy.id}
              >
                <h3 className="m-0 text-[#4B4A4A]">{vacancy.title}</h3>
                <p className="m-0">{vacancy.description}</p>
                <button
                  onClick={() => navigate(`/apply/${vacancy.id}`)}
                  className="border-none mx-auto mt-[30px] rounded-[15px] bg-[#3A6FF8] text-[14px]  w-full h-[50px] text-white"
                >
                  გადმოგვიგზავნე რეზიუმე
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

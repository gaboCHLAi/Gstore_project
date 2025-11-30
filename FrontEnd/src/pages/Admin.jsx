import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
export default function Admin() {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [vacancies, setVacancies] = useState([]);
  const [selectedVacancy, setSelectedVacancy] = useState("");
  const [date, setDate] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    (e) => e.preventDefault();
    navigate("/");
  };

  useEffect(() => {
    const fetchResumes = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/resumes`
      );
      setApps(response.data);
     
    };
    fetchResumes();
  }, []);

  useEffect(() => {
    const fetchVacancies = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/VacancyData`
      );
      setVacancies(response.data);
    };
    fetchVacancies();
  }, []);
  useEffect(() => {
    const fetchDates = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/ResumeDates`
      );
      setDate(response.data);
    
    };
    fetchDates();
  }, []);

  useEffect(() => {
    const fetchResumes = async () => {
      const params = {};
      if (selectedVacancy) params.vacancy = selectedVacancy;
      if (selectedDate) params.date = selectedDate;
      if (searchTerm) params.searchTerm = searchTerm;

    
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/resumes`, {
        params,
      });
 
      setApps(res.data);
    };

    fetchResumes();
  }, [selectedVacancy, selectedDate, searchTerm]);

  return (
    <div className="flex flex-col items-center">
      <Header />
      <div className="container mt-5 mx-0">
        <div className="flex  justify-between">
          <h1>Applications</h1>
          <button
            onClick={handleSubmit}
            type="submit"
            className="p-2 border-none rounded-2 bg-[#3A6FF8] text-[white] "
          >
            გამოსვლა
          </button>
        </div>

        <div className="flex justify-between mt-4">
          <div className="relative w-[30%]">
            <input
              type="text"
              className="outline-none pl-[40px] rounded-[12px] w-full h-[40px]  border-[#DDE2E9] border-1"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
              className="absolute top-1/2   left-[15px] -translate-y-1/2  w-[18px] "
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>

          <div className="flex gap-2">
            <select
              className="p-2 border rounded "
              value={selectedVacancy}
              onChange={(e) => setSelectedVacancy(e.target.value)}
            >
              <option value="">All Vacancies</option>
              {vacancies.map((v) => (
                <option key={v.id} value={v.title}>
                  {v.title}
                </option>
              ))}
            </select>
            <select
              className="p-2 border rounded"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              <option value="">All Dates</option>
              {date.map((d) => (
                <option
                  key={d.id}
                  value={new Date(d.date).toLocaleDateString()}
                >
                  {new Date(d.date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <table className="table table-striped mt-4">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Vacancy</th>
              <th>Date</th>
              <th>Resume</th>
            </tr>
          </thead>
          {apps.length ? (
            <tbody>
              {apps.map((a) => (
                <tr key={a.id}>
                  <td>{a.firstname}</td>
                  <td>{a.email}</td>
                  <td>{a.vacancies_title}</td>
                  <td>{new Date(a.created_at).toLocaleDateString()}</td>
                  <td>
                    <a
                      href={`${import.meta.env.VITE_API_URL}/open/${a.id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      CV
                    </a>
                  </td>
                  <td>
                    <a
                      href={`${import.meta.env.VITE_API_URL}/download/${a.id}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-[25px] text-[#0C1220] hover:text-[#3A6FF8]"
                      >
                        <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
                        <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
                      </svg>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan="5" className="text-center py-4 text-[#0C1220] ">
                  მონაცემები ვერ მოიძებნა
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}

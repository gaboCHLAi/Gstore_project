import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Apply() {
  const [cvData, setCvData] = useState([]);
  const [name, setName] = useState("");
  const [lasName, setLasName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [Cv, setCv] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [cvFileName, setCvFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (file) {
      if (file.type !== "application/pdf") {
        setErrors((prev) => ({
          ...prev,
          cv: "მხოლოდ PDF ფაილი შეიძლება ატვირთოს",
        }));
        setCv(null);
        setCvFileName("");
      } else {
        setErrors((prev) => ({ ...prev, cv: "" }));
        setCv(file);
        setCvFileName(file.name);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formErrors = {};

    if (!name.trim()) formErrors.name = "გთხოვთ შეიყვანოთ სახელი*";
    if (!lasName.trim()) formErrors.lastName = "გთხოვთ შეიყვანოთ გვარი*";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) formErrors.email = "გთხოვთ შეიყვანოთ ელფოსტა*";
    else if (!emailRegex.test(email))
      formErrors.email = "ელფოსტა არ არის ვალიდური*";

    const numberRegex = /^\d+$/;
    if (!number.trim()) formErrors.number = "გთხოვთ შეიყვანოთ ნომერი*";
    else if (!numberRegex.test(number))
      formErrors.number = "ნომერი უნდა შეიცავდეს მხოლოდ ციფრებს*";
    else if (number.length !== 9)
      formErrors.number = "ნომერი უნდა შეიცავდეს 9 ციფრს*";

    if (!Cv) formErrors.cv = "გთხოვთ ატვირთოთ CV*";

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("lastName", lasName);
      formData.append("email", email);
      formData.append("number", number);
      formData.append("vacancyid", id);
      formData.append("cv", Cv);

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/Apply`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

 
        setSuccess("ფორმა წარმატებით გაიგზავნა!");
        setErrors({});
        setName("");
        setLasName("");
        setEmail("");
        setNumber("");
        setCv(null);
        setCvFileName("");
      } catch (err) {
        console.error("Submit error:", err);
        setSuccess("");
      }
    } else {
      setSuccess("");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/VacancyData?id=${id}`
      );
      setCvData(response.data);
    };
    fetchData();
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="w-[22%] my-[50px] ">
        <button
          onClick={() => navigate("/")}
          className="bg-transparent border-none h-auto w-auto outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-[35px] mb-4 text-[black] cursor-pointer hover:text-[#3A6FF8]"
          >
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div className="flex flex-col items-center">
          <h3 className="font-bold text-center mb-4">
            -Applying for- <br />
            {cvData.length > 0 ? cvData[0].title : "Loading..."}
          </h3>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-center w-full gap-3"
            onDragEnter={handleDrag}
          >
            <div className="w-full">
              {errors.name && (
                <p className="text-[red] mb-1 text-sm">{errors.name}</p>
              )}
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="w-full p-2 border rounded border-gray-300 focus:border-[#3A6FF8] focus:ring-1 focus:ring-[#3A6FF8] outline-none placeholder-gray-400"
                placeholder="სახელი"
              />
            </div>

            <div className="w-full">
              {errors.lastName && (
                <p className="text-[red] mb-1 text-sm">{errors.lastName}</p>
              )}
              <input
                value={lasName}
                onChange={(e) => setLasName(e.target.value)}
                type="text"
                className="w-full p-2 border rounded border-gray-300 focus:border-[#3A6FF8] focus:ring-1 focus:ring-[#3A6FF8] outline-none placeholder-gray-400"
                placeholder="გვარი"
              />
            </div>

            <div className="w-full">
              {errors.email && (
                <p className="text-[red] mb-1 text-sm">{errors.email}</p>
              )}
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full p-2 border rounded border-gray-300 focus:border-[#3A6FF8] focus:ring-1 focus:ring-[#3A6FF8] outline-none placeholder-gray-400"
                placeholder="ელფოსტა"
              />
            </div>

            <div className="w-full">
              {errors.number && (
                <p className="text-[red] mb-1 text-sm">{errors.number}</p>
              )}
              <input
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                type="number"
                className="w-full p-2 border rounded border-gray-300 focus:border-[#3A6FF8] focus:ring-1 focus:ring-[#3A6FF8] outline-none placeholder-gray-400 no-spin"
                placeholder="ტელეფონის ნომერი"
              />
            </div>

            <div className="w-full">
              {errors.cv && (
                <p className="text-[red] mb-1 text-sm text-left">{errors.cv}</p>
              )}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className="w-full p-2 border-1 rounded border-[#0C1220] text-center cursor-pointer "
              >
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                  id="fileUpload"
                />
                <label
                  htmlFor="fileUpload"
                  className="w-full flex flex-col items-center cursor-pointer "
                >
                  {cvFileName ? cvFileName : "  CV ატვირთვა"}
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full p-2 bg-[#3A6FF8] rounded text-white font-semibold border-none mt-2"
            >
              გაგზავნე CV
            </button>

            {success && <p className="text-[green] mt-2">{success}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

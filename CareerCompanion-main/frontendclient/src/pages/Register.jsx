import { useState ,useContext ,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye } from "react-icons/fa";
import { BsEyeFill } from "react-icons/bs";
import BgImg from "../assets/bkimg.avif";
import Logo from "../assets/logo.avif";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://careercompanion-backend-mgbo.onrender.com/api/auth/register",
        form,
        { withCredentials: true }
      );
      console.log("User registered:", res.data);
      setUser(res.data.user);
      navigate("/");
    } catch (err) {
      console.error("Register error:", err.response?.data?.message);
      alert(err.response?.data?.message || "Registration failed");
    }
  };
useEffect(() => {
  setName("");
  setEmail("");
  setPassword("");
}, []);

  return (
    <div
      className="w-screen h-screen bg-cover bg-center bg-no-repeat text-white flex flex-col items-center"
      style={{ backgroundImage: `url(${BgImg})` }}
    >

      <div
        className="w-full h-[80px] flex items-center px-8 gap-3 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img className="w-10" src={Logo} alt="Logo" />
        <h1 className="text-[22px] font-sans">Career Companion</h1>
      </div>


      <div className="w-full text-center mt-6">
        <span className="text-2xl font-semibold drop-shadow-md">
          Create an Account
        </span>
        <p className="text-[16px] drop-shadow-md">
          Sign up to access resume analysis and job recommendations
        </p>
      </div>


      <div className="max-w-[600px] w-[90%] h-auto bg-[#00000080] border border-[#96969635] backdrop-blur-2xl rounded-lg shadow-lg flex items-center justify-center mt-6">
        <form
          onSubmit={handleRegister}
          className="w-[90%] flex flex-col items-center gap-5 py-8"
        >

          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            className="w-full h-[50px] border-2 border-[#96969635] rounded-lg shadow-lg bg-transparent placeholder-white px-5 font-semibold focus:outline-none"
            onChange={handleChange}
          />


          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full h-[50px] border-2 border-[#96969635] rounded-lg shadow-lg bg-transparent placeholder-white px-5 font-semibold focus:outline-none"
            onChange={handleChange}
          />


          <div className="w-full relative">
            <input
              type={show ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              className="w-full h-[50px] border-2 border-[#96969635] rounded-lg shadow-lg bg-transparent placeholder-white px-5 font-semibold focus:outline-none"
              onChange={handleChange}
            />
            {!show ? (
              <FaEye
                className="w-5 h-5 cursor-pointer absolute right-4 top-1/2 -translate-y-1/2"
                onClick={() => setShow((prev) => !prev)}
              />
            ) : (
              <BsEyeFill
                className="w-5 h-5 cursor-pointer absolute right-4 top-1/2 -translate-y-1/2"
                onClick={() => setShow((prev) => !prev)}
              />
            )}
          </div>


          <button
            type="submit"
            className="w-full h-[50px] bg-[#6060f5] rounded-lg text-[17px] font-semibold hover:bg-[#4848d8] transition"
          >
            Create Account
          </button>


          <p className="flex gap-2">
            Already have an account?
            <span
              className="text-[#5555f6cf] font-semibold cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;

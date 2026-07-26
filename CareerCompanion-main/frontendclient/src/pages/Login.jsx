import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye } from "react-icons/fa";
import { BsEyeFill } from "react-icons/bs";
import BgImg from "../assets/bkimg.avif";
import Logo from "../assets/logo.avif";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  toast.clearWaitingQueue();
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('https://careercompanion-backend-mgbo.onrender.com/api/auth/login', { email, password },{ withCredentials: true });

      localStorage.setItem('token', res.data.token);  
      setUser(res.data.user);


      navigate('/'); 
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
    finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);


  return (
    <div
      className="w-full h-screen bg-cover bg-center bg-no-repeat text-white flex flex-col items-center justify-start"
      style={{ backgroundImage: `url(${BgImg})` }}
    >

      <div
        className="w-full h-[80px] flex items-center justify-start px-8 gap-3 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img className="w-[40px]" src={Logo} alt="Logo" />
        <h1 className="text-[22px] font-sans">Career Companion</h1>
      </div>

      <div className="w-full h-[100px] flex items-center justify-center flex-col gap-2">
        <span className="text-[25px] font-semibold drop-shadow-md">
          Login Page
        </span>
        <span className="text-[16px] drop-shadow-md">
          Welcome back, sign in to continue
        </span>
      </div>

      <div className="max-w-[600px] w-[90%] h-[450px] bg-[#00000080] border border-[#96969635] backdrop-blur-2xl rounded-lg shadow-lg flex items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="w-[90%] h-[90%] flex flex-col items-center justify-start gap-5"
        >
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full h-[50px] border-2 border-[#96969635] rounded-lg shadow-lg bg-transparent placeholder-white px-5 font-semibold focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative w-full">
            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              required
              autoComplete="current-password"
              className="w-full h-[50px] border-2 border-[#96969635] rounded-lg shadow-lg bg-transparent placeholder-white px-5 font-semibold focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {!show && (
              <FaEye
                className="w-[20px] h-[20px] cursor-pointer absolute right-3 top-3"
                onClick={() => setShow((prev) => !prev)}
              />
            )}
            {show && (
              <BsEyeFill
                className="w-[20px] h-[20px] cursor-pointer absolute right-3 top-3"
                onClick={() => setShow((prev) => !prev)}
              />
            )}
          </div>
          {error && (
            <p className="text-red-400 font-medium text-sm -mt-2">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            type="submit"
            className={`w-full h-[50px] rounded-lg flex items-center justify-center text-[17px] font-semibold transition
    ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#6060f5] hover:bg-[#4b4bda]"}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="flex gap-2">
            Don't have an account?
            <span
              className="text-[#5555f6cf] text-[17px] font-semibold cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Create New Account
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;


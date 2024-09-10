import React, { useContext, useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import ModalBox from "../../ReactModal";
import SignUp from "../SignUp";
import { EtherContext } from "../../../contexts/ether";
import axios from "axios";
import { RootState } from "../../../stores";
import { useDispatch, useSelector } from "react-redux";
import { UserContext } from "../../../contexts/user";
import { setUser } from "../../../stores/slices/userSlice";
import { useNavigate } from "react-router-dom";

interface LoginModalProps {
  isOpen: boolean;
  setIsOpen?: any;
}

const SignInPage: React.FC<LoginModalProps> = ({ isOpen, setIsOpen }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [value, setValue] = useState("");
  const [load, setLoad] = useState(false);
  const [expired, setExpired] = useState("false");
  
  const user = useContext(UserContext);
  const [isRegisterModalOpen, setIsRegisterModalOpen] =
    useState<boolean>(false);

  const { isDarkMode } = useSelector((state: RootState) => state.darkMode);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setValue("");
  }

  function closeRegisterModal() {
    setIsRegisterModalOpen(false);
  }

  const handlePasswordChange = (e: any) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  const checkPasswordStrength = (password: any) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    console.log(password.length);

    if (password.length >= 8 && hasUpperCase && hasLowerCase && hasNumber) {
      return 4; // Strong
    } else if (password.length >= 8 && (hasUpperCase || hasLowerCase)) {
      return 3; // Good
    } else if (password.length >= 4) {
      return 2; // Okay
    } else {
      return 1; // Weak
    }
  };

  const isFormValid = () => {
    return (
      username.trim() !== "" && password.trim() !== "" && value.trim() !== ""
    );
  };

  const getPasswordColor = () => {
    switch (passwordStrength) {
      case 1:
        return "text-red-500";
      case 2:
        return "text-yellow-500";
      case 3:
        return "text-blue-500";
      case 4:
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };
  const TEST_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
  const DELAY = 1500;
  const reCaptchaRef = useRef();

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setLoad(true);
  //   }, DELAY);

  //   return () => clearTimeout(timer);
  // }, []);

  const handleChange = (newValue: any) => {
    console.log("Captcha value:", newValue);
    setValue(newValue);

    // if value is null recaptcha expired
    if (newValue === null) setExpired("true");
  };

  const ether = useContext(EtherContext).ether;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmitDemoLogin = () =>{
    dispatch(setUser({
        name: "John Doe",
        email: "john.doe@example.com",
        address: "123 Main St, Springfield, IL",
        token: "abc123tokenXYZ",
        designation: "Software Engineer",
        scholarUrl: "https://scholar.google.com/citations?user=12345",
        isDemo: true,
      }));
    setIsOpen(false);
    setValue("");
    navigate("/browse");
  }

  const handleSubmitlogin = async () => {
    if (ether == null) return;
    const signature = await ether.signMessage(
      "Click sign below to authenticate with Pivx Scholar :)"
    );
    
    if (signature == null) return;
    
    const walletAddress = await ether?.connectWallet();
    if (walletAddress == null) return;
    
    const response = await axios.post(`http://ec2-54-158-0-218.compute-1.amazonaws.com:3001/user/login`, {
      address: walletAddress,
      signature,
    });
    console.log("response", response);
    localStorage.setItem("token", response.data.token);
    setIsOpen(false);
    setValue("");
  };

  return (
    <div>
      <ModalBox
        isOpen={isRegisterModalOpen}
        onRequestClose={closeRegisterModal}
      >
        <SignUp
          isOpen={isRegisterModalOpen}
          setIsOpen={setIsRegisterModalOpen}
        />
      </ModalBox>

      <ModalBox isOpen={isOpen} onRequestClose={closeModal}>
        <div
          className={` flex items-center justify-center ${
            isDarkMode ? "bg-gray-900" : "bg-gray-100"
          } rounded-lg`}
        >
          <div
            className={`${
              isDarkMode ? "bg-black" : "bg-white"
            } p-8 rounded shadow-md w-full`}
          >
            <h2
              className={`text-2xl font-bold mb-4 ${
                isDarkMode && "text-white"
              }`}
            >
              Login
            </h2>
            <div className="mb-4">
              <label
                htmlFor="username"
                className={`block text-sm font-medium  ${
                  isDarkMode ? "text-gray-200" : "text-gray-600"
                }`}
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md h-12 text-base font-extralight "
                placeholder="Username"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-200" : "text-gray-600"
                } `}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                className="mt-1 p-2 w-full border rounded-md h-12 text-base font-extralight"
                placeholder="Password"
              />
              <div className="mt-5 flex">
                {[1, 2, 3, 4].map((line) => (
                  <div
                    key={line}
                    className={`h-1 w-1/4 mx-1 ${
                      passwordStrength >= line ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
              {/* {load && ( */}
                <div className="flex items-center justify-center mx-auto my-7">
                  <ReCAPTCHA
                    style={{
                      display: "inline-block",
                      width: "100%",
                      margin: "auto",
                    }}
                    theme={isDarkMode ? "dark" : "light"}
                    sitekey={TEST_SITE_KEY}
                    onChange={handleChange}
                    className="w-full  mx-auto"
                  />
                </div>
              {/*  )} */}
            </div>
            <button
              className={`bg-blue-500 text-white p-2 rounded-md w-full ${
                isFormValid() ? "" : "opacity-50 cursor-not-allowed"
              }`}
              disabled={!isFormValid()}
              onClick={() => handleSubmitDemoLogin()} //Don't forgot the change here later
            >
              Log In
            </button>

            <button
              className={` text-black p-2 rounded-md w-full mt-3 bg-gray-300 `}
              //${ isFormValid() ? "" : "opacity-50 cursor-not-allowed"}
              // disabled={!isFormValid()}
              onClick={() => {
                setIsOpen(false);
                setValue("");
                setIsRegisterModalOpen(true);
              }}
            >
              Create Wallat
            </button>
          </div>
        </div>
      </ModalBox>
    </div>
  );
};

export default SignInPage;

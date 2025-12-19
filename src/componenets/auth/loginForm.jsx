import { useState, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../auth/AuthProvider";
import loginImg from "../../assets/images/register.png";
import MainLayout from "../../layout/MainLayout";

export default function LoginPage({ switchToRegister }) {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "At least 6 characters")
        .required("Password is required"),
    }),

    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "http://localhost:5050/api/auth/login",
          values
        );

        if (response.data?.token && response.data?.user) {
          const { user, token } = response.data;

          // store auth info
          login(user, token);
          toast.success("Login successful!");

          // ✅ ROLE BASED NAVIGATION
          if (user.role === "seller") {
            navigate("/dashboard");
          } else {
            navigate("/");
          }
        } else {
          toast.error(response.data?.message || "Login failed");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Server error");
      }
    },
  });

  return (
    <MainLayout>
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl w-full">

          {/* Login Form */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-4xl font-serif mb-8 text-[#675715]">
              Login
            </h2>

            <form onSubmit={formik.handleSubmit} className="space-y-4">

              {/* Email */}
              <InputField
                name="email"
                placeholder="Email"
                icon={<Mail />}
                formik={formik}
              />

              {/* Password */}
              <PasswordField
                name="password"
                placeholder="Password"
                showPassword={showPassword}
                togglePassword={() => setShowPassword(!showPassword)}
                formik={formik}
              />

              <button
                type="submit"
                className="w-full bg-amber-300 text-amber-900 py-2 rounded-md font-semibold hover:bg-amber-400 transition"
              >
                Log In
              </button>
            </form>

            <p className="mt-4 text-sm">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={switchToRegister}
                className="text-amber-700 font-medium hover:underline"
              >
                Sign Up
              </button>
            </p>

            <ToastContainer />
          </div>

          {/* Image Section */}
          <div className="rounded-lg h-[600px] flex items-center justify-center bg-gradient-to-br from-[#FBF2CD] to-[#E5D17E] p-8">
            <img
              src={loginImg}
              alt="login"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

        </div>
      </div>
    </MainLayout>
  );
}

/* ===============================
   Reusable Input Field
================================ */
const InputField = ({ name, placeholder, icon, formik }) => (
  <div className="relative text-left">
    <input
      type={name === "email" ? "email" : "text"}
      name={name}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-full p-3 pl-10 text-sm focus:outline-none focus:border-amber-600 transition-colors"
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values[name]}
    />
    <div className="absolute left-3 top-3 text-gray-400">{icon}</div>
    {formik.touched[name] && formik.errors[name] && (
      <p className="text-red-500 text-xs mt-1">{formik.errors[name]}</p>
    )}
  </div>
);

/* ===============================
   Reusable Password Field
================================ */
const PasswordField = ({
  name,
  placeholder,
  showPassword,
  togglePassword,
  formik,
}) => (
  <div className="relative text-left">
    <input
      type={showPassword ? "text" : "password"}
      name={name}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-full p-3 pl-10 pr-10 text-sm focus:outline-none focus:border-amber-600 transition-colors"
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values[name]}
    />
    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
    <button
      type="button"
      onClick={togglePassword}
      className="absolute right-3 top-3 text-gray-400 hover:text-gray-700"
    >
      {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
    </button>
    {formik.touched[name] && formik.errors[name] && (
      <p className="text-red-500 text-xs mt-1">{formik.errors[name]}</p>
    )}
  </div>
);

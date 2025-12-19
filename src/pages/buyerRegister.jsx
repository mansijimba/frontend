import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from "../layout/MainLayout";
import registerImg from "../assets/images/register.png";

export default function RegisterBuyer() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone: Yup.string().required("Phone number is required"),
      address: Yup.string().required("Address is required"),
      password: Yup.string().min(6, "At least 6 characters").required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm your password"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post("http://localhost:5050/api/auth/register", {
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          address: values.address,
          password: values.password,
          role: "buyer", // set role explicitly
        });

        toast.success("Buyer registered successfully!");
        resetForm();
      } catch (err) {
        const errorMsg = err.response?.data?.message || "Registration failed";
        toast.error(errorMsg);
      }
    },
  });

  return (
    <MainLayout>
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl w-full">

          {/* Form Section */}
          <div className="bg-white p-8 rounded-lg">
            <h1 className="text-4xl font-serif mb-8 text-[#675715]">Buyer Registration</h1>

            <form className="space-y-4" onSubmit={formik.handleSubmit}>
              <InputField name="fullName" placeholder="Full Name" icon={<User />} formik={formik} />
              <InputField name="email" placeholder="Email" icon={<Mail />} formik={formik} />
              <InputField name="phone" placeholder="Phone Number" icon={<User />} formik={formik} />
              <InputField name="address" placeholder="Address" icon={<User />} formik={formik} />

              <PasswordField
                name="password"
                placeholder="Password"
                showPassword={showPassword}
                togglePassword={() => setShowPassword(!showPassword)}
                formik={formik}
              />

              <PasswordField
                name="confirmPassword"
                placeholder="Confirm Password"
                showPassword={showConfirmPassword}
                togglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                formik={formik}
              />

              <button type="submit" className="w-full bg-amber-300 py-2 rounded">
                Register
              </button>
            </form>
          </div>

          {/* Image Section */}
          <div className="rounded-lg h-[600px] flex items-center justify-center bg-gradient-to-br from-[#E5D17E] to-[#FBF2CD] p-4">
            <img src={registerImg} alt="registerImage" className="w-full h-full object-cover rounded-lg" />
          </div>

        </div>
      </div>
      <ToastContainer />
    </MainLayout>
  );
}

// Reusable Input Field
const InputField = ({ name, placeholder, icon, formik }) => (
  <div className="relative text-left">
    <input
      type="text"
      name={name}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-md p-2 pl-8 text-sm"
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values[name]}
    />
    <div className="absolute left-1 top-2 w-4 h-4 text-gray-400">{icon}</div>
    {formik.touched[name] && formik.errors[name] && (
      <p className="text-red-500 text-xs mt-1">{formik.errors[name]}</p>
    )}
  </div>
);

// Reusable Password Field
const PasswordField = ({ name, placeholder, showPassword, togglePassword, formik }) => (
  <div className="relative text-left">
    <input
      type={showPassword ? "text" : "password"}
      name={name}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-md p-2 pl-10 pr-10 text-sm"
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values[name]}
    />
    <Lock className="absolute left-2.5 top-3 w-4 h-4 text-gray-400" />
    <button
      type="button"
      onClick={togglePassword}
      className="absolute right-3 top-[4px] text-gray-400 hover:text-gray-700"
    >
      {showPassword ? <Eye className="h-3 w-4" /> : <EyeOff className="h-3 w-4" />}
    </button>
    {formik.touched[name] && formik.errors[name] && (
      <p className="text-red-500 text-xs mt-1">{formik.errors[name]}</p>
    )}
  </div>
);

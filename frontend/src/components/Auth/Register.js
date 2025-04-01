import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./apps.css"; // Ensure correct import

// ✅ Define validation schema
const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password1: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  password2: yup.string().oneOf([yup.ref("password1")], "Passwords must match").required("Confirm your password"),
  phone_number: yup.string().matches(/^[0-9]{10}$/, "Phone number must be 10 digits").required("Phone number is required"),
});

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const navigate = useNavigate();
  const [error, setError] = useState(""); // ✅ Move inside component

  const onSubmit = async (data) => {
    setError(""); // Clear previous errors

    try {
      const payload = {
        username: data.username,
        email: data.email,
        password1: data.password1,
        password2: data.password2,
        phone_number: data.phone_number,
      };

      await axios.post("http://127.0.0.1:8000/api/v1/auth/register/", payload);
      navigate("/"); // Redirect to login after successful registration
    } catch (error) {
      if (error.response) {
        // ✅ Display error message dynamically
        const { data } = error.response;
        if (data.non_field_errors) {
          setError(data.non_field_errors[0]); // Show password similarity error
        } else if (data.username) {
          setError(data.username[0]); // Show username error
        } else if (data.email) {
          setError(data.email[0]); // Show email error
        } else if (data.phone_number) {
          setError(data.phone_number[0]); // Show phone number error
        } else {
          setError("An error occurred. Please try again.");
        }
      } else {
        setError("Network error. Please try again.");
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>

      {error && <p className="error-text">{error}</p>} {/* ✅ Display error messages */}

      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="Username" {...register("username")} />
        <p className="error-text">{errors.username?.message}</p>

        <input type="email" placeholder="Email" {...register("email")} />
        <p className="error-text">{errors.email?.message}</p>

        <input type="password" placeholder="Password" {...register("password1")} />
        <p className="error-text">{errors.password1?.message}</p>

        <input type="password" placeholder="Confirm Password" {...register("password2")} />
        <p className="error-text">{errors.password2?.message}</p>

        <input type="text" placeholder="Phone Number" {...register("phone_number")} />
        <p className="error-text">{errors.phone_number?.message}</p>

        <button type="submit">Register</button>
      </form>

      <p className="form-toggle">
        Already have an account? <a href="/">Login</a>
      </p>
    </div>
  );
};

export default Register;

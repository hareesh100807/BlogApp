import {
  divider,
  errorClass,
  formCard,
  formGroup,
  formTitle,
  inputClass,
  labelClass,
  pageBackground,
  submitBtn,
  mutedText,
} from "../styles/common";
import { useForm } from "react-hook-form";
import { NavLink ,useNavigate} from "react-router";
import { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4060";


function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  //When user registration submitted
  const onUserRegister = async (userObj) => {
    setApiError(null);
    const selectedFile = userObj.profileImageUrl?.[0];
    const formData = new FormData();
    formData.append("firstName", userObj.firstName?.trim());
    formData.append("lastName", userObj.lastName?.trim());
    formData.append("email", userObj.email?.trim());
    formData.append("password", userObj.password);
    formData.append("role", userObj.role?.toUpperCase());
    if (selectedFile) {
      formData.append("profileImageUrl", selectedFile);
    }


    try {
        setLoading(true);
        //make HTTP post request in backend
        let res = await axios.post(`${API_BASE_URL}/auth/users`, formData, {
        });
        //navigate to login page
        if(res.status === 201){
            navigate("/login")
        }


    } catch (err) {
      console.log("err in registration", err);
      setApiError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${pageBackground} flex items-center justify-center py-16 px-4`}>
      <div className={formCard}>
        <h2 className={formTitle}>Create an Account</h2>

        {/* API Error */}
        {apiError && <p className={errorClass}>{apiError}</p>}

        <form onSubmit={handleSubmit(onUserRegister)}>
          {/* ROLE */}
          <div className="mb-5">
            <p className={labelClass}>Register as</p>

            <div className="flex gap-6 mt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="USER"
                  {...register("role", {
                    required: "Please select a role",
                  })}
                  className="accent-blue-600 w-4 h-4"
                />
                <span className="text-sm">User</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="AUTHOR"
                  {...register("role", {
                    required: "Please select a role",
                  })}
                  className="accent-blue-600 w-4 h-4"
                />
                <span className="text-sm">Author</span>
              </label>
            </div>

            {errors.role && <p className={errorClass}>{errors.role.message}</p>}
          </div>

          <div className={divider} />

          {/* NAME */}
          <div className="sm:flex gap-4 mb-4">
            <div className="flex-1">
              <label className={labelClass}>First Name</label>
              <input
                type="text"
                className={inputClass}
                placeholder="First name"
                {...register("firstName", {
                  required: "First name is required",
                  minLength: {
                    value: 2,
                    message: "At least 2 characters required",
                  },
                  maxLength: {
                    value: 30,
                    message: "Max 30 characters allowed",
                  },
                  validate: (v) => v.trim().length > 0 || "Cannot be empty",
                })}
              />
              {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
            </div>

            <div className="flex-1">
              <label className={labelClass}>Last Name</label>
              <input
                type="text"
                className={inputClass}
                placeholder="Last name"
                {...register("lastName", {
                  maxLength: {
                    value: 30,
                    message: "Max 30 characters allowed",
                  },
                })}
              />
              {errors.lastName && <p className={errorClass}>{errors.lastName.message}</p>}
            </div>
          </div>

          {/* EMAIL */}
          <div className={formGroup}>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              className={inputClass}
              placeholder="you@example.com"
              {...register("email", {
                required: "Email is required",
                validate: (value) => value.trim().length > 0 || "Email cannot be empty",
              })}
            />
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>

          {/* PASSWORD */}
          <div className={formGroup}>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              className={inputClass}
              placeholder="Min. 8 characters"
              {...register("password", {
                required: "Password is required",
              })}
            />
            {errors.password && <p className={errorClass}>{errors.password.message}</p>}
          </div>

          {/* PROFILE IMAGE */}
          <div className={formGroup}>
            <label className={labelClass}>Profile Image</label>

            <input
              type="file"
              className={inputClass}
              accept="image/png, image/jpeg"
              {...register("profileImageUrl", {
                validate: {
                  fileType: (files) => {
                    if (!files?.[0]) return true;
                    return ["image/png", "image/jpeg"].includes(files[0].type) || "Only PNG and JPEG images are allowed";
                  },
                  fileSize: (files) => {
                    if (!files?.[0]) return true;
                    return files[0].size <= 2 * 1024 * 1024 || "Max file size is 2MB";
                  },
                },
                onChange: (event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    setPreview(URL.createObjectURL(file));
                  } else {
                    setPreview(null);
                  }
                },
              })}
            />

            {errors.profileImageUrl && <p className={errorClass}>{errors.profileImageUrl.message}</p>}
            {preview && <div className="mt-3 overflow-hidden rounded-xl border border-[#d2d2d7] bg-white p-2">
              <img src={preview} alt="Preview" className="h-40 w-full rounded-lg object-contain" />
            </div>}
          </div>

          {/* SUBMIT */}
          <button type="submit" disabled={loading} className={submitBtn}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        {/* FOOTER */}
        <p className={`${mutedText} text-center mt-5`}>
          Already have an account?{" "}
          <NavLink to="/login" className="text-[#0066cc] font-medium">
            Sign in
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Register;
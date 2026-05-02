import { useForm } from "react-hook-form";
import {
  pageBackground,
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  mutedText,
  linkClass,
} from "../styles/common";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../store/authStore";
import { useEffect } from "react";

function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const currentUser = useAuth((state) => state.currentUser);
  const login = useAuth((state) => state.login);
  const loading = useAuth((state) => state.loading);
  const error = useAuth((state) => state.error);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);

  const onUserLogin = async (userCredObj) => {
    await login(userCredObj);
    // Navigation will be handled by useEffect after state updates
  };
  //console.log("currentUser in login comp is ", currentUser);
//   if(loading){
//     return <p className="loadingClass">Loading...</p>
//   }

  useEffect(() => {
    if (!isAuthenticated || !currentUser) return;

    const role = (currentUser?.role || "").toUpperCase().trim();
    console.log("Navigate based on role:", role);
    
    if (role === "ADMIN") {
      navigate("/admin-profile");
    } else if (role === "AUTHOR") {
      navigate("/author-profile");
    } else {
      navigate("/user-profile");
    }
  }, [currentUser, isAuthenticated, navigate]);

  
  return (
    <div className={`${pageBackground} flex items-center justify-center py-16 px-4`}>
      <div className={formCard}>
        {/* Title */}
        <h2 className={formTitle}>Sign In</h2>

        {/* API error */}
        {error && <p className={errorClass}>{error}</p>}

        <form onSubmit={handleSubmit(onUserLogin)}>
          {/* Email */}
          <div className={formGroup}>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className={inputClass}
              {...register("email", {
                required: "Email is required",

                validate: (value) => value.trim().length > 0 || "Email cannot be empty",
              })}
            />
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className={formGroup}>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className={inputClass}
              {...register("password", {
                required: "Password is required",
                validate: (value) => value.trim().length > 0 || "Password cannot be empty",
              })}
            />
            {errors.password && <p className={errorClass}>{errors.password.message}</p>}
          </div>

          {/* Forgot password */}
          <div className="text-right -mt-2 mb-4">
            <a href="/forgot-password" className={`${linkClass} text-xs`}>
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading} className={submitBtn}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className={`${mutedText} text-center mt-5`}>
          Don't have an account?{" "}
          <NavLink to="/register" className={linkClass}>
            Create one
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Login;
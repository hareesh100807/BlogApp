import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import {
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  secondaryBtn,
  errorClass,
  loadingClass,
  pageWrapper,
} from "../styles/common";

const ARTICLE_API_BASE_URL = import.meta.env.VITE_ARTICLE_API_URL || "http://localhost:4060";

function EditArticle() {
  const location = useLocation();
  const navigate = useNavigate();
  const article = location.state || null;
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: article?.title || "",
      category: article?.category || "",
      content: article?.content || "",
    },
  });

  useEffect(() => {
    if (!article) return;

    reset({
      title: article.title || "",
      category: article.category || "",
      content: article.content || "",
    });
  }, [article, reset]);

  const updateArticle = async (formValues) => {
    if (!article?._id) {
      setApiError("No article selected. Open an article first, then click Edit.");
      return;
    }

    setApiError("");
    setLoading(true);

    try {
      const payload = {
        articleId: article._id,
        title: formValues.title.trim(),
        category: formValues.category,
        content: formValues.content.trim(),
      };

      const res = await axios.put(`${ARTICLE_API_BASE_URL}/author-api/article`, payload, {
        withCredentials: true,
      });

      const updatedArticle = res.data?.payload || { ...article, ...payload };
      navigate(`/article/${article._id}`, { state: updatedArticle });
    } catch (err) {
      setApiError(err.response?.data?.message || err.response?.data?.error || "Failed to update article");
    } finally {
      setLoading(false);
    }
  };

  if (!article) {
    return (
      <div className={pageWrapper}>
        <div className={formCard}>
          <h2 className={formTitle}>Edit Article</h2>
          <p className={errorClass}>No article selected. Open an article first, then click Edit.</p>
          <button className={`${secondaryBtn} mt-4`} onClick={() => navigate("/author-profile/articles")}>
            Back To Articles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={pageWrapper}>
      <div className={formCard}>
        <h2 className={formTitle}>Edit Article</h2>

        {apiError && <p className={`${errorClass} mb-4`}>{apiError}</p>}

        <form onSubmit={handleSubmit(updateArticle)}>
          <div className={formGroup}>
            <label className={labelClass}>Title</label>
            <input
              type="text"
              className={inputClass}
              placeholder="Enter article title"
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 5,
                  message: "Title must be at least 5 characters",
                },
              })}
            />
            {errors.title && <p className={errorClass}>{errors.title.message}</p>}
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Category</label>
            <select
              className={inputClass}
              {...register("category", {
                required: "Category is required",
              })}
            >
              <option value="">Select category</option>
              <option value="technology">Technology</option>
              <option value="programming">Programming</option>
              <option value="ai">AI</option>
              <option value="web-development">Web Development</option>
            </select>
            {errors.category && <p className={errorClass}>{errors.category.message}</p>}
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Content</label>
            <textarea
              rows="12"
              className={inputClass}
              placeholder="Update your article content..."
              {...register("content", {
                required: "Content is required",
                minLength: {
                  value: 50,
                  message: "Content must be at least 50 characters",
                },
              })}
            />
            {errors.content && <p className={errorClass}>{errors.content.message}</p>}
          </div>

          <button className={submitBtn} type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Article"}
          </button>

          {loading && <p className={loadingClass}>Saving your changes...</p>}
        </form>
      </div>
    </div>
  );
}

export default EditArticle;

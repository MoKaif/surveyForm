import React, { useState, useContext } from "react";
import { AppContext } from "../App";
import { ID, Databases } from "appwrite";

const db = new Databases(import("../services/appwrite").then((m) => m.default));
const DB_ID = "68964345003049ffb81e";
const SURVEYS_COLLECTION = "68964367002a59032b91";

function SurveyForm() {
  const { user, showToast, setLoading } = useContext(AppContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    { type: "text", label: "", options: [""], required: false },
  ]);
  const [preview, setPreview] = useState(false);

  const handleQuestionChange = (idx, field, value) => {
    setQuestions((qs) =>
      qs.map((q, i) => (i === idx ? { ...q, [field]: value } : q))
    );
  };

  const handleOptionChange = (qIdx, oIdx, value) => {
    setQuestions((qs) =>
      qs.map((q, i) =>
        i === qIdx
          ? {
              ...q,
              options: q.options.map((opt, oi) => (oi === oIdx ? value : opt)),
            }
          : q
      )
    );
  };

  const addQuestion = () => {
    setQuestions((qs) => [
      ...qs,
      { type: "text", label: "", options: [""], required: false },
    ]);
  };

  const removeQuestion = (idx) => {
    setQuestions((qs) => qs.filter((_, i) => i !== idx));
  };

  const addOption = (idx) => {
    setQuestions((qs) =>
      qs.map((q, i) => (i === idx ? { ...q, options: [...q.options, ""] } : q))
    );
  };

  const removeOption = (qIdx, oIdx) => {
    setQuestions((qs) =>
      qs.map((q, i) =>
        i === qIdx
          ? { ...q, options: q.options.filter((_, oi) => oi !== oIdx) }
          : q
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dbModule = await import("../services/appwrite");
      const dbClient = new Databases(dbModule.default);
      // Store questions as JSON string for Appwrite compatibility
      const doc = {
        title,
        description,
        questions: JSON.stringify(questions),
        userId: user && user.$id ? user.$id : "",
      };
      await dbClient.createDocument(
        DB_ID,
        SURVEYS_COLLECTION,
        ID.unique(),
        doc
      );
      showToast("Survey created!", "success");
      setTitle("");
      setDescription("");
      setQuestions([
        { type: "text", label: "", options: [""], required: false },
      ]);
    } catch (err) {
      showToast(err.message || "Failed to create survey", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto" }}>
      <h2 style={{ fontSize: "2rem", marginBottom: 8 }}>Create Survey</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
          marginBottom: 32,
        }}
      >
        <input
          type="text"
          placeholder="Survey Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{
            width: "100%",
            fontSize: "1.2rem",
            marginBottom: 12,
            padding: 8,
          }}
        />
        <textarea
          placeholder="Survey Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          style={{ width: "100%", marginBottom: 18, padding: 8 }}
        />
        {questions.map((q, idx) => (
          <div
            key={idx}
            style={{
              border: "1px solid #eee",
              borderRadius: 6,
              padding: 16,
              marginBottom: 18,
            }}
          >
            <div style={{ marginBottom: 8 }}>
              <select
                value={q.type}
                onChange={(e) =>
                  handleQuestionChange(idx, "type", e.target.value)
                }
              >
                <option value="text">Text</option>
                <option value="mcq">Multiple Choice</option>
                <option value="checkbox">Checkbox</option>
              </select>
              <input
                type="text"
                placeholder="Question label"
                value={q.label}
                onChange={(e) =>
                  handleQuestionChange(idx, "label", e.target.value)
                }
                style={{ marginLeft: 12, width: "60%" }}
                required
              />
              <label style={{ marginLeft: 12 }}>
                <input
                  type="checkbox"
                  checked={q.required}
                  onChange={(e) =>
                    handleQuestionChange(idx, "required", e.target.checked)
                  }
                />{" "}
                Required
              </label>
              <button
                type="button"
                onClick={() => removeQuestion(idx)}
                style={{
                  float: "right",
                  color: "#e74c3c",
                  background: "none",
                  border: "none",
                  fontSize: 18,
                  cursor: "pointer",
                }}
              >
                ✖
              </button>
            </div>
            {(q.type === "mcq" || q.type === "checkbox") && (
              <div style={{ marginLeft: 8 }}>
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} style={{ marginBottom: 6 }}>
                    <input
                      type="text"
                      placeholder={`Option ${oIdx + 1}`}
                      value={opt}
                      onChange={(e) =>
                        handleOptionChange(idx, oIdx, e.target.value)
                      }
                      style={{ width: "70%" }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(idx, oIdx)}
                      style={{
                        marginLeft: 8,
                        color: "#e74c3c",
                        background: "none",
                        border: "none",
                        fontSize: 16,
                        cursor: "pointer",
                      }}
                    >
                      ✖
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addOption(idx)}
                  style={{
                    marginTop: 4,
                    color: "#3498db",
                    background: "none",
                    border: "none",
                    fontSize: 15,
                    cursor: "pointer",
                  }}
                >
                  + Add Option
                </button>
              </div>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addQuestion}
          style={{
            background: "#eee",
            border: "none",
            borderRadius: 4,
            padding: "0.5rem 1.2rem",
            marginBottom: 18,
            cursor: "pointer",
          }}
        >
          + Add Question
        </button>
        <div style={{ textAlign: "right" }}>
          <button type="submit" className="cta-btn">
            Save Survey
          </button>
        </div>
        <style>{`
          .cta-btn {
            background: #27ae60;
            color: #fff;
            padding: 0.6rem 1.5rem;
            border-radius: 4px;
            text-decoration: none;
            font-size: 1rem;
            font-weight: 500;
            border: none;
            transition: background 0.2s;
          }
          .cta-btn:hover {
            background: #219150;
          }
        `}</style>
      </form>
      <button
        onClick={() => setPreview((p) => !p)}
        style={{
          marginBottom: 16,
          background: "#3498db",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          padding: "0.5rem 1.2rem",
          cursor: "pointer",
        }}
      >
        {preview ? "Hide Preview" : "Preview Survey"}
      </button>
      {preview && (
        <div
          style={{
            background: "#fafbfc",
            border: "1px solid #eee",
            borderRadius: 8,
            padding: 24,
          }}
        >
          <h3 style={{ marginBottom: 8 }}>{title || "[Survey Title]"}</h3>
          <p style={{ color: "#888", marginBottom: 18 }}>
            {description || "[Survey Description]"}
          </p>
          {questions.map((q, idx) => (
            <div key={idx} style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 500 }}>
                {q.label || `[Question ${idx + 1}]`}
                {q.required && <span style={{ color: "#e74c3c" }}> *</span>}
              </div>
              {q.type === "text" && (
                <input
                  type="text"
                  disabled
                  style={{ width: "60%", marginTop: 6 }}
                />
              )}
              {q.type === "mcq" &&
                q.options.map((opt, oIdx) => (
                  <div key={oIdx}>
                    <input type="radio" disabled />{" "}
                    {opt || `[Option ${oIdx + 1}]`}
                  </div>
                ))}
              {q.type === "checkbox" &&
                q.options.map((opt, oIdx) => (
                  <div key={oIdx}>
                    <input type="checkbox" disabled />{" "}
                    {opt || `[Option ${oIdx + 1}]`}
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SurveyForm;

import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Databases, ID } from "appwrite";
import { AppContext } from "../App";

const DB_ID = "68964345003049ffb81e";
const SURVEYS_COLLECTION = "68964367002a59032b91";
const RESPONSES_COLLECTION = "6896ab8c000cedeab96d";

function SurveyView() {
  const { id } = useParams();
  const { showToast, setLoading } = useContext(AppContext);
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loadingSurvey, setLoadingSurvey] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoadingSurvey(true);
    import("../services/appwrite").then(({ default: client }) => {
      const db = new Databases(client);
      db.getDocument(DB_ID, SURVEYS_COLLECTION, id)
        .then((doc) => {
          let questions = [];
          if (Array.isArray(doc.questions)) {
            questions = doc.questions;
          } else if (typeof doc.questions === "string") {
            try {
              questions = JSON.parse(doc.questions);
              if (!Array.isArray(questions)) questions = [];
            } catch {
              questions = [];
            }
          }
          setSurvey({ ...doc, questions });
        })
        .catch((err) => showToast(err.message || "Survey not found", "error"))
        .finally(() => setLoadingSurvey(false));
    });
  }, [id, showToast]);

  const handleChange = (qIdx, value) => {
    setAnswers((a) => ({ ...a, [qIdx]: value }));
  };

  const handleCheckboxChange = (qIdx, opt) => {
    setAnswers((a) => {
      const arr = Array.isArray(a[qIdx]) ? a[qIdx] : [];
      return {
        ...a,
        [qIdx]: arr.includes(opt)
          ? arr.filter((o) => o !== opt)
          : [...arr, opt],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setLoading(true);
    try {
      const dbModule = await import("../services/appwrite");
      const dbClient = new Databases(dbModule.default);
      await dbClient.createDocument(DB_ID, RESPONSES_COLLECTION, ID.unique(), {
        surveyId: id,
        answers: JSON.stringify(answers),
        createdAt: new Date().toISOString(),
      });
      showToast("Response submitted!", "success");
      setAnswers({});
    } catch (err) {
      showToast(err.message || "Failed to submit response", "error");
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  if (loadingSurvey)
    return (
      <div style={{ textAlign: "center", margin: 32 }}>Loading survey...</div>
    );
  if (!survey)
    return (
      <div style={{ textAlign: "center", margin: 32, color: "#e74c3c" }}>
        Survey not found.
      </div>
    );
  if (!Array.isArray(survey.questions)) {
    return (
      <div style={{ textAlign: "center", margin: 32, color: "#e74c3c" }}>
        Survey questions are missing or invalid.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto" }}>
      <h2 style={{ fontSize: "2rem", marginBottom: 8 }}>{survey.title}</h2>
      <p style={{ color: "#555", marginBottom: 24 }}>{survey.description}</p>
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
        {survey.questions.map((q, idx) => (
          <div key={idx} style={{ marginBottom: 18 }}>
            <div style={{ fontWeight: 500, marginBottom: 6 }}>
              {q.label}
              {q.required && <span style={{ color: "#e74c3c" }}> *</span>}
            </div>
            {q.type === "text" && (
              <input
                type="text"
                value={answers[idx] || ""}
                onChange={(e) => handleChange(idx, e.target.value)}
                required={q.required}
                style={{ width: "60%", padding: 6 }}
              />
            )}
            {q.type === "mcq" &&
              q.options.map((opt, oIdx) => (
                <div key={oIdx}>
                  <label>
                    <input
                      type="radio"
                      name={`q${idx}`}
                      value={opt}
                      checked={answers[idx] === opt}
                      onChange={() => handleChange(idx, opt)}
                      required={q.required}
                    />{" "}
                    {opt}
                  </label>
                </div>
              ))}
            {q.type === "checkbox" &&
              q.options.map((opt, oIdx) => (
                <div key={oIdx}>
                  <label>
                    <input
                      type="checkbox"
                      name={`q${idx}`}
                      value={opt}
                      checked={
                        Array.isArray(answers[idx]) &&
                        answers[idx].includes(opt)
                      }
                      onChange={() => handleCheckboxChange(idx, opt)}
                      required={
                        q.required &&
                        (!answers[idx] || answers[idx].length === 0)
                      }
                    />{" "}
                    {opt}
                  </label>
                </div>
              ))}
          </div>
        ))}
        <div style={{ textAlign: "right" }}>
          <button type="submit" className="cta-btn" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Response"}
          </button>
        </div>
        <style>{`
          .cta-btn {
            background: #3498db;
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
            background: #217dbb;
          }
        `}</style>
      </form>
    </div>
  );
}

export default SurveyView;

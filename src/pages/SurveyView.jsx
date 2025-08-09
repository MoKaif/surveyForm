import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Databases, ID } from "appwrite";
import { AppContext } from "../App";
import { Clock, Users, CheckCircle, Send } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import toast from 'react-hot-toast';

const DB_ID = "68964345003049ffb81e";
const SURVEYS_COLLECTION = "68964367002a59032b91";
const RESPONSES_COLLECTION = "6896ab8c000cedeab96d";

function SurveyView() {
  const { id } = useParams();
  const { setLoading } = useContext(AppContext);
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loadingSurvey, setLoadingSurvey] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [theme, setTheme] = useState({ primary: "#3b82f6", secondary: "#e2e8f0" });

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
          
          // Parse theme
          let surveyTheme = { primary: "#3b82f6", secondary: "#e2e8f0" };
          if (doc.theme) {
            try {
              surveyTheme = JSON.parse(doc.theme);
            } catch {
              // Use default theme
            }
          }
          
          setSurvey({ ...doc, questions });
          setTheme(surveyTheme);
        })
        .catch((err) => toast.error(err.message || "Survey not found"))
        .finally(() => setLoadingSurvey(false));
    });
  }, [id]);

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

  const validateForm = () => {
    if (!survey || !survey.questions) return false;
    
    for (let i = 0; i < survey.questions.length; i++) {
      const question = survey.questions[i];
      if (question.required) {
        const answer = answers[i];
        if (!answer || (Array.isArray(answer) && answer.length === 0) || answer === "") {
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please answer all required questions");
      return;
    }

    const loadingToast = toast.loading("Submitting your response...");
    setSubmitting(true);
    setLoading(true);
    
    try {
      const dbModule = await import("../services/appwrite");
      const dbClient = new Databases(dbModule.default);
      await dbClient.createDocument(DB_ID, RESPONSES_COLLECTION, ID.unique(), {
        surveyId: id,
        answers: JSON.stringify(answers),
        createdAt: new Date().toISOString(),
        submittedAt: Date.now(),
      });
      
      toast.dismiss(loadingToast);
      toast.success("Response submitted successfully! 🎉");
      setSubmitted(true);
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.message || "Failed to submit response");
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  if (loadingSurvey) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <span className="text-slate-600 font-medium">Loading survey...</span>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card padding="lg" className="text-center max-w-md">
          <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">😞</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Survey not found</h2>
          <p className="text-slate-600">The survey you're looking for doesn't exist or has been removed.</p>
        </Card>
      </div>
    );
  }

  if (!Array.isArray(survey.questions)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card padding="lg" className="text-center max-w-md">
          <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Invalid Survey</h2>
          <p className="text-slate-600">This survey has invalid or missing questions.</p>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card padding="lg" className="text-center max-w-md">
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-success-600" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Thank you! 🎉</h2>
            <p className="text-slate-600 mb-4">
              Your response has been submitted successfully. We appreciate your feedback!
            </p>
            <Badge variant="success">Response recorded</Badge>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: theme.secondary }}>
      <div className="max-w-3xl mx-auto">
        {/* Survey Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card padding="lg" className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">{survey.title}</h1>
            {survey.description && (
              <p className="text-lg text-slate-600 mb-6">{survey.description}</p>
            )}
            <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>~{Math.max(2, survey.questions.length)} min</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{survey.questions.length} questions</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Survey Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card padding="lg">
            <form onSubmit={handleSubmit} className="space-y-8">
              {survey.questions.map((question, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="space-y-4"
                >
                  <div className="flex items-start space-x-3">
                    <Badge 
                      variant="primary" 
                      className="mt-1"
                      style={{ backgroundColor: theme.primary + '20', color: theme.primary }}
                    >
                      {idx + 1}
                    </Badge>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">
                        {question.label}
                        {question.required && <span className="text-error-500 ml-1">*</span>}
                      </h3>

                      {question.type === "text" && (
                        <input
                          type="text"
                          value={answers[idx] || ""}
                          onChange={(e) => handleChange(idx, e.target.value)}
                          required={question.required}
                          className="w-full px-4 py-3 text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-opacity-50 transition-colors duration-200"
                          style={{ 
                            focusRingColor: theme.primary,
                            '--tw-ring-color': theme.primary + '50'
                          }}
                          placeholder="Enter your answer..."
                        />
                      )}

                      {question.type === "textarea" && (
                        <textarea
                          value={answers[idx] || ""}
                          onChange={(e) => handleChange(idx, e.target.value)}
                          required={question.required}
                          rows={4}
                          className="w-full px-4 py-3 text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-opacity-50 transition-colors duration-200"
                          placeholder="Enter your detailed answer..."
                        />
                      )}

                      {question.type === "mcq" && (
                        <div className="space-y-3">
                          {question.options.map((opt, oIdx) => (
                            <label
                              key={oIdx}
                              className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                              <input
                                type="radio"
                                name={`q${idx}`}
                                value={opt}
                                checked={answers[idx] === opt}
                                onChange={() => handleChange(idx, opt)}
                                required={question.required}
                                className="w-4 h-4 border-slate-300 focus:ring-2 focus:ring-opacity-50"
                                style={{ color: theme.primary }}
                              />
                              <span className="text-slate-700 font-medium">{opt}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {question.type === "checkbox" && (
                        <div className="space-y-3">
                          {question.options.map((opt, oIdx) => (
                            <label
                              key={oIdx}
                              className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                              <input
                                type="checkbox"
                                value={opt}
                                checked={
                                  Array.isArray(answers[idx]) &&
                                  answers[idx].includes(opt)
                                }
                                onChange={() => handleCheckboxChange(idx, opt)}
                                className="w-4 h-4 border-slate-300 rounded focus:ring-2 focus:ring-opacity-50"
                                style={{ color: theme.primary }}
                              />
                              <span className="text-slate-700 font-medium">{opt}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              <div className="flex justify-end pt-6 border-t border-slate-200">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={submitting}
                  disabled={submitting}
                  className="min-w-[140px]"
                  style={{ backgroundColor: theme.primary }}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {submitting ? "Submitting..." : "Submit Response"}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default SurveyView;
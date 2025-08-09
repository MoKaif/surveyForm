import React, { useState, useContext } from "react";
import { AppContext } from "../App";
import { ID, Databases } from "appwrite";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  GripVertical,
  Type,
  CheckSquare,
  Circle,
  Eye,
  EyeOff,
  Save,
  Settings,
  Palette,
  ArrowLeft,
} from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import toast from "react-hot-toast";

const DB_ID = "68964345003049ffb81e";
const SURVEYS_COLLECTION = "68964367002a59032b91";

const questionTypes = [
  {
    value: "text",
    label: "Text Input",
    icon: Type,
    description: "Single line text response",
  },
  {
    value: "textarea",
    label: "Long Text",
    icon: Type,
    description: "Multi-line text response",
  },
  {
    value: "mcq",
    label: "Multiple Choice",
    icon: Circle,
    description: "Select one option",
  },
  {
    value: "checkbox",
    label: "Checkboxes",
    icon: CheckSquare,
    description: "Select multiple options",
  },
];

const surveyThemes = [
  { name: "Default", primary: "#3b82f6", secondary: "#e2e8f0" },
  { name: "Forest", primary: "#059669", secondary: "#d1fae5" },
  { name: "Sunset", primary: "#dc2626", secondary: "#fee2e2" },
  { name: "Ocean", primary: "#0284c7", secondary: "#dbeafe" },
  { name: "Purple", primary: "#7c3aed", secondary: "#e9d5ff" },
];

function SurveyForm() {
  const { user, setLoading } = useContext(AppContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    { type: "text", label: "", options: [""], required: false, id: Date.now() },
  ]);
  const [preview, setPreview] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(surveyThemes[0]);
  const [showSettings, setShowSettings] = useState(false);

  const handleQuestionChange = (id, field, value) => {
    setQuestions((qs) =>
      qs.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleOptionChange = (questionId, optionIndex, value) => {
    setQuestions((qs) =>
      qs.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, i) =>
                i === optionIndex ? value : opt
              ),
            }
          : q
      )
    );
  };

  const addQuestion = () => {
    const newQuestion = {
      type: "text",
      label: "",
      options: [""],
      required: false,
      id: Date.now(),
    };
    setQuestions((qs) => [...qs, newQuestion]);
  };

  const removeQuestion = (id) => {
    if (questions.length > 1) {
      setQuestions((qs) => qs.filter((q) => q.id !== id));
    }
  };

  const addOption = (questionId) => {
    setQuestions((qs) =>
      qs.map((q) =>
        q.id === questionId ? { ...q, options: [...q.options, ""] } : q
      )
    );
  };

  const removeOption = (questionId, optionIndex) => {
    setQuestions((qs) =>
      qs.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.filter((_, i) => i !== optionIndex) }
          : q
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Survey title is required");
      return;
    }

    if (questions.some((q) => !q.label.trim())) {
      toast.error("All questions must have labels");
      return;
    }

    const loadingToast = toast.loading("Creating survey...");
    setLoading(true);

    try {
      const dbModule = await import("../services/appwrite");
      const dbClient = new Databases(dbModule.default);

      const doc = {
        title: title.trim(),
        description: description.trim(),
        questions: JSON.stringify(
          questions.map((q) => ({ ...q, id: undefined }))
        ),
        userId: user && user.$id ? user.$id : "",
        theme: JSON.stringify(selectedTheme),
        createdAt: new Date().toISOString(),
      };

      await dbClient.createDocument(
        DB_ID,
        SURVEYS_COLLECTION,
        ID.unique(),
        doc
      );

      toast.dismiss(loadingToast);
      toast.success("Survey created successfully! 🎉");

      // Reset form
      setTitle("");
      setDescription("");
      setQuestions([
        {
          type: "text",
          label: "",
          options: [""],
          required: false,
          id: Date.now(),
        },
      ]);
      setSelectedTheme(surveyThemes[0]);
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.message || "Failed to create survey");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Create Survey
              </h1>
              <p className="text-slate-600">
                Build beautiful surveys with our intuitive form builder
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={() => setShowSettings(!showSettings)}
                className={showSettings ? "bg-slate-100" : ""}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="secondary" onClick={() => setPreview(!preview)}>
                {preview ? (
                  <EyeOff className="w-4 h-4 mr-2" />
                ) : (
                  <Eye className="w-4 h-4 mr-2" />
                )}
                {preview ? "Hide Preview" : "Preview"}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="lg:col-span-1"
              >
                <Card padding="lg" className="sticky top-24">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    <Palette className="w-5 h-5 inline mr-2" />
                    Theme
                  </h3>
                  <div className="space-y-3">
                    {surveyThemes.map((theme) => (
                      <button
                        key={theme.name}
                        onClick={() => setSelectedTheme(theme)}
                        className={`w-full p-3 rounded-lg border-2 transition-all ${
                          selectedTheme.name === theme.name
                            ? "border-primary-500 bg-primary-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex space-x-1">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: theme.primary }}
                            ></div>
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: theme.secondary }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-slate-900">
                            {theme.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div
            className={`${showSettings ? "lg:col-span-3" : "lg:col-span-4"}`}
          >
            <Card padding="lg">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Survey Basic Info */}
                <div className="space-y-6">
                  <Input
                    label="Survey Title"
                    placeholder="Enter survey title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-lg font-medium"
                  />
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      placeholder="Describe what this survey is about..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                    />
                  </div>
                </div>

                {/* Questions */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Questions
                    </h3>
                    <Badge variant="secondary">
                      {questions.length} questions
                    </Badge>
                  </div>

                  <AnimatePresence>
                    {questions.map((question, index) => (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="border border-slate-200 rounded-xl p-6 bg-white"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <GripVertical className="w-5 h-5 text-slate-400" />
                            <Badge variant="primary">Q{index + 1}</Badge>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuestion(question.id)}
                            disabled={questions.length === 1}
                            className="text-error-600 hover:text-error-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="space-y-4">
                          {/* Question Type */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Question Type
                            </label>
                            <select
                              value={question.type}
                              onChange={(e) =>
                                handleQuestionChange(
                                  question.id,
                                  "type",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                              {questionTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                  {type.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Question Label */}
                          <Input
                            label="Question"
                            placeholder="Enter your question..."
                            value={question.label}
                            onChange={(e) =>
                              handleQuestionChange(
                                question.id,
                                "label",
                                e.target.value
                              )
                            }
                          />

                          {/* Options for MCQ and Checkbox */}
                          {(question.type === "mcq" ||
                            question.type === "checkbox") && (
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Options
                              </label>
                              <div className="space-y-2">
                                {question.options.map((option, optionIndex) => (
                                  <div
                                    key={optionIndex}
                                    className="flex items-center space-x-2"
                                  >
                                    <Input
                                      placeholder={`Option ${optionIndex + 1}`}
                                      value={option}
                                      onChange={(e) =>
                                        handleOptionChange(
                                          question.id,
                                          optionIndex,
                                          e.target.value
                                        )
                                      }
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        removeOption(question.id, optionIndex)
                                      }
                                      disabled={question.options.length === 1}
                                      className="text-error-600 hover:text-error-700"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => addOption(question.id)}
                                  className="text-primary-600 hover:text-primary-700"
                                >
                                  <Plus className="w-4 h-4 mr-1" />
                                  Add Option
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Required Toggle */}
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`required-${question.id}`}
                              checked={question.required}
                              onChange={(e) =>
                                handleQuestionChange(
                                  question.id,
                                  "required",
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                            />
                            <label
                              htmlFor={`required-${question.id}`}
                              className="text-sm font-medium text-slate-700"
                            >
                              Required question
                            </label>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addQuestion}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                  </Button>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button type="submit" variant="gradient" size="lg">
                    <Save className="w-4 h-4 mr-2" />
                    Create Survey
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>

        {/* Preview Modal */}
        <AnimatePresence>
          {preview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setPreview(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl"
              >
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Survey Preview
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreview(false)}
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div
                  className="p-6"
                  style={{ backgroundColor: selectedTheme.secondary }}
                >
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h4 className="text-2xl font-bold text-slate-900 mb-3">
                      {title || "[Survey Title]"}
                    </h4>
                    <p className="text-slate-600 mb-6">
                      {description || "[Survey Description]"}
                    </p>
                    <div className="space-y-6">
                      {questions.map((question, index) => (
                        <div key={question.id} className="space-y-3">
                          <label className="block text-sm font-semibold text-slate-900">
                            {index + 1}.{" "}
                            {question.label || `[Question ${index + 1}]`}
                            {question.required && (
                              <span className="text-error-500 ml-1">*</span>
                            )}
                          </label>
                          {question.type === "text" && (
                            <input
                              type="text"
                              disabled
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                            />
                          )}
                          {question.type === "textarea" && (
                            <textarea
                              disabled
                              rows={3}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                            />
                          )}
                          {question.type === "mcq" &&
                            question.options.map((option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className="flex items-center space-x-2"
                              >
                                <input
                                  type="radio"
                                  disabled
                                  name={`q-${question.id}`}
                                />
                                <span className="text-slate-700">
                                  {option || `[Option ${optionIndex + 1}]`}
                                </span>
                              </div>
                            ))}
                          {question.type === "checkbox" &&
                            question.options.map((option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className="flex items-center space-x-2"
                              >
                                <input type="checkbox" disabled />
                                <span className="text-slate-700">
                                  {option || `[Option ${optionIndex + 1}]`}
                                </span>
                              </div>
                            ))}
                        </div>
                      ))}
                    </div>
                    <div className="mt-8">
                      <button
                        disabled
                        className="px-6 py-3 rounded-lg font-medium text-white"
                        style={{ backgroundColor: selectedTheme.primary }}
                      >
                        Submit Survey
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default SurveyForm;

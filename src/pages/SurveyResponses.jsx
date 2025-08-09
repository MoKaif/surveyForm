import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Databases } from "appwrite";
import { AppContext } from "../App";
import { 
  ArrowLeft, 
  Download, 
  Users, 
  Calendar, 
  TrendingUp, 
  Filter,
  Search,
  BarChart3,
  PieChart,
  Eye
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Input from "../components/ui/Input";
import toast from 'react-hot-toast';

const DB_ID = "68964345003049ffb81e";
const SURVEYS_COLLECTION = "68964367002a59032b91";
const RESPONSES_COLLECTION = "6896ab8c000cedeab96d";

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

function SurveyResponses() {
  const { id } = useParams();
  const { setLoading } = useContext(AppContext);
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loadingSurvey, setLoadingSurvey] = useState(true);
  const [loadingResponses, setLoadingResponses] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { default: client } = await import("../services/appwrite");
        const db = new Databases(client);

        // Fetch survey details
        const surveyDoc = await db.getDocument(DB_ID, SURVEYS_COLLECTION, id);
        let questions = [];
        if (Array.isArray(surveyDoc.questions)) {
          questions = surveyDoc.questions;
        } else if (typeof surveyDoc.questions === "string") {
          try {
            questions = JSON.parse(surveyDoc.questions);
            if (!Array.isArray(questions)) questions = [];
          } catch {
            questions = [];
          }
        }
        setSurvey({ ...surveyDoc, questions });
        setLoadingSurvey(false);

        // Fetch responses
        const responsesDoc = await db.listDocuments(DB_ID, RESPONSES_COLLECTION, []);
        const surveyResponses = responsesDoc.documents.filter(
          (response) => response.surveyId === id
        );
        
        // Parse response answers
        const parsedResponses = surveyResponses.map((response) => {
          let answers = {};
          try {
            answers = JSON.parse(response.answers || "{}");
          } catch {
            answers = {};
          }
          return { ...response, parsedAnswers: answers };
        });

        setResponses(parsedResponses);
        setLoadingResponses(false);
      } catch (err) {
        toast.error(err.message || "Failed to fetch data");
        setLoadingSurvey(false);
        setLoadingResponses(false);
      }
    };

    fetchData();
  }, [id]);

  // Generate analytics data
  const generateAnalytics = () => {
    if (!survey || !survey.questions || responses.length === 0) return {};

    const analytics = {};
    
    survey.questions.forEach((question, qIdx) => {
      const questionResponses = responses
        .map(r => r.parsedAnswers[qIdx])
        .filter(answer => answer !== undefined && answer !== null && answer !== "");

      if (question.type === "mcq" || question.type === "checkbox") {
        const optionCounts = {};
        question.options.forEach(option => {
          optionCounts[option] = 0;
        });

        questionResponses.forEach(answer => {
          if (question.type === "checkbox" && Array.isArray(answer)) {
            answer.forEach(option => {
              if (optionCounts.hasOwnProperty(option)) {
                optionCounts[option]++;
              }
            });
          } else if (question.type === "mcq" && optionCounts.hasOwnProperty(answer)) {
            optionCounts[answer]++;
          }
        });

        analytics[qIdx] = {
          type: "chart",
          data: Object.entries(optionCounts).map(([name, value]) => ({ name, value })),
          totalResponses: questionResponses.length
        };
      } else {
        analytics[qIdx] = {
          type: "text",
          responses: questionResponses,
          totalResponses: questionResponses.length
        };
      }
    });

    return analytics;
  };

  const analytics = generateAnalytics();
  const responsesByDay = responses.reduce((acc, response) => {
    const date = new Date(response.createdAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const dailyData = Object.entries(responsesByDay)
    .map(([date, count]) => ({ date, responses: count }))
    .slice(-7); // Last 7 days

  const filteredResponses = responses.filter(response =>
    Object.values(response.parsedAnswers).some(answer =>
      String(answer).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const exportToCSV = () => {
    if (!survey || responses.length === 0) return;

    const headers = ['Response ID', 'Submitted At', ...survey.questions.map((q, i) => `Q${i + 1}: ${q.label}`)];
    const csvData = responses.map(response => [
      response.$id,
      new Date(response.createdAt).toLocaleString(),
      ...survey.questions.map((_, i) => {
        const answer = response.parsedAnswers[i];
        if (Array.isArray(answer)) return answer.join('; ');
        return answer || '';
      })
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${survey.title}_responses.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Responses exported successfully!');
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
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Survey not found</h2>
          <p className="text-slate-600 mb-4">The survey you're looking for doesn't exist.</p>
          <Link to="/dashboard">
            <Button variant="primary">Back to Dashboard</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <Badge variant="primary">Survey Responses</Badge>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{survey.title}</h1>
              <p className="text-slate-600">{survey.description || "Survey responses and analytics"}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={`/survey/${id}`}>
                <Button variant="secondary">
                  <Eye className="w-4 h-4 mr-2" />
                  View Survey
                </Button>
              </Link>
              <Button variant="primary" onClick={exportToCSV} disabled={responses.length === 0}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Total Responses</p>
                <p className="text-3xl font-bold text-slate-900">{responses.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Questions</p>
                <p className="text-3xl font-bold text-slate-900">{survey.questions?.length || 0}</p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-success-600" />
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Avg. Daily Responses</p>
                <p className="text-3xl font-bold text-slate-900">
                  {dailyData.length > 0 ? Math.round(dailyData.reduce((sum, d) => sum + d.responses, 0) / dailyData.length) : 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {responses.length === 0 ? (
          <Card padding="lg" className="text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No responses yet</h3>
            <p className="text-slate-600 mb-6">Share your survey to start collecting responses.</p>
            <Link to={`/survey/${id}`}>
              <Button variant="primary">
                <Eye className="w-4 h-4 mr-2" />
                Preview Survey
              </Button>
            </Link>
          </Card>
        ) : (
          <>
            {/* Response Trends */}
            {dailyData.length > 0 && (
              <Card padding="lg" className="mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Response Trends</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="date" className="text-slate-600" />
                      <YAxis className="text-slate-600" />
                      <Bar dataKey="responses" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}

            {/* Question Analytics */}
            {survey.questions && survey.questions.length > 0 && (
              <Card padding="lg" className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-900">Question Analytics</h3>
                  <select
                    value={selectedQuestion}
                    onChange={(e) => setSelectedQuestion(parseInt(e.target.value))}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {survey.questions.map((question, idx) => (
                      <option key={idx} value={idx}>
                        Q{idx + 1}: {question.label.substring(0, 50)}...
                      </option>
                    ))}
                  </select>
                </div>

                {analytics[selectedQuestion] && (
                  <div>
                    <h4 className="font-medium text-slate-900 mb-4">
                      {survey.questions[selectedQuestion].label}
                    </h4>
                    <p className="text-sm text-slate-600 mb-4">
                      {analytics[selectedQuestion].totalResponses} responses
                    </p>
                    
                    {analytics[selectedQuestion].type === "chart" ? (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={analytics[selectedQuestion].data}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            >
                              {analytics[selectedQuestion].data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {analytics[selectedQuestion].responses.map((response, idx) => (
                          <div key={idx} className="p-3 bg-slate-50 rounded-lg">
                            <p className="text-slate-700">{response}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            )}

            {/* Individual Responses */}
            <Card padding="lg">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 lg:mb-0">
                  Individual Responses ({responses.length})
                </h3>
                <Input
                  placeholder="Search responses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={Search}
                  className="lg:w-64"
                />
              </div>

              {loadingResponses ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                  <span className="ml-3 text-slate-600">Loading responses...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredResponses.map((response, idx) => (
                    <motion.div
                      key={response.$id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="border border-slate-200 rounded-lg p-6 bg-white"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="secondary">Response #{idx + 1}</Badge>
                        <div className="flex items-center space-x-1 text-sm text-slate-500">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(response.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {survey.questions.map((question, qIdx) => (
                          <div key={qIdx} className="border-l-4 border-primary-200 pl-4">
                            <h5 className="font-medium text-slate-900 mb-2">
                              Q{qIdx + 1}: {question.label}
                            </h5>
                            <div className="text-slate-700">
                              {Array.isArray(response.parsedAnswers[qIdx]) 
                                ? response.parsedAnswers[qIdx].join(', ')
                                : response.parsedAnswers[qIdx] || 'No answer'
                              }
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                  
                  {filteredResponses.length === 0 && searchTerm && (
                    <div className="text-center py-8">
                      <p className="text-slate-600">No responses match your search criteria.</p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

export default SurveyResponses;

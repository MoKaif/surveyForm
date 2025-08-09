import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Databases, Query } from "appwrite";
import {
  Plus,
  BarChart3,
  Users,
  TrendingUp,
  Clock,
  Eye,
  MessageSquare,
  Calendar,
  Search,
  Filter,
  Download,
  Share2,
  Edit,
  Trash2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Input from "../components/ui/Input";
import toast from "react-hot-toast";

const DB_ID = "68964345003049ffb81e";
const SURVEYS_COLLECTION = "68964367002a59032b91";
const RESPONSES_COLLECTION = "6896ab8c000cedeab96d";

function Dashboard() {
  const { user } = useContext(AppContext);
  const [surveys, setSurveys] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loadingSurveys, setLoadingSurveys] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Sample analytics data (in a real app, this would come from API)
  const responseData = [
    { name: "Mon", responses: 12 },
    { name: "Tue", responses: 19 },
    { name: "Wed", responses: 25 },
    { name: "Thu", responses: 31 },
    { name: "Fri", responses: 22 },
    { name: "Sat", responses: 18 },
    { name: "Sun", responses: 15 },
  ];

  const surveyTypeData = [
    { name: "Customer Feedback", value: 35, color: "#3b82f6" },
    { name: "Product Research", value: 25, color: "#8b5cf6" },
    { name: "Employee Survey", value: 20, color: "#10b981" },
    { name: "Market Research", value: 20, color: "#f59e0b" },
  ];

  useEffect(() => {
    let cancelled = false;
    if (!user) return;
    setLoadingSurveys(true);

    import("../services/appwrite").then(({ default: client }) => {
      const db = new Databases(client);
      // Fetch surveys
      db.listDocuments(DB_ID, SURVEYS_COLLECTION, [])
        .then((res) => {
          if (cancelled) return;
          let docs = res.documents;
          if (
            docs.length &&
            Object.prototype.hasOwnProperty.call(docs[0], "userId")
          ) {
            docs = docs.filter((doc) => doc.userId === user.$id);
          }
          setSurveys(docs);
        })
        .catch((err) => {
          if (!cancelled) toast.error(err.message || "Failed to fetch surveys");
        })
        .finally(() => {
          if (!cancelled) setLoadingSurveys(false);
        });

      // Fetch responses for analytics
      db.listDocuments(DB_ID, RESPONSES_COLLECTION, [])
        .then((res) => {
          if (cancelled) return;
          setResponses(res.documents);
        })
        .catch((err) => {
          console.error("Failed to fetch responses:", err);
        });
    });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const filteredSurveys = surveys.filter((survey) => {
    const matchesSearch = survey.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && survey.status === "active") ||
      (filterStatus === "draft" && survey.status === "draft");
    return matchesSearch && matchesFilter;
  });

  const totalResponses = responses.length;
  const averageResponses =
    surveys.length > 0 ? Math.round(totalResponses / surveys.length) : 0;
  const recentSurveys = surveys.slice(0, 3);

  const stats = [
    {
      icon: BarChart3,
      label: "Total Surveys",
      value: surveys.length,
      change: "+12%",
      color: "text-primary-600",
      bgColor: "bg-primary-100",
    },
    {
      icon: MessageSquare,
      label: "Total Responses",
      value: totalResponses,
      change: "+23%",
      color: "text-success-600",
      bgColor: "bg-success-100",
    },
    {
      icon: Users,
      label: "Avg. Responses",
      value: averageResponses,
      change: "+8%",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: TrendingUp,
      label: "Response Rate",
      value: "78%",
      change: "+5%",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Welcome back, {user?.email?.split("@")[0] || "User"}! 👋
              </h1>
              <p className="text-slate-600">
                Here's what's happening with your surveys today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/create">
                <Button variant="primary" size="lg" className="group">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Survey
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card padding="lg" className="relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-2">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold text-slate-900">
                        {stat.value}
                      </p>
                      <p className="text-sm text-success-600 font-medium mt-2">
                        {stat.change} from last month
                      </p>
                    </div>
                    <div
                      className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}
                    >
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Response Trends */}
          <Card padding="lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Response Trends
              </h3>
              <Badge variant="primary">Last 7 days</Badge>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={responseData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" className="text-slate-600" />
                  <YAxis className="text-slate-600" />
                  <Line
                    type="monotone"
                    dataKey="responses"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Survey Types */}
          <Card padding="lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Survey Categories
              </h3>
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={surveyTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {surveyTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Surveys Section */}
        <Card padding="lg">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 lg:mb-0">
              Your Surveys ({surveys.length})
            </h3>
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Search surveys..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
                className="md:w-64"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {loadingSurveys ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
              <span className="ml-3 text-slate-600">Loading surveys...</span>
            </div>
          ) : filteredSurveys.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-slate-900 mb-2">
                {searchTerm || filterStatus !== "all"
                  ? "No surveys found"
                  : "No surveys created yet"}
              </h4>
              <p className="text-slate-600 mb-6">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by creating your first survey"}
              </p>
              {!searchTerm && filterStatus === "all" && (
                <Link to="/create">
                  <Button variant="primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Survey
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-4 px-4 font-semibold text-slate-900">
                      Survey
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-slate-900">
                      Status
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-slate-900">
                      Responses
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-slate-900">
                      Created
                    </th>
                    <th className="text-right py-4 px-4 font-semibold text-slate-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSurveys.map((survey, index) => (
                    <tr
                      key={survey.$id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div>
                          <h4 className="font-medium text-slate-900">
                            {survey.title}
                          </h4>
                          <p className="text-sm text-slate-600 mt-1">
                            {survey.description || "No description"}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="success">Active</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-900 font-medium">
                            {Math.floor(Math.random() * 50) + 1}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-1 text-slate-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            {new Date(survey.$createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Link to={`/survey/${survey.$id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link to={`/survey/${survey.$id}/responses`}>
                            <Button variant="ghost" size="sm">
                              <BarChart3 className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;

import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import { Link } from "react-router-dom";
import { Databases, Query } from "appwrite";

const DB_ID = "68964345003049ffb81e";
const SURVEYS_COLLECTION = "68964367002a59032b91";

function Dashboard() {
  const { user, showToast, setLoading } = useContext(AppContext);
  const [surveys, setSurveys] = useState([]);
  const [loadingSurveys, setLoadingSurveys] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!user) return;
    setLoadingSurveys(true);
    import("../services/appwrite").then(({ default: client }) => {
      const db = new Databases(client);
      // Try to fetch all surveys, filter client-side if needed
      db.listDocuments(DB_ID, SURVEYS_COLLECTION, [])
        .then((res) => {
          if (cancelled) return;
          // If userId exists in documents, filter by userId, else show all
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
          if (!cancelled)
            showToast(err.message || "Failed to fetch surveys", "error");
        })
        .finally(() => {
          if (!cancelled) setLoadingSurveys(false);
        });
    });
    return () => {
      cancelled = true;
    };
  }, [user, showToast]);

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto" }}>
      <h2 style={{ fontSize: "2rem", marginBottom: 8 }}>Dashboard</h2>
      <p style={{ color: "#555", marginBottom: 24 }}>
        {user
          ? `Welcome, ${user.email}!`
          : "Please login to view your dashboard."}
      </p>
      <div style={{ marginBottom: 32 }}>
        <Link to="/create" className="cta-btn">
          Create New Survey
        </Link>
      </div>
      <div>
        {loadingSurveys ? (
          <div style={{ color: "#888" }}>Loading surveys...</div>
        ) : surveys.length === 0 ? (
          <div style={{ color: "#aaa", fontStyle: "italic" }}>
            No surveys created yet.
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: 24,
            }}
          >
            <thead>
              <tr style={{ background: "#f7f7f7" }}>
                <th style={{ textAlign: "left", padding: 8 }}>Title</th>
                <th style={{ textAlign: "left", padding: 8 }}>Created</th>
                <th style={{ textAlign: "left", padding: 8 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {surveys.map((survey) => (
                <tr key={survey.$id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: 8 }}>{survey.title}</td>
                  <td style={{ padding: 8 }}>
                    {new Date(survey.$createdAt).toLocaleString()}
                  </td>
                  <td style={{ padding: 8 }}>
                    <Link
                      to={`/survey/${survey.$id}`}
                      style={{ marginRight: 12 }}
                    >
                      View
                    </Link>
                    <Link to={`/survey/${survey.$id}/responses`}>
                      Responses
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <style>{`
        .cta-btn {
          display: inline-block;
          background: #27ae60;
          color: #fff;
          padding: 0.6rem 1.5rem;
          border-radius: 4px;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          transition: background 0.2s;
        }
        .cta-btn:hover {
          background: #219150;
        }
      `}</style>
    </div>
  );
}

export default Dashboard;

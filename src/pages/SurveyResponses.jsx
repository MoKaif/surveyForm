import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Databases, Query } from "appwrite";
import { AppContext } from "../App";

const DB_ID = "68964345003049ffb81e";
const RESPONSES_COLLECTION = "6896ab8c000cedeab96d";

function SurveyResponses() {
  const { id } = useParams();
  const { showToast } = useContext(AppContext);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    import("../services/appwrite").then(({ default: client }) => {
      const db = new Databases(client);
      db.listDocuments(DB_ID, RESPONSES_COLLECTION, [
        Query.equal("surveyId", id),
      ])
        .then((res) => {
          if (!cancelled) setResponses(res.documents);
        })
        .catch((err) => {
          if (!cancelled) {
            setError(err.message || "Failed to fetch responses");
            showToast(err.message || "Failed to fetch responses", "error");
          }
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto" }}>
      <h2 style={{ fontSize: "2rem", marginBottom: 8 }}>Survey Responses</h2>
      {loading ? (
        <div style={{ color: "#888" }}>Loading responses...</div>
      ) : error ? (
        <div style={{ color: "#e74c3c", fontStyle: "italic" }}>{error}</div>
      ) : responses.length === 0 ? (
        <div style={{ color: "#aaa", fontStyle: "italic" }}>
          No responses yet.
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
              <th style={{ textAlign: "left", padding: 8 }}>Submitted At</th>
              <th style={{ textAlign: "left", padding: 8 }}>Answers</th>
            </tr>
          </thead>
          <tbody>
            {responses.map((resp) => (
              <tr key={resp.$id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 8 }}>
                  {new Date(resp.createdAt || resp.$createdAt).toLocaleString()}
                </td>
                <td
                  style={{ padding: 8, whiteSpace: "pre-wrap", fontSize: 14 }}
                >
                  {(() => {
                    let ans = resp.answers;
                    if (typeof ans === "string") {
                      try {
                        ans = JSON.parse(ans);
                      } catch {
                        ans = ans;
                      }
                    }
                    return JSON.stringify(ans, null, 2);
                  })()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SurveyResponses;

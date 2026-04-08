import { useEffect, useMemo, useState } from "react";

const FeedbackManagement = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [configQuestions, setConfigQuestions] = useState([]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const fetchFeedback = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/feedback`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load feedback");
      }
      setEntries(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.message || "Could not fetch feedback.");
    } finally {
      setLoading(false);
    }
  };

  const fetchConfig = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/feedback/config`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load feedback form config");
      }
      const questions = Array.isArray(data.data?.questions) ? data.data.questions : [];
      setConfigQuestions(questions);
    } catch (_) {
      setConfigQuestions([]);
    }
  };

  useEffect(() => {
    fetchFeedback();
    fetchConfig();
  }, []);

  const formattedRows = useMemo(() => {
    return entries.map((item) => ({
      id: item._id,
      submittedAt: new Date(item.createdAt).toLocaleString("en-IN"),
      name: item.name || "",
      phone: item.phone || "",
      answers: Array.isArray(item.answers) ? item.answers : [],
      additionalNotes: item.additionalNotes || "",
    }));
  }, [entries]);

  const questionHeaders = useMemo(() => {
    const ordered = configQuestions.map((q) => q.questionText).filter(Boolean);
    const fromAnswers = [];
    formattedRows.forEach((row) => {
      row.answers.forEach((answer) => {
        if (answer.questionText && !ordered.includes(answer.questionText) && !fromAnswers.includes(answer.questionText)) {
          fromAnswers.push(answer.questionText);
        }
      });
    });
    return [...ordered, ...fromAnswers];
  }, [formattedRows, configQuestions]);

  const escapeCsv = (value) => {
    const safe = String(value ?? "");
    return `"${safe.replace(/"/g, '""')}"`;
  };

  const handleExportCsv = () => {
    if (!formattedRows.length) return;

    const headers = ["submittedAt", "name", "phone", ...questionHeaders, "additionalNotes"];
    const lines = [
      headers.join(","),
      ...formattedRows.map((row) => {
        const answerMap = new Map(row.answers.map((ans) => [ans.questionText, ans.selectedLabel]));
        const dynamicValues = questionHeaders.map((questionText) => answerMap.get(questionText) || "");
        return [
          escapeCsv(row.submittedAt),
          escapeCsv(row.name),
          escapeCsv(row.phone),
          ...dynamicValues.map(escapeCsv),
          escapeCsv(row.additionalNotes),
        ].join(",");
      }),
    ];

    const csv = lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `feedback-entries-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this feedback entry?");
    if (!confirmed) return;

    setDeletingId(id);
    setError("");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/feedback/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete feedback");
      }
      setEntries((prev) => prev.filter((entry) => entry._id !== id));
    } catch (err) {
      setError(err.message || "Could not delete feedback.");
    } finally {
      setDeletingId("");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Feedback Entries</h1>
        <div className="flex gap-2">
          <button
            onClick={fetchFeedback}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            Refresh
          </button>
          <button
            onClick={handleExportCsv}
            disabled={!formattedRows.length}
            className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {formattedRows.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500">
          No feedback entries found.
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Submitted</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Phone</th>
                {questionHeaders.map((header) => (
                  <th key={header} className="px-4 py-3 text-left font-semibold text-gray-700">
                    {header}
                  </th>
                ))}
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Notes</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {formattedRows.map((item, idx) => {
                const answerMap = new Map(item.answers.map((answer) => [answer.questionText, answer.selectedLabel]));
                return (
                  <tr key={`${item.submittedAt}-${idx}`} className="border-t border-gray-100">
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{item.submittedAt}</td>
                    <td className="px-4 py-3 text-gray-700">{item.name || "-"}</td>
                    <td className="px-4 py-3 text-gray-700">{item.phone || "-"}</td>
                    {questionHeaders.map((header) => (
                      <td key={`${item.id}-${header}`} className="px-4 py-3 text-gray-700">
                        {answerMap.get(header) || "-"}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-gray-700 max-w-xs">{item.additionalNotes || "-"}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === item.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FeedbackManagement;

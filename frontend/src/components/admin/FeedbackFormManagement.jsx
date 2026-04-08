import { useEffect, useState } from "react";

const emptyQuestion = (index) => ({
  questionId: `q${index + 1}`,
  questionText: "",
  yesLabel: "Yes",
  noLabel: "No",
});

const FeedbackFormManagement = () => {
  const [config, setConfig] = useState({
    productTitle: "",
    productDescription: "",
    productHighlights: "",
    questions: [emptyQuestion(0)],
  });
  const [savingConfig, setSavingConfig] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [configMessage, setConfigMessage] = useState("");

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const fetchConfig = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/feedback/config`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load feedback form config");
      }
      const serverConfig = data.data || {};
      setConfig({
        productTitle: serverConfig.productTitle || "",
        productDescription: serverConfig.productDescription || "",
        productHighlights: Array.isArray(serverConfig.productHighlights)
          ? serverConfig.productHighlights.join("\n")
          : "",
        questions:
          Array.isArray(serverConfig.questions) && serverConfig.questions.length
            ? serverConfig.questions
            : [emptyQuestion(0)],
      });
    } catch (err) {
      setError(err.message || "Could not fetch form configuration.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const updateQuestion = (index, key, value) => {
    setConfig((prev) => {
      const questions = [...prev.questions];
      questions[index] = {
        ...questions[index],
        [key]: value,
      };
      return { ...prev, questions };
    });
  };

  const addQuestion = () => {
    setConfig((prev) => ({
      ...prev,
      questions: [...prev.questions, emptyQuestion(prev.questions.length)],
    }));
  };

  const removeQuestion = (index) => {
    setConfig((prev) => {
      if (prev.questions.length <= 1) return prev;
      return {
        ...prev,
        questions: prev.questions.filter((_, idx) => idx !== index),
      };
    });
  };

  const handleSaveConfig = async () => {
    setSavingConfig(true);
    setConfigMessage("");
    setError("");

    try {
      const payload = {
        productTitle: config.productTitle,
        productDescription: config.productDescription,
        productHighlights: config.productHighlights
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        questions: config.questions.map((question, idx) => ({
          questionId: (question.questionId || `q${idx + 1}`).trim(),
          questionText: (question.questionText || "").trim(),
          yesLabel: (question.yesLabel || "Yes").trim(),
          noLabel: (question.noLabel || "No").trim(),
        })),
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/feedback/config`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to save feedback form config");
      }
      setConfigMessage("Feedback form configuration saved.");
      await fetchConfig();
    } catch (err) {
      setError(err.message || "Could not save feedback form configuration.");
    } finally {
      setSavingConfig(false);
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
    <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Feedback Form Management</h2>
      <p className="text-sm text-gray-600">
        Manage product content, questions, and Yes/No option labels for the Connect page.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Product Title</label>
        <input
          type="text"
          value={config.productTitle}
          onChange={(e) => setConfig((prev) => ({ ...prev, productTitle: e.target.value }))}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
        <textarea
          rows="3"
          value={config.productDescription}
          onChange={(e) => setConfig((prev) => ({ ...prev, productDescription: e.target.value }))}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Highlights (one line per point)
        </label>
        <textarea
          rows="4"
          value={config.productHighlights}
          onChange={(e) => setConfig((prev) => ({ ...prev, productHighlights: e.target.value }))}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Questions</h3>
          <button
            onClick={addQuestion}
            className="px-3 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700"
          >
            Add Question
          </button>
        </div>

        {config.questions.map((question, index) => (
          <div key={`${question.questionId}-${index}`} className="border border-gray-200 rounded-lg p-4 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Question ID</label>
                <input
                  type="text"
                  value={question.questionId}
                  onChange={(e) => updateQuestion(index, "questionId", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="flex justify-end items-end">
                <button
                  onClick={() => removeQuestion(index)}
                  disabled={config.questions.length <= 1}
                  className="px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Question Text</label>
              <input
                type="text"
                value={question.questionText}
                onChange={(e) => updateQuestion(index, "questionText", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Yes Option Label</label>
                <input
                  type="text"
                  value={question.yesLabel}
                  onChange={(e) => updateQuestion(index, "yesLabel", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">No Option Label</label>
                <input
                  type="text"
                  value={question.noLabel}
                  onChange={(e) => updateQuestion(index, "noLabel", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSaveConfig}
          disabled={savingConfig}
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
        >
          {savingConfig ? "Saving..." : "Save Configuration"}
        </button>
        {configMessage && <p className="text-sm text-green-700">{configMessage}</p>}
      </div>
    </div>
  );
};

export default FeedbackFormManagement;

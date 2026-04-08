import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const Connect = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    answers: {},
    additionalNotes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [showThankYouModal, setShowThankYouModal] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      setLoadingConfig(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/feedback/config`);
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load feedback form.");
        }

        const safeConfig = data.data || {};
        setConfig(safeConfig);

        const initialAnswers = (safeConfig.questions || []).reduce((acc, question) => {
          acc[question.questionId] = "";
          return acc;
        }, {});

        setFormData((prev) => ({
          ...prev,
          answers: initialAnswers,
        }));
      } catch (error) {
        setStatus("error");
        setMessage(error.message || "Could not load feedback form.");
      } finally {
        setLoadingConfig(false);
      }
    };

    fetchConfig();
  }, []);

  const questions = useMemo(() => config?.questions || [], [config]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAnswerChange = (questionId, selectedValue) => {
    setFormData((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: selectedValue,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setStatus("");

    const payloadAnswers = questions.map((question) => ({
      questionId: question.questionId,
      selectedValue: formData.answers[question.questionId],
    }));
    const normalizedPhone = formData.phone.replace(/\D/g, "");
    const phoneWithoutCountryCode =
      normalizedPhone.startsWith("91") && normalizedPhone.length === 12
        ? normalizedPhone.slice(2)
        : normalizedPhone;

    const missingAnswer = payloadAnswers.some(
      (answer) => !["yes", "no"].includes(answer.selectedValue)
    );
    if (missingAnswer) {
      setStatus("error");
      setMessage("Please answer every question with Yes or No.");
      setIsSubmitting(false);
      return;
    }

    if (phoneWithoutCountryCode && !/^[6-9]\d{9}$/.test(phoneWithoutCountryCode)) {
      setStatus("error");
      setMessage("Please enter a valid Indian phone number (10 digits starting with 6-9).");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phone: phoneWithoutCountryCode,
          answers: payloadAnswers,
          additionalNotes: formData.additionalNotes,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to submit feedback");
      }

      const resetAnswers = questions.reduce((acc, question) => {
        acc[question.questionId] = "";
        return acc;
      }, {});

      setStatus("success");
      setMessage(data.message || "Thanks for your feedback!");
      setFormData({
        name: "",
        phone: "",
        answers: resetAnswers,
        additionalNotes: "",
      });
      setShowThankYouModal(true);
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingConfig) {
    return (
      <section className="bg-neutral-50 min-h-[70vh] py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-neutral-50 min-h-[70vh] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-primary-50 border border-primary-100 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
              {config?.productTitle || "About Daily Performance Fuel"}
            </h2>
            <p className="mt-2 text-neutral-700">
              {config?.productDescription ||
                "A light daily drink designed to help maintain steady energy."}
            </p>
            {Array.isArray(config?.productHighlights) && config.productHighlights.length > 0 && (
              <ul className="mt-4 space-y-2 text-neutral-700">
                {config.productHighlights.map((item, index) => (
                  <li key={`${item}-${index}`} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary-500"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Connect With Us</h1>
            <p className="text-neutral-600 mt-2">
              Share your honest feedback on your Daily Performance Fuel experience.
            </p>

            <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Name (optional)
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g. 9876543210"
                    inputMode="numeric"
                    maxLength={13}
                    required
                  />
                  <p className="mt-1 text-xs text-neutral-500">
                    Indian number only (10 digits, optionally with +91).
                  </p>
                </div>
              </div>

              {questions.map((question, index) => (
                <div key={question.questionId}>
                  <p className="text-sm font-semibold text-neutral-800 mb-2">
                    {index + 1}) {question.questionText}
                  </p>
                  <select
                    required
                    value={formData.answers[question.questionId] || ""}
                    onChange={(e) => handleAnswerChange(question.questionId, e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2"
                  >
                    <option value="">Select an option</option>
                    <option value="yes">{question.yesLabel || "Yes"}</option>
                    <option value="no">{question.noLabel || "No"}</option>
                  </select>
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Additional feedback (optional)
                </label>
                <textarea
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  rows="4"
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 resize-y"
                  placeholder="Tell us anything else that can help us improve."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </button>

              {message && (
                <p
                  className={`text-sm font-medium ${
                    status === "success" ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {showThankYouModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-neutral-900">Thank You!</h2>
            <p className="mt-2 text-neutral-700">Your feedback has been submitted successfully.</p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setShowThankYouModal(false)}
                className="px-4 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Connect;

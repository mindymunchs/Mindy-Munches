import { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialState = {
  name: "",
  email: "",
  q1ChoiceOverChai: "",
  q2DailyFixedTime: "",
  q3TryPack4050: "",
  q4TasteRating: "",
  additionalNotes: "",
};

const Connect = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [showThankYouModal, setShowThankYouModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setStatus("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to submit feedback");
      }

      setStatus("success");
      setMessage(data.message || "Thanks for your feedback!");
      setFormData(initialState);
      setShowThankYouModal(true);
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="bg-neutral-50 min-h-[70vh] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Connect With Us</h1>
        <p className="text-neutral-600 mt-2">
          Share your honest feedback on your Daily Performance Fuel experience.
        </p>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Name (optional)</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Email (optional)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-neutral-800 mb-2">
              1) Did this feel light and refreshing enough that you would actually choose it over chai/snacks?
            </p>
            <select
              required
              name="q1ChoiceOverChai"
              value={formData.q1ChoiceOverChai}
              onChange={handleChange}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2"
            >
              <option value="">Select an option</option>
              <option value="yes">Yes, definitely</option>
              <option value="maybe">Maybe, sometimes</option>
              <option value="no">No, not really</option>
            </select>
          </div>

          <div>
            <p className="text-sm font-semibold text-neutral-800 mb-2">
              2) Can you see yourself having this daily at a fixed time like post-lunch or during work/travel?
            </p>
            <select
              required
              name="q2DailyFixedTime"
              value={formData.q2DailyFixedTime}
              onChange={handleChange}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2"
            >
              <option value="">Select an option</option>
              <option value="yes">Yes</option>
              <option value="maybe">Maybe</option>
              <option value="no">No</option>
            </select>
          </div>

          <div>
            <p className="text-sm font-semibold text-neutral-800 mb-2">
              3) If this helps you avoid that energy dip, would you try a 10-day pack at Rs 40 to Rs 50 per serving?
            </p>
            <select
              required
              name="q3TryPack4050"
              value={formData.q3TryPack4050}
              onChange={handleChange}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2"
            >
              <option value="">Select an option</option>
              <option value="yes">Yes</option>
              <option value="maybe">Maybe</option>
              <option value="no">No</option>
            </select>
          </div>

          <div>
            <p className="text-sm font-semibold text-neutral-800 mb-2">
              4) How would you rate the taste of your Daily Performance Fuel?
            </p>
            <select
              required
              name="q4TasteRating"
              value={formData.q4TasteRating}
              onChange={handleChange}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2"
            >
              <option value="">Select a rating</option>
              <option value="game-up">Game Up</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="average">Average</option>
              <option value="poor">Poor</option>
            </select>
          </div>

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
    </section>

      {showThankYouModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-neutral-900">Thank You!</h2>
            <p className="mt-2 text-neutral-700">
              Your feedback has been submitted successfully.
            </p>
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

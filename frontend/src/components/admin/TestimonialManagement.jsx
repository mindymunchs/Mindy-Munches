import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const TestimonialManagement = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [videoTestimonials, setVideoTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("text");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [generatingThumbnail, setGeneratingThumbnail] = useState(false);
  const [saving, setSaving] = useState(false);
  const videoPreviewRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    quote: "", // ✅ Changed from 'message' to match backend
    rating: 5,
    location: "",
    title: "",
    videoSrc: "",
    thumbnail: "",
    fullQuote: "",
    duration: "",
  });

  // ✅ Auto-generate thumbnail from video
  const generateThumbnailFromVideo = async (videoUrl) => {
    return new Promise((resolve, reject) => {
      setGeneratingThumbnail(true);

      const video = document.createElement("video");
      video.crossOrigin = "anonymous";
      video.src = videoUrl;
      video.preload = "metadata";

      video.addEventListener("loadedmetadata", () => {
        video.currentTime = Math.min(2, video.duration * 0.1);
      });

      video.addEventListener("seeked", () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const thumbnailDataUrl = canvas.toDataURL("image/jpeg", 0.8);
          setGeneratingThumbnail(false);
          resolve(thumbnailDataUrl);
        } catch (error) {
          setGeneratingThumbnail(false);
          reject(error);
        }
      });

      video.addEventListener("error", () => {
        setGeneratingThumbnail(false);
        reject(new Error("Failed to load video"));
      });
    });
  };

  const handleVideoUrlChange = async (url) => {
    setFormData({ ...formData, videoSrc: url });

    if (url && url.trim()) {
      try {
        const thumbnail = await generateThumbnailFromVideo(url);
        setFormData((prev) => ({ ...prev, thumbnail, videoSrc: url }));
      } catch (error) {
        console.error("Error generating thumbnail:", error);
      }
    }
  };

  useEffect(() => {
    fetchTestimonials();
    fetchVideoTestimonials();
  }, []);

  // ✅ FIXED: Proper response handling for text testimonials
  const fetchTestimonials = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/testimonials`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch testimonials');
      }

      const data = await response.json();
      console.log('✅ Text testimonials fetched:', data);
      
      // ✅ Handle both array and object responses
      if (Array.isArray(data)) {
        setTestimonials(data);
      } else if (data.testimonials) {
        setTestimonials(data.testimonials);
      } else {
        setTestimonials([]);
      }
    } catch (error) {
      console.error("❌ Error fetching testimonials:", error);
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Proper response handling for video testimonials
  const fetchVideoTestimonials = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/video-testimonials`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch video testimonials');
      }

      const data = await response.json();
      console.log('✅ Video testimonials fetched:', data);
      
      // ✅ Handle both array and object responses
      if (Array.isArray(data)) {
        setVideoTestimonials(data);
      } else if (data.videoTestimonials) {
        setVideoTestimonials(data.videoTestimonials);
      } else {
        setVideoTestimonials([]);
      }
    } catch (error) {
      console.error("❌ Error fetching video testimonials:", error);
      setVideoTestimonials([]);
    }
  };

  // ✅ FIXED: Proper request body and response handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const token = localStorage.getItem("token");
    const isVideo = activeTab === "video";
    const endpoint = isVideo ? "video-testimonials" : "testimonials";
    const method = editingItem ? "PUT" : "POST";
    const url = editingItem
      ? `${import.meta.env.VITE_API_URL}/admin/${endpoint}/${editingItem._id}`
      : `${import.meta.env.VITE_API_URL}/admin/${endpoint}`;

    try {
      // ✅ Prepare correct data based on type
      let requestBody;
      
      if (isVideo) {
        // ✅ Remove MongoDB internal fields
        const { _id, createdAt, updatedAt, __v, ...cleanData } = formData;
        requestBody = cleanData;
      } else {
        // ✅ Text testimonial - ensure 'quote' field exists
        requestBody = {
          name: formData.name,
          quote: formData.quote,
          rating: formData.rating,
          location: formData.location || ''
        };
      }

      console.log('📤 Submitting:', method, url);
      console.log('📦 Data:', requestBody);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save');
      }

      const data = await response.json();
      console.log('✅ Save response:', data);

      alert(editingItem ? "Updated successfully!" : "Created successfully!");
      setShowModal(false);
      resetForm();
      
      // ✅ Refresh the appropriate list
      if (isVideo) {
        await fetchVideoTestimonials();
      } else {
        await fetchTestimonials();
      }
    } catch (error) {
      console.error("❌ Error saving testimonial:", error);
      alert("Failed to save: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  // ✅ FIXED: Proper delete handling
  const handleDelete = async (id, isVideo) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;

    const token = localStorage.getItem("token");
    const endpoint = isVideo ? "video-testimonials" : "testimonials";

    try {
      console.log('🗑️ Deleting:', id);
      
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/${endpoint}/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete');
      }

      console.log('✅ Deleted successfully');
      alert("Deleted successfully!");
      
      // ✅ Refresh the appropriate list
      if (isVideo) {
        await fetchVideoTestimonials();
      } else {
        await fetchTestimonials();
      }
    } catch (error) {
      console.error("❌ Error deleting testimonial:", error);
      alert("Failed to delete: " + error.message);
    }
  };

  // ✅ FIXED: Proper edit data loading
  const handleEdit = (item, isVideo) => {
    console.log('✏️ Editing:', item);
    setEditingItem(item);
    
    if (isVideo) {
      setFormData({
        name: item.name || "",
        location: item.location || "",
        title: item.title || "",
        videoSrc: item.videoSrc || "",
        thumbnail: item.thumbnail || "",
        fullQuote: item.fullQuote || "",
        duration: item.duration || "",
        rating: item.rating || 5,
        quote: "" // Not used for video
      });
    } else {
      setFormData({
        name: item.name || "",
        quote: item.quote || item.message || "", // ✅ Handle both field names
        rating: item.rating || 5,
        location: item.location || "",
        // Reset video fields
        title: "",
        videoSrc: "",
        thumbnail: "",
        fullQuote: "",
        duration: ""
      });
    }
    
    setActiveTab(isVideo ? "video" : "text");
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      quote: "",
      rating: 5,
      location: "",
      title: "",
      videoSrc: "",
      thumbnail: "",
      fullQuote: "",
      duration: "",
    });
    setEditingItem(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Testimonial Management
        </h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
        >
          + Add New
        </button>
      </div>

      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab("text")}
          className={`px-6 py-3 font-medium ${
            activeTab === "text"
              ? "border-b-2 border-primary-600 text-primary-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Text Testimonials ({testimonials.length})
        </button>
        <button
          onClick={() => setActiveTab("video")}
          className={`px-6 py-3 font-medium ${
            activeTab === "video"
              ? "border-b-2 border-primary-600 text-primary-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Video Testimonials ({videoTestimonials.length})
        </button>
      </div>

      {activeTab === "text" ? (
        <div className="grid gap-4">
          {testimonials.length > 0 ? (
            testimonials.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-1 my-2">
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <span key={i} className="text-yellow-400">⭐</span>
                      ))}
                    </div>
                    <p className="text-gray-600 italic">"{item.quote || item.message}"</p>
                    {item.location && (
                      <p className="text-sm text-gray-500 mt-1">{item.location}</p>
                    )}
                    <p className="text-sm text-gray-400 mt-2">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item, false)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id, false)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              No text testimonials yet. Click "Add New" to create one.
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoTestimonials.length > 0 ? (
            videoTestimonials.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      if (e.target.nextSibling) e.target.nextSibling.style.display = "block";
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">🎥 No thumbnail</span>
                  </div>
                )}
                <video
                  src={item.videoSrc}
                  className="w-full h-48 object-cover hidden"
                  preload="metadata"
                />

                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.location}</p>
                  {item.title && <p className="text-sm text-gray-500 mt-2">{item.title}</p>}
                  <div className="flex items-center gap-1 my-2">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-sm">⭐</span>
                    ))}
                  </div>
                  {item.fullQuote && (
                    <p className="text-sm text-gray-600 italic line-clamp-2">
                      "{item.fullQuote}"
                    </p>
                  )}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(item, true)}
                      className="flex-1 px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id, true)}
                      className="flex-1 px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No video testimonials yet. Click "Add New" to create one.
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingItem ? "Edit" : "Add New"}{" "}
                {activeTab === "video" ? "Video" : "Text"} Testimonial
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {activeTab === "text" ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quote *
                      </label>
                      <textarea
                        required
                        rows="4"
                        value={formData.quote}
                        onChange={(e) =>
                          setFormData({ ...formData, quote: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rating
                      </label>
                      <select
                        value={formData.rating}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            rating: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num} Star{num > 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Video URL *{" "}
                        {generatingThumbnail && (
                          <span className="text-blue-500 text-xs">
                            (Generating thumbnail...)
                          </span>
                        )}
                      </label>
                      <input
                        type="url"
                        required
                        value={formData.videoSrc}
                        onChange={(e) => handleVideoUrlChange(e.target.value)}
                        onBlur={(e) => handleVideoUrlChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter video URL and thumbnail will be auto-generated"
                      />
                    </div>

                    {formData.thumbnail && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Generated Thumbnail Preview
                        </label>
                        <img
                          src={formData.thumbnail}
                          alt="Thumbnail preview"
                          className="w-full max-w-sm h-auto rounded-lg border border-gray-300"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quote
                      </label>
                      <textarea
                        rows="3"
                        value={formData.fullQuote}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            fullQuote: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration (e.g., 2:30)
                      </label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) =>
                          setFormData({ ...formData, duration: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rating
                      </label>
                      <select
                        value={formData.rating}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            rating: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num} Star{num > 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={generatingThumbnail || saving}
                    className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving
                      ? "Saving..."
                      : generatingThumbnail
                      ? "Generating..."
                      : editingItem
                      ? "Update"
                      : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    disabled={saving}
                    className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialManagement;

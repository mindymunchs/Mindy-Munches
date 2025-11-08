const VideoTestimonial = require('../models/VideoTestimonial');

// GET all video testimonials
exports.getAllVideoTestimonials = async (req, res) => {
  try {
    const videoTestimonials = await VideoTestimonial.find({}).sort({ createdAt: -1 });
    res.status(200).json(videoTestimonials);
  } catch (error) {
    console.error('Error fetching video testimonials from DB:', error);
    res.status(500).json({ message: 'Failed to fetch video testimonials' });
  }
};

// CREATE - Add new video testimonial
exports.createVideoTestimonial = async (req, res) => {
  try {
    const { name, location, title, videoSrc, thumbnail, fullQuote, rating, duration } = req.body;

    // Validation - only videoSrc and basic info required
    if (!name || !location || !videoSrc) {
      return res.status(400).json({
        success: false,
        message: 'Name, location, and video source are required',
      });
    }

    const newVideoTestimonial = new VideoTestimonial({
      name,
      location,
      title,
      videoSrc,
      thumbnail: thumbnail || '', // ✅ Use provided thumbnail or empty string
      fullQuote,
      rating: rating || 5,
      duration,
    });

    await newVideoTestimonial.save();

    res.status(201).json({
      success: true,
      message: 'Video testimonial created successfully',
      testimonial: newVideoTestimonial,
    });
  } catch (error) {
    console.error('Error creating video testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create video testimonial',
      error: error.message,
    });
  }
};

// UPDATE - Edit video testimonial
exports.updateVideoTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedTestimonial = await VideoTestimonial.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTestimonial) {
      return res.status(404).json({
        success: false,
        message: 'Video testimonial not found',
      });
    }

    res.json({
      success: true,
      message: 'Video testimonial updated successfully',
      testimonial: updatedTestimonial,
    });
  } catch (error) {
    console.error('Error updating video testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update video testimonial',
      error: error.message,
    });
  }
};

// DELETE - Remove video testimonial
exports.deleteVideoTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTestimonial = await VideoTestimonial.findByIdAndDelete(id);

    if (!deletedTestimonial) {
      return res.status(404).json({
        success: false,
        message: 'Video testimonial not found',
      });
    }

    res.json({
      success: true,
      message: 'Video testimonial deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting video testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete video testimonial',
      error: error.message,
    });
  }
};

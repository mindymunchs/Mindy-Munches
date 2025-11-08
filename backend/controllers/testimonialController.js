const Testimonial = require('../models/Testimonial');

// Get all testimonials from MongoDB
const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    res.json({
      success: true,
      testimonials,
      totalCount: testimonials.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonials',
      error: error.message,
    });
  }
};

// CREATE - Add new testimonial
const createTestimonial = async (req, res) => {
  try {
    const { name, message, rating } = req.body;

    if (!name || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name and message are required',
      });
    }

    const newTestimonial = new Testimonial({
      name,
      message,
      rating: rating || 5,
    });

    await newTestimonial.save();

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      testimonial: newTestimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create testimonial',
      error: error.message,
    });
  }
};

// UPDATE - Edit existing testimonial
const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, message, rating } = req.body;

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      id,
      { name, message, rating },
      { new: true, runValidators: true }
    );

    if (!updatedTestimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      });
    }

    res.json({
      success: true,
      message: 'Testimonial updated successfully',
      testimonial: updatedTestimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update testimonial',
      error: error.message,
    });
  }
};

// DELETE - Remove testimonial
const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTestimonial = await Testimonial.findByIdAndDelete(id);

    if (!deletedTestimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      });
    }

    res.json({
      success: true,
      message: 'Testimonial deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete testimonial',
      error: error.message,
    });
  }
};

module.exports = {
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};

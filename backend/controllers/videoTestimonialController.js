const VideoTestimonial = require('../models/VideoTestimonial');
const mongoose = require('mongoose');

// GET all video testimonials
exports.getAllVideoTestimonials = async (req, res) => {
  try {
    const videoTestimonials = await VideoTestimonial.find({}).sort({ createdAt: -1 });
    console.log('✅ Fetched video testimonials:', videoTestimonials.length);
    res.status(200).json(videoTestimonials);
  } catch (error) {
    console.error('❌ Error fetching video testimonials:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch video testimonials',
      error: error.message 
    });
  }
};

// CREATE - Add new video testimonial
exports.createVideoTestimonial = async (req, res) => {
  try {
    const { name, location, title, videoSrc, thumbnail, fullQuote, rating, duration } = req.body;

    console.log('📤 Creating video testimonial:', { name, location });

    // Validation
    if (!name || !location || !videoSrc) {
      return res.status(400).json({
        success: false,
        message: 'Name, location, and video source are required',
      });
    }

    const newVideoTestimonial = new VideoTestimonial({
      name,
      location,
      title: title || '',
      videoSrc,
      thumbnail: thumbnail || '',
      fullQuote: fullQuote || '',
      rating: rating || 5,
      duration: duration || ''
    });

    const savedTestimonial = await newVideoTestimonial.save();
    console.log('✅ Created video testimonial:', savedTestimonial._id);

    res.status(201).json({
      success: true,
      message: 'Video testimonial created successfully',
      data: savedTestimonial,
    });
  } catch (error) {
    console.error('❌ Error creating video testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create video testimonial',
      error: error.message,
    });
  }
};

// UPDATE - Edit existing video testimonial
exports.updateVideoTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🔄 Update request received');
    console.log('   ID:', id);
    console.log('   Body:', req.body);

    // ✅ Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('❌ Invalid ObjectId format');
      return res.status(400).json({
        success: false,
        message: 'Invalid testimonial ID format',
      });
    }

    // ✅ Remove MongoDB internal fields from update
    const { _id, createdAt, updatedAt, __v, ...updateData } = req.body;

    console.log('   Clean update data:', updateData);

    // ✅ Use findByIdAndUpdate directly (more reliable)
    const updatedTestimonial = await VideoTestimonial.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, // Return updated document
        runValidators: true // Run schema validations
      }
    );

    if (!updatedTestimonial) {
      console.log('❌ Testimonial not found after update attempt');
      
      // Double-check if it exists
      const checkExists = await VideoTestimonial.findById(id);
      if (!checkExists) {
        console.log('❌ Confirmed: Document does not exist in DB');
        return res.status(404).json({
          success: false,
          message: 'Video testimonial not found',
        });
      } else {
        console.log('⚠️ Document exists but update failed');
        return res.status(500).json({
          success: false,
          message: 'Update failed for unknown reason',
        });
      }
    }

    console.log('✅ Update successful:', updatedTestimonial._id);

    res.status(200).json({
      success: true,
      message: 'Video testimonial updated successfully',
      data: updatedTestimonial,
    });
  } catch (error) {
    console.error('❌ Error updating video testimonial:', error);
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

    console.log('🗑️ Delete request for ID:', id);

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid testimonial ID format',
      });
    }

    const deletedTestimonial = await VideoTestimonial.findByIdAndDelete(id);

    if (!deletedTestimonial) {
      console.log('❌ Testimonial not found for deletion');
      return res.status(404).json({
        success: false,
        message: 'Video testimonial not found',
      });
    }

    console.log('✅ Deleted successfully:', id);

    res.status(200).json({
      success: true,
      message: 'Video testimonial deleted successfully',
      data: deletedTestimonial,
    });
  } catch (error) {
    console.error('❌ Error deleting video testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete video testimonial',
      error: error.message,
    });
  }
};

import Resume from "../models/Resume.js";

export const createResume = async (req, res) => {
  try {
    const resumeData = JSON.parse(req.body.resumeData);

    if (req.file) {
      resumeData.imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    }

    resumeData.userId = req.user._id;

    console.log("Resume Data Received:", resumeData);

    const resume = await Resume.findOneAndUpdate(
      { userId: req.user._id },
      { $set: resumeData },
      { new: true, upsert: true }
    );

    res.status(201).json({ success: true, resume });
  } catch (error) {
    console.error("Error saving resume:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};



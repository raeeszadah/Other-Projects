import axios from "axios";

export const generateInterviewQuestions = async (req, res) => {
  const { jobRole } = req.body;

  console.log("🔹 Job Role Received:", jobRole);

  try {
    const response = await axios.post(
      "https://ai-interview-generator.p.rapidapi.com/questions",
      { role: jobRole },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "ai-interview-generator.p.rapidapi.com",
        },
        timeout: 8000,
      }
    );

    console.log("🔹 API Raw Response:", response.data);

    if (response.data && response.data.questions && response.data.questions.length > 0) {
      console.log("Real-time questions fetched successfully!");
      return res.json({ success: true, questions: response.data.questions });
    } else {
      throw new Error("No valid questions in response");
    }
  } catch (err) {
    console.error("API Error:", err.message);

    const fallbackQuestions = {
      "Software Engineer": [
        "Explain the difference between REST and GraphQL.",
        "How do you optimize a React application for performance?",
        "What are the main principles of Object-Oriented Programming?",
      ],
      "Data Scientist": [
        "What is overfitting in machine learning?",
        "Explain the difference between supervised and unsupervised learning.",
        "How do you handle missing data in a dataset?",
      ],
      "Product Manager": [
        "How do you prioritize features in a product roadmap?",
        "Explain the concept of MVP.",
        "Describe a time you resolved a conflict between stakeholders.",
      ],
    };

    const questions = fallbackQuestions[jobRole] || [
      "Tell me about yourself.",
      "What motivates you?",
      "Describe a challenging situation you faced at work.",
    ];

    return res.json({ success: true, questions });
  }
};

import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InterviewPrepPage = () => {
  const [jobRole, setJobRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSpeak = (text) => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    synth.speak(utter);
  };

  const handleVoiceAnswer = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onstart = () => toast.info("🎙️ Listening... speak now");

    recognition.onresult = (event) => {
      const answer = event.results[0][0].transcript;
      toast.success("Your Answer: " + answer, { autoClose: 3000 });
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed") {
        toast.error("Microphone access denied — please allow it in browser settings.");
      } else if (event.error === "no-speech") {
        toast.error("No speech detected. Try again!");
      } else if (event.error === "audio-capture") {
        toast.error("No microphone found or access blocked.");
      } else {
        toast.error("Voice Error: " + event.error);
      }
    };
  };

  const handleGenerate = async () => {
    if (!jobRole) return toast.warning("Enter a job role");

    setLoading(true);
    try {
      const { data } = await axios.post(
        "https://careercompanion-backend-mgbo.onrender.com/api/interview",
        { jobRole },
        { withCredentials: true }
      );

      if (data.success) {
        setQuestions(data.questions);
        toast.success("Questions generated successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">AI-Powered Mock Interview</h2>

      <input
        type="text"
        placeholder="Enter Job Role (e.g., Software Engineer)"
        value={jobRole}
        onChange={(e) => setJobRole(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      <button
        onClick={handleGenerate}
        className={`px-4 py-2 rounded mb-6 text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Questions"}
      </button>

      {questions.length > 0 && (
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div
              key={idx}
              className="border p-4 rounded shadow flex justify-between items-center"
            >
              <span>{idx + 1}. {q}</span>
              <div className="space-x-2">
                <button
                  onClick={() => handleSpeak(q)}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Listen
                </button>
                <button
                  onClick={handleVoiceAnswer}
                  className="bg-purple-500 text-white px-2 py-1 rounded"
                >
                   Answer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewPrepPage;

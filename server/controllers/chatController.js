import { GoogleGenerativeAI } from "@google/generative-ai";

const askChatbot = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    
    const prompt = `You are a helpful, encouraging AI teaching assistant for an online learning platform. Keep answers concise and strictly related to education, coding, and learning. 
    
    Student's question: ${message}`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({ success: true, reply });
  } catch (error) {
    console.error("🔥 Detailed Chatbot Error:", error.message || error);
    res.status(500).json({ success: false, message: "Failed to connect to AI assistant." });
  }
};

export { askChatbot };
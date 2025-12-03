import {API_KEY,MODEL_NAME} from './api.js';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold
} from "@google/generative-ai";

// 模拟响应数据
const mockResponses = {
  greetings: [
    "你好！我是一个AI助手，可以帮助你解答问题、提供信息。有什么我可以帮助你的吗？",
    "欢迎使用AI助手！请问你有什么问题需要帮助解决？"
  ],
  general: [
    "这是一个关于你问题的模拟回答。由于API密钥限制，暂时使用模拟数据。",
    "根据你的问题，这是一个参考回答。请获取新的API密钥以使用完整功能。"
  ],
  error: "抱歉，当前API密钥已失效。请获取新的API密钥并更新到.env文件中以继续使用完整功能。"
};

async function runChat(prompt) {
  // 检查API密钥是否为默认的泄露密钥
  const isLeakedKey = API_KEY === "AIzaSyCkV4wHmdgNRh547vU7CwbOR44sjKJ6Wr4";
  
  // 如果是泄露密钥或API密钥无效，返回模拟响应
  if (!API_KEY || isLeakedKey) {
    console.warn("使用模拟响应：API密钥无效或已泄露");
    
    // 根据提示内容选择不同的模拟响应
    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes("你好") || lowerPrompt.includes("hi") || lowerPrompt.includes("hello")) {
      return mockResponses.greetings[Math.floor(Math.random() * mockResponses.greetings.length)];
    }
    return mockResponses.general[Math.floor(Math.random() * mockResponses.general.length)];
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
      }
    ];

    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: []
    });

    const result = await chat.sendMessage(prompt);
    const response = result.response;
    console.log(response.text());
    return response.text();
  } catch (error) {
    console.error("API调用错误:", error);
    // API调用失败时返回模拟响应
    return mockResponses.error;
  }
}

export default runChat;

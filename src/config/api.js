// Google Gemini API 配置
// 从环境变量中读取 API 密钥
export const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// 使用的模型名称
export const MODEL_NAME = "gemini-2.0-flash";

// 已知泄露的 API 密钥列表
const LEAKED_KEYS = [
  "AIzaSyCkV4wHmdgNRh547vU7CwbOR44sjKJ6Wr4"
];

// 检查 API 密钥有效性的函数
export function checkApiKeyValidity() {
  // 检查 API 密钥是否存在
  if (!API_KEY) {
    return {
      valid: false,
      message: "API 密钥不存在，请在 .env 文件中配置 VITE_GEMINI_API_KEY"
    };
  }

  // 检查 API 密钥是否在泄露列表中
  if (LEAKED_KEYS.includes(API_KEY)) {
    return {
      valid: false,
      message: "API 密钥已泄露，请获取新的 API 密钥"
    };
  }

  // 检查 API 密钥格式是否基本正确（Google API 密钥通常以 AIzaSy 开头）
  if (!API_KEY.startsWith("AIzaSy")) {
    return {
      valid: false,
      message: "API 密钥格式不正确，Google API 密钥通常以 AIzaSy 开头"
    };
  }

  return {
    valid: true,
    message: "API 密钥有效"
  };
}

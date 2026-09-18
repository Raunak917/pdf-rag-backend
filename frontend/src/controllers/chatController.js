import { uploadPdf } from "../services/api";

export const askQuestion = async (file, question) => {
  if (!file) {
    throw new Error("Please select a PDF file.");
  }

  if (!question.trim()) {
    throw new Error("Please enter a question.");
  }

  const answer = await uploadPdf(file, question);

  return answer;
};
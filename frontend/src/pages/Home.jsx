import { useState } from "react";
import FileUpload from "../components/FileUpload.jsx";
import ChatBox from "../components/ChatBox.jsx";
import { createChatMessage } from "../models/ChatModel.js";
import { askQuestion } from "../controllers/chatController.js";

const Home = () => {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file || !question.trim()) {
      return;
    }

    const userQuestion = question.trim();

    const userMessage = createChatMessage(
      "user",
      userQuestion
    );

    setMessages((previousMessages) => [
      ...previousMessages,
      userMessage,
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const answer = await askQuestion(file, userQuestion);

      const aiMessage = createChatMessage(
        "ai",
        answer
      );

      setMessages((previousMessages) => [
        ...previousMessages,
        aiMessage,
      ]);
    } catch (error) {
      console.log(error);

      const errorMessage = createChatMessage(
        "ai",
        "Something went wrong. Please check that the backend is running and try again."
      );

      setMessages((previousMessages) => [
        ...previousMessages,
        errorMessage,
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <header className="header">
        <div>
          <h1>Chat With RagifyR</h1>
          <p>Ask questions about your documents</p>
        </div>
      </header>

      <main className="main-content">
        <section className="upload-section">
          <h2>Upload your PDF</h2>

          <p className="section-description">
            Select a PDF document and ask questions about its content.
          </p>

          <FileUpload
            file={file}
            setFile={setFile}
          />
        </section>

        <section className="chat-section">
          <ChatBox
            messages={messages}
            question={question}
            setQuestion={setQuestion}
            handleSubmit={handleSubmit}
            loading={loading}
            file={file}
          />
        </section>
      </main>
    </div>
  );
};

export default Home;
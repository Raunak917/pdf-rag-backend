import Message from "./Message.jsx";
import Loading from "./Loading.jsx";

const ChatBox = ({
  messages,
  question,
  setQuestion,
  handleSubmit,
  loading,
  file,
}) => {
  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <div className="empty-icon">💬</div>
            <h2>Ask your PDF</h2>
            <p>
              Upload a PDF and ask questions about its content.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <Message key={message.id} message={message} />
          ))
        )}

        {loading && <Loading />}
      </div>

      <form className="question-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={
            file
              ? "Ask something about your PDF..."
              : "First select a PDF..."
          }
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          disabled={!file || loading}
        />

        <button
          type="submit"
          disabled={!file || !question.trim() || loading}
        >
          {loading ? "..." : "Ask"}
        </button>
      </form>
    </div>
  );
};

export default ChatBox;

const Message = ({ message }) => {
  return (
    <div className={`message-row ${message.sender}`}>
      <div className="message">
        <div className="message-sender">
          {message.sender === "user" ? "You" : "AI"}
        </div>

        <div className="message-text">
          {message.text}
        </div>
      </div>
    </div>
  );
};

export default Message;
export const createChatMessage = (sender, text) => {
  return {
    id: Date.now() + Math.random(),
    sender,
    text,
  };
};
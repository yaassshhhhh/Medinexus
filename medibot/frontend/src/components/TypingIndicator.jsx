const TypingIndicator = () => (
  <div className="flex items-end gap-2 mb-3">
    <div className="w-8 h-8 rounded-full bg-primaryDark flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
      M
    </div>
    <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
      <div className="flex gap-1 items-center h-4">
        <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full inline-block" />
        <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full inline-block" />
        <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full inline-block" />
      </div>
    </div>
  </div>
);

export default TypingIndicator;

const QuickReplies = ({ replies, onSelect }) => {
  if (!replies || replies.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2 mb-1 px-2">
      {replies.map((reply, i) => (
        <button
          key={i}
          onClick={() => onSelect(reply)}
          className="bg-white border border-primary text-primaryDark text-sm px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-colors duration-200 shadow-sm font-medium"
        >
          {reply}
        </button>
      ))}
    </div>
  );
};

export default QuickReplies;

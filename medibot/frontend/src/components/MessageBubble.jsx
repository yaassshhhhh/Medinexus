import ReactMarkdown from 'react-markdown';
import DoctorCard from './DoctorCard.jsx';

const formatTime = (date) =>
  new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const MessageBubble = ({ message, doctors }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-end gap-2 mb-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar — only for bot */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primaryDark flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mb-1">
          M
        </div>
      )}

      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[78%]`}>
        {/* Bubble */}
        <div className={`px-3 py-2 rounded-2xl shadow-sm text-sm leading-relaxed ${
          isUser
            ? 'bg-userBubble text-gray-800 rounded-br-none'
            : 'bg-botBubble text-gray-800 rounded-bl-none'
        }`}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="bot-markdown">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Doctor cards scrollable row */}
        {message.showDoctors && doctors?.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1 mt-2 max-w-full">
            {doctors.map((doc, i) => (
              <DoctorCard key={i} doctor={doc} />
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span className="text-[10px] text-gray-400 mt-0.5 px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;

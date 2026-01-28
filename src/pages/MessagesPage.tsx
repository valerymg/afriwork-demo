import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Phone, MoreVertical } from 'lucide-react';
import { useStore } from '../store/useStore';
import Avatar from '../components/ui/Avatar';
import { format, isToday, isYesterday } from 'date-fns';

export default function MessagesPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user, getConversationsByUser, getMessages, sendMessage, conversations: allConvs } = useStore();
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversations = user ? getConversationsByUser(user.id) : [];
  const activeConv = conversationId
    ? allConvs.find((c) => c.id === conversationId)
    : conversations[0];
  const messages = activeConv ? getMessages(activeConv.id) : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Please sign in to view messages.</p>
        <Link to="/login" className="text-primary-600 font-medium mt-2 inline-block">Sign In</Link>
      </div>
    );
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConv) return;
    sendMessage(activeConv.id, messageText.trim());
    setMessageText('');
  };

  const formatMsgTime = (date: string) => {
    const d = new Date(date);
    if (isToday(d)) return format(d, 'h:mm a');
    if (isYesterday(d)) return 'Yesterday ' + format(d, 'h:mm a');
    return format(d, 'MMM d, h:mm a');
  };

  const getOtherUser = (conv: typeof activeConv) => {
    if (!conv) return null;
    return conv.other_user;
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] flex pb-16 md:pb-0">
      {/* Conversation List */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-gray-200 bg-white flex flex-col ${
        activeConv && conversationId ? 'hidden md:flex' : 'flex'
      }`}>
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-lg font-semibold text-gray-900">Messages</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              No conversations yet. Contact a provider to start chatting!
            </div>
          ) : (
            conversations.map((conv) => {
              const other = getOtherUser(conv);
              const isActive = activeConv?.id === conv.id;
              return (
                <Link
                  key={conv.id}
                  to={`/messages/${conv.id}`}
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                    isActive ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="relative">
                    <Avatar
                      src={other?.avatar_url}
                      name={other?.full_name || 'User'}
                      size="md"
                    />
                    {(conv.unread_count || 0) > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {other?.full_name || 'User'}
                      </span>
                      {conv.last_message_at && (
                        <span className="text-xs text-gray-400 shrink-0 ml-2">
                          {isToday(new Date(conv.last_message_at))
                            ? format(new Date(conv.last_message_at), 'h:mm a')
                            : format(new Date(conv.last_message_at), 'MMM d')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {conv.last_message || 'Start a conversation...'}
                    </p>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col bg-gray-50 ${
        !conversationId ? 'hidden md:flex' : 'flex'
      }`}>
        {activeConv ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
              <button
                onClick={() => navigate('/messages')}
                className="md:hidden p-1.5 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft size={20} />
              </button>
              <Avatar
                src={getOtherUser(activeConv)?.avatar_url}
                name={getOtherUser(activeConv)?.full_name || 'User'}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900">{getOtherUser(activeConv)?.full_name}</h3>
                {activeConv.gig && (
                  <p className="text-xs text-gray-500 truncate">Re: {activeConv.gig.title}</p>
                )}
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                <Phone size={18} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                <MoreVertical size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((msg) => {
                const isMine = msg.sender_id === user.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                        isMine
                          ? 'bg-primary-600 text-white rounded-br-md'
                          : 'bg-white text-gray-900 border border-gray-100 rounded-bl-md'
                      }`}
                    >
                      <p className="leading-relaxed">{msg.content}</p>
                      <p
                        className={`text-[10px] mt-1 ${
                          isMine ? 'text-primary-200' : 'text-gray-400'
                        }`}
                      >
                        {formatMsgTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="bg-white border-t border-gray-200 px-4 py-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="p-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-xl transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <p className="text-lg font-medium mb-1">Select a conversation</p>
              <p className="text-sm">Choose from your existing conversations or start a new one.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

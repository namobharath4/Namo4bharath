import React, { useState, useEffect } from 'react';
import { X, Send, User, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';

export default function MessageDrawer({ isOpen, onClose, targetUser }) {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const targetName = typeof targetUser === 'string' ? targetUser : (targetUser?.name || targetUser?.full_name || 'Agricultural Partner');
  const targetId = typeof targetUser === 'object' ? (targetUser?.id || targetUser?.user_id) : targetName;

  useEffect(() => {
    if (isOpen && user) {
      loadMessages();
    }
  }, [isOpen, user, targetName]);

  async function loadMessages() {
    setLoading(true);
    try {
      const data = await dbService.getMessages(user.id, targetId);
      setMessages(data);
    } catch (err) {
      console.warn('Message load error:', err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !user) return;

    const text = inputMessage.trim();
    setInputMessage('');

    const newMsg = await dbService.sendMessage({
      senderId: user.id,
      recipientId: targetId,
      senderName: profile?.name || profile?.full_name || user.email?.split('@')[0],
      content: text
    });

    setMessages(prev => [...prev, newMsg]);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '480px', height: '600px', display: 'flex', flexDirection: 'column' }}
      >
        {/* Drawer Header */}
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={styles.avatar}>
              <User size={18} color="#15803d" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>{targetName}</h3>
              <span style={{ fontSize: '12px', color: '#16a34a' }}>Direct Agri-Partner Messaging</span>
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn} aria-label="Close message window">
            <X size={20} />
          </button>
        </div>

        {/* Messages Body */}
        <div style={styles.messageList}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#64748b', fontSize: '13px' }}>
              Loading conversation history...
            </div>
          ) : messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
              <MessageSquare size={36} color="#cbd5e1" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontWeight: '700', fontSize: '15px', color: '#334155' }}>No messages yet</div>
              <p style={{ fontSize: '13px', marginTop: '4px' }}>
                Discuss farm requirements, rates, machinery availability, and field location.
              </p>
            </div>
          ) : (
            messages.map((m) => {
              const isMe = m.sender_id === user?.id;
              return (
                <div 
                  key={m.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMe ? 'flex-end' : 'flex-start',
                    marginBottom: '12px'
                  }}
                >
                  <div style={isMe ? styles.myBubble : styles.theirBubble}>
                    {m.content}
                  </div>
                  <span style={{ fontSize: '10px', color: '#94a3b8', marginTop: '3px' }}>
                    {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} style={styles.inputBar}>
          <input 
            type="text"
            required
            className="form-input"
            placeholder="Type message, field location, or rate offer..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '10px 16px' }}>
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '14px',
    borderBottom: '1px solid #e2e8f0',
    marginBottom: '14px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#dcfce7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    padding: '4px',
    cursor: 'pointer',
    color: '#64748b',
  },
  messageList: {
    flexGrow: 1,
    overflowY: 'auto',
    paddingRight: '6px',
    display: 'flex',
    flexDirection: 'column',
  },
  myBubble: {
    backgroundColor: '#15803d',
    color: '#ffffff',
    padding: '10px 14px',
    borderRadius: '14px 14px 2px 14px',
    maxWidth: '80%',
    fontSize: '13px',
    lineHeight: '1.4',
  },
  theirBubble: {
    backgroundColor: '#f1f5f9',
    color: '#0f172a',
    padding: '10px 14px',
    borderRadius: '14px 14px 14px 2px',
    maxWidth: '80%',
    fontSize: '13px',
    lineHeight: '1.4',
  },
  inputBar: {
    display: 'flex',
    gap: '8px',
    paddingTop: '12px',
    borderTop: '1px solid #e2e8f0',
  }
};

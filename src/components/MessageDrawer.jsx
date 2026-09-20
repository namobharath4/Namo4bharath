import React, { useState } from 'react';
import { X, Send, User, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MessageDrawer({ isOpen, onClose, targetUser }) {
  const { profile } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: targetUser || 'Ramesh Reddy (Operator)',
      text: 'Hello! I saw your requirement for paddy field tilling. My 47HP tractor with 7ft rotavator is available starting tomorrow.',
      time: '10:30 AM',
      isMe: false
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: profile?.name || 'Me',
        text: inputMessage,
        time: 'Just now',
        isMe: true
      }
    ]);
    setInputMessage('');

    // Simulated helpful response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: targetUser || 'Ramesh Reddy',
          text: 'Understood! I will verify the field access road and confirm diesel terms. Thank you!',
          time: 'Just now',
          isMe: false
        }
      ]);
    }, 1500);
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
              <h3 style={{ fontSize: '16px', fontWeight: '800' }}>{targetUser || 'Agricultural Partner'}</h3>
              <span style={{ fontSize: '12px', color: '#16a34a' }}>● Online & Ready</span>
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        {/* Messages Body */}
        <div style={styles.messageList}>
          {messages.map((m) => (
            <div 
              key={m.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: m.isMe ? 'flex-end' : 'flex-start',
                marginBottom: '12px'
              }}
            >
              <div style={m.isMe ? styles.myBubble : styles.theirBubble}>
                {m.text}
              </div>
              <span style={{ fontSize: '10px', color: '#94a3b8', marginTop: '3px' }}>
                {m.time}
              </span>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} style={styles.inputBar}>
          <input 
            type="text"
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

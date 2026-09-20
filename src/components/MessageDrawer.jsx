import React, { useState, useEffect, useRef } from 'react';
import { X, Send, User, MessageSquare, Paperclip, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import { storageService } from '../services/storageService';
import StorageImage from './StorageImage';

export default function MessageDrawer({ isOpen, onClose, targetUser }) {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef(null);

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

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size exceeds 10MB limit.');
        return;
      }
      setAttachmentFile(file);
      if (file.type.startsWith('image/')) {
        setAttachmentPreview(URL.createObjectURL(file));
      } else {
        setAttachmentPreview('');
      }
    }
  };

  const handleRemoveAttachment = () => {
    setAttachmentFile(null);
    setAttachmentPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!inputMessage.trim() && !attachmentFile) || !user) return;

    setSending(true);
    const text = inputMessage.trim() || (attachmentFile ? 'Sent an attachment' : '');
    setInputMessage('');

    try {
      const messageId = crypto.randomUUID();
      let attachmentUrl = null;
      let attachmentName = null;

      if (attachmentFile) {
        const uploadRes = await storageService.uploadFile({
          file: attachmentFile,
          userId: user.id,
          featureName: 'messages',
          itemId: messageId
        });
        attachmentUrl = uploadRes.path;
        attachmentName = attachmentFile.name;
      }

      const newMsg = await dbService.sendMessage({
        senderId: user.id,
        recipientId: targetId,
        senderName: profile?.name || profile?.full_name || user.email?.split('@')[0],
        content: text,
        attachmentUrl,
        attachmentName
      });

      setMessages(prev => [...prev, newMsg]);
      handleRemoveAttachment();
    } catch (err) {
      console.error('Failed to send message with attachment:', err);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (msgId) => {
    await dbService.deleteMessage(msgId);
    setMessages(prev => prev.filter(m => m.id !== msgId));
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
                    marginBottom: '12px',
                    position: 'relative'
                  }}
                >
                  <div style={isMe ? styles.myBubble : styles.theirBubble}>
                    {m.attachment_url && (
                      <div style={{ marginBottom: '6px' }}>
                        <StorageImage 
                          src={m.attachment_url} 
                          alt="Message attachment"
                          style={{ maxWidth: '200px', maxHeight: '160px', borderRadius: '8px', objectFit: 'cover', display: 'block', marginBottom: '4px' }}
                          fallbackSrc=""
                        />
                        {m.attachment_name && (
                          <div style={{ fontSize: '11px', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Paperclip size={11} /> {m.attachment_name}
                          </div>
                        )}
                      </div>
                    )}
                    {m.content}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                      {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMe && (
                      <button
                        onClick={() => handleDeleteMessage(m.id)}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0 2px' }}
                        title="Delete message and attachment"
                      >
                        <Trash2 size={11} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected File Preview Banner */}
        {attachmentFile && (
          <div style={{ padding: '6px 12px', backgroundColor: '#f1f5f9', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
              {attachmentPreview ? (
                <img src={attachmentPreview} alt="Preview" style={{ width: '28px', height: '28px', objectFit: 'cover', borderRadius: '4px' }} />
              ) : (
                <Paperclip size={16} color="#64748b" />
              )}
              <span style={{ fontSize: '12px', color: '#334155', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {attachmentFile.name} ({(attachmentFile.size / 1024).toFixed(1)} KB)
              </span>
            </div>
            <button
              type="button"
              onClick={handleRemoveAttachment}
              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={handleSend} style={styles.inputBar}>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            style={{ display: 'none' }} 
            accept="image/*, application/pdf"
          />
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-secondary"
            style={{ padding: '8px 12px', color: '#64748b' }}
            title="Attach photo or document (Supabase Storage)"
          >
            <Paperclip size={18} />
          </button>
          <input 
            type="text"
            className="form-input"
            placeholder="Type message, field location, or rate offer..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={sending} 
            className="btn btn-primary" 
            style={{ padding: '10px 16px' }}
          >
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

'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Zap } from 'lucide-react';
import { ChatMessage } from '@/types';

interface ChatContext {
  product?: string;
  purpose?: string;
  environment?: string;
  power?: string;
  industry?: string;
  [key: string]: string | undefined;
}
import { chatResponse } from '@/services/aiServices';

interface ChatTabProps {
  onAnalyze: (data: {
    product: string;
    purpose: string;
    technicalRequirements: string;
    environment: string;
    industry: string;
  }) => void;
}


import { useLanguage } from '@/context/LanguageContext';

export default function ChatTab({ onAnalyze }: ChatTabProps) {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: t('chatGreeting'),
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState<ChatContext>({});
  const [readyToAnalyze, setReadyToAnalyze] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { message, updatedContext, readyToAnalyze: rta } = await chatResponse(text, context as Record<string, string | undefined>);
      setContext(updatedContext as ChatContext);
      setReadyToAnalyze(rta);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: message,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'I encountered an error. Please try again.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleAnalyze() {
    onAnalyze({
      product: (context.product as string) || 'Product from chat',
      purpose: (context.purpose as string) || '',
      technicalRequirements: context.power ? `Power: ${context.power}` : '',
      environment: (context.environment as string) || '',
      industry: (context.industry as string) || 'General',
    });
  }

  const SUGGESTIONS = [
    'I need standards for LED street lights for a highway project.',
    'What standards apply to industrial water pumps for municipal supply?',
    'Standards for OPC cement procurement?',
    'MCB standards for government building electrical work?',
  ];

  return (
    <div className="glass-card-bright" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', height: 520 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#2563eb,#00d4ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bot size={16} color="white" />
        </div>
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>IS-SMART AI Procurement Assistant</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <div style={{ width: 6, height: 6, background: '#10b981', borderRadius: '50%' }} />
            <span style={{ fontSize: '0.7rem', color: '#10b981' }}>Online • Demo Mode</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.875rem', paddingRight: '0.25rem' }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              gap: '0.625rem',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            {msg.role === 'assistant' && (
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <Bot size={14} color="#60a5fa" />
              </div>
            )}
            <div
              style={{
                maxWidth: '75%',
                padding: '0.625rem 0.875rem',
                borderRadius: msg.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                background: msg.role === 'user' ? 'rgba(37,99,235,0.25)' : 'var(--navy-800)',
                border: `1px solid ${msg.role === 'user' ? 'rgba(59,130,246,0.35)' : 'var(--border)'}`,
                fontSize: '0.8375rem',
                color: 'var(--text-primary)',
                lineHeight: 1.6,
              }}
              dangerouslySetInnerHTML={{
                __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
              }}
            />
            {msg.role === 'user' && (
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <User size={14} color="#a78bfa" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: '0.625rem' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bot size={14} color="#60a5fa" />
            </div>
            <div style={{ padding: '0.625rem 1rem', background: 'var(--navy-800)', border: '1px solid var(--border)', borderRadius: '12px 12px 12px 4px' }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 6, height: 6, background: '#60a5fa', borderRadius: '50%',
                      animation: `bounce 1.2s ${i * 0.2}s ease-in-out infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Analyze button when ready */}
      {readyToAnalyze && (
        <div style={{ padding: '0.75rem 0', borderTop: '1px solid var(--border)', marginTop: '0.5rem' }}>
          <button id="chat-analyze-btn" className="btn-primary" onClick={handleAnalyze} style={{ width: '100%', justifyContent: 'center' }}>
            <Zap size={15} />
            Analyze Requirements — View Standards
          </button>
        </div>
      )}

      {/* Suggestions */}
      {messages.length === 1 && (
        <div style={{ padding: '0.625rem 0', borderTop: '1px solid var(--border)', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                className="btn-ghost"
                style={{ fontSize: '0.7rem', padding: '0.3rem 0.625rem' }}
                onClick={() => { setInput(s); }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', marginTop: '0.5rem' }}>
        <input
          id="chat-input"
          className="input-field"
          placeholder={t('chatPlaceholder')}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
          style={{ flex: 1 }}
        />
        <button
          className="btn-primary"
          onClick={send}
          disabled={!input.trim() || loading}
          style={{ padding: '0.6rem 0.875rem', flexShrink: 0, opacity: !input.trim() || loading ? 0.5 : 1 }}
          aria-label="Send message"
        >
          <Send size={15} />
        </button>
      </div>

      <style jsx global>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

'use client';

import { ChatMessage } from 'lib/ai/assistant';
import { useEffect, useRef, useState } from 'react';
import { ProductCard } from './product-card';

interface Message extends ChatMessage {
  id: string;
  products?: Array<{
    productId: string;
    productHandle: string;
    title: string;
    description: string;
    price: string;
    availableForSale: boolean;
    tags: string[];
  }>;
}

// Simple markdown to HTML converter for bold text
function formatMessageContent(text: string): string {
  // Convert **text** to <strong>text</strong>
  return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate session ID on mount
  useEffect(() => {
    setSessionId(`session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check initialization status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/assistant/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'status' }),
        });
        const data = await response.json();
        setIsInitialized(data.initialized);
      } catch (error) {
        console.error('Error checking status:', error);
      }
    };

    if (isOpen) {
      checkStatus();
    }
  }, [isOpen]);

  const initializeAssistant = async () => {
    setIsInitializing(true);
    try {
      const response = await fetch('/api/assistant/init');
      const data = await response.json();
      if (data.success) {
        setIsInitialized(true);
        setMessages([
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: `Hi! I'm your shopping assistant. How can I help you today?`,
          },
        ]);
      }
    } catch (error) {
      console.error('Error initializing:', error);
      setMessages([
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error while initializing. Please try again.',
        },
      ]);
    } finally {
      setIsInitializing(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Create a placeholder message for streaming
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      products: [],
    };
    setMessages(prev => [...prev, assistantMessage]);

    try {
      const response = await fetch('/api/assistant/chat-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.map(m => ({ role: m.role, content: m.content })),
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));

            if (data.type === 'token') {
              // Append token to the assistant message
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === assistantMessageId
                    ? { ...msg, content: msg.content + data.content }
                    : msg
                )
              );
            } else if (data.type === 'products') {
              // Add products to the assistant message
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === assistantMessageId
                    ? { ...msg, products: data.products }
                    : msg
                )
              );
            } else if (data.type === 'done') {
              // Update session ID
              if (data.sessionId) {
                setSessionId(data.sessionId);
              }
            } else if (data.type === 'error') {
              // Handle error
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === assistantMessageId
                    ? { ...msg, content: data.content }
                    : msg
                )
              );
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessageId
            ? { ...msg, content: 'Sorry, I encountered an error. Please try again.' }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg transition-all hover:shadow-2xl hover:scale-110 active:scale-95"
        aria-label="Open chat"
      >
        {/* Pulse animation ring when closed */}
        {!isOpen && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
        )}

        {isOpen ? (
          <svg className="h-6 w-6 relative z-10 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6 relative z-10 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 left-2 right-2 z-50 flex h-[600px] flex-col rounded-lg border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-black sm:left-auto sm:right-4 sm:h-[700px] sm:w-[500px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-200 p-4 dark:border-neutral-800">
            <h3 className="font-semibold">Shopping Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {!isInitialized && !isInitializing && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="mb-4 text-neutral-600 dark:text-neutral-400">
                  Welcome! Click below to start chatting with our AI assistant.
                </p>
                <button
                  onClick={initializeAssistant}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Start Assistant
                </button>
              </div>
            )}

            {isInitializing && (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-4 border-blue-200 dark:border-blue-900"></div>
                  <div className="absolute top-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-400"></div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    Loading product catalog...
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Preparing AI assistant
                  </p>
                </div>
              </div>
            )}

            {isInitialized && messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div
                  className={`inline-block max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100'
                  }`}
                >
                  {message.role === 'user' ? (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    <div className="text-sm whitespace-pre-wrap">
                      <span
                        dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }}
                      />
                      {/* Show cursor while streaming (empty content means still loading) */}
                      {isLoading && message.content === '' && (
                        <span className="inline-block w-1.5 h-4 ml-0.5 bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
                      )}
                      {isLoading && message.content !== '' && (
                        <span className="inline-block w-1.5 h-4 ml-0.5 bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
                      )}
                    </div>
                  )}
                </div>

                {/* Product Cards */}
                {message.products && message.products.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.products.slice(0, 3).map((product, index) => (
                      <div
                        key={product.productId}
                        className="animate-in fade-in slide-in-from-bottom-4"
                        style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
                      >
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}



            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          {isInitialized && (
            <div className="border-t border-neutral-200 p-4 dark:border-neutral-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about products..."
                  className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="group relative rounded-lg bg-blue-600 px-4 py-2 text-white transition-all hover:bg-blue-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    <svg className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}


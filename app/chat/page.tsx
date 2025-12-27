"use client";

import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import {
  FiBookOpen,
  FiCpu,
  FiMessageSquare,
  FiSearch,
  FiSend,
  FiTrash2,
} from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./chat.module.css";

interface ChatSource {
  id: string;
  title: string;
  url: string;
  snippet: string;
}

type ChatRole = "user" | "assistant";

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  sources?: ChatSource[];
}

const promptLines = [
  [
    "Summarize the Next.js article in 5 bullets.",
    "Compare Kafka vs RabbitMQ in one table.",
    "Explain Redis use cases for web apps.",
    "What makes Microservices hard to scale?",
    "Outline the core ideas in GraphQL.",
    "Give me the key takeaways on TailwindCSS.",
  ],
  [
    "Explain SSG, SSR, and ISR differences.",
    "What are the pros/cons of WebAssembly?",
    "Summarize the MongoDB article.",
    "How does Auth0 simplify auth?",
    "Explain Kafka microservices patterns.",
    "What are the key themes in Agentic AI?",
  ],
];

const thinkingStates = [
  { label: "Scanning article vectors", icon: FiSearch },
  { label: "Reading sources", icon: FiBookOpen },
  { label: "Drafting response", icon: FiCpu },
];

const STORAGE_KEY = "devverse-chat-history";

const getInitialMessages = (): ChatMessage[] => [
  {
    id: "assistant-intro",
    role: "assistant",
    content: "Ask about any DevVerse article and I will answer with citations.",
  },
];

function stripSourcesSection(content: string) {
  return content.replace(/\n?Sources:[\s\S]*$/i, "").trim();
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(getInitialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingIndex, setThinkingIndex] = useState(0);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const skipNextSaveRef = useRef(true);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return;
      }
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return;
      }
      const hydrated = parsed
        .filter(
          (item) =>
            item &&
            (item.role === "user" || item.role === "assistant") &&
            typeof item.content === "string",
        )
        .map((item) => ({
          id: typeof item.id === "string" ? item.id : `msg-${Date.now()}`,
          role: item.role,
          content: item.content,
          sources: Array.isArray(item.sources) ? item.sources : undefined,
        })) as ChatMessage[];

      if (hydrated.length > 0) {
        setMessages(hydrated);
      }
    } catch (error) {
      console.warn("Failed to load chat history:", error);
    }
  }, []);

  useEffect(() => {
    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.warn("Failed to store chat history:", error);
    }
  }, [messages]);

  useEffect(() => {
    if (!isLoading) {
      setThinkingIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setThinkingIndex((prev) => (prev + 1) % thinkingStates.length);
    }, 1400);
    return () => clearInterval(interval);
  }, [isLoading]);

  const sendMessage = async (override?: string) => {
    const content = (override ?? input).trim();
    if (!content || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setIsLoading(true);

    try {
      const history = messages.slice(-8).map((message) => ({
        role: message.role,
        content:
          message.role === "assistant"
            ? stripSourcesSection(message.content)
            : message.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, history }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Request failed.");
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data?.answer || "I do not have a response right now.",
        sources: Array.isArray(data?.sources) ? data.sources : [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      const assistantMessage: ChatMessage = {
        id: `assistant-error-${Date.now()}`,
        role: "assistant",
        content:
          error?.message ||
          "Something went wrong while fetching an answer. Please try again.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const handleInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const target = event.currentTarget;
    target.style.height = "auto";
    target.style.height = `${Math.min(target.scrollHeight, 160)}px`;
    setInput(target.value);
  };

  const handleCitationClick = (messageId: string, index: number) => {
    const element = document.getElementById(`source-${messageId}-${index + 1}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const formatSnippet = (snippet: string) => {
    return snippet
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/^\s{0,3}#{1,6}\s+/gm, "")
      .replace(/^\s{0,3}>\s?/gm, "")
      .replace(/^\s{0,3}[-*+]\s+/gm, "")
      .replace(/^\s{0,3}\d+\.\s+/gm, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const handleClearChat = () => {
    setMessages(getInitialMessages());
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn("Failed to clear chat history:", error);
    }
  };

  const linkifyCitations = (content: string, messageId: string) =>
    content.replace(
      /\[(\d+)\]/g,
      (_match, number) => `[${number}](#source-${messageId}-${number})`,
    );

  const ThinkingIcon = thinkingStates[thinkingIndex].icon;

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <section className={styles.hero}>
          <h1 className={styles.title}>DevVerse RAG Chat</h1>
          <p className={styles.subtitle}>
            Ask questions about DevVerse articles. Responses include citations
            so you can jump straight to the sources. Powered by
            Retrieval-Augmented Generation (RAG) and Pinecone vector database.
          </p>
        </section>

        <section className={styles.shell}>
          <header className={styles.header}>
            <div className={styles.headerTitle}>
              <FiMessageSquare /> Research assistant
            </div>
            <div className={styles.headerActions}>
              <div className={styles.status}>
                {isLoading ? (
                  <span className={styles.statusActive}>
                    <span className={styles.statusDot} />
                    {thinkingStates[thinkingIndex].label}
                  </span>
                ) : (
                  "Ready with citations"
                )}
              </div>
              <button
                type="button"
                className={styles.clearButton}
                onClick={handleClearChat}
                disabled={messages.length <= 1}
                aria-label="Clear chat history"
              >
                <FiTrash2 />
                Clear
              </button>
            </div>
          </header>

          <div className={styles.promptScroller}>
            {promptLines.map((line, index) => (
              <div
                key={`prompt-line-${index}`}
                className={`${styles.marquee} ${
                  index % 2 === 0 ? styles.marqueeLeft : styles.marqueeRight
                }`}
              >
                <div className={styles.marqueeTrack}>
                  {line.concat(line).map((prompt, promptIndex) => (
                    <button
                      key={`${prompt}-${promptIndex}`}
                      type="button"
                      className={styles.promptPill}
                      onClick={() => sendMessage(prompt)}
                      disabled={isLoading}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.messages}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.messageRow} ${
                  message.role === "user" ? styles.userRow : styles.assistantRow
                }`}
              >
                <div
                  className={`${styles.bubble} ${
                    message.role === "user"
                      ? styles.userBubble
                      : styles.assistantBubble
                  }`}
                >
                  {message.role === "assistant" ? (
                    <ReactMarkdown
                      className={styles.markdown}
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({ href, children }) => {
                          if (href?.startsWith("#source-")) {
                            const match = href.match(/#source-[^-]+-(\d+)/);
                            const index = match ? Number(match[1]) - 1 : 0;
                            const label = Array.isArray(children)
                              ? children.join("")
                              : children;
                            return (
                              <button
                                type="button"
                                className={styles.citationLink}
                                onClick={() =>
                                  handleCitationClick(message.id, index)
                                }
                              >
                                [{label}]
                              </button>
                            );
                          }
                          return (
                            <a href={href} target="_blank" rel="noreferrer">
                              {children}
                            </a>
                          );
                        },
                      }}
                    >
                      {linkifyCitations(
                        message.sources && message.sources.length > 0
                          ? stripSourcesSection(message.content)
                          : message.content,
                        message.id,
                      )}
                    </ReactMarkdown>
                  ) : (
                    message.content
                  )}
                  {message.sources && message.sources.length > 0 && (
                    <div className={styles.sources}>
                      <div className={styles.sourcesLabel}>
                        Sources ({message.sources.length})
                      </div>
                      <ul className={styles.sourcesList}>
                        {message.sources.map((source, index) => (
                          <li
                            key={`${message.id}-${source.id}-${index}`}
                            className={styles.sourceItem}
                            id={`source-${message.id}-${index + 1}`}
                          >
                            <span className={styles.sourceBadge}>
                              {index + 1}
                            </span>
                            <div className={styles.sourceContent}>
                              <a
                                className={styles.sourceLink}
                                href={source.url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {source.title}
                              </a>
                              {source.url && (
                                <span className={styles.sourceUrl}>
                                  {source.url}
                                </span>
                              )}
                              {source.snippet && (
                                <span className={styles.sourceSnippet}>
                                  {formatSnippet(source.snippet)}
                                </span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.messageRow} ${styles.assistantRow}`}>
                <div
                  className={`${styles.bubble} ${styles.assistantBubble} ${styles.thinkingBubble}`}
                >
                  <div className={styles.thinkingHeader}>
                    <ThinkingIcon className={styles.thinkingIcon} />
                    <span>{thinkingStates[thinkingIndex].label}</span>
                  </div>
                  <div className={styles.thinkingDots}>
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className={styles.thinkingBar} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className={styles.composer}>
            <div className={styles.inputRow}>
              <textarea
                className={styles.textarea}
                placeholder="Ask a question about the articles..."
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                aria-label="Message input"
                autoFocus
                ref={textareaRef}
              />
              <button
                className={styles.sendButton}
                type="button"
                onClick={() => sendMessage()}
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
              >
                <FiSend /> Send
              </button>
            </div>
            <div className={styles.footerNote}>
              Answers are grounded in the DevVerse articles and include
              citations.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef, useState } from 'react';
import { ArrowUp, Plus, Sparkles, Square, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Markdown } from '@/components/ai-chat/markdown';
import { cn } from '@/lib/utils';

const SUGGESTIONS = [
  'Draft a volunteer schedule for Sunday service',
  'Write an invitation email for new members',
  'Suggest a setlist for a worship event',
  'Ideas to boost volunteer engagement',
];

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, stop, setMessages } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isStreaming = status === 'submitted' || status === 'streaming';
  const hasMessages = messages.length > 0;

  // Keep the latest message in view as tokens stream in.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  function submit() {
    const text = input.trim();
    if (!text || isStreaming) return;
    sendMessage({ text });
    setInput('');
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="flex h-screen flex-col bg-linear-to-br from-background via-background to-muted/20">
      <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b border-border/40 bg-background/80 px-4 backdrop-blur-xl sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight">NHC Assistant</p>
            <p className="text-xs text-muted-foreground">Your event planning copilot</p>
          </div>
        </div>
        {hasMessages && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setMessages([]); setInput(''); }}
            className="gap-1.5 text-muted-foreground"
          >
            <Plus className="h-4 w-4" />
            New chat
          </Button>
        )}
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6">
          {!hasMessages ? (
            <EmptyState
              onPick={(t) => { setInput(t); textareaRef.current?.focus(); }}
            />
          ) : (
            messages.map((message) => (
              <Message
                key={message.id}
                role={message.role}
                text={message.parts.map((p) => (p.type === 'text' ? p.text : '')).join('')}
              />
            ))
          )}
          {status === 'submitted' && <ThinkingBubble />}
        </div>
      </div>

      <div className="shrink-0 border-t border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-3xl px-4 py-4 sm:px-6">
          <form
            onSubmit={(e) => { e.preventDefault(); submit(); }}
            className="relative flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-lg shadow-black/5 transition-colors focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20"
          >
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              onKeyDown={onKeyDown}
              rows={1}
              placeholder="Ask anything about your events, volunteers, or setlists…"
              className="max-h-40 min-h-0 flex-1 resize-none border-0 bg-transparent px-2 py-1.5 shadow-none focus-visible:ring-0 dark:bg-transparent"
            />
            {isStreaming ? (
              <Button
                type="button"
                size="icon"
                variant="secondary"
                onClick={stop}
                className="size-9 shrink-0 rounded-xl"
              >
                <Square className="h-4 w-4 fill-current" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim()}
                className="size-9 shrink-0 rounded-xl shadow-md shadow-primary/20"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            )}
          </form>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            NHC Assistant can make mistakes. Verify important details.
          </p>
        </div>
      </div>
    </div>
  );
}

function Message({ role, text }: { role: string; text: string }) {
  const isUser = role === 'user';
  return (
    <div
      className={cn(
        'flex w-full items-start gap-3 duration-300 animate-in fade-in slide-in-from-bottom-2',
        isUser && 'flex-row-reverse',
      )}
    >
      <div
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-xl',
          isUser
            ? 'bg-muted text-muted-foreground'
            : 'bg-linear-to-br from-primary to-primary/80 text-primary-foreground shadow-sm shadow-primary/20',
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
      </div>
      <div
        className={cn(
          'min-w-0 max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'rounded-tr-md bg-primary text-primary-foreground whitespace-pre-wrap'
            : 'rounded-tl-md bg-muted text-foreground',
        )}
      >
        {isUser ? text : <Markdown>{text}</Markdown>}
      </div>
    </div>
  );
}

function ThinkingBubble() {
  return (
    <div className="flex items-start gap-3 duration-300 animate-in fade-in">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary/80 text-primary-foreground shadow-sm shadow-primary/20">
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-md bg-muted px-4 py-3.5">
        <span className="size-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.3s]" />
        <span className="size-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.15s]" />
        <span className="size-2 animate-bounce rounded-full bg-muted-foreground/50" />
      </div>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-12 text-center duration-500 animate-in fade-in">
      <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-primary/80 shadow-xl shadow-primary/25">
        <Sparkles className="size-7 text-primary-foreground" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">How can I help you today?</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Ask me anything about planning events, coordinating volunteers, or building
        setlists for your organization.
      </p>
      <div className="mt-8 grid w-full max-w-xl grid-cols-1 gap-2.5 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onPick(s)}
            className="group rounded-xl border border-border bg-card/50 px-4 py-3 text-left text-sm text-muted-foreground transition-all hover:border-primary/40 hover:bg-card hover:text-foreground hover:shadow-md hover:shadow-primary/5"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

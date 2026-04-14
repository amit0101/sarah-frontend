/** Animated typing indicator — three bouncing dots. */

export function TypingIndicator() {
  return (
    <div className="sarah-typing">
      <div className="sarah-typing-dots">
        <span /><span /><span />
      </div>
      <span className="sarah-typing-label">Sarah is typing…</span>
    </div>
  );
}

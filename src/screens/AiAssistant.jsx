import { useEffect, useRef } from 'react';
import { useHub } from '../store.jsx';
import { Hoverable } from '../components/ui.jsx';

const PROVIDERS = [
  { key: 'claude', label: 'Claude (built-in)' },
  { key: 'perplexity', label: 'Perplexity' },
];

const QUICK_PROMPTS = [
  'Which July post reached the most people?',
  'When should we post on Instagram?',
  'How many posts per week should we do?',
  'Why did Facebook engagement drop?',
];

export default function AiAssistant() {
  const { state, setState, sendAi } = useHub();
  const { aiMsgs, aiBusy, aiInput, provider } = state;
  const scrollRef = useRef(null);

  const empty = aiMsgs.length === 0 && !aiBusy;
  const providerNote =
    provider === 'perplexity'
      ? 'Perplexity needs an API key — add it under Connections. Using the built-in Claude model for this demo.'
      : '';

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [aiMsgs, aiBusy]);

  return (
    <section style={{ maxWidth: 880 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: '-.01em' }}>AI assistant</h1>
          <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#808080' }}>
            Ask about your posts and analytics, or get help refining content
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {PROVIDERS.map((pv) => {
            const active = provider === pv.key;
            return (
              <div
                key={pv.key}
                onClick={() => setState({ provider: pv.key })}
                style={{
                  padding: '8px 14px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: '1px solid ' + (active ? '#14171F' : '#E4E7EE'),
                  background: active ? '#14171F' : '#fff',
                  color: active ? '#fff' : '#555A66',
                }}
              >
                ✦ {pv.label}
              </div>
            );
          })}
        </div>
      </div>

      {providerNote ? (
        <div
          style={{
            marginBottom: 12,
            padding: '10px 14px',
            borderRadius: 10,
            background: 'rgba(16,68,255,.06)',
            border: '1px solid rgba(16,68,255,.2)',
            fontSize: 11.5,
            fontWeight: 600,
            color: '#1044FF',
          }}
        >
          {providerNote}
        </div>
      ) : null}

      <div
        style={{
          background: '#fff',
          border: '1px solid #E4E7EE',
          borderRadius: 14,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 480,
        }}
      >
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            overflowY: 'auto',
            maxHeight: 520,
          }}
        >
          {empty ? (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                color: '#808080',
                textAlign: 'center',
                padding: '40px 20px',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'rgba(16,68,255,.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  color: '#1044FF',
                }}
              >
                ✦
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: '#14171F' }}>
                Ask me anything about SolitAir&apos;s social performance
              </div>
              <div style={{ fontSize: 11.5, maxWidth: 380, lineHeight: 1.6 }}>
                I can search your posts, explain metrics, suggest posting times and cadence, and refine captions. Try a quick
                prompt below.
              </div>
            </div>
          ) : null}

          {aiMsgs.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div
                style={{
                  maxWidth: '78%',
                  padding: '12px 15px',
                  borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: m.role === 'user' ? '#1044FF' : '#F0F2F6',
                  color: m.role === 'user' ? '#fff' : '#14171F',
                  fontSize: 12.5,
                  lineHeight: 1.65,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {m.text}
              </div>
            </div>
          ))}

          {aiBusy ? (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div
                style={{
                  padding: '12px 15px',
                  borderRadius: '14px 14px 14px 4px',
                  background: '#F0F2F6',
                  fontSize: 12.5,
                  color: '#808080',
                  fontWeight: 600,
                }}
              >
                Thinking…
              </div>
            </div>
          ) : null}
        </div>

        <div
          style={{
            padding: '12px 16px 14px',
            borderTop: '1px solid #F0F2F6',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {QUICK_PROMPTS.map((q) => (
              <Hoverable
                key={q}
                onClick={() => sendAi(q)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 16,
                  border: '1px solid #E4E7EE',
                  background: '#F8F9FB',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#555A66',
                  cursor: 'pointer',
                }}
                hoverStyle={{ borderColor: '#1044FF', color: '#1044FF' }}
              >
                {q}
              </Hoverable>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={aiInput}
              disabled={aiBusy}
              onChange={(e) => setState({ aiInput: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendAi();
              }}
              placeholder="e.g. Which July post reached the most people?"
              style={{
                flex: 1,
                padding: '11px 14px',
                border: '1px solid #E4E7EE',
                borderRadius: 10,
                fontSize: 12.5,
                color: '#14171F',
              }}
            />
            <Hoverable
              as="button"
              onClick={() => sendAi()}
              style={{
                padding: '11px 20px',
                border: 'none',
                borderRadius: 10,
                background: '#1044FF',
                color: '#fff',
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer',
              }}
              hoverStyle={{ background: '#0B33CC' }}
            >
              Send
            </Hoverable>
          </div>
        </div>
      </div>
    </section>
  );
}

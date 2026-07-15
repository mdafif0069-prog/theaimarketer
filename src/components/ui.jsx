import { useState } from 'react';

// Reproduces the prototype's `style-hover` attribute: merges `hoverStyle` over
// `style` while the pointer is over the element.
export function Hoverable({ as: Comp = 'div', style, hoverStyle, ...props }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Comp
      style={{ ...style, ...(hovered ? hoverStyle : null) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    />
  );
}

// The toggle switch used across the composer and Team settings.
export function Toggle({ on, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 34,
        height: 20,
        borderRadius: 12,
        background: on ? '#00A83A' : '#D4D8E0',
        position: 'relative',
        cursor: 'pointer',
        flex: 'none',
        transition: 'background .15s',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: on ? 16 : 2,
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 3px rgba(14,18,32,.3)',
          transition: 'left .15s',
        }}
      />
    </div>
  );
}

// Section heading used at the top of every screen.
export function ScreenHeader({ title, subtitle, right }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: right ? 18 : 18,
        flexWrap: 'wrap',
      }}
    >
      <div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: '-.01em' }}>{title}</h1>
        {subtitle ? (
          <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#808080' }}>{subtitle}</p>
        ) : null}
      </div>
      {right || null}
    </div>
  );
}

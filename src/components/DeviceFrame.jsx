import React from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

// Renders the app inside a phone frame on larger screens, and full-bleed on
// phones. An animated aurora sits behind the frame on desktop.
export function DeviceFrame({ children }) {
  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-[#04060c]">
      {/* Ambient aurora (desktop) */}
      <div className="pointer-events-none absolute inset-0 hidden sm:block" aria-hidden>
        <div className="absolute left-1/2 top-1/4 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-emerald2/20 blur-[120px] animate-aurora" />
        <div className="absolute right-1/4 top-1/2 h-[32rem] w-[32rem] rounded-full bg-violet2/20 blur-[120px] animate-aurora" style={{ animationDelay: '-6s' }} />
        <div className="absolute bottom-0 left-1/3 h-[28rem] w-[28rem] rounded-full bg-gold2/15 blur-[120px] animate-aurora" style={{ animationDelay: '-12s' }} />
      </div>

      <div className="relative flex min-h-[100dvh] items-center justify-center sm:py-8">
        <div
          className="relative flex h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-ink
            sm:h-[min(920px,92vh)] sm:rounded-[2.75rem] sm:border sm:border-white/10 sm:shadow-device"
        >
          {/* Status bar */}
          <div className="z-30 flex h-9 shrink-0 items-center justify-between px-7 pt-1 text-xs font-semibold text-cloud">
            <span>9:41</span>
            <span className="flex items-center gap-1.5">
              <Signal className="h-3.5 w-3.5" />
              <Wifi className="h-3.5 w-3.5" />
              <BatteryMedium className="h-4 w-4" />
            </span>
          </div>

          {/* App area */}
          <div className="relative flex flex-1 flex-col overflow-hidden">{children}</div>
        </div>
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { Eye, Copy, Check, ExternalLink, X, RotateCcw, Code2, Crown, Clover, MapPin, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PROFILE_DATA } from './data';
import { RainOverlay } from './components/RainOverlay';
import { MusicPlayer } from './components/MusicPlayer';
import { EnterScreen } from './components/EnterScreen';
import { TiltingCard } from './components/TiltingCard';

export default function App() {
  const [isEntered, setIsEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [viewsCount, setViewsCount] = useState(PROFILE_DATA.views);
  const [activeViewers, setActiveViewers] = useState(1);
  const [isLiveUpdating, setIsLiveUpdating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasRecordedViewRef = useRef(false);

  // Real-time View Count Tracking & SSE Synchronization
  useEffect(() => {
    let isMounted = true;

    // 1. Increment total views on real page visit (only once per mount, safe against StrictMode double execution)
    if (!hasRecordedViewRef.current) {
      hasRecordedViewRef.current = true;
      fetch('/api/views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
        .then((res) => res.json())
        .then((data) => {
          if (isMounted && data && typeof data.views === 'number') {
            setViewsCount(data.views);
            if (data.activeViewers) setActiveViewers(data.activeViewers);
          }
        })
        .catch((err) => {
          console.warn('Initial view increment error:', err);
        });
    } else {
      // Just fetch current views without incrementing
      fetch('/api/views')
        .then((res) => res.json())
        .then((data) => {
          if (isMounted && data && typeof data.views === 'number') {
            setViewsCount(data.views);
            if (data.activeViewers) setActiveViewers(data.activeViewers);
          }
        })
        .catch(() => {});
    }

    // 2. Connect to real-time Server-Sent Events stream
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/views/stream');

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && typeof data.views === 'number') {
            setViewsCount((prev) => {
              if (prev !== data.views) {
                setIsLiveUpdating(true);
                setTimeout(() => setIsLiveUpdating(false), 1200);
              }
              return data.views;
            });
            if (typeof data.activeViewers === 'number') {
              setActiveViewers(data.activeViewers);
            }
          }
        } catch {
          // Ignore keepalive or malformed data
        }
      };

      eventSource.onerror = () => {
        // Close on error, polling fallback can handle it
        eventSource?.close();
      };
    } catch (e) {
      console.warn('SSE connection failed, falling back to polling', e);
    }

    // 3. Fallback periodic polling every 10 seconds to keep in sync
    const pollInterval = setInterval(() => {
      fetch('/api/views')
        .then((res) => res.json())
        .then((data) => {
          if (isMounted && data?.views) {
            setViewsCount(data.views);
            if (data.activeViewers) setActiveViewers(data.activeViewers);
          }
        })
        .catch(() => {});
    }, 10000);

    return () => {
      isMounted = false;
      if (eventSource) {
        eventSource.close();
      }
      clearInterval(pollInterval);
    };
  }, []);

  const handleEnter = () => {
    setIsEntered(true);

    // Direct synchronous call on user gesture ensures autoplay policy approval
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn('Audio playback error on enter:', err);
        });
    }
  };

  const handleExit = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsEntered(false);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn('Audio playback error on toggle:', err);
        });
    }
  };

  const handleCopyDiscord = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(PROFILE_DATA.discord.username);
    setCopiedText('discord');
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-[#d8d8d8] flex flex-col items-center justify-center px-4 py-12 sm:px-8 sm:py-16 overflow-x-hidden selection:bg-white/20 selection:text-white">
      {/* Click Anywhere To Enter / Fade Out Transition */}
      <EnterScreen isEntered={isEntered} onEnter={handleEnter} />

      {/* Background Animated GIF */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <img
          src={PROFILE_DATA.backgroundUrl}
          alt="background animation"
          className="h-full w-full object-cover object-center"
        />
        {/* Subtle Vignette overlay to keep text readable without stopping or muddying the GIF */}
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-radial-[ellipse_at_center,transparent_20%,rgba(0,0,0,0.8)_100%]" />
      </div>

      {/* Rain Effect Overlay */}
      <RainOverlay />

      {/* Top Floating Exit / Re-enter Control Bar when entered */}
      <AnimatePresence>
        {isEntered && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="fixed top-3.5 right-3.5 z-40 flex items-center gap-2"
          >
            <button
              type="button"
              id="exit-screen-btn"
              onClick={handleExit}
              title="Close Profile / Exit"
              className="group flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-xs text-white/60 backdrop-blur-md transition-all hover:border-white/25 hover:bg-black/80 hover:text-white cursor-pointer"
            >
              <X className="size-3.5 transition-transform group-hover:rotate-90" />
              <span>Close / Exit</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Profile Card with Fluid 3D Tilt, Entrance & Fade-out Animation */}
      <motion.main
        id="profile-container"
        initial={{ opacity: 0, scale: 0.88, y: 35, filter: 'blur(12px)' }}
        animate={{
          opacity: isEntered ? 1 : 0,
          scale: isEntered ? 1 : 0.88,
          y: isEntered ? 0 : 35,
          filter: isEntered ? 'blur(0px)' : 'blur(12px)',
          pointerEvents: isEntered ? 'auto' : 'none',
        }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 24,
          mass: 0.9,
        }}
        className="relative z-10 w-full max-w-[340px] sm:max-w-[360px] my-auto"
      >
        {/* Interactive 3D Tilting Card Wrapper */}
        <TiltingCard maxTilt={14}>
          {/* Profile Card Body */}
          <div className="relative rounded-[26px] border border-white/[0.08] bg-[#111111]/85 p-4 pt-9 sm:p-4.5 sm:pt-9.5 shadow-[0_25px_60px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.09)] backdrop-blur-2xl">
            {/* Floating Avatar with Spring Animation */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={isEntered ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.15 }}
              className="absolute -top-9 left-1/2 -translate-x-1/2"
              style={{ transform: 'translateZ(30px)' }}
            >
              <div className="relative group cursor-pointer">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-b from-white/25 to-transparent opacity-70 blur-xs transition-opacity group-hover:opacity-100" />
                <img
                  src={PROFILE_DATA.avatarUrl}
                  alt={PROFILE_DATA.username}
                  className="relative h-[72px] w-[72px] rounded-full border-2 border-white/20 bg-[#161616] object-cover shadow-[0_8px_24px_rgba(0,0,0,0.85)] transition-transform duration-500 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>

            {/* User Info Header with Staggered Entrance */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-2.5 flex flex-col items-center text-center"
              style={{ transform: 'translateZ(20px)' }}
            >
              {/* Username */}
              <div className="relative group flex items-center justify-center cursor-default">
                <h1 className="text-lg font-bold tracking-tight text-white transition-colors group-hover:text-white">
                  {PROFILE_DATA.username}
                </h1>
              </div>

              {/* Badges: Dev icon, Crown icon, and Clover icon (Clean white, icon-only) */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={isEntered ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-2 flex items-center justify-center gap-1.5"
              >
                {/* Dev Icon Badge */}
                <div
                  id="badge-dev"
                  title="Developer"
                  className="flex size-6 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-[0_0_8px_rgba(255,255,255,0.1),inset_0_1px_1px_rgba(255,255,255,0.2)] backdrop-blur-md transition-transform hover:scale-110 cursor-default select-none"
                >
                  <Code2 className="size-3 text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.7)]" />
                </div>

                {/* Crown Icon Badge */}
                <div
                  id="badge-crown"
                  title="Crown"
                  className="flex size-6 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-[0_0_8px_rgba(255,255,255,0.1),inset_0_1px_1px_rgba(255,255,255,0.2)] backdrop-blur-md transition-transform hover:scale-110 cursor-default select-none"
                >
                  <Crown className="size-3 text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.7)]" />
                </div>

                {/* Clover Icon Badge */}
                <div
                  id="badge-clover"
                  title="Clover"
                  className="flex size-6 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-[0_0_8px_rgba(255,255,255,0.1),inset_0_1px_1px_rgba(255,255,255,0.2)] backdrop-blur-md transition-transform hover:scale-110 cursor-default select-none"
                >
                  <Clover className="size-3 text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.7)]" />
                </div>
              </motion.div>

              {/* Bio without background on (Closed) */}
              <div className="mt-2.5 text-xs sm:text-[13px] text-[#d8d8d8]/85 font-normal tracking-wide leading-relaxed">
                <div className="text-white/60 font-mono tracking-widest text-[11px] mb-0.5">
                  ⊹ ࣪ ˖ ໒꒱
                </div>
                <div className="text-[#e4e4e7]">งาน frontend & backend, full-stack</div>
                <div className="mt-0.5 flex items-center justify-center gap-1.5 flex-wrap">
                  <span className="text-[#d8d8d8]/85">เริ่มต้น $1 DM kub</span>
                  <span className="text-white/40 font-mono text-[11px]">
                    (Closed)
                  </span>
                </div>
              </div>

              {/* Current Location */}
              {PROFILE_DATA.location && (
                <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-white/50 font-mono tracking-wider">
                  <MapPin className="size-2.5 text-white/60 animate-pulse" />
                  <span>{PROFILE_DATA.location}</span>
                </div>
              )}
            </motion.div>

            {/* Interactive Tactile Buttons and Widgets */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mt-4 space-y-2"
              style={{ transform: 'translateZ(15px)' }}
            >
              {/* 1. Discord Button */}
              <motion.div
                whileHover={{ scale: 1.012, y: -1 }}
                whileTap={{ scale: 0.988 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="group relative"
              >
                <a
                  id="discord-btn"
                  href={PROFILE_DATA.discord.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-slot="card"
                  className="relative border border-white/[0.03] from-[#1a1a1a] to-[#131313] bg-gradient-to-br shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_1px_3px_rgba(0,0,0,0.3),_inset_0_-1px_1px_rgba(0,0,0,0.2)] transition-all duration-500 before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-gradient-to-b before:from-white/[0.02] before:to-transparent before:opacity-0 before:transition-opacity after:absolute after:inset-0 after:z-[-1] after:rounded-2xl after:bg-gradient-to-t after:from-black/30 after:to-transparent flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 hover:border-white/10 hover:before:opacity-100 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),_0_6px_20px_rgba(0,0,0,0.6)] cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-[13px] font-medium text-white/90">Discord</span>
                    <span className="text-[11px] text-white/40">(@{PROFILE_DATA.discord.username})</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      title="Copy Discord Tag"
                      onClick={handleCopyDiscord}
                      className="p-1 rounded text-white/40 hover:text-white/80 transition-colors cursor-pointer"
                    >
                      {copiedText === 'discord' ? (
                        <Check className="size-3 text-emerald-400" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                    </button>

                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      role="img"
                      viewBox="0 0 24 24"
                      className="text-primary-300 ml-1 inline size-3.5 drop-shadow-[0_0_6px_rgba(129,140,248,0.5)]"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                    </svg>
                  </div>
                </a>
              </motion.div>

              {/* 2. Roblox Button */}
              <motion.div
                whileHover={{ scale: 1.012, y: -1 }}
                whileTap={{ scale: 0.988 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="group relative"
              >
                <a
                  id="roblox-btn"
                  href={PROFILE_DATA.roblox.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-slot="card"
                  className="relative border border-white/[0.03] from-[#1a1a1a] to-[#131313] bg-gradient-to-br shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_1px_3px_rgba(0,0,0,0.3),_inset_0_-1px_1px_rgba(0,0,0,0.2)] transition-all duration-500 before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-gradient-to-b before:from-white/[0.02] before:to-transparent before:opacity-0 before:transition-opacity after:absolute after:inset-0 after:z-[-1] after:rounded-2xl after:bg-gradient-to-t after:from-black/30 after:to-transparent flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 hover:border-white/10 hover:before:opacity-100 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),_0_6px_20px_rgba(0,0,0,0.6)] cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-[13px] font-medium text-white/90">Roblox</span>
                    <span className="text-[11px] text-white/40">
                      ({PROFILE_DATA.roblox.displayName} / @{PROFILE_DATA.roblox.username})
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <ExternalLink className="size-3 text-white/30 group-hover:text-white/70 transition-colors" />
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 24 24"
                      className="text-white/80 ml-0.5 inline size-3.5"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M18.926 23.998L0 18.892 5.075.002 24 5.108l-5.074 18.89zM15.348 10.09l-5.28-1.415-1.414 5.28 5.28 1.414 1.414-5.279z" />
                    </svg>
                  </div>
                </a>
              </motion.div>

              {/* 3. iOS Certificates Store Button */}
              {PROFILE_DATA.iosCert && (
                <motion.div
                  whileHover={{ scale: 1.012, y: -1 }}
                  whileTap={{ scale: 0.988 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="group relative"
                >
                  <a
                    id="ios-cert-btn"
                    href={PROFILE_DATA.iosCert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-slot="card"
                    className="relative border border-white/[0.03] from-[#1a1a1a] to-[#131313] bg-gradient-to-br shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_1px_3px_rgba(0,0,0,0.3),_inset_0_-1px_1px_rgba(0,0,0,0.2)] transition-all duration-500 before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-gradient-to-b before:from-white/[0.02] before:to-transparent before:opacity-0 before:transition-opacity after:absolute after:inset-0 after:z-[-1] after:rounded-2xl after:bg-gradient-to-t after:from-black/30 after:to-transparent flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 hover:border-white/10 hover:before:opacity-100 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),_0_6px_20px_rgba(0,0,0,0.6)] cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-[13px] font-medium text-white/90">iOS Certificates</span>
                      <span className="rounded-md bg-white/[0.06] border border-white/10 px-1.5 py-0.5 text-[9px] font-mono text-zinc-300 font-semibold shadow-xs">
                        From $2
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-white/40 hidden sm:inline">ร้านขาย Cert</span>
                      <ExternalLink className="size-3 text-white/30 group-hover:text-white/70 transition-colors" />
                      <svg
                        className="text-white/80 ml-0.5 inline size-3.5 fill-current"
                        viewBox="0 0 170 170"
                      >
                        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.69-7.85-11.96-14.42-7.23-11.19-12.82-24.15-16.78-38.86-3.95-14.71-5.93-28.43-5.93-41.16 0-14.99 3.65-27.42 10.95-37.3 7.3-9.87 16.63-14.93 28.01-15.17 4.79 0 10.12 1.37 15.99 4.1 5.87 2.74 9.69 4.17 11.45 4.31 1.76-.14 5.66-1.57 11.7-4.31 6.04-2.73 11.22-3.99 15.53-3.78 12.39.73 22.37 5.34 29.93 13.82-10.85 6.64-16.14 15.82-15.86 27.54.28 9.53 4.07 17.51 11.36 23.94 7.29 6.43 15.82 10.01 25.59 10.74-2.22 6.77-5.06 14.15-8.52 22.13zm-27.8-106.91c0 6.64-2.45 13.01-7.36 18.11-4.91 5.1-10.92 8.28-18.04 7.55-.14-1.04-.21-1.98-.21-2.82 0-6.64 2.58-13.06 7.74-18.26 5.16-5.2 11.35-8.31 18.57-7.33.14.95.21 1.87.21 2.75z" />
                      </svg>
                    </div>
                  </a>
                </motion.div>
              )}

              {/* 3. Music Player with Enhanced Visualizer, Vinyl Disc & Audio Sync */}
              <MusicPlayer
                track={PROFILE_DATA.music}
                isPlaying={isPlaying}
                onTogglePlay={togglePlay}
                audioRef={audioRef}
              />
            </motion.div>

            {/* Views Counter Footer & Re-enter info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isEntered ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4 flex items-center justify-between text-xs text-white/35 font-mono px-1"
              style={{ transform: 'translateZ(10px)' }}
            >
              <div
                id="viewers-count-container"
                className="flex items-center gap-1.5 transition-colors"
                title={`${viewsCount.toLocaleString()} visits`}
              >
                <Eye className={`size-3.5 ${isLiveUpdating ? 'text-white scale-110' : 'text-white/40'} transition-all duration-300`} />
                <motion.span
                  key={viewsCount}
                  initial={{ opacity: 0.7, y: -2 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`transition-colors duration-300 ${isLiveUpdating ? 'text-white font-semibold' : 'text-white/40'}`}
                >
                  {viewsCount.toLocaleString()} views
                </motion.span>
              </div>

              <button
                type="button"
                id="exit-profile-btn"
                onClick={handleExit}
                className="flex items-center gap-1 text-[11px] text-white/40 hover:text-white/70 transition-colors cursor-pointer"
              >
                <RotateCcw className="size-3" />
                <span>ออกหน้าโปรไฟล์</span>
              </button>
            </motion.div>
          </div>
        </TiltingCard>
      </motion.main>
    </div>
  );
}

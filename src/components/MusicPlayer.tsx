import { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';
import { Track } from '../types';

interface MusicPlayerProps {
  track: Track;
  isPlaying: boolean;
  onTogglePlay: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

export function MusicPlayer({ track, isPlaying, onTogglePlay, audioRef }: MusicPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(288);
  const [isMuted, setIsMuted] = useState(false);
  const [audioFreqs, setAudioFreqs] = useState<number[]>([35, 60, 85, 45, 70, 30, 80]);

  // Audio equalizer wave animation when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setAudioFreqs([
        Math.floor(Math.random() * 55 + 20),
        Math.floor(Math.random() * 65 + 25),
        Math.floor(Math.random() * 75 + 20),
        Math.floor(Math.random() * 85 + 15),
        Math.floor(Math.random() * 70 + 25),
        Math.floor(Math.random() * 60 + 20),
        Math.floor(Math.random() * 50 + 25),
      ]);
    }, 130);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const ratio = Math.max(0, Math.min(1, clickX / width));
    const targetTime = ratio * (duration || 288);
    audioRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = Math.min(100, (currentTime / (duration || 288)) * 100);

  return (
    <motion.div
      id="music-player-card"
      data-slot="card"
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="relative border border-white/[0.06] from-[#18181a] to-[#101012] bg-gradient-to-br shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),_0_8px_20px_rgba(0,0,0,0.5)] transition-all duration-500 flex flex-col w-full rounded-2xl p-3.5 overflow-hidden group"
    >
      <audio
        ref={audioRef}
        src={track.previewUrl}
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (audioRef.current?.duration) {
            setDuration(audioRef.current.duration);
          }
        }}
      />

      {/* Ambient ethereal halo glow when playing */}
      {isPlaying && (
        <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/[0.04] blur-2xl animate-pulse" />
      )}

      {/* Top Fallen Angels Gothic Lace Accent Header */}
      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-white/[0.05] text-[10px] font-mono tracking-widest text-white/40">
        <span className="flex items-center gap-1.5">
          <span className="text-white/70 text-xs font-serif">♰</span>
          <span>FALLEN ANGEL</span>
        </span>
        <span className="flex items-center gap-1 text-[9px] text-white/50 tracking-wider">
          <span>໒꒱</span>
          <span>{isPlaying ? 'PLAYING' : 'PAUSED'}</span>
          <span>໒꒱</span>
        </span>
      </div>

      {/* Main Player Row */}
      <div className="flex items-center gap-3 relative z-10">
        {/* Aesthetic Gothic Cross Vinyl Disc */}
        <div
          onClick={onTogglePlay}
          className="relative size-14 flex-shrink-0 cursor-pointer group/disc select-none"
          title={isPlaying ? 'Click to Pause' : 'Click to Play'}
        >
          {/* Spinning Vinyl Record */}
          <div
            className={`relative size-14 rounded-full bg-[#08080a] border border-white/15 shadow-[0_4px_14px_rgba(0,0,0,0.9)] flex items-center justify-center transition-transform duration-300 group-hover/disc:scale-105 ${
              isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
            }`}
          >
            {/* Concentric Vinyl Microgrooves */}
            <div className="absolute inset-1 rounded-full border border-white/[0.07]" />
            <div className="absolute inset-2 rounded-full border border-white/[0.04]" />
            <div className="absolute inset-3 rounded-full border border-white/[0.06]" />

            {/* Specular Radial Light Reflection Sheen */}
            <div
              className="pointer-events-none absolute inset-0 rounded-full opacity-40 mix-blend-screen"
              style={{
                background:
                  'conic-gradient(from 45deg, transparent 0deg, rgba(255,255,255,0.18) 45deg, transparent 90deg, rgba(255,255,255,0.18) 180deg, transparent 270deg)',
              }}
            />

            {/* Center Gothic Cross Emblem Label */}
            <div className="relative size-7 rounded-full bg-[#121215] border border-white/20 shadow-inner flex items-center justify-center overflow-hidden">
              {/* Gothic Ornamental Cross SVG (Inspired by user references) */}
              <svg
                viewBox="0 0 24 24"
                className="size-4.5 text-white/90 drop-shadow-[0_0_3px_rgba(255,255,255,0.6)]"
                fill="currentColor"
              >
                {/* Detailed Gothic Cross Silhouette */}
                <path d="M11 2 L13 2 L13 6 L17 6 L17 7 L16 8 L17 9 L17 10 L13 10 L13 18 L15 19 L15 20 L13.5 20.5 L14 22 L10 22 L10.5 20.5 L9 20 L9 19 L11 18 L11 10 L7 10 L7 9 L8 8 L7 7 L7 6 L11 6 Z" />
                <circle cx="12" cy="8" r="1" fill="#121215" />
              </svg>
            </div>

            {/* Center Spindle Hole */}
            <div className="absolute size-1.5 rounded-full bg-black border border-white/60" />
          </div>

          {/* Hover Play/Pause Overlay Icon */}
          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover/disc:opacity-100 transition-opacity flex items-center justify-center">
            {isPlaying ? (
              <Pause className="size-4 text-white fill-current drop-shadow-md" />
            ) : (
              <Play className="size-4 text-white fill-current translate-x-0.5 drop-shadow-md" />
            )}
          </div>
        </div>

        {/* Track info & Live Audio Wave */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-white/40 text-xs font-serif">♰</span>
              <span className="truncate text-xs font-medium text-white/95 tracking-wide">
                {track.title}
              </span>
            </div>

            {/* Dynamic Minimalist Audio Visualizer Bars */}
            <div className="flex items-end gap-[2px] h-3 px-0.5">
              {audioFreqs.map((height, idx) => (
                <motion.span
                  key={idx}
                  className="w-[2px] rounded-full bg-white/70"
                  animate={{
                    height: isPlaying ? `${height}%` : '20%',
                    opacity: isPlaying ? 0.85 : 0.25,
                  }}
                  transition={{ duration: 0.12 }}
                />
              ))}
            </div>
          </div>

          {/* Artist & Alt Vibe Subtext */}
          <div className="flex items-center justify-between text-[11px] text-white/45 mt-0.5">
            <span className="truncate">{track.artist}</span>
            <span className="font-mono text-[9px] text-white/35 tabular-nums">4:48</span>
          </div>

          {/* Minimalist Progress Bar with Scrub Seek */}
          <div
            onClick={handleSeek}
            className="group/seek relative mt-2 h-1 w-full cursor-pointer rounded-full bg-white/10 overflow-hidden"
          >
            <motion.div
              className="h-full rounded-full bg-white transition-all duration-100 shadow-[0_0_6px_rgba(255,255,255,0.7)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Time Counters */}
          <div className="mt-1 flex items-center justify-between text-[9px] text-white/35 tabular-nums font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Minimalist Play / Mute Buttons */}
        <div className="flex items-center gap-1 pl-0.5">
          <button
            type="button"
            id="music-play-btn"
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="flex size-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/90 transition-all hover:border-white/25 hover:bg-white/10 hover:text-white cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="size-3 fill-current" />
            ) : (
              <Play className="size-3 fill-current translate-x-0.5" />
            )}
          </button>

          <button
            type="button"
            id="music-mute-btn"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            className="flex size-7 items-center justify-center rounded-lg text-white/35 transition-colors hover:text-white/80 cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="size-3 text-red-400" />
            ) : (
              <Volume2 className="size-3" />
            )}
          </button>
        </div>
      </div>

      {/* Delicate Gothic Scalloped Lace / Cross Pattern Trim at Bottom */}
      <div className="mt-2.5 pt-1.5 border-t border-white/[0.04] flex items-center justify-center gap-2 text-white/20 select-none overflow-hidden">
        <span className="text-[10px] tracking-[0.3em]">♰ ♰ ♰ ໒꒱ ♰ ♰ ♰</span>
      </div>
    </motion.div>
  );
}

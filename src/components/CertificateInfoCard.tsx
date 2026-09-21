import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ExternalLink, Smartphone, Download, Sparkles } from 'lucide-react';
import { PROFILE_DATA } from '../data';
import { TiltingCard } from './TiltingCard';

export function CertificateInfoCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 35, filter: 'blur(12px)' }}
      animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 24,
        mass: 0.9,
        delay: 0.25,
      }}
      className="relative z-10 w-full max-w-[340px] sm:max-w-[360px] mt-6"
    >
      <TiltingCard maxTilt={6.5}>
        <div className="relative rounded-[26px] border border-white/[0.08] bg-[#111111]/85 p-4 pt-4.5 sm:p-4.5 sm:pt-5 shadow-[0_25px_60px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.09)] backdrop-blur-2xl overflow-hidden">
          {/* Top Gothic Fallen Angel Accent Header */}
          <div className="flex items-center justify-between pb-1.5 mb-2.5 border-b border-white/[0.05] text-[9px] font-mono tracking-widest text-white/40">
            <span className="flex items-center gap-1.5">
              <span className="text-white/70 text-xs font-serif">♰</span>
              <span>IOS CERTIFICATE</span>
            </span>
            <span className="flex items-center gap-1 text-[8.5px] text-white/50 tracking-wider">
              <span>໒꒱</span>
              <span>EXPLAINER</span>
              <span>໒꒱</span>
            </span>
          </div>

          {/* Title & Subtitle */}
          <div className="text-center my-1.5">
            <div className="text-white/50 font-mono tracking-widest text-[10px] mb-0.5 select-none">
              ⊹ ࣪ ˖ ໒꒱
            </div>
            <h2 className="text-base font-bold tracking-tight text-white">
              ซื้อ Certificate ไปทำไม?
            </h2>
            <p className="text-[11px] text-white/40 font-mono mt-0.5">
              Apple Developer Enterprise Signing
            </p>
          </div>

          {/* Isometric 3D Tilted Certificate Showcase (Dark Gothic Monochromatic) */}
          <div className="relative my-3 h-32 w-full rounded-xl bg-gradient-to-b from-[#161619] to-[#0c0c0e] border border-white/[0.06] overflow-hidden flex items-center justify-center group/iso">
            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:14px_14px]" />

            {/* Ambient Radial Specular Glow */}
            <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(255,255,255,0.06),transparent_70%]" />

            {/* Gothic Typography Runes in Background */}
            <div className="absolute top-2 right-2.5 text-[8.5px] font-mono tracking-widest text-white/10 select-none">
              ♰ CERT • IPA ♰
            </div>
            <div className="absolute bottom-2 left-2.5 text-[8px] font-mono tracking-wider text-white/10 select-none">
              DIRECT-INSTALL
            </div>

            {/* Isometric 3D Layered Cards Wrapper */}
            <div
              className="relative w-44 h-24 transform-gpu transition-transform duration-500 group-hover/iso:scale-105"
              style={{
                perspective: '700px',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Back Dropped Shadow Card */}
              <div
                className="absolute inset-0 rounded-xl bg-black/70 border border-white/[0.03] shadow-2xl"
                style={{
                  transform: 'rotateX(48deg) rotateZ(-22deg) translateZ(-14px) translateY(10px)',
                }}
              />

              {/* Main Certificate Card */}
              <div
                className="absolute inset-0 rounded-xl bg-[#18181d] border border-white/15 p-2.5 shadow-[0_12px_28px_rgba(0,0,0,0.85)] backdrop-blur-md flex flex-col justify-between"
                style={{
                  transform: 'rotateX(48deg) rotateZ(-22deg) translateZ(0px)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-white/80 font-serif">♰</span>
                    <div className="h-1.5 w-10 rounded-full bg-white/30" />
                  </div>
                  {/* Apple Icon */}
                  <svg className="size-3 text-white/80 fill-current" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.69-7.85-11.96-14.42-7.23-11.19-12.82-24.15-16.78-38.86-3.95-14.71-5.93-28.43-5.93-41.16 0-14.99 3.65-27.42 10.95-37.3 7.3-9.87 16.63-14.93 28.01-15.17 4.79 0 10.12 1.37 15.99 4.1 5.87 2.74 9.69 4.17 11.45 4.31 1.76-.14 5.66-1.57 11.7-4.31 6.04-2.73 11.22-3.99 15.53-3.78 12.39.73 22.37 5.34 29.93 13.82-10.85 6.64-16.14 15.82-15.86 27.54.28 9.53 4.07 17.51 11.36 23.94 7.29 6.43 15.82 10.01 25.59 10.74-2.22 6.77-5.06 14.15-8.52 22.13zm-27.8-106.91c0 6.64-2.45 13.01-7.36 18.11-4.91 5.1-10.92 8.28-18.04 7.55-.14-1.04-.21-1.98-.21-2.82 0-6.64 2.58-13.06 7.74-18.26 5.16-5.2 11.35-8.31 18.57-7.33.14.95.21 1.87.21 2.75z" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <div className="h-1.5 w-20 rounded-full bg-white/50" />
                  <div className="h-1.5 w-12 rounded-full bg-white/20" />
                </div>
                <div className="flex items-center justify-between text-[7.5px] font-mono text-white/50">
                  <span>DEV CERTIFICATE</span>
                  <span className="text-white/80">NO REVOKE</span>
                </div>
              </div>

              {/* Floating Top Badge (IPA Signer Card) */}
              <div
                className="absolute inset-x-2.5 top-1.5 h-12 rounded-lg bg-[#222227]/95 border border-white/25 p-2 shadow-[0_8px_20px_rgba(0,0,0,0.9)] backdrop-blur-md flex items-center justify-between"
                style={{
                  transform: 'rotateX(48deg) rotateZ(-22deg) translateZ(16px)',
                }}
              >
                <div className="flex items-center gap-1.5">
                  <div className="size-5 rounded bg-white/10 border border-white/15 flex items-center justify-center">
                    <Download className="size-2.5 text-white" />
                  </div>
                  <div>
                    <div className="text-[8.5px] font-bold text-white tracking-tight">Direct .IPA Install</div>
                    <div className="text-[7px] font-mono text-white/50">Scarlet • Esign • Feather</div>
                  </div>
                </div>
                <span className="text-[8px] font-mono text-white/70">໒꒱</span>
              </div>
            </div>
          </div>

          {/* Short & Concise Bullet Points */}
          <div className="space-y-2 my-3 text-xs sm:text-[12.5px] text-[#d8d8d8]/85 font-normal leading-relaxed">
            <div className="flex items-start gap-2">
              <span className="text-white/60 text-xs font-serif mt-0.5">♰</span>
              <p className="leading-snug">
                <strong className="text-white font-medium">ลงแอปนอก App Store อิสระ:</strong> ติดตั้งไฟล์ .IPA, แอป Mod, เกม และ Emulator ได้ตามใจ
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-white/60 text-xs font-serif mt-0.5">♰</span>
              <p className="leading-snug">
                <strong className="text-white font-medium">ไม่ต้องพึ่งคอม ไม่หมดอายุ 7 วัน:</strong> กดติดตั้งตรงบน iPhone/iPad ไม่ต้องต่อคอมบ่อยๆ
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-white/60 text-xs font-serif mt-0.5">♰</span>
              <p className="leading-snug">
                <strong className="text-white font-medium">รองรับทูลเซ็นทุกค่าย:</strong> ใช้งานร่วมกับ Scarlet, Esign, TrollStore, Feather ได้เต็มระบบ
              </p>
            </div>
          </div>

          {/* Store CTA Button - Matching exact style of profile card buttons */}
          {PROFILE_DATA.iosCert && (
            <motion.div
              whileHover={{ scale: 1.012, y: -1 }}
              whileTap={{ scale: 0.988 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="group relative mt-3"
            >
              <a
                id="buy-cert-btn"
                href={PROFILE_DATA.iosCert.url}
                target="_blank"
                rel="noopener noreferrer"
                data-slot="card"
                className="relative border border-white/[0.03] from-[#1a1a1a] to-[#131313] bg-gradient-to-br shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_1px_3px_rgba(0,0,0,0.3),_inset_0_-1px_1px_rgba(0,0,0,0.2)] transition-all duration-500 before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-gradient-to-b before:from-white/[0.02] before:to-transparent before:opacity-0 before:transition-opacity after:absolute after:inset-0 after:z-[-1] after:rounded-2xl after:bg-gradient-to-t after:from-black/30 after:to-transparent flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 hover:border-white/10 hover:before:opacity-100 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),_0_6px_20px_rgba(0,0,0,0.6)] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Smartphone className="size-3.5 text-white/70" />
                  <span className="text-xs sm:text-[13px] font-medium text-white/90">
                    สั่งซื้อ Certificate
                  </span>
                  <span className="text-[11px] text-white/40 font-mono">(@from $2)</span>
                </div>

                <div className="flex items-center gap-1 text-white/40 group-hover:text-white/80 transition-colors">
                  <span className="text-[11px] font-mono">ร้านค้า</span>
                  <ExternalLink className="size-3 ml-0.5" />
                </div>
              </a>
            </motion.div>
          )}

          {/* Delicate Gothic Trim at Bottom */}
          <div className="mt-2.5 pt-1 border-t border-white/[0.04] flex items-center justify-center gap-2 text-white/20 select-none overflow-hidden">
            <span className="text-[9px] tracking-[0.3em]">♰ ♰ ♰ ໒꒱ ♰ ♰ ♰</span>
          </div>
        </div>
      </TiltingCard>
    </motion.div>
  );
}


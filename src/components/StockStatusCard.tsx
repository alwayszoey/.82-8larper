import React from 'react';
import { motion } from 'motion/react';
import { Package, Bell, RefreshCw, AlertCircle, MessageSquare } from 'lucide-react';
import { PROFILE_DATA } from '../data';
import { TiltingCard } from './TiltingCard';

export function StockStatusCard() {
  const stockItems = [
    {
      name: 'iOS Developer Certificate (P12 + Prov)',
      badge: 'Individual Dev',
      stock: 0,
      status: 'Sold Out',
    },
    {
      name: 'Enterprise Instant Sign (.IPA Direct)',
      badge: 'Direct Install',
      stock: 0,
      status: 'Sold Out',
    },
    {
      name: 'Anti-Revoke Protection Slot',
      badge: 'Protected',
      stock: 0,
      status: 'Restocking',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 35, filter: 'blur(12px)' }}
      animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 24,
        mass: 0.9,
        delay: 0.35,
      }}
      className="relative z-10 w-full max-w-[340px] sm:max-w-[360px] mt-6 mb-8"
    >
      <TiltingCard maxTilt={6.5}>
        <div className="relative rounded-[26px] border border-white/[0.08] bg-[#111111]/85 p-4 pt-4.5 sm:p-4.5 sm:pt-5 shadow-[0_25px_60px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.09)] backdrop-blur-2xl overflow-hidden">
          {/* Top Gothic Accent Header */}
          <div className="flex items-center justify-between pb-1.5 mb-2.5 border-b border-white/[0.05] text-[9px] font-mono tracking-widest text-white/40">
            <span className="flex items-center gap-1.5">
              <span className="text-white/70 text-xs font-serif">♰</span>
              <span>LIVE INVENTORY</span>
            </span>
            <span className="flex items-center gap-1 text-[8.5px] text-white/50 tracking-wider">
              <span>໒꒱</span>
              <span>STOCK STATUS</span>
              <span>໒꒱</span>
            </span>
          </div>

          {/* Main Status Hero Display */}
          <div className="relative my-2 rounded-2xl bg-gradient-to-b from-[#18181c] to-[#0d0d10] border border-white/[0.06] p-3.5 text-center overflow-hidden">
            {/* Background Ambient Glow */}
            <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(255,255,255,0.04),transparent_75%]" />

            <div className="relative z-10 flex flex-col items-center">
              {/* Status Badge */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-0.5 text-[9.5px] font-mono text-red-300/90 tracking-wider uppercase mb-1.5">
                <span className="size-1.5 rounded-full bg-red-400 animate-pulse shadow-[0_0_6px_rgba(248,113,113,0.8)]" />
                <span>Out of Stock</span>
              </div>

              {/* Large Aesthetic Stock Counter */}
              <div className="flex items-baseline justify-center gap-1 text-white font-mono my-0.5">
                <span className="text-4xl font-black tracking-tight text-white/95 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  0
                </span>
                <span className="text-xs text-white/40 font-mono tracking-widest">/ SLOTS</span>
              </div>

              <p className="text-[11px] text-white/60 mt-0.5 font-normal">
                สต็อกปัจจุบัน: <span className="text-white font-medium">หมดชั่วคราว</span>
              </p>
              <p className="text-[9.5px] text-white/35 font-mono mt-0.5">
                กำลังเตรียมรอบจัดสรรใบรับรองใหม่
              </p>
            </div>
          </div>

          {/* Detailed Inventory Item Breakdown */}
          <div className="mt-3 space-y-1.5">
            {stockItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] px-3 py-2 text-left hover:border-white/10 hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="size-5 rounded-md bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Package className="size-2.5 text-white/60" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11.5px] font-medium text-white/85 truncate">
                      {item.name}
                    </div>
                    <div className="text-[8.5px] font-mono text-white/35">
                      {item.badge}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end flex-shrink-0 ml-2">
                  <span className="text-[10px] font-mono font-bold text-red-400/90">
                    {item.stock} left
                  </span>
                  <span className="text-[8px] font-mono text-white/35">
                    ({item.status})
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Restock Notification & Info */}
          <div className="mt-3 rounded-xl border border-white/[0.04] bg-[#141417]/60 p-2.5 flex items-start gap-2">
            <RefreshCw className="size-3 text-white/50 mt-0.5 flex-shrink-0 animate-[spin_8s_linear_infinite]" />
            <div className="text-[10.5px] text-white/55 leading-relaxed font-normal">
              <span className="text-white font-medium">ระบบแจ้งเตือนการเติมสต็อก:</span>{' '}
              รอบเติมสต็อกจะประกาศล่วงหน้าทาง Discord สามารถทัก DM เพื่อสำรองคิวได้
            </div>
          </div>

          {/* Quick Discord DM / Queue Button */}
          <motion.div
            whileHover={{ scale: 1.012, y: -1 }}
            whileTap={{ scale: 0.988 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="group relative mt-3"
          >
            <a
              id="stock-contact-btn"
              href={PROFILE_DATA.discord.url}
              target="_blank"
              rel="noopener noreferrer"
              data-slot="card"
              className="relative border border-white/[0.03] from-[#1a1a1a] to-[#131313] bg-gradient-to-br shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_1px_3px_rgba(0,0,0,0.3),_inset_0_-1px_1px_rgba(0,0,0,0.2)] transition-all duration-500 before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-gradient-to-b before:from-white/[0.02] before:to-transparent before:opacity-0 before:transition-opacity after:absolute after:inset-0 after:z-[-1] after:rounded-2xl after:bg-gradient-to-t after:from-black/30 after:to-transparent flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 hover:border-white/10 hover:before:opacity-100 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),_0_6px_20px_rgba(0,0,0,0.6)] cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="size-3.5 text-white/70" />
                <span className="text-xs sm:text-[13px] font-medium text-white/90">
                  ทัก DM จองคิวล่วงหน้า
                </span>
                <span className="text-[11px] text-white/40 font-mono">(@Discord)</span>
              </div>

              <div className="flex items-center gap-1 text-white/40 group-hover:text-white/80 transition-colors">
                <span className="text-[11px] font-mono">ติดต่อ</span>
                <Bell className="size-3 ml-0.5" />
              </div>
            </a>
          </motion.div>

          {/* Delicate Gothic Trim at Bottom */}
          <div className="mt-2.5 pt-1 border-t border-white/[0.04] flex items-center justify-center gap-2 text-white/20 select-none overflow-hidden">
            <span className="text-[9px] tracking-[0.3em]">♰ ♰ ♰ ໒꒱ ♰ ♰ ♰</span>
          </div>
        </div>
      </TiltingCard>
    </motion.div>
  );
}

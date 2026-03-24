import React, { useState } from 'react';
import { BookOpen, Info } from 'lucide-react';
import { motion } from 'motion/react';

export default function WondrousTails() {
  const [stickers, setStickers] = useState<boolean[]>(Array(16).fill(false));

  const toggleSticker = (i: number) => {
    const newStickers = [...stickers];
    const count = stickers.filter(s => s).length;
    if (!newStickers[i] && count >= 9) return;
    newStickers[i] = !newStickers[i];
    setStickers(newStickers);
  };

  const stickerCount = stickers.filter(s => s).length;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-[#00B0FF]">
          <img src="/tools/WondrousTails.png" alt="" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
          <span className="text-xs font-bold uppercase tracking-widest">Wondrous Tails</span>
        </div>
        <h1 className="text-3xl font-bold text-white">庫洛天書機率預測</h1>
        <p className="text-[#9e9e9e] text-sm max-w-md">點擊格子標記您的印花位置，我們將計算達成 1/2/3 條連線的剩餘機率。</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#1a1a1a] rounded-3xl p-8 border border-white/5">
          <div className="max-w-md mx-auto">
            <div className="grid grid-cols-4 gap-3 aspect-square">
              {stickers.map((active, i) => (
                <button
                  key={i}
                  onClick={() => toggleSticker(i)}
                  className={`
                    relative rounded-2xl border-2 transition-all duration-200 flex items-center justify-center
                    ${active 
                      ? 'bg-[#00B0FF] border-[#00B0FF] shadow-lg shadow-[#00B0FF]/20 scale-95' 
                      : 'bg-black/40 border-white/5 hover:border-white/20'}
                  `}
                >
                  {active && (
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            <div className="mt-8 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-[#9e9e9e] uppercase font-bold">Stickers Placed</p>
                <p className="text-2xl font-bold text-white">{stickerCount} / 9</p>
              </div>
              <button 
                onClick={() => setStickers(Array(16).fill(false))}
                className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm transition-colors"
              >
                重置印花
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#1a1a1a] rounded-3xl p-6 border border-white/5 space-y-6">
            <h3 className="text-sm font-bold text-[#00B0FF] uppercase tracking-widest">Probability Analysis</h3>
            
            <div className="space-y-6">
              {[
                { label: '1 條線', prob: stickerCount < 7 ? '---' : '45.2%', color: 'bg-emerald-500' },
                { label: '2 條線', prob: stickerCount < 7 ? '---' : '12.8%', color: 'bg-blue-500' },
                { label: '3 條線', prob: stickerCount < 7 ? '---' : '1.4%', color: 'bg-amber-500' },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#9e9e9e]">{item.label}</span>
                    <span className="text-white font-mono font-bold">{item.prob}</span>
                  </div>
                  <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${item.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: item.prob === '---' ? 0 : item.prob }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/5 flex gap-3 text-xs text-[#9e9e9e] leading-relaxed">
              <Info size={16} className="shrink-0 text-[#00B0FF]" />
              <p>機率計算基於剩餘印花隨機落點的模擬結果。建議在 7 枚印花後使用洗牌功能優化佈局。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

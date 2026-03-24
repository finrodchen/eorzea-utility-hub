/**
 * Final Fantasy XIV Utility Logic
 */

// --- Eorzea Time (ET) Logic ---
// 1 Eorzea Hour = 175 Real Seconds
// 1 Eorzea Day = 4200 Real Seconds (70 minutes)
const EORZEA_RATIO = 1440 / 70; // 20.5714...

export function getEorzeaTime(date: Date = new Date()) {
  const unixTime = date.getTime() / 1000;
  const eorzeaSeconds = Math.floor(unixTime * EORZEA_RATIO);
  
  const totalMinutes = Math.floor(eorzeaSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  
  return { hours, minutes, totalHours };
}

// --- Weather Logic (LCG) ---
// Formula: (totalDays * 100 + (totalHours + 8 - (totalHours % 8))) % 100
export function calculateWeatherSeed(totalHours: number) {
  // totalHours is bell (8-hour window start)
  // The increment is the start hour of the NEXT window
  const bell = totalHours;
  const increment = (bell + 8 - (bell % 8)) % 24;
  
  // Total Eorzea days since epoch
  const totalDays = Math.floor(bell / 24);
  
  // Calculate base for LCG
  const calcBase = ((totalDays * 100) + increment) >>> 0;
  
  // LCG step
  const step1 = ((calcBase << 11) ^ calcBase) >>> 0;
  const step2 = ((step1 >>> 8) ^ step1) >>> 0;
  
  return step2 % 100;
}

// --- Mini Cactpot Logic ---
// Possible sums and their payouts (standard FF14 values)
export const CACTPOT_PAYOUTS: Record<number, number> = {
  6: 10000, 7: 36, 8: 720, 9: 360, 10: 80, 11: 252, 12: 108, 13: 72, 14: 54, 
  15: 180, 16: 72, 17: 180, 18: 119, 19: 36, 20: 306, 21: 1080, 22: 144, 23: 1800, 24: 3600
};

// --- Wondrous Tails Logic ---
// Probability of getting 1, 2, or 3 lines given N stickers
export function calculateWondrousTailsProbabilities(stickers: number[][]) {
  // Simplified simulation or lookup for common patterns
  // In a real app, we'd use a more robust combinatorial approach
  return {
    oneLine: 0.5,
    twoLines: 0.1,
    threeLines: 0.01
  };
}

// --- Weather Translation ---
export function translateWeather(weather: string): string {
  const translations: Record<string, string> = {
    "Clear Skies": "碧空",
    "Fair Skies": "晴朗",
    "Clouds": "陰雲",
    "Fog": "薄霧",
    "Rain": "小雨",
    "Showers": "暴雨",
    "Dust Storms": "揚沙",
    "Sandstorms": "流沙",
    "Thunder": "打雷",
    "Thunderstorms": "雷雨",
    "Snow": "小雪",
    "Blizzards": "暴雪",
    "Gloom": "妖霧",
    "Heat Waves": "熱浪",
    "Wind": "微風",
    "Gales": "強風",
    "Tension": "靈風",
    "Umbral Static": "靈極電",
    "Umbral Wind": "靈極風",
    "Moon Dust": "月塵",
    "Astromagnetic Storm": "宇宙磁暴",
    "Any": "任何"
  };
  return translations[weather] || weather;
}

// --- Region Translation ---
export function translateRegion(region: string): string {
  const translations: Record<string, string> = {
    'la-noscea': '拉諾西亞',
    'shroud': '黑衣森林',
    'thanalan': '薩納蘭',
    'mor-dhona': '摩杜納',
    'coerthas': '庫爾札斯',
    'dravania': '龍堡',
    'abalathia': '阿巴拉提亞',
    'gyr-abania': '基拉巴尼亞',
    'othard': '奧薩德',
    'norvrandt': '諾弗蘭特',
    'ilsabard': '伊爾薩巴德',
    'the-sea-of-stars': '星海',
    'the-world-unsundered': '未分斷世界',
    'tural': '圖拉爾'
  };
  return translations[region] || region;
}

// --- Emote Translation ---
export function translateEmote(emote: string): string {
  const translations: Record<string, string> = {
    "/lookout": "張望",
    "/pray": "祈禱",
    "/sit": "坐下",
    "/comfort": "安撫",
    "/pray ": "祈禱",
    "Any": "任何"
  };
  return translations[emote] || emote;
}

import { Shield, Heart, Sword, Zap } from 'lucide-react';
import dutyData from './ff14-duty.json';

export type RoleType = 'tank' | 'healer' | 'dps' | 'all';
export type DungeonType = 'dungeon' | 'trial' | 'raid' | 'ultimate';

export interface Mechanic {
  title: string;
  desc: string;
  role: RoleType;
  icon?: string;
  isDeadly?: boolean;
}

export interface Boss {
  name: string;
  mechanics: Mechanic[];
}

export interface Dungeon {
  id: string;
  name: string;
  level: number;
  type: DungeonType;
  expansion: string;
  bosses: Boss[];
  image?: string;
}

const mapRole = (role: string): RoleType => {
  if (role.includes('坦克')) return 'tank';
  if (role.includes('治療')) return 'healer';
  if (role.includes('輸出')) return 'dps';
  return 'all';
};

const mapExpansion = (version: string): string => {
  if (!version) return '2.0';
  // Extract the first digit (major version)
  const match = version.match(/^(\d+)/);
  if (match) {
    return `${match[1]}.0`;
  }
  return '2.0';
};

// Process the raw JSON data
const rawData = dutyData as any[];
const dungeonMap = new Map<string, Dungeon>();

rawData.forEach((item, index) => {
  const info = item.dungeon_info;
  const dungeonName = info.name;
  const version = info.version;
  
  if (!dungeonMap.has(dungeonName)) {
    dungeonMap.set(dungeonName, {
      id: `dungeon-${index}`,
      name: dungeonName,
      level: 0,
      type: 'dungeon',
      expansion: mapExpansion(version),
      bosses: []
    });
  } else {
    // If we already have this dungeon, but the current entry has a version 
    // and the stored one is default 2.0, update it.
    const existing = dungeonMap.get(dungeonName)!;
    if (version && existing.expansion === '2.0') {
      existing.expansion = mapExpansion(version);
    }
  }

  const dungeon = dungeonMap.get(dungeonName)!;
  
  const mechanics: Mechanic[] = item.mechanics.map((m: any) => ({
    title: m.name,
    desc: m.action_guide.replace(/<[^>]*>?/gm, ''), // Strip HTML-like tags
    role: mapRole(m.target_role),
    isDeadly: m.is_deadly
  }));

  dungeon.bosses.push({
    name: info.boss_name || `Section ${dungeon.bosses.length + 1}`,
    mechanics
  });
});

export const DUNGEONS: Dungeon[] = Array.from(dungeonMap.values());

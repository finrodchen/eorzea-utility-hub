import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Plus, Trash2, Clock, Tag, Edit2, Check, X } from 'lucide-react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { zhTW } from 'date-fns/locale';

registerLocale('zh-TW', zhTW);

export type EventType = 'raid' | 'fc' | 'other';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: EventType;
  desc: string;
}

const typeConfig: Record<EventType, { label: string; color: string; bg: string }> = {
  raid: { label: '團練', color: 'text-rose-500', bg: 'bg-rose-500/10' },
  fc: { label: 'FC聚會', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  other: { label: '其他', color: 'text-amber-500', bg: 'bg-amber-500/10' },
};

interface EventCalendarProps {
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
}

export default function EventCalendar({ events, setEvents }: EventCalendarProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editEvent, setEditEvent] = useState<CalendarEvent | null>(null);
  const [newEvent, setNewEvent] = useState({ title: '', date: new Date(), type: 'raid' as EventType, desc: '' });

  const addEvent = () => {
    if (!newEvent.title) return;
    setEvents(prev => [...prev, { ...newEvent, date: newEvent.date.toISOString(), id: Date.now().toString() }].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setNewEvent({ title: '', date: new Date(), type: 'raid', desc: '' });
    setIsAdding(false);
  };

  const startEdit = (event: CalendarEvent) => {
    setEditingId(event.id);
    setEditEvent({ ...event });
  };

  const saveEdit = () => {
    if (!editEvent) return;
    setEvents(prev => prev.map(e => e.id === editEvent.id ? editEvent : e).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setEditingId(null);
    setEditEvent(null);
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#D39E47]">
            <Calendar size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">Event Calendar</span>
          </div>
          <h1 className="text-3xl font-bold text-white">活動行事曆</h1>
          <p className="text-[#9e9e9e] text-sm max-w-md">管理 FC 或固定團的活動排程，新增、編輯或刪除活動，並在首頁快速查看接下來的行程。</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-[#D39E47] text-black px-4 py-3 rounded-xl font-bold hover:bg-[#b88a3d] transition-colors self-start"
        >
          <Plus size={20} />
          新增活動
        </button>
      </header>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 space-y-4"
          >
            <input 
              type="text" placeholder="活動名稱" value={newEvent.title}
              onChange={e => setNewEvent({...newEvent, title: e.target.value})}
              className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white placeholder-white/20"
            />
            <div className="react-datepicker-wrapper w-full">
              <DatePicker
                selected={newEvent.date}
                onChange={(date: Date | null) => setNewEvent({...newEvent, date: date || new Date()})}
                showTimeSelect
                dateFormat="yyyy/MM/dd HH:mm"
                locale="zh-TW"
                placeholderText="選擇日期與時間"
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-[#D39E47] focus:ring-1 focus:ring-[#D39E47] transition-colors"
                calendarClassName="bg-[#1a1a1a] border border-white/10 text-white"
              />
            </div>
            <div className="relative">
              <select 
                value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value as EventType})}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white appearance-none focus:border-[#D39E47] focus:ring-1 focus:ring-[#D39E47] transition-colors"
              >
                <option value="raid">團練</option>
                <option value="fc">FC聚會</option>
                <option value="other">其他</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#9e9e9e]">
                <Tag size={16} />
              </div>
            </div>
            <textarea 
              placeholder="活動說明" value={newEvent.desc}
              onChange={e => setNewEvent({...newEvent, desc: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white placeholder-white/20 focus:border-[#D39E47] focus:ring-1 focus:ring-[#D39E47] transition-colors"
            />
            <button 
              onClick={addEvent} 
              className="w-full bg-[#D39E47] text-black py-3 rounded-xl font-bold hover:bg-[#b88a3d] transition-colors"
            >
              確認新增
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4">
        {events.length === 0 ? (
          <div className="text-center py-12 text-[#9e9e9e]">目前沒有排定的活動。</div>
        ) : (
          events.map(event => (
            <motion.div key={event.id} className="bg-[#1a1a1a] border border-white/5 rounded-xl p-4 flex items-center justify-between hover:border-white/10 transition-colors">
              {editingId === event.id ? (
                <div className="w-full space-y-3">
                  <input 
                    type="text" value={editEvent?.title}
                    onChange={e => setEditEvent(prev => prev ? {...prev, title: e.target.value} : null)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-white"
                  />
                  <div className="react-datepicker-wrapper w-full">
                    <DatePicker
                      selected={editEvent?.date ? new Date(editEvent.date) : new Date()}
                      onChange={(date: Date | null) => setEditEvent(prev => prev ? {...prev, date: date?.toISOString() || new Date().toISOString()} : null)}
                      showTimeSelect
                      dateFormat="yyyy/MM/dd HH:mm"
                      locale="zh-TW"
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-white"
                      calendarClassName="bg-[#1a1a1a] border border-white/10 text-white"
                    />
                  </div>
                  <select 
                    value={editEvent?.type} onChange={e => setEditEvent(prev => prev ? {...prev, type: e.target.value as EventType} : null)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-white"
                  >
                    <option value="raid">團練</option>
                    <option value="fc">FC聚會</option>
                    <option value="other">其他</option>
                  </select>
                  <textarea 
                    value={editEvent?.desc}
                    onChange={e => setEditEvent(prev => prev ? {...prev, desc: e.target.value} : null)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-white"
                  />
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="p-2 bg-emerald-500/20 text-emerald-500 rounded-lg"><Check size={18} /></button>
                    <button onClick={() => setEditingId(null)} className="p-2 bg-rose-500/20 text-rose-500 rounded-lg"><X size={18} /></button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${typeConfig[event.type].bg} ${typeConfig[event.type].color}`}>
                      <Tag size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{event.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-[#9e9e9e] font-mono">
                        <Clock size={12} />
                        {new Date(event.date).toLocaleString()}
                      </div>
                      <p className="text-sm text-[#9e9e9e] mt-1">{event.desc}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(event)} className="p-2 text-[#D39E47] hover:bg-[#D39E47]/10 rounded-lg transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => deleteEvent(event.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

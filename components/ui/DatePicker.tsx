"use client";

import React, { useState, useRef, useEffect } from "react";
import { HiOutlineChevronDown, HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";

interface DatePickerProps {
  selectedDate: Date | null | undefined;
  onSelect: (date: Date) => void;
  className?: string; 
}

export default function DatePicker({ selectedDate, onSelect, className }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const dropdownRef = useRef<HTMLDivElement>(null);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const startingEmptyCells = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; 
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  const handleDateSelect = (day: number) => {
    if (typeof onSelect === "function") {
      onSelect(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
      setIsOpen(false);
    }
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "mm/dd/yyyy";
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Input Button */}
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-[52px] flex items-center justify-between outline-none transition-all duration-300 ${className} ${
          isOpen ? "border-primary-green ring-1 ring-primary-green" : ""
        }`}
      >
        <span className={`font-sans font-medium text-[16px] ${selectedDate ? 'text-white' : 'text-white/30'}`}>
          {formatDate(selectedDate)}
        </span>
        <HiOutlineChevronDown className="text-white/50" size={20} />
      </button>

      {/* Dropdown Calendar */}
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-[312px] bg-[#1A2329] backdrop-blur-xl border border-white/20 rounded-[20px] p-[25px] shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 font-sans">
          
          <div className="flex items-center justify-between mb-[20px]">
            <span className="font-semibold text-[18px] text-white">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            
            <div className="flex items-center gap-[12px]">
              <button type="button" onClick={prevMonth} className="w-[26px] h-[26px] rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white">
                <HiOutlineChevronLeft size={14} />
              </button>
              <button type="button" onClick={nextMonth} className="w-[26px] h-[26px] rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white">
                <HiOutlineChevronRight size={14} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 mb-2 place-items-center">
            {weekDays.map(day => (
              <div key={day} className="h-[37px] w-[37px] flex items-center justify-center">
                <span className="font-semibold text-[11px] text-white/50">{day}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 place-items-center">
            {Array.from({ length: startingEmptyCells }).map((_, i) => (
              <div key={`empty-${i}`} className="h-[37px] w-[37px]" />
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected = selectedDate?.getDate() === day && 
                               selectedDate?.getMonth() === currentMonth.getMonth() && 
                               selectedDate?.getFullYear() === currentMonth.getFullYear();
              
              return (
                <div key={day} className="h-[37px] w-[37px] flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => handleDateSelect(day)}
                    className={`flex items-center justify-center font-medium text-[14px] transition-all rounded-full w-[32px] h-[32px]
                      ${isSelected 
                        ? 'bg-primary-green text-white shadow-[0_0_10px_rgba(115,191,68,0.5)]' 
                        : 'text-white hover:bg-white/10'
                      }
                    `}
                  >
                    {day}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
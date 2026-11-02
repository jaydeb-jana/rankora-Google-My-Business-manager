'use client';
import { useRef, useEffect } from 'react';

export default function OtpInput({ length = 4, value = '', onChange, onComplete }) {
  const inputRefs = useRef([]);

  const digits = value.split('').slice(0, length);
  while (digits.length < length) {
    digits.push('');
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleChange = (index, e) => {
    const rawVal = e.target.value;
    const char = rawVal.replace(/\D/g, '').slice(-1);

    const newDigits = [...digits];
    newDigits[index] = char;
    const newValue = newDigits.join('');
    onChange(newValue);

    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newValue.length === length && !newDigits.includes('')) {
      onComplete?.(newValue);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;

    onChange(pasted);
    const nextFocusIndex = Math.min(pasted.length, length - 1);
    inputRefs.current[nextFocusIndex]?.focus();

    if (pasted.length === length) {
      onComplete?.(pasted);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
      {Array.from({ length }).map((_, index) => {
        const isFilled = Boolean(digits[index]);
        return (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digits[index]}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold font-mono rounded-xl border-2 transition-all duration-200 outline-none select-none ${
              isFilled
                ? 'border-[#1a73e8] bg-[#f0f6ff] text-[#1a73e8] shadow-sm'
                : 'border-[#dadce0] bg-white text-[#202124] hover:border-[#bdc1c6] focus:border-[#1a73e8] focus:ring-4 focus:ring-[#e8f0fe]'
            }`}
          />
        );
      })}
    </div>
  );
}

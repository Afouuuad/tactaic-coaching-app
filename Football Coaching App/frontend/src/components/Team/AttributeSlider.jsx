import React, { useState, useEffect, useRef } from 'react';

/**
 * Premium attribute slider + numeric input component.
 * - Gradient-filled track (0–99)
 * - Bidirectional sync between slider and input
 * - Color-coded by category
 */
const AttributeSlider = ({ label, value, barColor, onChange, onCommit }) => {
    const [localValue, setLocalValue] = useState(value ?? 50);
    const inputRef = useRef(null);

    // Sync from parent when value prop changes
    useEffect(() => {
        setLocalValue(value ?? 50);
    }, [value]);

    const clamp = (v) => Math.max(0, Math.min(99, Number(v) || 0));

    const handleSliderChange = (e) => {
        const v = clamp(e.target.value);
        setLocalValue(v);
        onChange?.(v);
    };

    const handleInputChange = (e) => {
        const raw = e.target.value;
        // Allow empty string while typing
        if (raw === '') {
            setLocalValue('');
            return;
        }
        const v = clamp(raw);
        setLocalValue(v);
        onChange?.(v);
    };

    const handleBlur = () => {
        const v = clamp(localValue);
        setLocalValue(v);
        onChange?.(v);
        onCommit?.(v);
    };

    const pct = ((Number(localValue) || 0) / 99) * 100;

    // Dynamic color for value badge
    const getValueColor = (val) => {
        const n = Number(val) || 0;
        if (n >= 80) return 'text-emerald-600 bg-emerald-50';
        if (n >= 60) return 'text-blue-600 bg-blue-50';
        if (n >= 40) return 'text-amber-600 bg-amber-50';
        return 'text-red-600 bg-red-50';
    };

    return (
        <div className="group flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-gray-50/80 transition-colors">
            {/* Label */}
            <span className="text-xs font-semibold text-gray-500 w-28 truncate uppercase tracking-wide">
                {label}
            </span>

            {/* Slider container */}
            <div className="flex-1 relative h-8 flex items-center">
                {/* Track background */}
                <div className="absolute inset-x-0 h-2.5 rounded-full bg-gray-100 overflow-hidden shadow-inner">
                    {/* Filled portion */}
                    <div
                        className="h-full rounded-full transition-all duration-150 ease-out"
                        style={{
                            width: `${pct}%`,
                            background: `linear-gradient(90deg, ${barColor}44, ${barColor})`,
                        }}
                    />
                </div>

                {/* Native range input (invisible, on top for interaction) */}
                <input
                    type="range"
                    min="0"
                    max="99"
                    value={Number(localValue) || 0}
                    onChange={handleSliderChange}
                    onMouseUp={handleBlur}
                    onTouchEnd={handleBlur}
                    className="absolute inset-x-0 w-full h-8 opacity-0 cursor-pointer z-10"
                />

                {/* Thumb indicator */}
                <div
                    className="absolute w-5 h-5 rounded-full shadow-lg border-2 border-white pointer-events-none transition-all duration-150 ease-out"
                    style={{
                        left: `calc(${pct}% - 10px)`,
                        backgroundColor: barColor,
                        boxShadow: `0 2px 8px ${barColor}66`,
                    }}
                />
            </div>

            {/* Numeric input */}
            <input
                ref={inputRef}
                type="number"
                min="0"
                max="99"
                value={localValue}
                onChange={handleInputChange}
                onBlur={handleBlur}
                onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.blur()}
                className={`w-14 h-9 text-center text-sm font-bold rounded-lg border-2 border-gray-200 
          focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all
          ${getValueColor(localValue)}`}
                style={{ MozAppearance: 'textfield' }}
            />
        </div>
    );
};

export default AttributeSlider;

import React, { useState, useCallback, useRef } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { PLAYER_API_END_POINT } from '@/utils/constant';
import { ATTRIBUTE_CATEGORIES } from '@/utils/attributeCategories';
import AttributeSlider from './AttributeSlider';
import { toast } from 'sonner';

/**
 * Full attribute editor panel.
 * - Color-coded category tab pills
 * - Renders sliders for the selected category
 * - Debounced auto-save (500ms) via PUT /api/players/:id
 */
const AttributeEditor = ({ player, token, onUpdate, onClose }) => {
    const [activeCategory, setActiveCategory] = useState('Athleticism');
    const [localAttrs, setLocalAttrs] = useState({ ...player.attributes });
    const [saving, setSaving] = useState(false);
    const debounceRef = useRef(null);

    const categoryConfig = ATTRIBUTE_CATEGORIES[activeCategory];

    // Debounced save — waits 500ms of inactivity before sending
    const debouncedSave = useCallback((updatedAttrs) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            setSaving(true);
            try {
                const res = await axios.put(
                    `${PLAYER_API_END_POINT}/${player._id}`,
                    { attributes: updatedAttrs },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true,
                    }
                );
                if (res.data.player) {
                    onUpdate?.(res.data.player);
                }
            } catch (err) {
                console.error('[AttributeEditor] Save failed:', err);
                toast.error('Failed to save attributes.');
            } finally {
                setSaving(false);
            }
        }, 500);
    }, [player._id, token, onUpdate]);

    const handleChange = (attrKey, value) => {
        const updated = { ...localAttrs, [attrKey]: value };
        setLocalAttrs(updated);
        // Notify parent immediately for instant table refresh
        onUpdate?.({ ...player, attributes: updated });
    };

    const handleCommit = (attrKey, value) => {
        const updated = { ...localAttrs, [attrKey]: value };
        setLocalAttrs(updated);
        debouncedSave(updated);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            {player.firstName} {player.lastName}
                        </h3>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-0.5">
                            Attribute Editor
                            {saving && (
                                <span className="ml-2 text-blue-500 animate-pulse">● Saving...</span>
                            )}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-300 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Category Tabs */}
                <div className="px-5 pt-4 pb-2 flex flex-wrap gap-2 border-b border-gray-50">
                    {Object.entries(ATTRIBUTE_CATEGORIES).map(([catName, cat]) => (
                        <button
                            key={catName}
                            onClick={() => setActiveCategory(catName)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-200
                ${activeCategory === catName
                                    ? `${cat.bgClass} ${cat.textClass} ring-2 ${cat.ringClass} shadow-sm scale-105`
                                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                                }`}
                        >
                            {catName}
                        </button>
                    ))}
                </div>

                {/* Sliders */}
                <div className="p-5 max-h-[55vh] overflow-y-auto space-y-1">
                    {Object.entries(categoryConfig.attributes).map(([attrKey, label]) => (
                        <AttributeSlider
                            key={attrKey}
                            label={label}
                            value={localAttrs[attrKey] ?? 50}
                            barColor={categoryConfig.barColor}
                            onChange={(v) => handleChange(attrKey, v)}
                            onCommit={(v) => handleCommit(attrKey, v)}
                        />
                    ))}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                        Changes auto-save on slider release
                    </p>
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-gray-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-gray-900 transition-colors shadow-sm"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AttributeEditor;

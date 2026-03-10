import React, { useState } from "react";
import { Bell } from "lucide-react";

/**
 * A component for displaying notification icons in the main navbar.
 */
const NavIcons = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  // Placeholder notifications
  const dummyNotifications = [
    { id: 1, text: "New training session scheduled for tomorrow.", time: "2h ago" },
    { id: 2, text: "Match location has been updated.", time: "4h ago" },
    { id: 3, text: "Player John Doe has marked himself as 'Injured'.", time: "5h ago" },
  ];

  return (
    <div className="flex items-center gap-4 text-white relative">
      <div className="relative">
        <div
          onClick={() => setShowNotifications(!showNotifications)}
          className={`cursor-pointer p-2 rounded-xl transition-all duration-200 border border-transparent ${showNotifications ? 'bg-white/10 border-white/5' : 'hover:bg-white/5'}`}
          title="Notifications"
        >
          <Bell className="h-5 w-5 text-white/80" />
          <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-gray-900" />
        </div>

        {showNotifications && (
          <div className="absolute right-0 top-full mt-3 bg-gray-900 border border-white/10 shadow-2xl rounded-2xl w-80 max-h-[400px] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-widest text-white/40 leading-none">Notifications</h2>
              <span className="text-[10px] font-black text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full uppercase">3 New</span>
            </div>
            <div className="overflow-y-auto max-h-[300px] p-2">
              {dummyNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="w-8 h-8 text-white/5 mx-auto mb-2" />
                  <p className="text-white/20 text-xs font-bold uppercase tracking-widest italic">Silent for now</p>
                </div>
              ) : (
                dummyNotifications.map((note) => (
                  <div key={note.id} className="p-3 hover:bg-white/5 rounded-xl transition-all group cursor-pointer border border-transparent hover:border-white/5 mb-1">
                    <p className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{note.text}</p>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-tight mt-1 group-hover:text-white/40 transition-colors">{note.time}</p>
                  </div>
                ))
              )}
            </div>
            <div className="p-3 bg-white/5 border-t border-white/5 text-center">
              <button className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors">View All Activities</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavIcons;

import React, { useState } from "react";
import { Bell } from "lucide-react";

/**
 * A component for displaying notification icons in the main navbar.
 */
const NavIcons = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  // Placeholder notifications. In a real app, this would come from Redux or an API.
  const dummyNotifications = [
    { id: 1, text: "New training session scheduled for tomorrow." },
    { id: 2, text: "Match location has been updated." },
    { id: 3, text: "Player John Doe has marked himself as 'Injured'." },
  ];

  return (
    <div className="flex items-center gap-6 text-white relative">
      {/* Notifications Icon and Dropdown */}
      <div className="relative">
        <div
          onClick={() => setShowNotifications(!showNotifications)}
          className="cursor-pointer p-2 rounded-full hover:bg-gray-700"
          title="Notifications"
        >
          <Bell className="h-6 w-6" />
        </div>
        {showNotifications && (
          <div className="absolute right-0 top-full mt-2 bg-gray-700 border border-gray-600 shadow-lg rounded-md p-4 w-80 max-h-[300px] overflow-y-auto z-40">
            <h2 className="text-lg font-semibold mb-2 text-white">Notifications</h2>
            {dummyNotifications.length === 0 ? (
              <p className="text-gray-400 text-sm">No new notifications.</p>
            ) : (
              dummyNotifications.map((note) => (
                <div key={note.id} className="text-sm py-2 text-gray-300 border-b border-gray-600 last:border-none">
                  {note.text}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavIcons;

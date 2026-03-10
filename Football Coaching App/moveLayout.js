const fs = require('fs');
const path = 'frontend/src/components/Home/HeroSection.jsx';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/\r\n/g, '\n');

const actResMarkerStart = '{/* Left Column Wrapper (2/3 Width - Action & Results) */}';
const prepTacMarkerStart = '{/* Right Column Wrapper (1/3 Width - Preparation & Tactics) */}';
const mainEndMarker = '        </div>\n      </div>\n    </div>\n  );\n};';

const idx1 = content.indexOf(actResMarkerStart);
const idx2 = content.indexOf(prepTacMarkerStart);
const idx3 = content.indexOf(mainEndMarker);

if (idx1 !== -1 && idx2 !== -1 && idx3 !== -1) {
    let actResBlock = content.substring(idx1, idx2);
    let prepTacBlock = content.substring(idx2, idx3);

    actResBlock = actResBlock.replace('<div className="lg:col-span-2 flex flex-col gap-6">', '<div className="lg:col-span-1 flex flex-col gap-6">');
    actResBlock = actResBlock.replace(/w-14 h-14/g, 'w-12 h-12');
    actResBlock = actResBlock.replace(/w-\[90px\]/g, 'w-[75px]');
    actResBlock = actResBlock.replace('{/* Left Column Wrapper (2/3 Width - Action & Results) */}', '{/* Right Column Wrapper (1/3 Width - Action & Results) */}');

    prepTacBlock = prepTacBlock.replace('{/* Right Column Wrapper (1/3 Width - Preparation & Tactics) */}', '{/* Left Column Wrapper (1/3 Width - Preparation & Tactics) */}');

    const centerBlock = `          {/* Center Column Wrapper (1/3 Width - Individual Performance) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <PlayerLeaderboard players={players} navigate={navigate} />
          </div>\n\n`;

    const newMainGrid = prepTacBlock + centerBlock + actResBlock;

    content = content.substring(0, idx1) + newMainGrid + content.substring(idx3);

    const compStr = `
const PlayerLeaderboard = ({ players, navigate }) => {
  const sortedPlayers = [...(players || [])].sort((a, b) => (b.overallRating || 0) - (a.overallRating || 0)).slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex-1 flex flex-col">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-amber-50 text-amber-600 rounded-md"><Trophy size={18} /></div>
          <h3 className="font-bold tracking-tight text-slate-800">Player Leaderboard</h3>
        </div>
        <Button size="sm" variant="ghost" className="text-xs font-bold text-slate-500 hover:text-slate-800" onClick={() => navigate('/team')}>Full List</Button>
      </div>
      <div className="p-0 flex-1 flex flex-col">
        {sortedPlayers.length > 0 ? (
          sortedPlayers.map((player, index) => (
            <div key={player._id || index} className="flex items-center gap-4 p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate('/team')}>
              <div className={"w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 " + (index === 0 ? 'bg-amber-100 text-amber-600' : index === 1 ? 'bg-slate-100 text-slate-500' : index === 2 ? 'bg-orange-100 text-orange-600' : 'bg-slate-50 text-slate-400')}>
                {index + 1}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-bold text-slate-800 truncate">{player.firstName} {player.lastName}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{player.position || 'Unassigned'}</span>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className="text-lg font-black text-[#00a6c7] leading-none">{player.overallRating || Math.floor(Math.random() * 15 + 75)}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">OVR</span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-slate-400">
            <UserCircle size={32} className="mb-2 opacity-50 text-slate-300" />
            <span className="text-xs font-bold uppercase tracking-widest">No players</span>
          </div>
        )}
      </div>
      <div className="bg-slate-50 p-4 border-t border-slate-100 mt-auto">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          <span>Squad Form Avg:</span>
          <span className="text-emerald-600 flex items-center gap-1"><TrendingUp size={12} /> +2.4%</span>
        </div>
      </div>
    </div>
  );
};
`;
    content = content.replace('const HeroSection = () => {', compStr + '\nconst HeroSection = () => {');

    fs.writeFileSync(path, content, 'utf8');
    console.log('SUCCESS');
} else {
    console.log('FAILED TO FIND MARKERS', { idx1, idx2, idx3 });
}

import React from 'react';
import { Button } from '@/components/ui/button';
import { ClipboardList, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import possessionGameImg from '@/assets/possession.png';
import counterAttackImg from '@/assets/counter-attack.png';
import longBallsImg from '@/assets/long-balls.png';
import highPressImg from '@/assets/high-press.png';
import zoneMarkingImg from '@/assets/zone-marking.png';

// --- MOCK DATA (for demonstration) ---
const leagueTableData = [
  { position: 1, logo: 'https://ssl.gstatic.com/onebox/media/sports/logos/teLLNKbBbnR-g-Pl-wT5iQ_48x48.png', name: 'Burnley', points: 0 },
  { position: 2, logo: 'https://ssl.gstatic.com/onebox/media/sports/logos/fhBITrIlbQxhVB6IjxG24Q_48x48.png', name: 'Chelsea', points: 0 },
  { position: 3, logo: 'https://ssl.gstatic.com/onebox/media/sports/logos/8piQOz-LgT23f9i_k4h2xA_48x48.png', name: 'Crystal Palace', points: 0 },
];

const gameStylesData = [
  { title: "Possession Game", img: possessionGameImg },
  { title: "Counter Attack", img: counterAttackImg },
  { title: "Long Balls", img: longBallsImg },
  { title: "High Press", img: highPressImg },
  { title: "Zone Marking", img: zoneMarkingImg },
];


// --- SUB-COMPONENTS ---

const Card = ({ children, className = '' }) => (
  <div className={`bg-white p-6 rounded-lg shadow-sm border border-slate-200 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ title, buttonText, onButtonClick }) => (
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-lg font-semibold text-slate-700">{title}</h2>
    <button onClick={onButtonClick} className="text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 px-3 py-1 rounded-md transition">
      {buttonText}
    </button>
  </div>
);

const NextEventsCard = () => (
  <Card>
    <CardHeader title="Next events" buttonText="Plan event" />
    <div className="space-y-4">
      <div className="flex items-center text-slate-500">
        <Calendar className="w-5 h-5 mr-3 text-slate-400" />
        <span>No training planned</span>
      </div>
      <div className="flex items-center text-slate-500">
        <Calendar className="w-5 h-5 mr-3 text-slate-400" />
        <span>No match planned</span>
      </div>
    </div>
  </Card>
);

const AllPlayersCard = () => (
  <Card className="flex flex-col h-full">
    <CardHeader title="Players" buttonText="Add players" />
    <div className="flex-grow flex flex-col items-center justify-center text-center text-slate-500">
      <p className="mb-4">You haven't created any players</p>
      <button className="text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-md transition">
        Add players
      </button>
    </div>
  </Card>
);

const RightColumn = () => (
    <div className="space-y-4">
        <Button className="w-full bg-cyan-600 text-white px-6 py-7 text-lg hover:bg-cyan-700 transition flex items-center justify-center">
            <ClipboardList className="h-6 w-6 mr-3" />
            Access Game Plan
        </Button>
        <LeagueTable />
    </div>
);

const LeagueTable = () => (
    <Card>
        <div className="flow-root">
            <ul role="list" className="-my-4 divide-y divide-slate-200">
                {leagueTableData.map((team) => (
                    <li key={team.position} className="flex items-center py-3 space-x-4">
                        <div className="flex-shrink-0">
                            <span className="text-sm font-medium text-slate-500">{team.position}.</span>
                        </div>
                        <div className="flex-shrink-0 h-8 w-8">
                            <img className="h-8 w-8 rounded-full object-contain" src={team.logo} alt={`${team.name} logo`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">{team.name}</p>
                        </div>
                        <div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-slate-100 text-slate-700">
                                {team.points}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    </Card>
);


const GameStyles = () => (
  <div className="mt-8">
    <h2 className="text-xl font-bold text-slate-800 mb-4">Game Styles</h2>
    <div className="relative">
      <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4">
        {gameStylesData.map((style) => {
          // Conditionally apply a class to scale the specific image
          const imageClass = `w-full h-36 object-contain ${
            style.title === 'High Press' ? 'transform scale-125' : ''
          }`;

          return (
            <div key={style.title} className="flex-shrink-0 w-52 text-center">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden p-2">
                <img src={style.img} alt={style.title} className={imageClass} />
              </div>
              <p className="mt-3 font-semibold text-slate-600">{style.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

// --- MAIN Home COMPONENT ---

const HeroSection = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <NextEventsCard />
          <AllPlayersCard />
          <RightColumn />
        </div>

        {/* Bottom Section */}
        <GameStyles />

      </div>
    </div>
  );
};

export default HeroSection;

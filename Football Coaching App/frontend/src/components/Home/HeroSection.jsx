import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ClipboardList, Calendar } from 'lucide-react';
import possessionGameImg from '@/assets/possession.png';
import counterAttackImg from '@/assets/counter-attack.png';
import longBallsImg from '@/assets/long-balls.png';
import highPressImg from '@/assets/high-press.png';
import zoneMarkingImg from '@/assets/zone-marking.png';



const gameStylesData = [
  { title: "Possession Game", img: possessionGameImg },
  { title: "Counter Attack", img: counterAttackImg },
  { title: "Long Balls", img: longBallsImg },
  { title: "High Press", img: highPressImg },
  { title: "Zone Marking", img: zoneMarkingImg },
];



const Card = ({ children, className = '' }) => (
  <div className={`bg-white p-6 rounded-lg shadow-sm border border-slate-200 ${className}`}>
    {children}
  </div>
);



const CardHeader = ({ title, buttonText, onButtonClick }) => (
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-lg font-semibold text-slate-700">{title}</h2>
    {buttonText && (
      <button onClick={onButtonClick} className="text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 px-3 py-1 rounded-md transition">
        {buttonText}
      </button>
    )}
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



// --- UPDATED LEAGUE TABLE COMPONENT ---
const LeagueTable = () => {
    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);



    useEffect(() => {
        const fetchStandings = async () => {
            try {
                // 1. Get the authentication token from local storage.
                // Your login logic must save the token here for this to work.
                const token = localStorage.getItem('token');



                if (!token) {
                    setError('You must be logged in to view the league table.');
                    setLoading(false);
                    return;
                }



                // 2. Send the token in the Authorization header.
                const response = await fetch('http://localhost:5001/api/external/standings/1/61627', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
               
                if (!response.ok) {
                    // Handle specific auth errors
                    if (response.status === 401) {
                         setError('Your session has expired. Please log in again.');
                    } else {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return; // Stop execution if there's an error
                }
               
                const data = await response.json();
                const newStandings = data.standings[0]?.rows || [];
                setStandings(newStandings);



            } catch (e) {
                console.error("Failed to fetch standings:", e);
                setError('Could not load league table.');
            } finally {
                setLoading(false);
            }
        };



        fetchStandings();
    }, []);



    return (
        <Card>
            <CardHeader title="Premier League" />
            <div className="flow-root">
                {loading && <p className="text-center text-slate-500">Loading standings...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                {!loading && !error && standings.length > 0 && (
                    <ul role="list" className="-my-4 divide-y divide-slate-200">
                        {standings.slice(0, 10).map((row) => (
                            <li key={row.team.id} className="flex items-center py-3 space-x-4">
                                <div className="w-6 text-center flex-shrink-0">
                                    <span className="text-sm font-medium text-slate-500">{row.position}.</span>
                                </div>
                                <div className="flex-shrink-0 h-8 w-8">
                                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                                        {row.team.name.charAt(0)}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-800 truncate">{row.team.name}</p>
                                </div>
                                <div>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-bold bg-slate-100 text-slate-700">
                                        {row.totalPoints}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                 {!loading && !error && standings.length === 0 && (
                    <p className="text-center text-slate-500">No standings data available.</p>
                )}
            </div>
        </Card>
    );
};






const GameStyles = () => (
  <div className="mt-8">
    <h2 className="text-xl font-bold text-slate-800 mb-4">Game Styles</h2>
    <div className="relative">
      <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4">
        {gameStylesData.map((style) => (
          <div key={style.title} className="flex-shrink-0 w-52 text-center">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden p-2">
              <img src={style.img} alt={style.title} className={`w-full h-36 object-contain ${style.title === 'High Press' ? 'transform scale-125' : ''}`} />
            </div>
            <p className="mt-3 font-semibold text-slate-600">{style.title}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);



const HeroSection = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <NextEventsCard />
          <AllPlayersCard />
          <RightColumn />
        </div>
        <GameStyles />
      </div>
    </div>
  );
};



export default HeroSection;


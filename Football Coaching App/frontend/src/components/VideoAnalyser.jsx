import React, { useState, useRef, useEffect } from 'react';
import { FaUpload, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import Navbar from './shared/Navbar';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

// The new Python Microservice handles processing
const AI_SERVICE_URL = 'http://localhost:8000/api/process-video';

const VideoAnalyser = () => {
  const { token } = useSelector((state) => state.auth);

  // Step Management
  // 1: Upload, 2: Calibrate (Pitch), 3: Calibrate (Teams), 4: Processing, 5: Results
  const [step, setStep] = useState(1);

  // File State
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  // Calibration State
  const videoRef = useRef(null);
  const [pitchCorners, setPitchCorners] = useState([]); // Array of {x, y}
  const [teamCentroids, setTeamCentroids] = useState([]); // Array of {x, y}
  const [attackDirection, setAttackDirection] = useState('leftToRight');

  // Output State
  const [stats, setStats] = useState(null);
  const [telemetry, setTelemetry] = useState([]);

  // Dashboard Playback State
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0);

  // Playback Loop for the 2D Pitch
  useEffect(() => {
    let interval;
    if (step === 5 && telemetry.length > 0) {
      interval = setInterval(() => {
        setCurrentFrameIdx(prev => (prev + 1) % telemetry.length);
      }, 100); // 10 FPS matching backend extraction rate
    }
    return () => clearInterval(interval);
  }, [step, telemetry]);

  // --- Step 1: Upload ---
  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
      setStep(2);
      toast.info("Step 1 Complete. Please calibrate the pitch.");
    }
  };

  // --- Step 2 & 3: Calibration Clicks ---
  const handleVideoClick = (e) => {
    if (!videoRef.current) return;

    // Get click coordinates relative to the video element's natural resolution
    const rect = videoRef.current.getBoundingClientRect();
    const scaleX = videoRef.current.videoWidth / rect.width;
    const scaleY = videoRef.current.videoHeight / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    if (step === 2) {
      if (pitchCorners.length < 4) {
        const newCorners = [...pitchCorners, { x: clickX, y: clickY }];
        setPitchCorners(newCorners);
        if (newCorners.length === 4) setStep(3);
      }
    } else if (step === 3) {
      if (teamCentroids.length < 2) {
        const newCentroids = [...teamCentroids, { x: clickX, y: clickY }];
        setTeamCentroids(newCentroids);
      }
    }
  };

  // --- Step 4: Submission ---
  const submitToAI = async () => {
    if (pitchCorners.length !== 4 || teamCentroids.length !== 2) {
      toast.error("Please complete all calibration clicks.");
      return;
    }

    setStep(4);

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('calibrationPoints', JSON.stringify(pitchCorners));
    formData.append('teamCentroids', JSON.stringify(teamCentroids));
    formData.append('attackDirection', attackDirection);

    try {
      const response = await axios.post(AI_SERVICE_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setStats(response.data.metrics);
      setTelemetry(response.data.telemetry);
      setStep(5);
      toast.success("Tactical Analysis Complete!");

    } catch (error) {
      console.error("AI processing failed", error);
      toast.error("Video analysis failed. Ensure Python microservice is running.");
      setStep(3); // Go back to let them try again
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-slate-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Tactical Shape Engine</h1>
              <p className="text-slate-500 font-medium mt-1">AI-Powered Video Tracking & Spacing Analysis</p>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(s => (
                <div key={s} className={`h-2 w-12 rounded-full ${step >= s ? 'bg-blue-600' : 'bg-slate-200'}`} />
              ))}
            </div>
          </div>

          <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100">
            {step === 1 && (
              <div className="p-12 text-center">
                <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaUpload size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Upload Match Footage</h2>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">Select a short 20-60s clip from a tripod or steady phone pointing at the pitch. MP4 or MOV.</p>
                <label className="inline-block bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-xl cursor-pointer transition-transform active:scale-95 shadow-lg shadow-slate-200">
                  Select Video File
                  <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
                </label>
              </div>
            )}

            {(step === 2 || step === 3) && (
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-2/3 bg-slate-900 relative">
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-bold z-10">
                    {step === 2 ? "🎯 Click 4 Pitch Corners (Top-L, Top-R, Bot-R, Bot-L)" : "👕 Click 1 Player from Team A, then Team B"}
                  </div>
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full h-auto max-h-[60vh] object-contain cursor-crosshair"
                    onClick={handleVideoClick}
                    onLoadedData={() => { if (videoRef.current) videoRef.current.currentTime = 0; }} // lock to first frame
                  />
                </div>

                <div className="lg:w-1/3 p-6 flex flex-col justify-between border-l border-slate-100">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Calibration Details</h3>

                    <div className="mb-6">
                      <h4 className="text-xs font-bold uppercase text-slate-400 mb-2 tracking-wider">Homography Points</h4>
                      <ul className="space-y-2">
                        {[0, 1, 2, 3].map(i => (
                          <li key={i} className="flex items-center gap-3 text-sm">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${pitchCorners[i] ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
                              {i + 1}
                            </div>
                            <span className={pitchCorners[i] ? 'text-slate-800 font-medium' : 'text-slate-400'}>
                              {pitchCorners[i] ? `X: ${Math.round(pitchCorners[i].x)}, Y: ${Math.round(pitchCorners[i].y)}` : 'Awaiting click...'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-xs font-bold uppercase text-slate-400 mb-2 tracking-wider">Team Recognition</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-3 text-sm">
                          <div className={`w-3 h-3 rounded-full ${teamCentroids[0] ? 'bg-blue-500' : 'bg-slate-200'}`} />
                          <span className={teamCentroids[0] ? 'text-slate-800 font-medium' : 'text-slate-400'}>Team A Reference</span>
                        </li>
                        <li className="flex items-center gap-3 text-sm">
                          <div className={`w-3 h-3 rounded-full ${teamCentroids[1] ? 'bg-red-500' : 'bg-slate-200'}`} />
                          <span className={teamCentroids[1] ? 'text-slate-800 font-medium' : 'text-slate-400'}>Team B Reference</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-xs font-bold uppercase text-slate-400 mb-2 tracking-wider">Attack Direction</h4>
                      <select
                        value={attackDirection}
                        onChange={(e) => setAttackDirection(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                      >
                        <option value="leftToRight">Team A attacks Left ➔ Right</option>
                        <option value="rightToLeft">Team A attacks Right ➔ Left</option>
                      </select>
                    </div>

                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => { setPitchCorners([]); setTeamCentroids([]); setStep(2); }}
                      className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-sm"
                    >
                      Reset Clicks
                    </button>
                    <button
                      onClick={submitToAI}
                      disabled={pitchCorners.length !== 4 || teamCentroids.length !== 2}
                      className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold rounded-xl transition-colors text-sm shadow-md"
                    >
                      Run Tracker
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="p-20 text-center flex flex-col items-center justify-center min-h-[400px]">
                <FaSpinner className="animate-spin text-blue-600 text-5xl mb-6" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Analyzing Footage...</h2>
                <p className="text-slate-500">Running YOLOv8 Tracking & Extracting Coordinates</p>
                <div className="w-64 bg-slate-100 h-2 rounded-full overflow-hidden mt-8">
                  <div className="h-full bg-blue-600 w-1/2 rounded-full animate-pulse blur-[1px]"></div>
                </div>
              </div>
            )}

            {step === 5 && stats && (
              <div className="p-6">
                <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-100 flex items-center justify-between mb-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <FaCheckCircle size={20} className="text-emerald-500" />
                    <div>
                      <p className="font-bold">Analysis Complete</p>
                      <p className="text-sm opacity-80">Tracked {stats.total_frames_processed} frames successfully.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setStep(1); setStats(null); setTelemetry([]); setPitchCorners([]); setTeamCentroids([]); }}
                    className="text-sm font-bold bg-white text-emerald-700 px-4 py-2 rounded shadow hover:shadow-md transition-shadow"
                  >
                    Analyze Another Clip
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Tactics Board */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-2 h-6 bg-blue-600 rounded"></span>
                      2D Tactical Projection
                    </h3>

                    {/* The Pitch Canvas Area */}
                    <div className="relative w-full aspect-[105/68] bg-emerald-600 border-4 border-emerald-800 rounded-lg shadow-inner shadow-black/30 overflow-hidden"
                      style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10%, rgba(255,255,255,0.05) 10%, rgba(255,255,255,0.05) 20%)' }}
                    >
                      {/* Center Circle & Line */}
                      <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/40 -translate-x-1/2" />
                      <div className="absolute top-1/2 left-1/2 w-1/4 aspect-square border-2 border-white/40 rounded-full -translate-x-1/2 -translate-y-1/2" />

                      {/* Penalty Areas */}
                      <div className="absolute top-1/4 bottom-1/4 left-0 w-1/6 border-2 border-l-0 border-white/40" />
                      <div className="absolute top-1/4 bottom-1/4 right-0 w-1/6 border-2 border-r-0 border-white/40" />

                      {/* Player Dots */}
                      {telemetry[currentFrameIdx]?.players.map((p, i) => {
                        const isTeamA = p.team === 'Team A';
                        const isTeamB = p.team === 'Team B';
                        if (!isTeamA && !isTeamB) return null; // Ignore unknown/refs

                        // Convert meters to %
                        // Standard pitch 105x68. 
                        const leftPct = (p.x / 105) * 100;
                        const topPct = (p.y / 68) * 100;

                        // If out of bounds drastically, hide it
                        if (leftPct < -10 || leftPct > 110 || topPct < -10 || topPct > 110) return null;

                        return (
                          <div
                            key={`${p.id}-${i}`}
                            className={`absolute w-3 h-3 rounded-full shadow border border-white transform -translate-x-1/2 -translate-y-1/2 transition-all duration-[100ms] ease-linear
                                ${isTeamA ? 'bg-blue-500' : 'bg-red-500'}
                              `}
                            style={{
                              left: `${leftPct}%`,
                              top: `${topPct}%`,
                            }}
                          />
                        );
                      })}
                    </div>

                    {/* Timeline slider mock */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-500 w-12 text-right">0:{(currentFrameIdx / 10).toFixed(1)}</span>
                      <input
                        type="range"
                        min="0"
                        max={telemetry.length - 1}
                        value={currentFrameIdx}
                        onChange={(e) => setCurrentFrameIdx(parseInt(e.target.value))}
                        className="flex-1 accent-blue-600"
                      />
                      <span className="text-xs font-bold text-slate-500 w-12">0:{(telemetry.length / 10).toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Right Column: Metrics Summaries */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-2 h-6 bg-slate-800 rounded"></span>
                      Structural Metrics
                    </h3>

                    {['Team A', 'Team B'].map(teamName => {
                      const currentMetrics = telemetry[currentFrameIdx]?.metrics;
                      const tKey = teamName === 'Team A' ? 'team_a' : 'team_b';
                      const tM = currentMetrics?.[tKey];
                      const tColor = teamName === 'Team A' ? 'text-blue-600' : 'text-red-600';
                      const bColor = teamName === 'Team A' ? 'border-blue-200' : 'border-red-200';
                      const bgColor = teamName === 'Team A' ? 'bg-blue-50' : 'bg-red-50';

                      return (
                        <div key={teamName} className={`p-4 rounded-xl border ${bColor} ${bgColor}`}>
                          <h4 className={`font-bold ${tColor} mb-3 flex items-center justify-between`}>
                            {teamName}
                            <span className="text-xs px-2 py-0.5 bg-white rounded-full border border-inherit">
                              {attackDirection === 'leftToRight' && teamName === 'Team A' ? 'Attacking ➔' : 'Defending ⬅'}
                            </span>
                          </h4>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white p-2 rounded border border-inherit text-center">
                              <p className="text-[9px] uppercase font-bold text-slate-400">Width</p>
                              <p className="text-lg font-black text-slate-800">{tM?.width ? `${Math.round(tM.width)}m` : '-'}</p>
                            </div>
                            <div className="bg-white p-2 rounded border border-inherit text-center">
                              <p className="text-[9px] uppercase font-bold text-slate-400">Depth</p>
                              <p className="text-lg font-black text-slate-800">{tM?.depth ? `${Math.round(tM.depth)}m` : '-'}</p>
                            </div>
                            <div className="bg-white p-2 rounded border border-inherit text-center">
                              <p className="text-[9px] uppercase font-bold text-slate-400">Compactness</p>
                              <p className="text-lg font-black text-slate-800">{tM?.compactness ? `${(tM.compactness).toFixed(1)}m` : '-'}</p>
                            </div>
                            <div className="bg-white p-2 rounded border border-inherit text-center">
                              <p className="text-[9px] uppercase font-bold text-slate-400">Line Gaps</p>
                              <p className="text-lg font-black text-slate-800">{tM?.line_gap_1 ? `${Math.round(tM.line_gap_1)}m` : '-'}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    <div className="bg-slate-900 text-white p-5 rounded-xl shadow-lg mt-6">
                      <h4 className="font-bold mb-2">💡 AI Insight</h4>
                      {telemetry[currentFrameIdx] && (() => {
                        const ta = telemetry[currentFrameIdx].metrics?.team_a;
                        if (ta && ta.depth > 35) return <p className="text-sm text-slate-300">Team A is severely stretched vertically.</p>;
                        if (ta && ta.width < 40) return <p className="text-sm text-slate-300">Team A attacking shape is too narrow.</p>;
                        if (ta && ta.line_gap_1 > 15) return <p className="text-sm text-slate-300">Team A lines are disconnected.</p>;
                        return <p className="text-sm text-emerald-400">Great structural compactness.</p>;
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default VideoAnalyser;
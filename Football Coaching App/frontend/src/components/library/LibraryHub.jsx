import React from 'react';
import Navbar from '@/components/shared/Navbar';
import { BookOpen, PlayCircle, FileText, ArrowRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LibraryHub = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <Navbar />

            {/* Premium Header */}
            <div className="bg-[#0B1C3F] border-b border-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20 relative z-10">
                    <span className="text-cyan-400 font-bold text-xs uppercase tracking-widest mb-3 block flex items-center gap-2">
                        <BookOpen size={16} /> Coach Education & Resources
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase mb-4">
                        Tactical Library
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl font-medium">
                        Access premium courses, tactical breakdowns, and training drills to elevate your coaching methodology.
                    </p>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12">

                {/* Featured Section */}
                <div className="mb-16">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3 mb-6">
                        <TrendingUp className="text-cyan-600" size={24} /> Featured Article
                    </h2>

                    <div
                        onClick={() => navigate('/library/4-4-2-formation')}
                        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row group cursor-pointer hover:shadow-lg hover:border-cyan-300 transition-all duration-300"
                    >
                        {/* Featured Image Placeholder */}
                        <div className="md:w-2/5 bg-slate-800 relative min-h-[250px] md:min-h-full overflow-hidden">
                            <div className="absolute inset-0 bg-cyan-900 mix-blend-multiply opacity-50 group-hover:opacity-30 transition-opacity"></div>
                            {/* Pitch Graphic Representation */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-80">
                                <div className="w-3/4 h-[1px] bg-white/20 absolute"></div>
                                <div className="h-3/4 w-[1px] bg-white/20 absolute"></div>
                                <div className="w-24 h-24 border-2 border-white/20 rounded-full"></div>
                            </div>
                        </div>

                        {/* Featured Content */}
                        <div className="p-8 md:p-10 flex flex-col justify-center flex-1">
                            <div className="flex gap-2 mb-4">
                                <span className="bg-cyan-50 text-cyan-700 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md">Tactics</span>
                                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md">Formations</span>
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-3 group-hover:text-cyan-600 transition-colors">
                                The 4-4-2 Formation: A Complete Tactical Guide
                            </h3>
                            <p className="text-slate-500 font-medium mb-8 line-clamp-2 max-w-2xl">
                                Explore the history, core principles, defensive solidity, and attacking variations of football's most iconic shape. Learn how to implement it effectively with your squad.
                            </p>

                            <div className="flex items-center text-cyan-600 font-bold uppercase tracking-wider text-xs group-hover:translate-x-2 transition-transform">
                                Read Article <ArrowRight size={16} className="ml-2" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid Section */}
                <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6">
                        Browse by Category
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Dummy Card 1 */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col hover:border-slate-300 hover:shadow-sm transition-all cursor-not-allowed opacity-75">
                            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 mb-4">
                                <PlayCircle size={24} />
                            </div>
                            <h3 className="font-black text-lg text-slate-800 mb-2">Video Analysis Courses</h3>
                            <p className="text-sm text-slate-500">Master the art of breaking down opponent footage and presenting data. (Coming Soon)</p>
                        </div>

                        {/* Dummy Card 2 */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col hover:border-slate-300 hover:shadow-sm transition-all cursor-not-allowed opacity-75">
                            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 mb-4">
                                <FileText size={24} />
                            </div>
                            <h3 className="font-black text-lg text-slate-800 mb-2">Training Session Plans</h3>
                            <p className="text-sm text-slate-500">Downloadable PDFs for complete 90-minute specialized training sessions. (Coming Soon)</p>
                        </div>

                        {/* Dummy Card 3 */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col hover:border-slate-300 hover:shadow-sm transition-all cursor-not-allowed opacity-75">
                            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 mb-4">
                                <BookOpen size={24} />
                            </div>
                            <h3 className="font-black text-lg text-slate-800 mb-2">Sports Science & Fitness</h3>
                            <p className="text-sm text-slate-500">Periodization strategies and injury prevention protocols for elite squads. (Coming Soon)</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LibraryHub;

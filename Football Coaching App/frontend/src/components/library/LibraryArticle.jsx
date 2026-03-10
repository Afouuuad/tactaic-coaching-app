import React from 'react';
import Navbar from '@/components/shared/Navbar';
import { ArrowLeft, BookOpen, Clock, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LibraryArticle = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
            <Navbar />

            {/* Premium Header */}
            <div className="bg-[#0f172a] text-white pt-16 pb-24 border-b border-slate-800">
                <div className="max-w-[900px] mx-auto px-6">
                    <button
                        onClick={() => navigate('/library')}
                        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold text-sm tracking-wider uppercase mb-8 transition-colors group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Library
                    </button>

                    <div className="flex flex-wrap gap-3 mb-6">
                        <span className="bg-cyan-900/50 text-cyan-400 border border-cyan-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                            <Tag size={12} /> Tactics
                        </span>
                        <span className="bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                            <Clock size={12} /> 10 Min Read
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-6">
                        The 4-4-2 Formation: Core Principles and Tactical Variations
                    </h1>

                    <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-[800px]">
                        A comprehensive deep-dive into the most iconic formation in football history. Discover why the 4-4-2 remains a fundamental tactical shape for modern coaches.
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-[900px] mx-auto px-6 -mt-12 relative z-10">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-12">

                    <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-cyan-600">
                        {/* Intro */}
                        <p className="lead text-xl text-slate-600 font-medium mb-10">
                            The <strong>4-4-2 formation</strong> is deeply ingrained in the tactics and history of football. Once the dominant system across global leagues, particularly in England during the 1990s and 2000s, it provides a balanced structure that ensures solid defensive blocks alongside potent attacking partnerships.
                        </p>

                        {/* Section 1 */}
                        <h2 className="text-2xl font-black text-slate-900 mt-12 mb-6 flex items-center gap-3">
                            <span className="bg-cyan-100 text-cyan-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                            What is the 4-4-2 Formation?
                        </h2>
                        <p>
                            It consists of four defenders (two center-backs and two full-backs), four midfielders (two central midfielders and two wide midfielders/wingers), and two central strikers.
                            The beauty of the 4-4-2 lies in its symmetry and clearly defined lines of four, making it relatively straightforward to teach and execute. It naturally creates passing triangles and partnerships across the pitch: the full-back and winger, the two center-backs, the central midfield duo, and the striking pair.
                        </p>

                        <div className="my-10 bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
                            {/* Placeholder for a tactical pitch diagram */}
                            <div className="w-full max-w-[400px] aspect-[3/4] bg-green-800 rounded-lg mx-auto border-4 border-white shadow-inner flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-white/30 -translate-y-1/2"></div>
                                <div className="absolute w-20 h-20 border-2 border-white/30 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                                <p className="text-white/50 font-bold uppercase tracking-widest rotate-90 absolute right-4">Static Diagram Placeholder</p>

                                {/* Defense */}
                                <div className="absolute bottom-10 left-1/4 w-4 h-4 rounded-full bg-cyan-400 border border-white"></div>
                                <div className="absolute bottom-8 left-1/2 -translate-x-6 w-4 h-4 rounded-full bg-cyan-400 border border-white"></div>
                                <div className="absolute bottom-8 left-1/2 translate-x-2 w-4 h-4 rounded-full bg-cyan-400 border border-white"></div>
                                <div className="absolute bottom-10 right-1/4 w-4 h-4 rounded-full bg-cyan-400 border border-white"></div>

                                {/* Midfield */}
                                <div className="absolute bottom-32 left-1/4 w-4 h-4 rounded-full bg-cyan-400 border border-white"></div>
                                <div className="absolute bottom-28 left-1/2 -translate-x-6 w-4 h-4 rounded-full bg-cyan-400 border border-white"></div>
                                <div className="absolute bottom-28 left-1/2 translate-x-2 w-4 h-4 rounded-full bg-cyan-400 border border-white"></div>
                                <div className="absolute bottom-32 right-1/4 w-4 h-4 rounded-full bg-cyan-400 border border-white"></div>

                                {/* Attack */}
                                <div className="absolute top-1/3 left-1/2 -translate-x-8 w-4 h-4 rounded-full bg-cyan-400 border border-white"></div>
                                <div className="absolute top-1/3 left-1/2 translate-x-4 w-4 h-4 rounded-full bg-cyan-400 border border-white"></div>
                            </div>
                        </div>

                        {/* Section 2 */}
                        <h2 className="text-2xl font-black text-slate-900 mt-12 mb-6 flex items-center gap-3">
                            <span className="bg-cyan-100 text-cyan-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                            Key Roles & Responsibilities
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                <h3 className="font-bold text-slate-800 mb-2">The Striking Partnership</h3>
                                <p className="text-sm text-slate-600">Typically pairs a "target man" (who holds up play and wins aerial duals) with a "poacher" or quick forward who runs in behind the defensive line. Their chemistry is crucial to the system's attacking output.</p>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                <h3 className="font-bold text-slate-800 mb-2">Central Midfielders (The Engine Room)</h3>
                                <p className="text-sm text-slate-600">Requires immense stamina and tactical discipline. Often split into a "destroyer" (defensive pivot) and a "creator" (box-to-box or deep-lying playmaker).</p>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                <h3 className="font-bold text-slate-800 mb-2">Wide Midfielders / Wingers</h3>
                                <p className="text-sm text-slate-600">Tasked with providing width and delivering crosses from the flanks. Defensively, they must drop back to form a flat line of four, protecting the full-backs.</p>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                <h3 className="font-bold text-slate-800 mb-2">The Back Four</h3>
                                <p className="text-sm text-slate-600">Center-backs must dominate the penalty area, while full-backs handle overlapping runs to support the attack while rarely abandoning their defensive posts.</p>
                            </div>
                        </div>

                        {/* Section 3 */}
                        <h2 className="text-2xl font-black text-slate-900 mt-12 mb-6 flex items-center gap-3">
                            <span className="bg-cyan-100 text-cyan-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                            Pros & Cons
                        </h2>

                        <div className="flex flex-col md:flex-row gap-8 my-8">
                            <div className="flex-1 bg-green-50 border border-green-200 p-6 rounded-xl">
                                <h3 className="text-green-800 font-bold mb-4 uppercase tracking-widest text-sm text-center">Advantages</h3>
                                <ul className="space-y-2 text-sm text-green-900">
                                    <li>✓ Pitch-wide defensive solidity</li>
                                    <li>✓ Two central strikers continually pressure the opposing center-backs</li>
                                    <li>✓ Easy to understand and coach across all age groups</li>
                                    <li>✓ Excellent structure for counter-attacking football</li>
                                </ul>
                            </div>
                            <div className="flex-1 bg-red-50 border border-red-200 p-6 rounded-xl">
                                <h3 className="text-red-800 font-bold mb-4 uppercase tracking-widest text-sm text-center">Disadvantages</h3>
                                <ul className="space-y-2 text-sm text-red-900">
                                    <li>✗ Often outnumbered in central midfield against modern 4-3-3 or 4-2-3-1 shapes</li>
                                    <li>✗ Predictable attacking patterns</li>
                                    <li>✗ Demands extreme physical exertion from the central midfield duo</li>
                                </ul>
                            </div>
                        </div>

                        {/* Conclusion */}
                        <div className="mt-12 pt-8 border-t border-slate-200">
                            <h3 className="font-bold text-slate-800 mb-4">Modern Implementation</h3>
                            <p className="text-slate-600 text-sm">
                                While fewer elite teams use a rigid 4-4-2 as their primary attacking shape today, many top managers (like Diego Simeone at Atlético Madrid or Sean Dyche) weaponize it as a compact defensive block out of possession. It remains a legendary cornerstone of tactical theory.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default LibraryArticle;

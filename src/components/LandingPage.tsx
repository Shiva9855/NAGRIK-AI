import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  Zap, 
  ChevronRight, 
  Award, 
  Activity, 
  Users, 
  BarChart3, 
  Eye, 
  Camera,
  MessageSquare,
  TrendingUp,
  BrainCircuit,
  CornerRightDown
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreMap: () => void;
}

export default function LandingPage({ onGetStarted, onExploreMap }: LandingPageProps) {
  // Mock live event stream for hackathon feel
  const liveEvents = [
    { time: 'Just now', icon: '⚡', text: 'AI detected Water Leakage with 97% confidence in Indiranagar Ward' },
    { time: '5 mins ago', icon: '🎉', text: 'Garbage Dump cleared successfully in Koramangala Ward' },
    { time: '18 mins ago', icon: '🔥', text: '5 community volunteers verified damaged Electric Pole in HSR Layout' },
    { time: '1 hour ago', icon: '🏆', text: 'Rajesh Kumar earned "Community Hero" badge' },
  ];

  return (
    <div className="bg-slate-950 text-white min-h-screen relative overflow-hidden" id="landing-page-root">
      
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[450px] h-[450px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 text-center">
        {/* Banner Announcement */}
        <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-8 animate-fade-in-down">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-emerald-300 font-semibold tracking-wide">AI-Driven Hyperlocal Civic Engine for Smart Cities</span>
        </div>

        {/* Catchy Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none mb-6">
          <span className="block text-slate-100">Empowering Citizens.</span>
          <span className="block bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
            Transforming Communities.
          </span>
        </h1>

        {/* Dynamic Pitch Paragraph */}
        <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-400 mb-10 leading-relaxed">
          NagrikAI turns every smartphone into a smart municipal sensor. Report potholes, broken lights, and public litter. Our advanced **Computer Vision** classifies defects, estimates repair costs, matches duplicates, and dispatches them straight to ward officers instantly.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base transition-all duration-200 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:-translate-y-0.5 flex items-center justify-center group"
          >
            Launch Platform
            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={onExploreMap}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-base transition-all duration-200 flex items-center justify-center"
          >
            <MapPin className="w-5 h-5 mr-2 text-rose-500" />
            Explore Hyperlocal Live Map
          </button>
        </div>

        {/* Real-time Ticker Box (Hackathon highlight feature) */}
        <div className="max-w-4xl mx-auto bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-4 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-3 md:space-y-0 text-left">
            <div className="flex items-center space-x-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">Live Activity Pulse:</span>
            </div>
            <div className="flex-1 px-4 text-xs sm:text-sm text-slate-300 font-medium line-clamp-1">
              {liveEvents[0].icon} {liveEvents[0].text}
            </div>
            <span className="text-xs text-slate-500 bg-slate-800 px-2.5 py-1 rounded-full">{liveEvents[0].time}</span>
          </div>
        </div>
      </section>

      {/* Problem Statistics / Impact Numbers */}
      <section className="bg-slate-950 border-y border-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4 bg-slate-900/30 rounded-xl border border-slate-800/40">
              <span className="block text-4xl sm:text-5xl font-extrabold text-white">48+ Hrs</span>
              <span className="block text-xs sm:text-sm text-emerald-400 font-semibold mt-1">Saved Per Issue</span>
            </div>
            <div className="p-4 bg-slate-900/30 rounded-xl border border-slate-800/40">
              <span className="block text-4xl sm:text-5xl font-extrabold text-white">96.4%</span>
              <span className="block text-xs sm:text-sm text-emerald-400 font-semibold mt-1">AI Classification Accuracy</span>
            </div>
            <div className="p-4 bg-slate-900/30 rounded-xl border border-slate-800/40">
              <span className="block text-4xl sm:text-5xl font-extrabold text-white">4,200+</span>
              <span className="block text-xs sm:text-sm text-emerald-400 font-semibold mt-1">Active Smart Citizens</span>
            </div>
            <div className="p-4 bg-slate-900/30 rounded-xl border border-slate-800/40">
              <span className="block text-4xl sm:text-5xl font-extrabold text-white">1,580+</span>
              <span className="block text-xs sm:text-sm text-emerald-400 font-semibold mt-1">Civic Complaints Resolved</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Flow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Simple 4-Step Civil Resolution Loop</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            No complex bureaucracy. NagrikAI uses modern mobile capabilities and intelligent algorithms to empower citizens directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              step: '01',
              title: 'Snap & Upload',
              desc: 'Upload a picture of any streetlight, pothole, or garbage pile. Our OCR & vision scanner parses the metadata.',
              icon: Camera,
              color: 'text-sky-400 bg-sky-500/10'
            },
            {
              step: '02',
              title: 'AI Smart Extraction',
              desc: 'AI generates titles, tags severity, estimates cleanup costs, and prevents identical duplicates in real time.',
              icon: BrainCircuit,
              color: 'text-purple-400 bg-purple-500/10'
            },
            {
              step: '03',
              title: 'Crowd Verification',
              desc: 'Nearby neighbors receive instant pings to verify reports. Verified issues get promoted to the dispatch log automatically.',
              icon: Users,
              color: 'text-amber-400 bg-amber-500/10'
            },
            {
              step: '04',
              title: 'Official Resolution',
              desc: 'Ward officers track complaints, coordinate dispatch repairs, and update citizens on completion timeline.',
              icon: ShieldCheck,
              color: 'text-emerald-400 bg-emerald-500/10'
            }
          ].map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
                <div className="flex justify-between items-center mb-4">
                  <div className={`p-3 rounded-xl ${step.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-800">{step.step}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI Features & Tech Capabilities (The Hackathon Winner Selling Point) */}
      <section className="bg-slate-900/40 border-y border-slate-800/80 py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column: Visual AI Demo Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl relative group overflow-hidden">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors"></div>
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">AI Computer Vision Scan</span>
                </div>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-2.5 py-0.5 rounded-full">Active</span>
              </div>

              {/* Sample analyzed issue display */}
              <div className="space-y-4">
                <div className="aspect-video w-full rounded-xl overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=600" 
                    alt="Pothole"
                    className="object-cover w-full h-full filter brightness-75"
                  />
                  <div className="absolute inset-0 border-2 border-dashed border-emerald-400/60 rounded-xl m-2 animate-pulse"></div>
                  <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-800 text-[10px] font-mono text-emerald-400">
                    DETECTED: POTHOLE (98.2%)
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800/60">
                    <span className="text-slate-500 block mb-0.5">EST. REPAIR COST</span>
                    <span className="text-white font-bold text-sm text-emerald-400">₹18,500</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800/60">
                    <span className="text-slate-500 block mb-0.5">EST. TIMELINE</span>
                    <span className="text-white font-bold text-sm text-emerald-400">2 Days</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800/60">
                    <span className="text-slate-500 block mb-0.5">SEVERITY INDEX</span>
                    <span className="text-rose-400 font-bold text-sm">Critical</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800/60">
                    <span className="text-slate-500 block mb-0.5">DEPARTMENT</span>
                    <span className="text-white font-bold text-[10px] truncate">Public Works Dept</span>
                  </div>
                </div>

                {/* AI Explanation Box */}
                <div className="p-3 bg-emerald-950/20 rounded-xl border border-emerald-800/30 text-xs text-emerald-300">
                  ⚡ <strong>AI Decision Reasoning:</strong> Pothole exceeds 12cm depth post-monsoon on critical high-traffic artery. High danger index for evening motorbikes. Directing dispatch.
                </div>
              </div>
            </div>

            {/* Right Column: Platform Features text */}
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1">
                <BrainCircuit className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-purple-300 font-bold">Advanced AI Sub-Systems</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Not Just a Complaint Form.<br />An Intelligent Ecosystem.
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Most civic tools fail because of redundant spam reports and poor categorization. NagrikAI uses high-performance Gemini AI models and mathematical location comparison algorithms to filter data automatically.
              </p>

              <div className="space-y-4 pt-2">
                {[
                  {
                    title: "Smart Image Analytics & OCR",
                    desc: "Upload a picture of any streetlight, pothole, or garbage pile. Our OCR & vision scanner parses the metadata.",
                  },
                  {
                    title: "Predictive Analytics & Forecasting",
                    desc: "Uses history data to predict asphalt erosion, garbage accumulation, and drainage collapse probability.",
                  },
                  {
                    title: "Dynamic Duplicate Detection",
                    desc: "Warns citizens before submitting if identical complaints exist within 100 meters, guiding them to support existing ones.",
                  }
                ].map((item, i) => (
                  <div key={i} className="flex items-start">
                    <div className="mt-1 bg-emerald-500/20 p-1.5 rounded-md mr-3 text-emerald-400">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-white">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Leaderboard & Badges Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Gamifying Community Pride</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Citizens gain XP, rise on the local neighborhood leaderboard, and unlock high-status digital badges. Let’s clean the neighborhood together.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { name: "Community Hero", desc: "Verified over 15 local reports", icon: "🏆", color: "from-amber-400 to-orange-500 text-slate-950" },
            { name: "Guardian", desc: "Helped solve 5 critical public hazards", icon: "🛡️", color: "from-sky-400 to-indigo-500 text-white" },
            { name: "Volunteer", desc: "Reported 5 approved civic issues", icon: "❤️", color: "from-emerald-400 to-teal-500 text-slate-950" }
          ].map((b, i) => (
            <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center hover:scale-102 transition-all">
              <span className="text-5xl block mb-4">{b.icon}</span>
              <h4 className="font-bold text-white mb-1.5">{b.name}</h4>
              <p className="text-xs text-slate-400">{b.desc}</p>
              <div className="mt-4 inline-block text-[10px] uppercase tracking-wider font-extrabold bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 px-2.5 py-1 rounded-full">
                Unlockable Badge
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Call to Action */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-center">
        <div className="bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-500/20 rounded-3xl p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">Ready to upgrade your city?</h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base mb-8">
            Access the citizen platform, check ongoing repairs, or log in as an inspector/municipal ward manager.
          </p>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={onGetStarted}
              className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-md hover:scale-102"
            >
              Get Started Now
            </button>
            <button
              onClick={onExploreMap}
              className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-semibold transition-all"
            >
              Browse Issues Map
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center text-slate-950 font-bold text-xs">
              N
            </div>
            <span className="font-bold text-slate-300">NagrikAI</span>
          </div>
          <p className="text-center text-xs text-slate-600 mb-4 md:mb-0">
            © 2026 NagrikAI Civic Technologies Inc. Built for the Smart India and Global Municipal Hackathons.
          </p>
          <div className="flex space-x-6 text-xs text-slate-400">
            <a href="#landing" onClick={onGetStarted} className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#landing" onClick={onGetStarted} className="hover:text-emerald-400 transition-colors">Developer API</a>
            <a href="#landing" onClick={onGetStarted} className="hover:text-emerald-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

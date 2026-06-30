import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Search, 
  Check, 
  Mail, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles,
  PhoneCall,
  MapPin,
  Send,
  Plus
} from 'lucide-react';

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactText, setContactText] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const faqs = [
    {
      q: "How does the computer vision model detect civic defects?",
      a: "NagrikAI integrates advanced Gemini vision models. When you upload a picture, our system analyzes the visual pixels to classify the complaint, evaluate standard repair costs based on average Indian municipal schedules, and estimate safe severity indices."
    },
    {
      q: "What is Community Verification?",
      a: "To prevent spam and false alarms, reports remain in the 'AI Verified' phase until nearby neighbors review the grievance. When 3 citizens click the 'Verify' button, the status advances to 'Community Verified' and is pushed to official boards."
    },
    {
      q: "Can I redeem citizen points for real benefits?",
      a: "Yes! NagrikAI partners with local municipality bodies and public transport boards. You can convert your accumulated helper XP into property tax reductions, free bus/metro passes, or compost bag dispatches."
    },
    {
      q: "How does smart duplicate detection work?",
      a: "Before a new report is created, NagrikAI checks distance margins and image similarity against active issues in the same category. If there is a similar issue within 100 meters, it prompts you to upvote and support the existing report instead of creating a duplicate."
    }
  ];

  const filteredFaqs = faqs.filter(f => 
    f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactText) return;
    setFeedbackSuccess(true);
    setContactSubject('');
    setContactText('');
    setTimeout(() => setFeedbackSuccess(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8" id="help-center-root">
      
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-white flex items-center">
          Help Center & FAQs <HelpCircle className="w-6 h-6 ml-2 text-emerald-400" />
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Everything you need to know about points, verifications, dispatches, and AI computer vision parameters.
        </p>
      </div>

      {/* Grid: FAQ & Contact */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* FAQ list (3/5 span) */}
        <div className="lg:col-span-3 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
            <h3 className="font-bold text-slate-200">Frequently Asked Questions</h3>
            
            {/* Search FAQ */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FAQs..."
                className="bg-slate-900 border border-slate-800 rounded px-2 pl-7 py-1.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredFaqs.map((faq, idx) => (
              <div key={idx} className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl space-y-2">
                <h4 className="font-extrabold text-sm text-slate-200 flex items-start">
                  <span className="text-emerald-400 mr-2">Q.</span>
                  {faq.q}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed pl-5 border-l border-emerald-500/20">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

        </div>

        {/* Contact/Support Form (2/5 span) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="font-bold text-white flex items-center">
              <Mail className="w-4 h-4 mr-2 text-emerald-400" />
              Contact Municipal Reps
            </h3>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Have customized ward issues, comments, or complaints about officials? Write to us directly.
            </p>

            {feedbackSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 rounded-lg flex items-center">
                <Check className="w-4 h-4 mr-2" /> Message sent successfully to Indiranagar Ward Council.
              </div>
            )}

            <form onSubmit={handleSubmitFeedback} className="space-y-3.5">
              <div>
                <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Subject</label>
                <input
                  type="text"
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  placeholder="e.g. Broken pavement on 4th Main"
                  required
                  className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Detailed Inquiry</label>
                <textarea
                  value={contactText}
                  onChange={(e) => setContactText(e.target.value)}
                  placeholder="Describe your query or complaint in full details..."
                  rows={4}
                  required
                  className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-2 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded transition-colors flex items-center justify-center"
              >
                Send Inquiry <Send className="w-3.5 h-3.5 ml-1.5" />
              </button>
            </form>

          </div>

          {/* Quick ward hotlines */}
          <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Emergency Hotlines</h4>
            <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
              <p>☎️ <strong>Water Supply emergency:</strong> 1916 (BWSSB)</p>
              <p>☎️ <strong>Power failure dispatch:</strong> 1912 (BESCOM)</p>
              <p>☎️ <strong>Ward general assistance:</strong> 080-22660000</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

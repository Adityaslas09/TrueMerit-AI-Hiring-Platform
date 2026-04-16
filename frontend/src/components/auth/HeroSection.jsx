import { motion } from 'framer-motion';
import { CheckCircle2, Zap, GitBranch, Award } from 'lucide-react';
import GitHubPreviewCard from './GitHubPreviewCard';

const FEATURES = [
  { icon: <GitBranch size={15} className="text-blue-400" />, text: 'GitHub-based scoring engine' },
  { icon: <Zap size={15} className="text-purple-400" />, text: 'Real project evaluation via AI' },
  { icon: <Award size={15} className="text-green-400" />, text: 'Skill authenticity verification' },
];

const SCORE_BARS = [
  { label: 'GitHub Activity', pct: 88, color: 'from-blue-500 to-blue-400' },
  { label: 'Project Depth', pct: 75, color: 'from-purple-500 to-purple-400' },
  { label: 'Skill Alignment', pct: 92, color: 'from-green-500 to-green-400' },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } }
};
const itemVariant = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } }
};

const HeroSection = () => (
  <div className="hidden lg:flex w-full lg:w-[48%] relative bg-[#06080F] items-center justify-center p-10 xl:p-16 overflow-hidden border-r border-[#1C212B]">

    {/* Ambient Blobs */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute -top-[15%] -left-[5%] w-[65%] h-[65%] bg-blue-600/10 rounded-full blur-[130px] animate-blob" />
      <div className="absolute top-[30%] -right-[15%] w-[55%] h-[55%] bg-purple-600/10 rounded-full blur-[130px] animate-blob animation-delay-2000" />
      <div className="absolute -bottom-[10%] left-[15%] w-[60%] h-[60%] bg-emerald-600/8 rounded-full blur-[130px] animate-blob animation-delay-4000" />
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
    </div>

    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="relative z-10 w-full max-w-[500px]"
    >
      {/* Pill Badge */}
      <motion.div variants={itemVariant} className="inline-flex items-center gap-2.5 mb-10 bg-white/[0.04] border border-white/10 px-4 py-2.5 rounded-full backdrop-blur-md shadow-sm">
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_6px_rgba(96,165,250,0.8)]" />
        <span className="text-[11px] font-black text-gray-300 uppercase tracking-[0.18em]">Merit &gt; Marks</span>
      </motion.div>

      {/* Headline */}
      <motion.h1 variants={itemVariant} className="text-[3.2rem] xl:text-[3.6rem] font-black text-white leading-[1.08] mb-5 tracking-tight">
        Hire Talent.<br />
        <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">Not Just Grades.</span>
      </motion.h1>

      <motion.p variants={itemVariant} className="text-base text-gray-400 leading-relaxed font-light mb-8 max-w-[400px]">
        TrueMerit analyzes GitHub activity, project complexity, and real skills to generate an authentic, bias-free merit score for every candidate.
      </motion.p>

      {/* Feature Pills */}
      <motion.div variants={itemVariant} className="flex flex-col gap-3 mb-10">
        {FEATURES.map((f, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center shrink-0">
              {f.icon}
            </div>
            <span className="text-sm text-gray-300 font-medium">{f.text}</span>
          </div>
        ))}
      </motion.div>

      {/* Score Dashboard Card */}
      <motion.div
        variants={itemVariant}
        className="bg-gradient-to-br from-[#111827]/90 to-[#0F172A]/90 border border-white/[0.08] rounded-2xl p-5 shadow-[0_0_60px_rgba(59,130,246,0.07)] backdrop-blur-xl max-w-[380px] mb-4"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-0.5">TrueMerit Score</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-black text-white leading-none">82</span>
              <span className="text-sm text-gray-500 font-medium">/ 100</span>
            </div>
          </div>
          <div className="relative w-16 h-16">
            <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e293b" strokeWidth="3" />
              <motion.circle
                cx="18" cy="18" r="15.9"
                fill="none"
                stroke="url(#scoreGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="100"
                initial={{ strokeDashoffset: 100 }}
                animate={{ strokeDashoffset: 18 }}
                transition={{ duration: 1.4, delay: 0.8, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <CheckCircle2 size={18} className="text-blue-400" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {SCORE_BARS.map((bar, i) => (
            <div key={i}>
              <div className="flex justify-between mb-1.5">
                <span className="text-[11px] text-gray-400 font-medium">{bar.label}</span>
                <span className="text-[11px] text-gray-300 font-bold">{bar.pct}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${bar.pct}%` }}
                  transition={{ duration: 1, delay: 0.9 + i * 0.15, ease: 'easeOut' }}
                  className={`h-full rounded-full bg-gradient-to-r ${bar.color}`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* GitHub Preview Card */}
      <motion.div variants={itemVariant}>
        <GitHubPreviewCard />
      </motion.div>

      {/* Social Proof */}
      <motion.div variants={itemVariant} className="flex items-center gap-3 mt-6">
        <div className="flex -space-x-2">
          {[1, 2, 3, 4, 5].map(i => (
            <img
              key={i}
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=hero${i}`}
              alt="user"
              className="w-7 h-7 rounded-full border-2 border-[#06080F] bg-gray-800"
            />
          ))}
        </div>
        <div>
          <div className="flex items-center gap-1 mb-0.5">
            {[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400 text-[10px]">★</span>)}
          </div>
          <p className="text-[11px] text-gray-500">Trusted by <span className="text-white font-bold">1,000+</span> students &amp; recruiters</p>
        </div>
      </motion.div>
    </motion.div>
  </div>
);

export default HeroSection;

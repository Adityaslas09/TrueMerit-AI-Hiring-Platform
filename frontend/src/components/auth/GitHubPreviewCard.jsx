import { motion } from 'framer-motion';
import { Star, GitCommitHorizontal, GitFork } from 'lucide-react';

const MOCK_REPOS = [
  { name: 'ai-job-matcher', lang: 'TypeScript', stars: 142, color: '#3B82F6' },
  { name: 'devboard-ui', lang: 'JavaScript', stars: 89, color: '#F59E0B' },
  { name: 'neural-scheduler', lang: 'Python', stars: 213, color: '#10B981' },
];

const MOCK_LANGS = [
  { name: 'TypeScript', pct: 48, color: '#3B82F6' },
  { name: 'Python', pct: 31, color: '#10B981' },
  { name: 'JavaScript', pct: 21, color: '#F59E0B' },
];

const GitHubPreviewCard = ({ username }) => {
  const displayName = username || 'aditya-dev';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.5 }}
      className="mt-6 bg-[#0D1117]/80 border border-[#30363D] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.08)] backdrop-blur-2xl"
    >
      {/* Card Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#21262D]">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-md">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-white text-sm font-bold leading-none">{displayName}</p>
          <p className="text-gray-500 text-xs mt-0.5">github.com/{displayName}</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 bg-[#1F6FEB]/10 border border-[#1F6FEB]/30 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
          <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wide">Active</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 divide-x divide-[#21262D] border-b border-[#21262D]">
        {[
          { label: 'Repos', value: '28' },
          { label: 'Commits', value: '1.2k', icon: <GitCommitHorizontal size={12} /> },
          { label: 'Stars', value: '444', icon: <Star size={11} /> },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center py-3">
            <div className="flex items-center gap-1 text-white font-black text-base">
              {stat.icon && <span className="text-yellow-400">{stat.icon}</span>}
              {stat.value}
            </div>
            <div className="text-gray-500 text-[10px] font-medium uppercase tracking-wide mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Repos List */}
      <div className="px-4 py-3 space-y-2">
        {MOCK_REPOS.map((repo, i) => (
          <motion.div
            key={repo.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + i * 0.1 }}
            className="flex items-center justify-between group"
          >
            <div className="flex items-center gap-2">
              <GitFork size={12} className="text-gray-600" />
              <span className="text-blue-400 text-xs font-mono group-hover:text-blue-300 transition">{repo.name}</span>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-sm text-gray-400" style={{ background: `${repo.color}15`, border: `1px solid ${repo.color}30` }}>
                {repo.lang}
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <Star size={11} className="text-yellow-400/70" />
              {repo.stars}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Language Bar */}
      <div className="px-4 pb-4">
        <div className="w-full h-1.5 rounded-full overflow-hidden flex mt-3" style={{ gap: '2px' }}>
          {MOCK_LANGS.map((lang) => (
            <motion.div
              key={lang.name}
              initial={{ width: 0 }}
              animate={{ width: `${lang.pct}%` }}
              transition={{ duration: 1, delay: 0.9 }}
              style={{ background: lang.color }}
              className="h-full rounded-sm"
            />
          ))}
        </div>
        <div className="flex items-center gap-3 mt-2.5">
          {MOCK_LANGS.map((lang) => (
            <div key={lang.name} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: lang.color }} />
              <span className="text-[10px] text-gray-400 font-medium">{lang.name}</span>
              <span className="text-[10px] text-gray-600">{lang.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default GitHubPreviewCard;

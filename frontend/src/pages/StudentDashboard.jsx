import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Github, Link as LinkIcon, Star, GitCommit, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const StudentDashboard = () => {
  const { user, setUser } = useContext(AuthContext);
  const [profileForm, setProfileForm] = useState({
    college: user.college || '',
    cgpa: user.cgpa || '',
    githubUsername: user.githubUsername || '',
    skills: user.skills ? user.skills.join(', ') : '',
  });
  const [projects, setProjects] = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/students/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...profileForm,
        skills: profileForm.skills.split(',').map(s => s.trim()).filter(s => s)
      };
      const res = await axios.put('http://localhost:5000/api/students/profile', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser({ ...user, ...res.data });
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const scoreData = user.trueMeritScore ? [
    { name: 'GitHub', value: user.trueMeritScore.githubScore, color: '#3b82f6' },
    { name: 'Projects', value: user.trueMeritScore.projectScore, color: '#10b981' },
    { name: 'Academics', value: user.trueMeritScore.academicScore, color: '#f59e0b' },
    { name: 'Certifications', value: user.trueMeritScore.certScore, color: '#8b5cf6' },
  ] : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: TrueMerit Score & Stats */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-surface rounded-2xl p-6 border border-gray-800 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Star size={100} />
            </div>
            <h2 className="text-xl font-bold mb-4 text-textLight">TrueMerit Score</h2>
            <div className="flex items-end gap-2 mb-6">
              <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                {user.trueMeritScore?.total || 0}
              </span>
              <span className="text-textMuted mb-2">/ 100</span>
            </div>
            
            {user.trueMeritScore && user.trueMeritScore.total > 0 && (
              <div className="h-48 w-full mt-4 -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={scoreData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {scoreData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                      itemStyle={{ color: '#f8fafc' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {user.githubData && (
            <div className="bg-surface rounded-2xl p-6 border border-gray-800 shadow-lg">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Github size={20}/> GitHub Insights</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background p-4 rounded-xl border border-gray-800">
                  <div className="text-textMuted text-sm mb-1 flex items-center gap-1"><BookOpen size={14}/> Repos</div>
                  <div className="text-2xl font-bold">{user.githubData.publicRepos}</div>
                </div>
                <div className="bg-background p-4 rounded-xl border border-gray-800">
                  <div className="text-textMuted text-sm mb-1 flex items-center gap-1"><Star size={14}/> Stars</div>
                  <div className="text-2xl font-bold">{user.githubData.totalStars}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Setup & Projects */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Profile Form */}
          <div className="bg-surface rounded-2xl p-6 border border-gray-800 shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
              Complete Your Profile 
              {loading && <RefreshCw className="animate-spin text-primary" size={20} />}
            </h2>
            <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm text-textMuted ml-1">College/University</label>
                <input 
                  type="text" className="w-full bg-background border border-gray-700 rounded-xl py-2 px-4 focus:ring-1 focus:ring-primary focus:outline-none"
                  value={profileForm.college} onChange={e => setProfileForm({...profileForm, college: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-textMuted ml-1">CGPA (out of 10)</label>
                <input 
                  type="number" step="0.01" max="10" className="w-full bg-background border border-gray-700 rounded-xl py-2 px-4 focus:ring-1 focus:ring-primary focus:outline-none"
                  value={profileForm.cgpa} onChange={e => setProfileForm({...profileForm, cgpa: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-textMuted ml-1 flex items-center gap-1"><Github size={14}/> GitHub Username</label>
                <input 
                  type="text" className="w-full bg-background border border-gray-700 rounded-xl py-2 px-4 focus:ring-1 focus:ring-primary focus:outline-none"
                  value={profileForm.githubUsername} onChange={e => setProfileForm({...profileForm, githubUsername: e.target.value})}
                  placeholder="e.g. microsoft"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-textMuted ml-1">Skills (comma separated)</label>
                <input 
                  type="text" className="w-full bg-background border border-gray-700 rounded-xl py-2 px-4 focus:ring-1 focus:ring-primary focus:outline-none"
                  value={profileForm.skills} onChange={e => setProfileForm({...profileForm, skills: e.target.value})}
                  placeholder="React, Node.js, Python"
                />
              </div>
              <div className="md:col-span-2 flex justify-end mt-2">
                <button type="submit" disabled={loading} className="bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-xl transition-colors">
                  Save & Sync GitHub
                </button>
              </div>
            </form>
          </div>

          {/* Projects */}
          <div className="bg-surface rounded-2xl p-6 border border-gray-800 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Your Projects</h2>
              <button 
                onClick={() => setShowProjectModal(true)}
                className="bg-primary hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <Plus size={16}/> Add Project
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="bg-background border flex flex-col items-center justify-center border-gray-800 border-dashed rounded-xl p-8 text-center text-textMuted">
                <BookOpen size={32} className="mb-2 opacity-50" />
                <p>No projects added yet.</p>
                <p className="text-sm mt-1">Add projects to increase your TrueMerit Score!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map(p => (
                  <div key={p._id} className="bg-background border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-blue-400">{p.title}</h3>
                        <p className="text-textMuted text-sm mt-1 line-clamp-2">{p.description}</p>
                      </div>
                      {p.aiComplexityScore > 0 && (
                        <div className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs font-bold border border-purple-500/30 whitespace-nowrap">
                          AI Score: {p.aiComplexityScore}/10
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4 text-xs">
                      {p.techStack.map((tech, i) => (
                        <span key={i} className="bg-gray-800 text-gray-300 px-2 py-1 rounded-md">{tech}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
      
      <ProjectModal 
        isOpen={showProjectModal} 
        onClose={() => setShowProjectModal(false)}
        onSuccess={() => fetchProjects()}
      />
    </div>
  );
};

const ProjectModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({ title: '', description: '', githubLink: '', liveLink: '', techStack: '' });
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useContext(AuthContext);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...form,
        techStack: form.techStack.split(',').map(s => s.trim()).filter(s => s)
      };
      await axios.post('http://localhost:5000/api/students/projects', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh user profile to get new score
      const res = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      onSuccess();
      onClose();
    } catch (err) {
      alert('Failed to add project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface border border-gray-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl">
        <h2 className="text-2xl font-bold mb-4">Add Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-textMuted ml-1">Project Title</label>
            <input required type="text" className="w-full bg-background border border-gray-700 rounded-xl py-2 px-4 focus:ring-primary focus:outline-none mt-1" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          </div>
          <div>
            <label className="text-sm text-textMuted ml-1">Description (Be detailed for AI Evaluation)</label>
            <textarea required rows="3" className="w-full bg-background border border-gray-700 rounded-xl py-2 px-4 focus:ring-primary focus:outline-none mt-1" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
          </div>
          <div>
            <label className="text-sm text-textMuted ml-1">Tech Stack (comma separated)</label>
            <input required type="text" className="w-full bg-background border border-gray-700 rounded-xl py-2 px-4 focus:ring-primary focus:outline-none mt-1" placeholder="MongoDB, Express, React, Node" value={form.techStack} onChange={e => setForm({...form, techStack: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="text-sm text-textMuted ml-1">GitHub Link</label>
               <input type="url" className="w-full bg-background border border-gray-700 rounded-xl py-2 px-4 focus:ring-primary focus:outline-none mt-1" value={form.githubLink} onChange={e => setForm({...form, githubLink: e.target.value})} />
            </div>
            <div>
               <label className="text-sm text-textMuted ml-1">Live Link</label>
               <input type="url" className="w-full bg-background border border-gray-700 rounded-xl py-2 px-4 focus:ring-primary focus:outline-none mt-1" value={form.liveLink} onChange={e => setForm({...form, liveLink: e.target.value})} />
            </div>
          </div>
          <div className="flex gap-4 justify-end mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-textMuted hover:text-white transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="bg-primary hover:bg-blue-600 px-6 py-2 rounded-xl text-white font-medium transition-colors">
              {loading ? 'Analyzing...' : 'Submit & Evaluate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentDashboard;

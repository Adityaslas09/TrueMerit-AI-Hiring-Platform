import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Github, ChevronRight, GraduationCap, Bookmark } from 'lucide-react';

const RecruiterDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skillFilter, setSkillFilter] = useState('');
  const [savedOnly, setSavedOnly] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [skillFilter, savedOnly]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/recruiters/students?skill=${skillFilter}&savedOnly=${savedOnly}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(res.data.students);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStudentDetails = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/recruiters/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudentDetails(res.data);
      setSelectedStudent(res.data.student);
      setIsSaved(res.data.isSaved);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSave = async () => {
    if (!studentDetails) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`http://localhost:5000/api/recruiters/students/${studentDetails.student._id}/save`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsSaved(res.data.isSaved);
      if (savedOnly) fetchStudents(); // Refresh list if we are in saved mode
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-80px)] flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Talent Pipeline</h1>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Filter by skill (e.g. React, Python)" 
            className="w-full bg-surface border border-gray-800 rounded-xl py-3 pl-10 pr-4 focus:ring-1 focus:ring-primary focus:outline-none"
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setSavedOnly(!savedOnly)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-medium transition-all ${savedOnly ? 'bg-primary text-white border-primary' : 'bg-surface border-gray-800 text-textMuted hover:border-gray-600'}`}
        >
          <Bookmark size={18} fill={savedOnly ? "currentColor" : "none"} />
          {savedOnly ? 'Show All' : 'Saved'}
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        
        {/* Student List */}
        <div className="lg:col-span-1 bg-surface border border-gray-800 rounded-2xl overflow-y-auto hidden-scrollbar flex flex-col">
          <div className="p-4 border-b border-gray-800 bg-surface sticky top-0 z-10 font-medium text-textMuted flex justify-between">
            <span>Candidates Ranked</span>
            <span>Score</span>
          </div>
          <div className="p-2 space-y-2 flex-1 overflow-y-auto">
            {loading ? (
               <div className="text-center p-8 text-textMuted animate-pulse">Loading candidates...</div>
            ) : students.length === 0 ? (
               <div className="text-center p-8 text-textMuted">No candidates found matching skills.</div>
            ) : (
              students.map((student, index) => (
                <div 
                  key={student._id} 
                  onClick={() => loadStudentDetails(student._id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    selectedStudent?._id === student._id 
                      ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                      : 'bg-background hover:bg-gray-800 border-transparent hover:border-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-textLight">{student.name}</h3>
                        {student.isSaved && <Bookmark size={14} className="text-amber-500" fill="currentColor" />}
                      </div>
                      <p className="text-xs text-textMuted mb-2">{student.college || 'College not provided'}</p>
                      
                      <div className="flex flex-wrap gap-1">
                        {student.skills?.slice(0,3).map(skill => (
                           <span key={skill} className="bg-gray-800 text-[10px] px-2 py-0.5 rounded text-gray-300">{skill}</span>
                        ))}
                        {student.skills?.length > 3 && <span className="text-[10px] text-gray-500">+{student.skills.length - 3}</span>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className={`text-xl font-black ${index < 3 ? 'text-primary' : 'text-gray-300'}`}>
                        {student.trueMeritScore?.total || 0}
                      </div>
                      <span className="text-[10px] uppercase text-gray-500 font-bold">Score</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Details View */}
        <div className="lg:col-span-2 bg-surface border border-gray-800 rounded-2xl overflow-y-auto flex flex-col p-6">
          {studentDetails ? (
            <div className="animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-primary">
                      {studentDetails.student.name}
                    </h2>
                    <button 
                      onClick={handleToggleSave} 
                      className={`p-2 rounded-full border transition-all ${isSaved ? 'bg-amber-500/10 border-amber-500/50 text-amber-500 hover:bg-amber-500/20' : 'bg-surface border-gray-700 text-gray-500 hover:text-white hover:border-gray-500'}`}
                      title={isSaved ? "Remove from saved" : "Save candidate"}
                    >
                      <Bookmark size={22} fill={isSaved ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-textMuted">
                    <span className="flex items-center gap-1"><GraduationCap size={16}/> {studentDetails.student.college}</span>
                    {studentDetails.student.cgpa && (
                       <span className="bg-gray-800 px-2 py-0.5 rounded text-xs font-bold text-gray-300">CGPA: {studentDetails.student.cgpa}</span>
                    )}
                  </div>
                </div>
                
                <div className="text-center bg-background border border-gray-800 rounded-xl p-4 min-w-[120px]">
                  <div className="text-textMuted text-xs uppercase font-bold mb-1">TrueMerit Score</div>
                  <div className="text-4xl font-black text-primary">{studentDetails.student.trueMeritScore?.total || 0}</div>
                </div>
              </div>

              {/* Badges/skills */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-textMuted uppercase mb-3 border-b border-gray-800 pb-2">Verified Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {studentDetails.student.skills?.map(skill => (
                    <span key={skill} className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* GitHub Data */}
                <div>
                  <h3 className="text-sm font-bold text-textMuted uppercase mb-3 border-b border-gray-800 pb-2 flex items-center gap-2">
                    <Github size={16}/> GitHub Analytics
                  </h3>
                  {studentDetails.student.githubData ? (
                    <div className="bg-background rounded-xl p-4 border border-gray-800 grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-textMuted">Public Repos</div>
                        <div className="text-2xl font-bold">{studentDetails.student.githubData.publicRepos}</div>
                      </div>
                      <div>
                        <div className="text-xs text-textMuted">Total Stars</div>
                        <div className="text-2xl font-bold">{studentDetails.student.githubData.totalStars}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-xs text-textMuted mb-2">Top Languages</div>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(studentDetails.student.githubData.topLanguages || {})
                             .sort((a,b) => b[1] - a[1])
                             .slice(0,4)
                             .map(([lang]) => (
                               <span key={lang} className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded">{lang}</span>
                             ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-textMuted italic">No GitHub account linked.</div>
                  )}
                </div>

                {/* Algorithmic Breakdown */}
                <div>
                  <h3 className="text-sm font-bold text-textMuted uppercase mb-3 border-b border-gray-800 pb-2">Score Breakdown</h3>
                  <div className="space-y-3 bg-background rounded-xl p-4 border border-gray-800">
                     <div className="flex justify-between items-center text-sm">
                       <span className="text-gray-400">GitHub (40%)</span>
                       <span className="font-bold text-blue-400">{studentDetails.student.trueMeritScore?.githubScore} pts</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                       <span className="text-gray-400">Projects (30%)</span>
                       <span className="font-bold text-green-400">{studentDetails.student.trueMeritScore?.projectScore} pts</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                       <span className="text-gray-400">Academics (20%)</span>
                       <span className="font-bold text-yellow-400">{studentDetails.student.trueMeritScore?.academicScore} pts</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                       <span className="text-gray-400">Certifications (10%)</span>
                       <span className="font-bold text-purple-400">{studentDetails.student.trueMeritScore?.certScore} pts</span>
                     </div>
                  </div>
                </div>
              </div>

              {/* Projects List */}
              <div>
                <h3 className="text-sm font-bold text-textMuted uppercase mb-3 border-b border-gray-800 pb-2">Portfolio Projects</h3>
                <div className="space-y-4">
                  {studentDetails.projects?.map(p => (
                    <div key={p._id} className="bg-background rounded-xl p-4 border border-gray-800">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-textLight">{p.title}</h4>
                        {p.aiComplexityScore > 0 && (
                          <div className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded text-xs font-bold border border-purple-500/30">
                            AI Score: {p.aiComplexityScore}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-textMuted mb-3">{p.description}</p>
                      
                      <div className="flex justify-between items-end">
                        <div className="flex gap-2">
                           {p.githubLink && <a href={p.githubLink} target="_blank" className="text-xs flex items-center gap-1 text-gray-400 hover:text-white"><Github size={12}/> Repo</a>}
                           {p.liveLink && <a href={p.liveLink} target="_blank" className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300"><ChevronRight size={12}/> Live</a>}
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          {p.techStack.map(t => <span key={t} className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">{t}</span>)}
                        </div>
                      </div>
                    </div>
                  ))}
                  {studentDetails.projects?.length === 0 && (
                    <div className="text-sm text-textMuted italic text-center p-4">No projects uploaded yet.</div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="m-auto text-center opacity-50">
              <GraduationCap size={64} className="mx-auto mb-4" />
              <h3 className="text-xl font-medium">Select a candidate</h3>
              <p className="text-sm mt-2">View their TrueMerit score breakdown and portfolio</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default RecruiterDashboard;

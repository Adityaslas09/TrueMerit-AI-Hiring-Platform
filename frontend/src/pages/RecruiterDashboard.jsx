import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ChevronRight, GraduationCap, Bookmark, BrainCircuit, MessageSquareText, Loader2, Sparkles, Briefcase, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RecruiterDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skillFilter, setSkillFilter] = useState('');
  const [savedOnly, setSavedOnly] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  
  // AI States
  const [jobDescription, setJobDescription] = useState('');
  const [matchResult, setMatchResult] = useState(null);
  const [aiQuestions, setAiQuestions] = useState([]);
  const [resumeVerification, setResumeVerification] = useState(null);
  const [linkedinAudit, setLinkedinAudit] = useState(null);
  const [analyzingJob, setAnalyzingJob] = useState(false);
  const [generatingQ, setGeneratingQ] = useState(false);
  const [verifyingResume, setVerifyingResume] = useState(false);
  const [auditingLinkedin, setAuditingLinkedin] = useState(false);

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
      // Reset AI views
      setMatchResult(null);
      setAiQuestions([]);
      setJobDescription('');
      setResumeVerification(null);
      setLinkedinAudit(null);
      
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
      if (savedOnly) fetchStudents(); 
    } catch (err) {
      console.error(err);
    }
  };

  const generateInterviewQuestions = async () => {
    if(!studentDetails) return;
    setGeneratingQ(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/recruiters/students/${studentDetails.student._id}/generate-questions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAiQuestions(res.data.questions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingQ(false);
    }
  };

  const matchJob = async () => {
    if(!studentDetails || !jobDescription) return;
    setAnalyzingJob(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`http://localhost:5000/api/recruiters/students/${studentDetails.student._id}/match-job`, { jobDescription }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMatchResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingJob(false);
    }
  };

  const verifyResume = async () => {
    if(!studentDetails) return;
    setVerifyingResume(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`http://localhost:5000/api/recruiters/students/${studentDetails.student._id}/verify-resume`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResumeVerification(res.data);
    } catch (err) {
      console.error('Resume Verification Error:', err);
    } finally {
      setVerifyingResume(false);
    }
  };

  const runLinkedinAudit = async () => {
    if(!studentDetails) return;
    setAuditingLinkedin(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/recruiters/students/${studentDetails.student._id}/analyze-linkedin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLinkedinAudit(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to analyze LinkedIn');
    } finally {
      setAuditingLinkedin(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-80px)] flex flex-col">
      <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className="mb-6">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Talent Pipeline</h1>
        <p className="text-textMuted text-sm mt-1">Source, analyze, and save top-tier candidates powered by GenAI.</p>
      </motion.div>

      <div className="flex gap-4 mb-6 relative z-20">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by skill OR type naturally (e.g. 'Find me an expert Node.js developer')" 
            className="w-full bg-surface/50 backdrop-blur-md border border-gray-700/50 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow shadow-lg placeholder-gray-500 text-sm"
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setSavedOnly(!savedOnly)}
          className={`flex items-center shadow-lg gap-2 px-6 py-3 rounded-xl border font-medium transition-all ${savedOnly ? 'bg-primary text-white border-primary shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'bg-surface/50 backdrop-blur-md border border-gray-700/50 text-textMuted hover:border-gray-500 hover:text-white'}`}
        >
          <Bookmark size={18} fill={savedOnly ? "currentColor" : "none"} />
          {savedOnly ? 'Show All Candidates' : 'View Shortlist'}
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        
        {/* Student List */}
        <div className="lg:col-span-1 bg-surface/40 backdrop-blur-2xl border border-gray-800/80 rounded-2xl overflow-y-auto hidden-scrollbar flex flex-col shadow-2xl relative">
          <div className="p-4 border-b border-gray-800/50 bg-surface/80 backdrop-blur-md sticky top-0 z-10 font-bold text-textMuted flex justify-between text-xs tracking-wider uppercase">
            <span>Candidates Ranked</span>
            <span>AI Score</span>
          </div>
          <div className="p-3 space-y-3 flex-1 overflow-y-auto">
            {loading ? (
               <div className="flex justify-center items-center h-full text-primary"><Loader2 className="animate-spin" size={32}/></div>
            ) : students.length === 0 ? (
               <div className="text-center p-8 text-textMuted italic">No candidates match your criteria.</div>
            ) : (
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-3">
                {students.map((student, index) => (
                  <motion.div 
                    variants={itemVariants}
                    key={student._id} 
                    onClick={() => loadStudentDetails(student._id)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border ${
                      selectedStudent?._id === student._id 
                        ? 'bg-primary/20 border-primary shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
                        : 'bg-background hover:bg-gray-800/50 border-transparent hover:border-gray-700'
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
                             <span key={skill} className="bg-gray-800 text-[10px] px-2 py-0.5 rounded-full text-gray-300">{skill}</span>
                          ))}
                          {student.skills?.length > 3 && <span className="text-[10px] text-gray-500 font-bold">+{student.skills.length - 3}</span>}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className={`text-xl font-black ${index < 3 ? 'gradient-text glow-text' : 'text-gray-300'}`}>
                          {student.trueMeritScore?.total || 0}
                        </div>
                        <span className="text-[10px] uppercase text-gray-500 font-bold">Pts</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Details View */}
        <div className="lg:col-span-2 bg-surface/40 backdrop-blur-2xl border border-gray-800/80 rounded-2xl overflow-y-auto flex flex-col p-8 shadow-2xl relative">
          {studentDetails ? (
            <motion.div initial={{opacity:0, scale: 0.98}} animate={{opacity:1, scale:1}} transition={{duration: 0.3}} className="h-full">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <div className="flex items-center gap-4">
                    <h2 className="text-5xl font-black tracking-tight text-white mb-2">
                      {studentDetails.student.name}
                    </h2>
                    <button 
                      onClick={handleToggleSave} 
                      className={`p-3 rounded-full border transition-all shadow-lg ${isSaved ? 'bg-amber-500/20 border-amber-500/50 text-amber-500 hover:bg-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-surface border-gray-700 text-gray-500 hover:text-white hover:border-gray-500'}`}
                      title={isSaved ? "Remove from saved" : "Save candidate"}
                    >
                      <Bookmark size={24} fill={isSaved ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 text-textMuted font-medium">
                    <span className="flex items-center gap-2"><GraduationCap size={18}/> {studentDetails.student.college}</span>
                    {studentDetails.student.cgpa && (
                       <span className="bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded font-bold">CGPA: {studentDetails.student.cgpa}</span>
                    )}
                  </div>
                </div>
                
                <div className="text-center bg-gray-900/80 border border-gray-800 rounded-2xl p-5 min-w-[140px] shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  <div className="text-textMuted text-xs uppercase tracking-widest font-bold mb-1">TrueMerit Score</div>
                  <div className="text-5xl font-black gradient-text glow-text">{studentDetails.student.trueMeritScore?.total || 0}</div>
                </div>
              </div>

              {/* GenAI Recruiter Panel */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">
                {/* AI Semantic Job Matcher */}
                <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden group">
                  <h3 className="text-sm font-bold text-indigo-300 uppercase mb-4 flex items-center gap-2">
                    <BrainCircuit size={18}/> Semantic Job Match
                  </h3>
                  {!matchResult ? (
                    <div>
                      <textarea 
                        className="w-full bg-background/50 border border-indigo-500/30 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 text-gray-300 placeholder-gray-600 mb-3 resize-none"
                        rows="3" placeholder="Paste your Job Description here to see if they fit..."
                        value={jobDescription} onChange={e => setJobDescription(e.target.value)}
                      ></textarea>
                      <button onClick={matchJob} disabled={analyzingJob || !jobDescription} className="w-full bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg py-2 font-medium transition flex justify-center items-center gap-2 disabled:opacity-50 text-sm">
                        {analyzingJob ? <Loader2 className="animate-spin" size={16}/> : <Sparkles size={16}/>}
                        Analyze Fit
                      </button>
                    </div>
                  ) : (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl font-black text-indigo-400">{matchResult.matchPercentage}%</div>
                        <div className="text-sm text-gray-300 italic">" {matchResult.reasoning} "</div>
                      </div>
                      <button onClick={() => setMatchResult(null)} className="text-xs text-indigo-400 hover:text-indigo-300 font-bold uppercase transition">Test Another Job</button>
                    </motion.div>
                  )}
                </div>

                {/* AI Interview Questions */}
                <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-bold text-blue-300 uppercase flex items-center gap-2">
                      <MessageSquareText size={18}/> Technical Interview
                    </h3>
                    {aiQuestions.length === 0 && (
                      <button onClick={generateInterviewQuestions} disabled={generatingQ} className="bg-blue-600/80 hover:bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-2 disabled:opacity-50">
                        {generatingQ ? <Loader2 className="animate-spin" size={12}/> : <Sparkles size={12}/>} Generate
                      </button>
                    )}
                  </div>
                  {aiQuestions.length > 0 ? (
                    <motion.ul initial="hidden" animate="show" variants={containerVariants} className="space-y-3">
                      {aiQuestions.map((q, i) => (
                        <motion.li variants={itemVariants} key={i} className="text-sm bg-background/50 border border-blue-500/20 p-3 rounded-lg text-blue-100 flex gap-3">
                          <span className="font-bold text-blue-500">Q{i+1}.</span> {q}
                        </motion.li>
                      ))}
                    </motion.ul>
                  ) : (
                     <p className="text-sm text-blue-200/50 flex-1">Auto-generate highly targeted technical interview questions based on this candidate's specific tech stack and AI evaluation scores.</p>
                  )}
                </div>

                {/* AI Resume vs GitHub Verifier */}
                <div className="md:col-span-1 xl:col-span-2 bg-gradient-to-br from-[#1C212B] to-[#0A0D14] border border-gray-800 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2 tracking-widest">
                      <BrainCircuit size={18} className="text-amber-500"/> Resume Audit (AI)
                    </h3>
                    {!resumeVerification && studentDetails.student.resumeText && (
                      <button onClick={verifyResume} disabled={verifyingResume} className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 border border-amber-500/30 text-xs px-4 py-1.5 rounded-lg font-bold transition flex items-center gap-2 disabled:opacity-50">
                        {verifyingResume ? <Loader2 className="animate-spin" size={12}/> : <Sparkles size={12}/>} Audit Authenticity
                      </button>
                    )}
                  </div>
                  
                  {!studentDetails.student.resumeText ? (
                     <div className="text-center p-6 border border-gray-800/50 border-dashed rounded-xl text-gray-500 text-sm">
                       Candidate has not uploaded readable resume text for AI verification.
                     </div>
                  ) : !resumeVerification ? (
                     <p className="text-sm text-gray-500 max-w-md">The AI Recruiter agent will cross-reference the candidate's custom resume text word-for-word against their actual GitHub API commits and repositories to detect missing skills and hallucinated experience.</p>
                  ) : (
                     <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       
                       <div className="col-span-1 border border-gray-800 bg-black/20 rounded-xl p-4 flex flex-col justify-center items-center text-center">
                         <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-2">Authenticity Score</p>
                         <div className={`text-5xl font-black ${resumeVerification.mismatch_score > 60 ? 'text-red-500' : 'text-green-500'}`}>
                           {100 - (resumeVerification.mismatch_score || 0)}%
                         </div>
                         <p className="text-xs text-gray-400 mt-2 italic">{resumeVerification.insights}</p>
                       </div>

                       <div className="col-span-2 space-y-4">
                         <div>
                           <h4 className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Verified Claims vs GitHub</h4>
                           <div className="flex flex-wrap gap-2">
                             {resumeVerification.verified_skills?.length > 0 ? resumeVerification.verified_skills.map(s => <span key={s} className="bg-green-500/20 text-green-400 border border-green-500/30 text-[11px] px-2 py-1 rounded font-medium">{s}</span>) : <span className="text-xs text-gray-600 italic">No skills actively verified.</span>}
                           </div>
                         </div>
                         <div>
                           <h4 className="text-xs text-red-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1"><AlertCircle size={12}/> Exaggerated or Missing from Repo</h4>
                           <div className="flex flex-wrap gap-2">
                             {resumeVerification.missing_skills?.length > 0 ? resumeVerification.missing_skills.map(s => <span key={s} className="bg-red-500/10 text-red-400 border border-red-500/30 text-[11px] px-2 py-1 rounded font-medium">{s}</span>) : <span className="text-xs text-gray-600 italic">No missing skills flagged.</span>}
                           </div>
                         </div>
                       </div>
                     </motion.div>
                  )}
                </div>

                {/* AI LinkedIn Auditor */}
                <div className="md:col-span-1 xl:col-span-2 bg-gradient-to-br from-[#0a192f] to-[#020c1b] border border-blue-900 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
                  <div className="flex justify-between items-start mb-4">
                     <h3 className="text-sm font-bold text-blue-300 uppercase flex items-center gap-2 tracking-widest">
                       <Briefcase size={18} className="text-blue-500"/> LinkedIn Auditor (AI)
                     </h3>
                     {!linkedinAudit && studentDetails.student.linkedinText && (
                        <button onClick={runLinkedinAudit} disabled={auditingLinkedin} className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 text-xs px-4 py-1.5 rounded-lg font-bold transition flex items-center gap-2 disabled:opacity-50">
                          {auditingLinkedin ? <Loader2 className="animate-spin" size={12}/> : <Sparkles size={12}/>} Run Audit
                        </button>
                     )}
                   </div>
                   
                   {!studentDetails.student.linkedinText ? (
                      <div className="text-center p-6 border border-blue-900/50 border-dashed rounded-xl text-blue-300/50 text-sm">
                        Candidate has not attached a LinkedIn Profile PDF.
                      </div>
                   ) : !linkedinAudit ? (
                      <p className="text-sm text-blue-200/50 max-w-md">The LinkedIn Auditor will strictly cross-reference the candidate's verified LinkedIn history with their provided TrueMerit Resume payload to identify discrepancies and career strength.</p>
                   ) : (
                      <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="col-span-1 border border-blue-900/50 bg-black/30 rounded-xl p-4 flex flex-col justify-center items-center text-center">
                          <p className="text-[10px] uppercase font-bold text-blue-400 tracking-wider mb-2">Authority Score</p>
                          <div className="text-5xl font-black text-white">{linkedinAudit.authority_score || 0}<span className="text-sm text-blue-500">/100</span></div>
                        </div>
                        <div className="col-span-3 space-y-4">
                          <div>
                            <h4 className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-2">Career Progression</h4>
                            <p className="text-sm text-blue-100">{linkedinAudit.career_progression}</p>
                          </div>
                          <div>
                            <h4 className="text-xs text-amber-500 font-bold uppercase tracking-wider mb-2">Discrepancies vs Resume</h4>
                            <ul className="list-disc pl-4 text-sm text-amber-100/80">
                               {linkedinAudit.discrepancies?.map((d, i) => <li key={i}>{d}</li>)}
                               {(!linkedinAudit.discrepancies || linkedinAudit.discrepancies.length === 0) && <li className="text-green-400">No discrepancies found.</li>}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-2">Networking Footprint</h4>
                            <p className="text-sm text-blue-100">{linkedinAudit.networking_insights}</p>
                          </div>
                        </div>
                      </motion.div>
                   )}
                </div>
              </div>

              {/* AI Verified Certifications */}
              <div>
                <h3 className="text-sm font-bold text-textMuted uppercase mb-6 tracking-widest border-b border-gray-800/80 pb-3 flex items-center gap-2">
                  <Star size={14} className="text-purple-500" /> AI Forensics: Certificates
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                  {studentDetails.student.certifications?.length > 0 ? studentDetails.student.certifications.map((cert, index) => (
                    <div key={index} className="flex flex-col bg-background/80 border border-gray-800 p-4 rounded-xl relative overflow-hidden">
                       {cert.verificationStatus === 'verified' && <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>}
                       {cert.verificationStatus === 'suspicious' && <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>}
                       {cert.verificationStatus === 'fake' && <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>}
                       
                       <div className="flex justify-between items-start mb-2 mt-1">
                          <div>
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                               {cert.name}
                               {cert.verificationStatus === 'verified' && <span className="text-green-500" title="Authentic">✓</span>}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">{cert.issuer}</p>
                          </div>
                          <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                             cert.verificationStatus === 'verified' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                             cert.verificationStatus === 'fake' ? 'bg-red-500/20 text-red-500 border border-red-500/30' :
                             'bg-gray-800 text-gray-400 border border-gray-700'
                          }`}>
                            {cert.verificationStatus === 'fake' ? 'FORGERY DETECTED' : cert.verificationStatus}
                          </div>
                       </div>
                       
                       {cert.verificationDetails && (
                         <div className="mt-2 bg-black/40 p-3 rounded text-xs border border-gray-800/50">
                            <span className="font-bold text-gray-400 mr-2">Analyst Note:</span>
                            <span className="text-gray-300 leading-relaxed">{cert.verificationDetails}</span>
                         </div>
                       )}
                       
                       {/* Optional: if there's base64, the recruiter can see the literal image. Let's make it clickable. */}
                       {cert.imageBase64 && (
                         <div className="mt-3 text-right">
                           <a href={`data:${cert.imageType};base64,${cert.imageBase64}`} target="_blank" rel="noreferrer" className="text-[10px] text-blue-400 hover:text-blue-300 font-bold uppercase tracking-wider border-b border-blue-400/30 pb-0.5">
                             View Original Scan
                           </a>
                         </div>
                       )}
                    </div>
                  )) : (
                    <div className="col-span-2 text-sm text-textMuted italic text-center p-8 border border-dashed border-gray-800 rounded-2xl">No AI verified certificates found for this candidate.</div>
                  )}
                </div>
              </div>

              {/* Projects List */}
              <div>
                <h3 className="text-sm font-bold text-textMuted uppercase mb-6 tracking-widest border-b border-gray-800/80 pb-3">Portfolio Deep Dive</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {studentDetails.projects?.map(p => (
                    <div key={p._id} className="bg-background/80 backdrop-blur-md rounded-2xl p-6 border border-gray-800 shadow-xl group hover:border-gray-600 transition duration-300">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-lg text-textLight group-hover:text-primary transition">{p.title}</h4>
                        {p.aiComplexityScore > 0 && (
                          <div className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full text-xs font-black border border-purple-500/30 flex items-center gap-1 shadow-[0_0_10px_rgba(168,85,247,0.15)]">
                            <Sparkles size={10}/> AI: {p.aiComplexityScore}/10
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-textMuted mb-6 leading-relaxed line-clamp-3">{p.description}</p>
                      
                      <div className="flex justify-between items-end mt-auto">
                        <div className="flex flex-wrap gap-2 max-w-[70%]">
                          {p.techStack.map(t => <span key={t} className="text-[10px] bg-surface border border-gray-700 text-gray-300 px-2 py-1 rounded-md font-medium">{t}</span>)}
                        </div>
                        <div className="flex gap-3">
                           {p.githubLink && <a href={p.githubLink} target="_blank" className="text-sm font-bold text-gray-400 hover:text-white transition">Repo</a>}
                           {p.liveLink && <a href={p.liveLink} target="_blank" className="text-sm font-bold text-primary hover:text-blue-400 transition flex items-center gap-1">Live <ChevronRight size={14}/></a>}
                        </div>
                      </div>
                    </div>
                  ))}
                  {studentDetails.projects?.length === 0 && (
                    <div className="col-span-2 text-sm text-textMuted italic text-center p-8 border border-dashed border-gray-800 rounded-2xl">No verified projects in pipeline.</div>
                  )}
                </div>
              </div>

            </motion.div>
          ) : (
            <div className="m-auto text-center opacity-30 flex flex-col items-center justify-center p-12">
              <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center mb-6 shadow-2xl relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-tr from-primary to-purple-600 opacity-20"></div>
                 <GrainyBackground />
                 <BrainCircuit size={48} className="text-gray-400 relative z-10" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-wide">AI Recruiter Engine</h3>
              <p className="text-sm mt-3 max-w-xs leading-relaxed">Select a candidate from the pipeline to launch deep GenAI analytics.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

// Fancy static background filler
const GrainyBackground = () => (
  <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
);

export default RecruiterDashboard;

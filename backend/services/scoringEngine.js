/**
 * TrueMerit Scoring Engine
 * 
 * Max Score: 100
 * Weights:
 * GitHub Activity: 40%
 * Projects: 30%
 * Academics (CGPA): 20%
 * Certifications: 10%
 */

const calculateScore = (user, projects) => {
  let githubScore = 0;
  let projectScore = 0;
  let academicScore = 0;
  let certScore = 0;

  // 1. GitHub (Max 40 points)
  if (user.githubData) {
    const repos = user.githubData.publicRepos || 0;
    const stars = user.githubData.totalStars || 0;
    
    // Simple heuristic for demo:
    // Repos (up to 20 points, 2 points per repo)
    // Stars (up to 20 points, 1 point per star)
    const repoPts = Math.min(repos * 2, 20);
    const starPts = Math.min(stars * 1, 20);
    githubScore = repoPts + starPts;
  }

  // 2. Projects (Max 30 points)
  if (projects && projects.length > 0) {
    let totalProjectPoints = 0;
    projects.forEach(p => {
      // Base points just for having a project
      let pts = 5; 
      // Add points for AI complexity score (0-10)
      pts += (p.aiComplexityScore || 0); 
      // Add bonus for live link + github link
      if(p.liveLink) pts += 2;
      if(p.githubLink) pts += 2;
      
      totalProjectPoints += pts;
    });
    // Cap at 30
    projectScore = Math.min(totalProjectPoints, 30);
  }

  // 3. Academics (Max 20 points)
  if (user.cgpa) {
    // Assuming 10.0 scale
    const cgpaNormalized = Math.min(user.cgpa / 10.0, 1.0);
    academicScore = cgpaNormalized * 20;
  }

  // 4. Certifications (Max 10 points)
  if (user.certifications) {
    // 2.5 points per cert, cap at 10
    certScore = Math.min(user.certifications.length * 2.5, 10);
  }

  const total = Math.round(githubScore + projectScore + academicScore + certScore);

  return {
    total,
    githubScore: Math.round(githubScore),
    projectScore: Math.round(projectScore),
    academicScore: Math.round(academicScore),
    certScore: Math.round(certScore)
  };
};

module.exports = { calculateScore };

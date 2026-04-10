const axios = require('axios');

const fetchGithubData = async (username) => {
  try {
    // Basic user info
    const userRes = await axios.get(`https://api.github.com/users/${username}`);
    const reposRes = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100`);
    
    const repos = reposRes.data;
    let totalStars = 0;
    let languages = {};

    repos.forEach(repo => {
      totalStars += repo.stargazers_count;
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    return {
      publicRepos: userRes.data.public_repos,
      followers: userRes.data.followers,
      totalStars: totalStars,
      topLanguages: languages,
    };
  } catch (error) {
    console.error('Error fetching GitHub data:', error.message);
    return null;
  }
};

module.exports = { fetchGithubData };

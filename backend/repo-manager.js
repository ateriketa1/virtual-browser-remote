const axios = require('axios');

class RepoManager {
  constructor() {
    this.githubToken = process.env.GITHUB_TOKEN;
    this.apiBase = 'https://api.github.com';
  }

  getHeaders() {
    return {
      'Authorization': this.githubToken ? `token ${this.githubToken}` : '',
      'Accept': 'application/vnd.github.v3+json'
    };
  }

  async getRepository(owner, repo) {
    try {
      const response = await axios.get(
        `${this.apiBase}/repos/${owner}/${repo}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching repository:', error.message);
      throw error;
    }
  }

  async getRepositoryTree(owner, repo, branch = 'main') {
    try {
      const response = await axios.get(
        `${this.apiBase}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
        { headers: this.getHeaders() }
      );
      return response.data.tree;
    } catch (error) {
      console.error('Error fetching tree:', error.message);
      throw error;
    }
  }

  async getFileContent(owner, repo, path, branch = 'main') {
    try {
      const response = await axios.get(
        `${this.apiBase}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
        { headers: this.getHeaders() }
      );
      return {
        content: Buffer.from(response.data.content, 'base64').toString('utf-8'),
        path: response.data.path,
        size: response.data.size
      };
    } catch (error) {
      console.error('Error fetching file:', error.message);
      throw error;
    }
  }

  async searchRepositories(query) {
    try {
      const response = await axios.get(
        `${this.apiBase}/search/repositories?q=${query}&sort=stars&order=desc`,
        { headers: this.getHeaders() }
      );
      return response.data.items;
    } catch (error) {
      console.error('Error searching repositories:', error.message);
      throw error;
    }
  }
}

module.exports = { RepoManager };

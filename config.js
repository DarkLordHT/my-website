const repoOwner = 'darklordht'; // 替换为你的 GitHub 用户名
const repoName  = 'my-website'; // 替换为你的 GitHub 仓库名
const dataFilePath = 'data/students.json';
const branch = 'main';
const GITHUB_TOKEN = localStorage.getItem('GITHUB_TOKEN'); // 推荐用 localStorage 设置，不要直接写 token

import { dialog } from 'electron';
import { spawn } from 'child_process';
import path from 'path';
import {
  CloneRepositoryRequest,
  CloneRepositoryResponse,
  GithubCommit,
  GithubRepo,
  GithubUser,
  UserRepositoriesResponse,
} from '../../shared/Types/GitBrowser.types';

const GITHUB_API_BASE = 'https://api.github.com';

type GithubRequestInit = {
  token?: string;
};

async function githubGet<T>(endpoint: string, options: GithubRequestInit): Promise<T> {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'GitBrowser-Electron',
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, { headers });

  if (!response.ok) {
    const failureBody = await response.text();
    throw new Error(`GitHub API request failed (${response.status}): ${failureBody}`);
  }

  return response.json() as Promise<T>;
}

function mapGithubUser(user: any): GithubUser {
  return {
    login: user.login,
    name: user.name,
    avatarUrl: user.avatar_url,
    profileUrl: user.html_url,
    followers: user.followers,
    following: user.following,
    publicRepos: user.public_repos,
  };
}

function mapGithubRepository(repo: any): GithubRepo {
  return {
    id: repo.id,
    name: repo.name,
    owner: repo.owner?.login,
    description: repo.description,
    cloneUrl: repo.clone_url,
    htmlUrl: repo.html_url,
    defaultBranch: repo.default_branch,
    language: repo.language,
    stargazersCount: repo.stargazers_count,
    forksCount: repo.forks_count,
    openIssuesCount: repo.open_issues_count,
    updatedAt: repo.updated_at,
  };
}

function mapGithubCommit(commit: any): GithubCommit {
  return {
    sha: commit.sha,
    message: commit.commit?.message ?? '',
    authorName: commit.commit?.author?.name ?? 'Unknown',
    authoredAt: commit.commit?.author?.date,
    url: commit.html_url,
  };
}

export async function getUserRepositories(
  username: string,
  token?: string
): Promise<UserRepositoriesResponse> {
  const [user, repositories] = await Promise.all([
    githubGet<any>(`/users/${username}`, { token }),
    githubGet<any[]>(`/users/${username}/repos?sort=updated&per_page=100`, {
      token,
    }),
  ]);

  return {
    user: mapGithubUser(user),
    repositories: repositories.map(mapGithubRepository),
  };
}

export async function getAuthenticatedUserRepositories(
  token: string
): Promise<UserRepositoriesResponse> {
  const [user, repositories] = await Promise.all([
    githubGet<any>('/user', { token }),
    githubGet<any[]>('/user/repos?sort=updated&per_page=100', { token }),
  ]);

  return {
    user: mapGithubUser(user),
    repositories: repositories.map(mapGithubRepository),
  };
}

export async function getRepositoryCommits(
  owner: string,
  repo: string,
  token?: string
): Promise<GithubCommit[]> {
  const commits = await githubGet<any[]>(
    `/repos/${owner}/${repo}/commits?per_page=30`,
    {
      token,
    }
  );

  return commits.map(mapGithubCommit);
}

export async function cloneRepository(
  request: CloneRepositoryRequest
): Promise<CloneRepositoryResponse> {
  const selectedFolder = await dialog.showOpenDialog({
    title: `Select destination for ${request.repositoryName}`,
    properties: ['openDirectory', 'createDirectory'],
  });

  if (selectedFolder.canceled || selectedFolder.filePaths.length === 0) {
    return {
      success: false,
      error: 'Clone cancelled by user.',
    };
  }

  const destination = selectedFolder.filePaths[0];
  const targetPath = path.join(destination, request.repositoryName);

  return new Promise((resolve) => {
    const process = spawn('git', ['clone', request.cloneUrl, targetPath], {
      stdio: 'pipe',
    });

    let stderr = '';
    process.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    process.on('close', (exitCode) => {
      if (exitCode === 0) {
        resolve({ success: true, targetPath });
        return;
      }

      resolve({
        success: false,
        error: stderr || `git clone failed with exit code ${exitCode}`,
      });
    });

    process.on('error', (error) => {
      resolve({ success: false, error: error.message });
    });
  });
}

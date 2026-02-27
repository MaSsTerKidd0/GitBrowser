export type GithubAuth = {
  token?: string;
};

export type UserLookupRequest = GithubAuth & {
  username: string;
};

export type RepoLookupRequest = GithubAuth & {
  owner: string;
  repo: string;
};

export type GithubUser = {
  login: string;
  name: string | null;
  avatarUrl: string;
  profileUrl: string;
  followers: number;
  following: number;
  publicRepos: number;
};

export type GithubRepo = {
  id: number;
  name: string;
  owner: string;
  description: string | null;
  cloneUrl: string;
  htmlUrl: string;
  defaultBranch: string;
  language: string | null;
  stargazersCount: number;
  forksCount: number;
  openIssuesCount: number;
  updatedAt: string;
};

export type GithubCommit = {
  sha: string;
  message: string;
  authorName: string;
  authoredAt: string;
  url: string;
};

export type UserRepositoriesResponse = {
  user: GithubUser;
  repositories: GithubRepo[];
};

export type CloneRepositoryRequest = {
  cloneUrl: string;
  repositoryName: string;
};

export type CloneRepositoryResponse = {
  success: boolean;
  targetPath?: string;
  error?: string;
};

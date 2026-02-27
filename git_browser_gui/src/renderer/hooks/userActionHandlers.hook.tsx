import invokeServer from '../IPC/InvokeServer';
import {
  CloneRepositoryResponse,
  GithubCommit,
  UserRepositoriesResponse,
} from '../../shared/Types/GitBrowser.types';

export type UserActionHandlers = {
  fetchUserRepositories: (
    username: string,
    token?: string
  ) => Promise<UserRepositoriesResponse>;
  fetchPersonalRepositories: (token: string) => Promise<UserRepositoriesResponse>;
  fetchRepositoryCommits: (
    owner: string,
    repo: string,
    token?: string
  ) => Promise<GithubCommit[]>;
  cloneRepository: (
    cloneUrl: string,
    repositoryName: string
  ) => Promise<CloneRepositoryResponse>;
};

export const useUserActionHandlers = (): UserActionHandlers => {
  const fetchUserRepositories = async (username: string, token?: string) => {
    return invokeServer('github-user-repositories', { username, token });
  };

  const fetchPersonalRepositories = async (token: string) => {
    return invokeServer('github-personal-repositories', { token });
  };

  const fetchRepositoryCommits = async (
    owner: string,
    repo: string,
    token?: string
  ) => {
    return invokeServer('github-repo-commits', { owner, repo, token });
  };

  const cloneRepository = async (cloneUrl: string, repositoryName: string) => {
    return invokeServer('clone-repository', { cloneUrl, repositoryName });
  };

  return {
    fetchUserRepositories,
    fetchPersonalRepositories,
    fetchRepositoryCommits,
    cloneRepository,
  };
};

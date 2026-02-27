import {
  CloneRepositoryRequest,
  CloneRepositoryResponse,
  GithubCommit,
  UserLookupRequest,
  UserRepositoriesResponse,
} from '../../Types/GitBrowser.types';

export interface IPCMethods {
  'github-user-repositories': {
    request: UserLookupRequest;
    response: UserRepositoriesResponse;
  };
  'github-personal-repositories': {
    request: { token: string };
    response: UserRepositoriesResponse;
  };
  'github-repo-commits': {
    request: {
      owner: string;
      repo: string;
      token?: string;
    };
    response: GithubCommit[];
  };
  'clone-repository': {
    request: CloneRepositoryRequest;
    response: CloneRepositoryResponse;
  };
}

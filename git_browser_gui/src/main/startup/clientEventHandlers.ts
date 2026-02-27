import { BrowserWindow } from 'electron';
import emitToClient from '../IPC/EmitToClient';
import { ErrorMessage } from '../../shared/Types/ErrorMessage';
import {
  cloneRepository,
  getAuthenticatedUserRepositories,
  getRepositoryCommits,
  getUserRepositories,
} from '../services/github.service';

export function handleErrorMessage(
  browserWindow: BrowserWindow,
  data: ErrorMessage
): void {
  emitToClient(browserWindow, 'error_message', data);
}

export async function handleGithubUserRepositories(
  username: string,
  token?: string
) {
  return getUserRepositories(username, token);
}

export async function handleGithubPersonalRepositories(token: string) {
  return getAuthenticatedUserRepositories(token);
}

export async function handleGithubRepoCommits(
  owner: string,
  repo: string,
  token?: string
) {
  return getRepositoryCommits(owner, repo, token);
}

export async function handleCloneRepository(cloneUrl: string, repositoryName: string) {
  return cloneRepository({ cloneUrl, repositoryName });
}

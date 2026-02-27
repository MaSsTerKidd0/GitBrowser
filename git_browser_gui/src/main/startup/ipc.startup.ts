import { BrowserWindow } from 'electron';
import * as ClientEventHandlers from './clientEventHandlers';
import registerEvent from '../IPC/RegisterEvent';
import { ErrorMessage } from '../../shared/Types/ErrorMessage';
import createStackTraceFromException from '../../shared/utils/StackTrace.utils';

export default function setIpcRoutes(
  ipcMain: Electron.IpcMain,
  browserWindow: BrowserWindow
) {
  async function forwardErrorsToClient<T>(
    action: () => Promise<T>
  ): Promise<T | null> {
    try {
      return action();
    } catch (exception: any) {
      const errorMessage: ErrorMessage = {
        stringMessage: `Error from server: ${createStackTraceFromException(
          exception
        )}`,
      };
      try {
        ClientEventHandlers.handleErrorMessage(browserWindow, errorMessage);
      } catch (nestedException: any) {
        console.log(
          `Exception while handling exception. ${createStackTraceFromException(
            nestedException
          )}`
        );
      }
      return null;
    }
  }

  registerEvent('github-user-repositories', ipcMain, async (payload) => {
    const response = await forwardErrorsToClient(async () =>
      ClientEventHandlers.handleGithubUserRepositories(
        payload.username,
        payload.token
      )
    );

    if (!response) {
      throw new Error('Unable to fetch user repositories.');
    }

    return response;
  });

  registerEvent('github-personal-repositories', ipcMain, async (payload) => {
    const response = await forwardErrorsToClient(async () =>
      ClientEventHandlers.handleGithubPersonalRepositories(payload.token)
    );

    if (!response) {
      throw new Error('Unable to fetch personal repositories.');
    }

    return response;
  });

  registerEvent('github-repo-commits', ipcMain, async (payload) => {
    const response = await forwardErrorsToClient(async () =>
      ClientEventHandlers.handleGithubRepoCommits(
        payload.owner,
        payload.repo,
        payload.token
      )
    );

    if (!response) {
      throw new Error('Unable to fetch repository commits.');
    }

    return response;
  });

  registerEvent('clone-repository', ipcMain, async (payload) => {
    const response = await forwardErrorsToClient(async () =>
      ClientEventHandlers.handleCloneRepository(
        payload.cloneUrl,
        payload.repositoryName
      )
    );

    if (!response) {
      throw new Error('Unable to clone repository.');
    }

    return response;
  });
}

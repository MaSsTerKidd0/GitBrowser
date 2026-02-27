# GitBrowser Store (React + Electron)

A desktop GitHub client with a store-like browsing experience.

## Features

- Explore any account repositories over the internet.
- Clone a repository with a folder picker.
- Download repository ZIP archives.
- Inspect recent commits per repository.
- Personal profile mode (authenticated with GitHub token).
- Commit activity mini graph for each selected repository.
- Theme mode switcher: `Light`, `Dark`, and `System`.
- GitHub-inspired color palette.

## Architecture and Flow

### Main Process Responsibilities

- Register IPC routes.
- Call GitHub REST APIs.
- Open native folder picker for clone destination.
- Execute `git clone`.

### Renderer Responsibilities

- UI rendering and interaction.
- Form state, feature mode state, and theme state.
- Request/response handling through IPC wrappers.

### IPC Methods

- `github-user-repositories`
- `github-personal-repositories`
- `github-repo-commits`
- `clone-repository`

## Types

Shared types are in:

- `src/shared/Types/GitBrowser.types.ts`

These include:

- `GithubUser`
- `GithubRepo`
- `GithubCommit`
- `UserRepositoriesResponse`
- `CloneRepositoryRequest/Response`

## Workflow Rules

Use branch naming:

- `Feature/<feature-name>`
- `BugFix/<bug-name>`

Commit strategy:

- One branch per feature or bug.
- Small and focused commits.
- Keep responsibilities isolated (single responsibility).

## Setup

```bash
npm install
npm start
```

## Suggestions (minor additions already compatible)

- Add pagination and filters (language, stars, last update).
- Add local cache for commit lists to reduce API calls.
- Add “open in file explorer” after cloning.

## Suggestion (major, discuss before implementing)

- Add OAuth device flow login to avoid manual token pasting.

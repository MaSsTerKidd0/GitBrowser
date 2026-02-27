import { useMemo, useState } from 'react';
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  CssBaseline,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Stack,
  TextField,
  ThemeProvider,
  Toolbar,
  Tooltip,
  Typography,
  createTheme,
  useMediaQuery,
} from '@mui/material';
import './App.css';
import useServerEventHandlers from './hooks/serverEventHandlers.hook';
import { useUserActionHandlers } from './hooks/userActionHandlers.hook';
import { GithubCommit, GithubRepo, UserRepositoriesResponse } from '../shared/Types/GitBrowser.types';

const githubPalette = {
  dark: { mode: 'dark' as const, primary: { main: '#58A6FF' }, background: { default: '#0D1117', paper: '#161B22' } },
  light: { mode: 'light' as const, primary: { main: '#0969DA' }, background: { default: '#F6F8FA', paper: '#FFFFFF' } },
};

type ThemeMode = 'light' | 'dark' | 'system';

function CommitActivityGraph({ commits }: { commits: GithubCommit[] }) {
  const buckets = useMemo(() => {
    const map = new Map<string, number>();
    commits.forEach((commit) => {
      const day = new Date(commit.authoredAt).toISOString().slice(0, 10);
      map.set(day, (map.get(day) ?? 0) + 1);
    });
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-14);
  }, [commits]);

  const maxCount = Math.max(...buckets.map((entry) => entry[1]), 1);

  return (
    <Stack direction="row" alignItems="flex-end" spacing={0.5} sx={{ minHeight: 60 }}>
      {buckets.map(([day, count]) => (
        <Tooltip key={day} title={`${day}: ${count} commits`}>
          <Box
            sx={{
              width: 12,
              height: `${(count / maxCount) * 56 + 4}px`,
              bgcolor: 'primary.main',
              borderRadius: 1,
              opacity: 0.85,
            }}
          />
        </Tooltip>
      ))}
    </Stack>
  );
}

export default function App() {
  const actions = useUserActionHandlers();
  useServerEventHandlers();

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('octocat');
  const [view, setView] = useState<'explore' | 'personal'>('explore');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [result, setResult] = useState<UserRepositoriesResponse | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<GithubRepo | null>(null);
  const [commits, setCommits] = useState<GithubCommit[]>([]);

  const effectiveMode = themeMode === 'system' ? (prefersDarkMode ? 'dark' : 'light') : themeMode;

  const theme = useMemo(
    () =>
      createTheme({
        palette: githubPalette[effectiveMode],
      }),
    [effectiveMode]
  );

  const loadExploreData = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const data = await actions.fetchUserRepositories(username.trim(), token || undefined);
      setResult(data);
      setSelectedRepo(null);
      setCommits([]);
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadPersonalData = async () => {
    if (!token.trim()) {
      setMessage('Provide a GitHub personal access token to load personal repositories.');
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const data = await actions.fetchPersonalRepositories(token.trim());
      setResult(data);
      setSelectedRepo(null);
      setCommits([]);
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCommits = async (repo: GithubRepo) => {
    setSelectedRepo(repo);
    setLoading(true);
    setMessage(null);
    try {
      const data = await actions.fetchRepositoryCommits(repo.owner, repo.name, token || undefined);
      setCommits(data);
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onClone = async (repo: GithubRepo) => {
    const response = await actions.cloneRepository(repo.cloneUrl, repo.name);
    if (response.success) {
      setMessage(`Repository cloned to: ${response.targetPath}`);
      return;
    }
    setMessage(response.error || 'Repository clone failed.');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="appRoot">
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              GitBrowser Store
            </Typography>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel id="theme-select">Theme</InputLabel>
              <Select
                labelId="theme-select"
                value={themeMode}
                label="Theme"
                onChange={(event) => setThemeMode(event.target.value as ThemeMode)}
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="system">System</MenuItem>
              </Select>
            </FormControl>
          </Toolbar>
        </AppBar>

        <Stack spacing={2} sx={{ p: 2 }}>
          <Card>
            <CardContent>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  label="GitHub Token"
                  type="password"
                  value={token}
                  onChange={(event) => setToken(event.target.value)}
                  fullWidth
                  helperText="Optional for public data, required for personal repositories."
                />
                <TextField
                  label="Account Username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  fullWidth
                />
              </Stack>
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Button variant={view === 'explore' ? 'contained' : 'outlined'} onClick={() => setView('explore')}>
                  Explore Account
                </Button>
                <Button variant={view === 'personal' ? 'contained' : 'outlined'} onClick={() => setView('personal')}>
                  My Profile
                </Button>
                <Button variant="contained" onClick={view === 'explore' ? loadExploreData : loadPersonalData}>
                  Load Repositories
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {message && <Alert severity="info">{message}</Alert>}
          {loading && <CircularProgress />}

          {result && (
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar src={result.user.avatarUrl} />
                  <Box>
                    <Typography variant="h6">{result.user.name || result.user.login}</Typography>
                    <Link href={result.user.profileUrl}>{result.user.profileUrl}</Link>
                    <Typography variant="body2">
                      Followers {result.user.followers} · Following {result.user.following} · Public Repos {result.user.publicRepos}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          )}

          <Box className="repoGrid">
            {result?.repositories.map((repo) => (
              <Card key={repo.id} className="repoCard" variant="outlined">
                <CardContent>
                  <Typography variant="h6">{repo.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ minHeight: 36 }}>
                    {repo.description || 'No description'}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                    {repo.language && <Chip label={repo.language} size="small" />}
                    <Chip label={`★ ${repo.stargazersCount}`} size="small" />
                    <Chip label={`Forks ${repo.forksCount}`} size="small" />
                  </Stack>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => loadCommits(repo)}>
                    Show Commits
                  </Button>
                  <Button size="small" onClick={() => onClone(repo)}>
                    Clone
                  </Button>
                  <Button size="small" href={`${repo.htmlUrl}/archive/refs/heads/${repo.defaultBranch}.zip`}>
                    Download ZIP
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>

          {selectedRepo && (
            <Card>
              <CardContent>
                <Typography variant="h6">Commit activity · {selectedRepo.owner}/{selectedRepo.name}</Typography>
                <CommitActivityGraph commits={commits} />
                <Stack spacing={1} sx={{ mt: 2 }}>
                  {commits.slice(0, 8).map((commit) => (
                    <Box key={commit.sha}>
                      <Typography variant="body2">{commit.message}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {commit.authorName} · {new Date(commit.authoredAt).toLocaleString()}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          )}
        </Stack>
      </Box>
    </ThemeProvider>
  );
}

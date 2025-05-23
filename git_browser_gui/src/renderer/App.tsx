import { Box } from '@mui/material';
import './App.css';                // ← global CSS import
import { RepoCardList } from './components/repository_components/repo_card';
import useServerEventHandlers from './hooks/serverEventHandlers.hook';
import {
  UserActionHandlers,
  useUserActionHandlers,
} from './hooks/userActionHandlers.hook';

const repos = [
  { repo_name: "1" }, { repo_name: "2" }, { repo_name: "3" },
  { repo_name: "4" }, { repo_name: "5" }, { repo_name: "6" },
  { repo_name: "7" }, { repo_name: "8" }, { repo_name: "9" },
  { repo_name: "10" },
];

export default function App() {
  const userActionHandlers: UserActionHandlers = useUserActionHandlers();
  useServerEventHandlers();

  return (
    <Box className="container">
      <Box className="sidebar">
        Sidebar
      </Box>

      <Box className="upper">
        Upper Panel
      </Box>

      <Box className="secondary">
        Secondary Panel
      </Box>

      <Box className="main">
        <RepoCardList repos={repos} />
      </Box>

      <Box className="bottom">
        Bottom Panel
      </Box>
    </Box>
  );
}

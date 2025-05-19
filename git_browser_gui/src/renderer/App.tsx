import './App.css';
import useServerEventHandlers from './hooks/serverEventHandlers.hook';
import {
  UserActionHandlers,
  useUserActionHandlers,
} from './hooks/userActionHandlers.hook';

export default function App() {
  const userActionHandlers: UserActionHandlers = useUserActionHandlers();
  useServerEventHandlers();
  return (
    <div className="body-container">
      
    </div>
  );
}

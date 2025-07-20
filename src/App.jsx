// client/src/App.jsx
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Mixtape from './pages/Mixtape';
import Playback from './pages/Playback';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Mixtape />} />
      <Route path='/mixtape' element={<Navigate to='/' />} />
      <Route path='/mixtape/playback' element={<Playback />} />
    </Routes>
  );
}

export default App;

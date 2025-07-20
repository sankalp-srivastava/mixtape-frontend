import { useState } from 'react';
import CassetteCard from '../components/CassetteCard';
import MixtapeForm from '../components/MixtapeForm';

// client/src/pages/Mixtape.jsx
function Mixtape() {
  const [mixTapeName, setMixTapeName] = useState('');
  return (
    <div className='mixtape__container'>
      <div className='mixtape__background'></div>
      <div className='mixtape__content'>
        <h1 class='mixtape__heading'>Make a Mixtape</h1>
        <CassetteCard tapeText={mixTapeName} />
        <MixtapeForm mixTapeName={mixTapeName} setMixTapeName={setMixTapeName} />
      </div>
    </div>
  );
}

export default Mixtape;

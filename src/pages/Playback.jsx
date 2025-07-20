import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MixtapeComponent from '../components/MixTapeComponent';
const API = import.meta.env.VITE_API_BASE_URL;

function Playback() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  console.log(queryParams);
  const tapeId = queryParams.get('v');
  const [loading, setLoading] = useState(true);
  const [tapeData, setTapeData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTape = async () => {
      if (!tapeId) {
        setError('Mixtape ID not provided in URL.');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API}/tapes/${tapeId}`);
        setTapeData(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch mixtape.');
      } finally {
        setLoading(false);
      }
    };

    fetchTape();
  }, [tapeId]);
  return (
    <div className='mixtape__container'>
      <div className='mixtape__background'></div>
      <div className='mixtape__content'>
        {loading ? (
          <div className='loading-message'>Loading mixtape...</div>
        ) : error ? (
          <div className='error-message'>Error: {error}</div>
        ) : (
          <>
            <MixtapeComponent tapeData={tapeData} />
          </>
        )}
      </div>
      <div className='bottomContainer'>
        Note: On mobile devices, you may need to press pause and play when skipping tracks.
        <Link to='/' className='home-link'>
          Create a new mixtape
        </Link>
      </div>
    </div>
  );
}

export default Playback;

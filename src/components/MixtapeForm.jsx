import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MixtapeForm.css';
const API = import.meta.env.VITE_API_BASE_URL;

const MAX_TRACKS = 5;

const MixtapeForm = ({ mixTapeName, setMixTapeName }) => {
  const [tracks, setTracks] = useState(['']);
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    const updated = [...tracks];
    updated[index] = value;
    setTracks(updated);
  };

  const addTrack = () => {
    if (tracks.length < MAX_TRACKS) {
      setTracks([...tracks, '']);
    }
  };

  const removeTrack = (index) => {
    const updated = [...tracks];
    updated.splice(index, 1);
    setTracks(updated);
  };
  const isValidYouTubeUrl = (url) => {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname;

      // Match typical YouTube hosts
      const isYouTubeHost =
        host === 'www.youtube.com' || host === 'youtube.com' || host === 'youtu.be';

      if (!isYouTubeHost) return false;

      // youtu.be/<videoId>
      if (host === 'youtu.be') {
        return /^[\w-]{11}$/.test(parsed.pathname.slice(1));
      }

      // youtube.com/watch?v=<videoId>
      if (parsed.pathname === '/watch') {
        const v = parsed.searchParams.get('v');
        return /^[\w-]{11}$/.test(v);
      }

      return false;
    } catch {
      return false;
    }
  };
  const handleCreateMixtape = async () => {
    // Trim links and check for empties
    const trimmedLinks = tracks.map((track) => track.trim());

    // Validate each link
    const invalidLinks = trimmedLinks.filter((link) => !isValidYouTubeUrl(link));

    if (invalidLinks.length > 0) {
      alert('Please ensure all links are valid YouTube URLs.');
      return;
    }

    try {
      const response = await fetch(`${API}/tapes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls: trimmedLinks, name: mixTapeName }),
      });

      if (!response.ok) {
        throw new Error('Failed to create mixtape');
      }

      const result = await response.json();
      const mixtapeId = result._id; // Adjust this if the key is different

      // ✅ Navigate to playback page
      navigate(`/mixtape/playback?id=${mixtapeId}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong while creating the mixtape.');
    }
  };

  return (
    <div className='mixtape__form_container'>
      <div className='mixtape__form__name'>
        <span className='form_headings'>Recipient Name (optional):</span>
        <input
          className='mixtape__input'
          placeholder='Who is this mixtape for?'
          maxLength={15}
          onChange={(e) => setMixTapeName(e.target.value)}
        />
        <span className='form_lower_text'>
          {mixTapeName
            ? `Mixtape will be labeled "${mixTapeName}'s Mix"`
            : 'Leave blank for "For You"'}
        </span>
      </div>
      <span className='form_headings'>Add YouTube Links (max 5):</span>

      {tracks.map((track, index) => (
        <div className='track_input_wrapper' key={index}>
          <span className='track_number_inside'>{index + 1}:</span>
          <input
            className='mixtape__input with_number'
            placeholder='Paste YouTube URL here'
            value={track}
            onChange={(e) => handleChange(index, e.target.value)}
          />
          {tracks.length > 1 && (
            <button className='remove_btn' onClick={() => removeTrack(index)}>
              ❌
            </button>
          )}
        </div>
      ))}

      {tracks.length < MAX_TRACKS && (
        <button className='track_button' onClick={addTrack}>
          Add Another Track ({tracks.length}/{MAX_TRACKS})
        </button>
      )}
      <button className='submit_button' onClick={handleCreateMixtape}>
        Create Mixtape{' '}
        <svg
          style={{ width: '1.2rem' }}
          xmlns='http://www.w3.org/2000/svg'
          class='h-5 w-5 ml-2'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            stroke-linecap='round'
            stroke-linejoin='round'
            stroke-width='2'
            d='M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z'
          ></path>
          <path
            stroke-linecap='round'
            stroke-linejoin='round'
            stroke-width='2'
            d='M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          ></path>
        </svg>
      </button>
    </div>
  );
};

export default MixtapeForm;

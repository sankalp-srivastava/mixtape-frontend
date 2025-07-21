import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MixtapeForm.css';
const API = import.meta.env.VITE_API_BASE_URL;

const MAX_TRACKS = 10;

const MixtapeForm = ({ mixTapeName, setMixTapeName }) => {
  const [tracks, setTracks] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [genAiMode, setGenAiMode] = useState(false);
  const [genAiPrompt, setGenAiPrompt] = useState('');
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
    setLoading(true);
    if (genAiMode) {
      if (!genAiPrompt.trim()) {
        alert('Please write a prompt for GenAI mode.');
        return;
      }

      try {
        const response = await fetch(`${API}/tapes/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: genAiPrompt, name: mixTapeName }),
        });

        if (!response.ok) throw new Error('GenAI mixtape creation failed');
        const result = await response.json();
        navigate(`/mixtape/playback?v=${result._id}`);
      } catch (error) {
        console.error(error);
        alert('Error creating mixtape via GenAI.');
      } finally {
        setLoading(false);
      }
    } else {
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
        navigate(`/mixtape/playback?v=${mixtapeId}`);
      } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong while creating the mixtape.');
      } finally {
        setLoading(false);
      }
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
      <div className='gen-ai-container'>
        {genAiMode ? (
          <span className='form_headings'>Write your prompt:</span>
        ) : (
          <span className='form_headings'>Add YouTube Links (max 5):</span>
        )}
        <div className='genai_toggle'>
          <label
            className='form_headings'
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <input type='checkbox' checked={genAiMode} onChange={() => setGenAiMode(!genAiMode)} />
            GenAI Mode
          </label>
        </div>
      </div>
      {genAiMode ? (
        <>
          <textarea
            className='mixtape__input'
            placeholder='Describe the vibe, artists, mood, or era...'
            style={{ height: '8rem', resize: 'none', marginBottom: '1rem' }}
            value={genAiPrompt}
            onChange={(e) => setGenAiPrompt(e.target.value)}
          />
        </>
      ) : (
        <>
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
        </>
      )}
      <button
        className={`submit_button ${loading && 'loading-btn'}`}
        onClick={handleCreateMixtape}
        disabled={loading}
      >
        {loading ? (
          <>
            Creating ...
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 512 512'
              width='18'
              height='18'
              fill='white'
            >
              <path d='M360 64H152c-4.4 0-8 3.6-8 8v29.8c0 35.5 14.1 69.5 39.1 94.5l21.7 21.7c5.4 5.4 5.4 14.3 0 19.7l-21.7 21.7c-25 25-39.1 59-39.1 94.5V440c0 4.4 3.6 8 8 8h208c4.4 0 8-3.6 8-8v-29.8c0-35.5-14.1-69.5-39.1-94.5l-21.7-21.7c-5.4-5.4-5.4-14.3 0-19.7l21.7-21.7c25-25 39.1-59 39.1-94.5V72c0-4.4-3.6-8-8-8zm-8 64c0 26.5-10.6 52-29.4 70.6L298.8 224c-15 15-15 39.2 0 54.2l23.8 23.8c18.8 18.8 29.4 44.1 29.4 70.6v13.3H160v-13.3c0-26.5 10.6-52 29.4-70.6l23.8-23.8c15-15 15-39.2 0-54.2l-23.8-23.8C170.6 180 160 154.7 160 128V96h192v32z' />
              <path d='M256 296c-4.4 0-8-3.6-8-8v-64c0-4.4 3.6-8 8-8s8 3.6 8 8v64c0 4.4-3.6 8-8 8z' />
            </svg>
          </>
        ) : (
          <>
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
          </>
        )}
      </button>
    </div>
  );
};

export default MixtapeForm;

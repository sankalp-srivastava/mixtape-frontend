import { useEffect, useRef, useState } from 'react';
import YouTube from 'react-youtube';
import CassetteCard from './CassetteCard';
import './MixtapeComponent.css';
function getYouTubeVideoId(url) {
  let urlP;
  if (!url) {
    urlP = 'https://www.youtube.com/watch?v=5EpyN_6dqyk&pp=ygUGd2Vla25k';
  } else {
    urlP = url;
  }
  const parsedUrl = new URL(urlP);
  return parsedUrl.searchParams.get('v');
}
const MixtapeComponent = ({ tapeData }) => {
  const [eject, setEject] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(getYouTubeVideoId(false));
  const [currentPlaying, setCurrentPlaying] = useState(1);
  const insertRef = useRef(null);
  const ejectRef = useRef(null);
  const playpauseRef = useRef(null);
  const tapeUrls = tapeData?.urls ?? [];
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null);

  const handlePlay = () => {
    playerRef.current?.playVideo();
  };

  const handlePause = () => {
    playerRef.current?.pauseVideo();
  };
  const onReady = (event) => {
    playerRef.current = event.target;
    setIsPlaying(false);
    handlePause();
  };
  const opts = {
    height: '500',
    width: '500',
    playerVars: {
      autoplay: 0,
      controls: 0,
    },
  };
  const togglePlayback = () => {
    if (!playerRef.current) return;

    setIsPlaying((prev) => {
      if (prev) {
        handlePause();
      } else {
        handlePlay();
      }
      playpauseRef.current.play();
      return !prev;
    });
  };
  const onStateChange = (event) => {
    // 0 === ENDED
    if (event.data === 0) {
      if (currentPlaying < tapeUrls.length) {
        setCurrentPlaying((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }
  };
  const handleEject = () => {
    setEject((prev) => {
      if (prev) {
        ejectRef.current.play();
      } else {
        insertRef.current.play();
      }
      return !prev;
    });
  };
  useEffect(() => {
    if (tapeUrls.length > 0) {
      const firstVideoId = getYouTubeVideoId(tapeUrls[0]);
      setCurrentPlaying(1);
      setCurrentVideoId(firstVideoId);
    }
  }, [tapeUrls]);
  useEffect(() => {
    if (tapeUrls.length === 0) return;

    const videoUrl = tapeUrls[currentPlaying - 1];
    const videoId = getYouTubeVideoId(videoUrl);

    if (videoId) {
      setCurrentVideoId(videoId);
      playerRef.current?.loadVideoById(videoId);
      if (isPlaying) {
        handlePlay();
      } else {
        handlePause();
      }
    }
  }, [currentPlaying, tapeUrls]);
  return (
    <div className='mixtape-container'>
      <div className='tape-head'>
        <div className='corner-left'></div>
        <div className='corner-right'></div>
        <div className='stick-left'></div>
        <div className='stick-right'></div>
        <div className='handle'>
          <div className='handle-inner'></div>
        </div>
        <div className='handle-marks'>
          {[...Array(16)].map((_, i) => (
            <div className='mark' key={i}></div>
          ))}
        </div>
        <div className='handle-shadow'></div>
      </div>
      <div className='cassette-container'>
        {/* Radio line UI */}
        <div className='radio-line'>
          <div className='radio-bar'></div>
          <div className='radio-labels'>
            <span>88</span>
            <span>92</span>
            <span>96</span>
            <span>100</span>
            <span>104</span>
            <span>108</span>
            <span>MHz</span>
          </div>
          <div className={`radio-marker ${eject ? 'moved_radio_marker' : ''}`}></div>
          <div className={`radio-knob ${eject ? 'moved_radio_knob' : ''}`}></div>
        </div>

        {/* Cassette Window */}
        <div className='cassette-window'>
          <div className={`cassette-card-wrapper ${eject ? 'slide-in' : ''}`}>
            <CassetteCard tapeText={tapeData?.name} />
          </div>
          <div className='top-strip'></div>
          <div className='middle-slot'></div>
          <button className='eject-button' onClick={handleEject} disabled={isPlaying}>
            {eject ? 'EJECT' : 'INSERT'}
          </button>
        </div>

        <div style={{ display: 'none' }}>
          <YouTube
            videoId={currentVideoId}
            opts={opts}
            onReady={onReady}
            onStateChange={onStateChange}
          />
          ;
        </div>

        {/* Bottom Reel Dots */}
        <div className='reel-dots'>
          {[...Array(40)].map((_, i) => (
            <div className='radio__dot' key={i}></div>
          ))}
        </div>

        {/* Track Info */}
        <div className='track-info'>
          <div>{!eject ? 'NO TAPE' : `TRACK ${currentPlaying}/${tapeUrls.length}`}</div>
          <div className={!isPlaying ? 'track-led' : 'track-led-red'}></div>
        </div>

        {/* Controls */}
        <div className='end__controls'>
          <div className='buttons'>
            <button
              aria-label='Previous track'
              disabled={!eject || currentPlaying == 1}
              onClick={() => setCurrentPlaying((prev) => prev - 1)}
            >
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                <path d='M11 19l-7-7 7-7m8 14l-7-7 7-7' />
              </svg>
            </button>
            <button aria-label='Play' disabled={!eject} onClick={togglePlayback}>
              {isPlaying ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  class='h-4 w-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-width='2'
                    d='M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z'
                  ></path>
                </svg>
              ) : (
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
              )}
            </button>
            <button
              disabled={!eject || currentPlaying == tapeUrls.length}
              aria-label='Next track'
              onClick={() => setCurrentPlaying((prev) => prev + 1)}
            >
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                <path d='M13 5l7 7-7 7M5 5l7 7-7 7' />
              </svg>
            </button>
          </div>

          <div className='volume'>
            <div className='volume-knob'>
              <div className='volume-center'></div>
              <div className='volume-indicator'></div>
            </div>
            <div className='volume-label'>VOL</div>
          </div>
        </div>
      </div>
      <audio ref={insertRef} src='/audio/insert.mp3' preload='auto' />
      <audio ref={ejectRef} src='/audio/eject.mp3' preload='auto' />
      <audio ref={playpauseRef} src='/audio/play_pause.mp3' preload='auto' />
    </div>
  );
};

export default MixtapeComponent;

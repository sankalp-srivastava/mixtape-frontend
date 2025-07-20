import './CassetteCard.css';

export default function CassetteCard({ tapeText }) {
  return (
    <div className='cassette-card'>
      <div className='dot top-left' />
      <div className='dot top-right' />
      <div className='dot bottom-left' />
      <div className='dot bottom-right' />

      <div className='label'>
        <div className='line one-third' />
        <div className='line two-thirds' />
        <div className='label-text'>{tapeText ? `${tapeText}'s MIX`.toUpperCase() : 'FOR YOU'}</div>
      </div>

      <div className='stripes'>
        <div className='stripe red' />
        <div className='stripe pink' />
        <div className='stripe yellow' />
        <div className='stripe green' />
        <div className='stripe blue' />
        <div className='stripe indigo' />
      </div>

      <div className='controls'>
        <div className='reel'>
          <div className='reel-inner' />
        </div>
        <div className='window'>
          <div className='tape-strip' />
        </div>
        <div className='reel'>
          <div className='reel-inner' />
        </div>
      </div>

      <div className='label-tag'>A</div>
    </div>
  );
}

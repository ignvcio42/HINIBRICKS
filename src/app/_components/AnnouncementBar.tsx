const messages = [
  "ENVÍOS EN LA REGIÓN METROPOLITANA SOLO POR $2.990",
  "ENVÍOS A TODO CHILE POR BLUE EXPRESS",
];

const ticker = Array(6)
  .fill(messages)
  .flat()
  .map((msg, i) => (
    <span key={i} className="announcement-item">
      {msg}
      <span className="announcement-sep" aria-hidden="true">·</span>
    </span>
  ));

export function AnnouncementBar() {
  return (
    <div className="announcement-bar" aria-label="Anuncio">
      <div className="announcement-track">
        {ticker}
        {ticker}
      </div>

      <style>{`
        .announcement-bar {
          background-color: #5B5BD6;
          color: #ffffff;
          height: 36px;
          overflow: hidden;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .announcement-track {
          display: flex;
          align-items: center;
          white-space: nowrap;
          animation: marquee 35s linear infinite;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .announcement-item {
          display: inline-flex;
          align-items: center;
          gap: 0;
          padding-right: 0;
        }

        .announcement-sep {
          margin: 0 20px;
          opacity: 0.6;
        }

        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

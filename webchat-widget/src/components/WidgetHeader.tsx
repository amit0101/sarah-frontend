/** Widget header — brand, status, close button. */
import { WsStatus } from '../hooks/useWebSocket';

interface Props {
  status: WsStatus;
  locationName?: string;
  onClose: () => void;
}

export function WidgetHeader({ status, locationName, onClose }: Props) {
  const isOnline = status === 'connected';

  return (
    <div className="sarah-header">
      <div className="sarah-header-left">
        <img
          src="/sarah-icon.jpg"
          alt=""
          className="sarah-header-avatar"
          draggable={false}
        />
        <div className="sarah-header-info">
          <div className="sarah-header-brand">McInnis &amp; Holloway</div>
          <div className="sarah-header-sub">
            <span className={`sarah-header-dot ${isOnline ? '' : 'offline'}`} />
            {locationName
              ? `Sarah — ${locationName}`
              : 'Sarah — here to help'}
          </div>
        </div>
      </div>
      <button className="sarah-header-close" onClick={onClose} aria-label="Close chat">
        ✕
      </button>
    </div>
  );
}

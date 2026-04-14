/** Location dropdown selector. */

interface LocationDef {
  id: string;
  name: string;
}

interface Props {
  locations: LocationDef[];
  selected: string | null;
  onSelect: (id: string | null) => void;
  onStart: () => void;
}

export function LocationSelector({ locations, selected, onSelect, onStart }: Props) {
  return (
    <div className="sarah-location-panel">
      <h3>Select your location</h3>
      <p>Choose the McInnis &amp; Holloway funeral home you are reaching out to.</p>
      <select
        className="sarah-location-select"
        value={selected ?? ''}
        onChange={(e) => onSelect(e.target.value || null)}
      >
        <option value="">— Select a location —</option>
        {locations.map((l) => (
          <option key={l.id} value={l.id}>{l.name}</option>
        ))}
      </select>
      <button
        className="sarah-btn-start"
        disabled={!selected}
        onClick={onStart}
      >
        Start conversation
      </button>
    </div>
  );
}

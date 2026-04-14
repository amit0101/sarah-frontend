/** Prompt editor — edit prompts per conversation path. */
import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { IconSave } from './Icons';

const PATHS = [
  { value: 'immediate_need', label: 'Immediate Need', desc: 'Someone has just passed' },
  { value: 'pre_need', label: 'Pre-Need Planning', desc: 'Future arrangement planning' },
  { value: 'obituary', label: 'Obituary Lookup', desc: 'Searching service details' },
  { value: 'general', label: 'General Questions', desc: 'FAQ, pricing, locations' },
  { value: 'pet_cremation', label: 'Pet Cremation', desc: 'Pet memorial services' },
];

interface Props {
  orgId: string;
}

export function PromptEditor({ orgId }: Props) {
  const [path, setPath] = useState(PATHS[0].value);
  const [globalInstructions, setGlobalInstructions] = useState('');
  const [pathInstructions, setPathInstructions] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const currentPath = PATHS.find((p) => p.value === path);

  useEffect(() => {
    setLoading(true);
    api.getPrompt(orgId, path)
      .then((d) => {
        setGlobalInstructions(d.global_instructions || '');
        setPathInstructions(d.path_instructions || '');
      })
      .catch((e) => setMsg(`Error: ${e}`))
      .finally(() => setLoading(false));
  }, [orgId, path]);

  const save = async () => {
    try {
      await api.putPrompt(orgId, path, {
        global_instructions: globalInstructions || null,
        path_instructions: pathInstructions || null,
      });
      setMsg('Prompt saved successfully.');
    } catch (e) {
      setMsg(`Error: ${e}`);
    }
  };

  return (
    <div>
      <h2 className="sa-heading">Conversation Prompts</h2>
      <p className="sa-muted">
        Customize the AI instructions for each conversation path. Global instructions apply to all paths;
        path-specific instructions are appended for the selected path.
      </p>
      {msg && <div className="sa-toast">{msg}</div>}

      <label className="sa-field">
        <span className="sa-label">Conversation Path</span>
        <select className="sa-select" value={path} onChange={(e) => setPath(e.target.value)}
          style={{ maxWidth: 400 }}>
          {PATHS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label} — {p.desc}
            </option>
          ))}
        </select>
      </label>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="sa-loading" style={{ height: 80 }} />
          <div className="sa-loading" style={{ height: 160 }} />
        </div>
      ) : (
        <>
          <label className="sa-field">
            <span className="sa-label">Global Instructions</span>
            <textarea
              className="sa-textarea"
              rows={6}
              value={globalInstructions}
              onChange={(e) => setGlobalInstructions(e.target.value)}
              placeholder="These instructions override the default GLOBAL_BRAND prompt for this org…"
            />
          </label>

          <label className="sa-field">
            <span className="sa-label">
              Path Instructions — {currentPath?.label}
            </span>
            <textarea
              className="sa-textarea sa-code-editor"
              rows={12}
              value={pathInstructions}
              onChange={(e) => setPathInstructions(e.target.value)}
              placeholder={`Instructions specific to the ${currentPath?.label} path…`}
            />
          </label>

          <button className="sa-btn sa-btn-primary" onClick={save}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <IconSave /> Save Prompt
          </button>
        </>
      )}
    </div>
  );
}

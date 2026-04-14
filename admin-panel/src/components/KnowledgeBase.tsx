/** Knowledge base — upload, list, delete files per location. */
import { useCallback, useEffect, useRef, useState } from 'react';
import { api, KbFile, LocSummary } from '../api/client';
import { IconFile, IconUpload, IconTrash } from './Icons';

interface Props {
  orgId: string;
}

export function KnowledgeBase({ orgId }: Props) {
  const [locations, setLocations] = useState<LocSummary[]>([]);
  const [selectedLoc, setSelectedLoc] = useState<string | null>(null);
  const [files, setFiles] = useState<KbFile[]>([]);
  const [msg, setMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.listLocations(orgId).then((d) => setLocations(d.locations)).catch(() => {});
  }, [orgId]);

  const loadFiles = useCallback(() => {
    if (!selectedLoc) return;
    api.listKbFiles(orgId, selectedLoc)
      .then((d) => setFiles(d.files))
      .catch((e) => setMsg(`Error: ${e}`));
  }, [orgId, selectedLoc]);

  useEffect(() => { loadFiles(); }, [loadFiles]);

  const upload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file || !selectedLoc) return;
    setUploading(true);
    try {
      await api.uploadKbFile(orgId, selectedLoc, file);
      setMsg('File uploaded successfully.');
      loadFiles();
    } catch (e) {
      setMsg(`Error: ${e}`);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const remove = async (fileId: string) => {
    if (!selectedLoc || !confirm('Delete this file from the vector store?')) return;
    try {
      await api.deleteKbFile(orgId, selectedLoc, fileId);
      setMsg('File deleted.');
      loadFiles();
    } catch (e) {
      setMsg(`Error: ${e}`);
    }
  };

  return (
    <div>
      <h2 className="sa-heading">Knowledge Base</h2>
      <p className="sa-muted">
        Upload documents to the location's OpenAI Vector Store for RAG-powered answers.
        Sarah uses <code className="sa-code">file_search</code> to retrieve relevant content during conversations.
      </p>
      {msg && <div className="sa-toast">{msg}</div>}

      <label className="sa-field">
        <span className="sa-label">Location</span>
        <select className="sa-select" value={selectedLoc ?? ''}
          onChange={(e) => setSelectedLoc(e.target.value || null)}
          style={{ maxWidth: 400 }}>
          <option value="">— Select location —</option>
          {locations.map((l) => (
            <option key={l.id} value={l.id}>{l.name} ({l.id})</option>
          ))}
        </select>
      </label>

      {selectedLoc && (
        <>
          <h3 className="sa-sub-heading">Files in Vector Store</h3>
          {files.length === 0 ? (
            <div className="sa-empty-state">
              <div className="sa-empty-state-icon"><IconFile /></div>
              <p className="sa-muted" style={{ marginBottom: 0 }}>No files uploaded yet.</p>
            </div>
          ) : (
            <div className="sa-card-list">
              {files.map((f) => (
                <div key={f.file_id} className="sa-card sa-card-row">
                  <div>
                    <code className="sa-code">{f.file_id}</code>
                    <span className={`sa-badge ${f.status === 'completed' ? 'sa-badge-ok' : ''}`}>
                      {f.status}
                    </span>
                  </div>
                  <button className="sa-btn sa-btn-danger sa-btn-sm" onClick={() => remove(f.file_id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <IconTrash /> Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          <h3 className="sa-sub-heading">Upload File</h3>
          <div className="sa-upload-row">
            <input ref={fileRef} type="file" className="sa-file-input"
              accept=".txt,.md,.pdf,.docx,.csv" />
            <button className="sa-btn sa-btn-primary" onClick={upload}
              disabled={uploading}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconUpload /> {uploading ? 'Uploading…' : 'Upload'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

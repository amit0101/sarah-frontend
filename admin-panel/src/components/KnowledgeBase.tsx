/** Knowledge base — upload, list, delete files for the organization. */
import { useCallback, useEffect, useRef, useState } from 'react';
import { api, KbFile } from '../api/client';
import { IconFile, IconUpload, IconTrash } from './Icons';

interface Props {
  orgId: string;
}

export function KnowledgeBase({ orgId }: Props) {
  const [files, setFiles] = useState<KbFile[]>([]);
  const [vectorStoreId, setVectorStoreId] = useState<string | null>(null);
  const [msg, setMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadFiles = useCallback(() => {
    api.listKbFiles(orgId)
      .then((d) => {
        setFiles(d.files);
        setVectorStoreId(d.vector_store_id);
      })
      .catch((e) => setMsg(`Error: ${e}`));
  }, [orgId]);

  useEffect(() => { loadFiles(); }, [loadFiles]);

  const upload = async () => {
    const input = fileRef.current;
    if (!input?.files?.length) return;
    setUploading(true);
    let uploaded = 0;
    try {
      for (const file of Array.from(input.files)) {
        await api.uploadKbFile(orgId, file);
        uploaded++;
      }
      setMsg(`${uploaded} file${uploaded > 1 ? 's' : ''} uploaded successfully.`);
      loadFiles();
    } catch (e) {
      setMsg(`Uploaded ${uploaded} files, then error: ${e}`);
      loadFiles();
    } finally {
      setUploading(false);
      if (input) input.value = '';
    }
  };

  const remove = async (fileId: string) => {
    if (!confirm('Delete this file from the knowledge base?')) return;
    try {
      await api.deleteKbFile(orgId, fileId);
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
        Upload documents to the organization's OpenAI Vector Store for RAG-powered answers.
        Sarah uses <code className="sa-code">file_search</code> to retrieve relevant content
        during conversations across all locations.
      </p>
      {vectorStoreId && (
        <p className="sa-muted" style={{ fontSize: 11 }}>
          Vector Store: <code className="sa-code">{vectorStoreId}</code>
        </p>
      )}
      {msg && <div className="sa-toast">{msg}</div>}

      <h3 className="sa-sub-heading">
        Files {files.length > 0 && <span className="sa-badge">{files.length}</span>}
      </h3>
      {files.length === 0 ? (
        <div className="sa-empty-state">
          <div className="sa-empty-state-icon"><IconFile /></div>
          <p className="sa-muted" style={{ marginBottom: 0 }}>
            No files uploaded yet. Upload documents below.
          </p>
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

      <h3 className="sa-sub-heading">Upload Files</h3>
      <div className="sa-upload-row">
        <input ref={fileRef} type="file" className="sa-file-input"
          accept=".txt,.md,.pdf,.docx,.csv" multiple />
        <button className="sa-btn sa-btn-primary" onClick={upload}
          disabled={uploading}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <IconUpload /> {uploading ? 'Uploading…' : 'Upload'}
        </button>
      </div>
      <p className="sa-muted" style={{ fontSize: 11, marginTop: 6 }}>
        Accepts .txt, .md, .pdf, .docx, .csv — select multiple files at once.
        A Vector Store will be auto-created on first upload.
      </p>
    </div>
  );
}

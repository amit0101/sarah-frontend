/** API client wrapper for admin endpoints. */

const API_KEY_STORAGE = 'sarah_admin_key';

function getApiUrl(): string {
  return (import.meta.env.VITE_SARAH_API_URL as string) || '';
}

function getApiKey(): string {
  try {
    return localStorage.getItem(API_KEY_STORAGE) || '';
  } catch {
    return '';
  }
}

export function setApiKey(key: string) {
  try {
    localStorage.setItem(API_KEY_STORAGE, key);
  } catch { /* noop */ }
}

async function request<T = unknown>(
  path: string,
  opts: RequestInit = {},
): Promise<T> {
  const url = `${getApiUrl()}${path}`;
  const key = getApiKey();
  const headers: Record<string, string> = {
    ...(opts.headers as Record<string, string> || {}),
  };
  if (key) headers['X-Admin-Key'] = key;
  if (opts.body && typeof opts.body === 'string') {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(url, { ...opts, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status}: ${text}`);
  }
  return res.json();
}

export const api = {
  // Organizations
  listOrgs: () => request<{ organizations: OrgSummary[] }>('/admin/organizations'),
  getOrg: (id: string) => request<OrgDetail>(`/admin/organizations/${id}`),
  createOrg: (body: Record<string, unknown>) =>
    request('/admin/organizations', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  updateOrg: (id: string, body: Record<string, unknown>) =>
    request(`/admin/organizations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  deleteOrg: (id: string) =>
    request(`/admin/organizations/${id}`, { method: 'DELETE' }),
  testGhl: (id: string) =>
    request(`/admin/organizations/${id}/test-ghl`, { method: 'POST' }),

  // Locations
  listLocations: (orgId: string) =>
    request<{ locations: LocSummary[] }>(`/admin/organizations/${orgId}/locations`),
  createLocation: (orgId: string, body: Record<string, unknown>) =>
    request(`/admin/organizations/${orgId}/locations`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  updateLocation: (orgId: string, slug: string, body: Record<string, unknown>) =>
    request(`/admin/organizations/${orgId}/locations/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  deleteLocation: (orgId: string, slug: string) =>
    request(`/admin/organizations/${orgId}/locations/${slug}`, { method: 'DELETE' }),

  // Config
  getConfig: (orgId: string, slug: string) =>
    request<{ config: Record<string, unknown> }>(
      `/admin/organizations/${orgId}/locations/${slug}/config`,
    ),
  putConfig: (orgId: string, slug: string, config: Record<string, unknown>) =>
    request(`/admin/organizations/${orgId}/locations/${slug}/config`, {
      method: 'PUT',
      body: JSON.stringify({ config }),
    }),

  // Escalation
  getEscalation: (orgId: string, slug: string) =>
    request<{ escalation_contacts: EscalationContact[] }>(
      `/admin/organizations/${orgId}/locations/${slug}/escalation`,
    ),
  putEscalation: (orgId: string, slug: string, contacts: EscalationContact[]) =>
    request(`/admin/organizations/${orgId}/locations/${slug}/escalation`, {
      method: 'PUT',
      body: JSON.stringify({ escalation_contacts: contacts }),
    }),

  // Knowledge Base (org-level)
  listKbFiles: (orgId: string) =>
    request<{ files: KbFile[]; vector_store_id: string | null }>(
      `/admin/organizations/${orgId}/knowledge-base`,
    ),
  uploadKbFile: async (orgId: string, file: File) => {
    const url = `${getApiUrl()}/admin/organizations/${orgId}/knowledge-base`;
    const form = new FormData();
    form.append('file', file);
    const headers: Record<string, string> = {};
    const key = getApiKey();
    if (key) headers['X-Admin-Key'] = key;
    const res = await fetch(url, { method: 'POST', body: form, headers });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  deleteKbFile: (orgId: string, fileId: string) =>
    request(`/admin/organizations/${orgId}/knowledge-base/${fileId}`, {
      method: 'DELETE',
    }),

  // Prompts
  getPrompt: (orgId: string, path: string) =>
    request<PromptData>(`/admin/organizations/${orgId}/prompts/${path}`),
  putPrompt: (orgId: string, path: string, body: Record<string, unknown>) =>
    request(`/admin/organizations/${orgId}/prompts/${path}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  // Health
  health: () => request<{ status: string; database: string }>('/admin/health'),
};

// Types
export type OrgSummary = {
  id: string;
  name: string;
  slug: string;
  status: string;
  twilio_phone_number?: string | null;
};

export type OrgDetail = OrgSummary & {
  ghl_location_id?: string;
  vector_store_id?: string | null;
  has_ghl_api_key?: boolean;
};

export type LocSummary = {
  id: string;
  name: string;
};

export type EscalationContact = {
  name: string;
  role: string;
  phone?: string;
  email?: string;
};

export type KbFile = {
  file_id: string;
  status: string;
  created_at: number;
};

export type PromptData = {
  path: string;
  global_instructions?: string | null;
  path_instructions?: string | null;
  extra_config?: Record<string, unknown> | null;
  prompt?: null;
};

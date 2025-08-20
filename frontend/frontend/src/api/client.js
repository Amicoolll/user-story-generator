export const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000";


function getToken() {
return localStorage.getItem("token");
}


export async function apiFetch(path, { headers = {}, auth = true, ...opts } = {}) {
const finalHeaders = { ...headers };
if (auth) {
const t = getToken();
if (t) finalHeaders.Authorization = `Bearer ${t}`;
}


const res = await fetch(`${API_BASE}${path}`, { ...opts, headers: finalHeaders });


if (res.status === 401) {
window.dispatchEvent(new Event("auth:unauthorized"));
}


let data;
try {
data = await res.json();
} catch {
const txt = await res.text();
throw new Error(txt || "Unexpected server response");
}


if (!res.ok) {
const msg = data?.detail || data?.message || "Request failed";
throw new Error(msg);
}
return data;
}
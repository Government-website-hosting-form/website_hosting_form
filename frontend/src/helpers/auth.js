export async function fetchIsOic() {
  const token = getToken();
  const ssoId = getSsoId();
  if (!token || !ssoId) return null;

  try {
    const res = await fetch(`${BASE_URL}/api/sso/2/user-details`, {
      headers: { Accept: "application/json", "SSO-TOKEN": token, "SSO-ID": ssoId },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? !!data.isOic : null; // null = pata nahi, block mat karo
  } catch {
    return null;
  }
}
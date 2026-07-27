export function normalizeSteamInput(input) {
  return (input || "").trim();
}

export function isLikelySteamId64(value) {
  return /^7656119\d{10}$/.test(normalizeSteamInput(value));
}

export function steamInputHint(value) {
  const trimmed = normalizeSteamInput(value);
  if (!trimmed) {
    return "Paste your steamID64, profile URL, or custom URL name.";
  }
  if (isLikelySteamId64(trimmed)) {
    return "Valid steamID64 format.";
  }
  if (/steamcommunity\.com/i.test(trimmed) || !/^\d+$/.test(trimmed)) {
    return "Profile URL or custom name detected — will be resolved when you save.";
  }
  return "Use a 17-digit steamID64 if sync fails.";
}

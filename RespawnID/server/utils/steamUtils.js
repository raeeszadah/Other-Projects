import axios from "axios";

const STEAM_ID64_REGEX = /^7656119\d{10}$/;

export function parseSteamInput(input) {
    if (!input || typeof input !== "string") {
        return { type: "empty", value: "" };
    }

    const trimmed = input.trim();

    const profilesMatch = trimmed.match(
        /steamcommunity\.com\/profiles\/(\d{17})/i
    );
    if (profilesMatch) {
        return { type: "id64", value: profilesMatch[1] };
    }

    const idMatch = trimmed.match(/steamcommunity\.com\/id\/([^/?#]+)/i);
    if (idMatch) {
        return { type: "vanity", value: decodeURIComponent(idMatch[1]) };
    }

    if (STEAM_ID64_REGEX.test(trimmed)) {
        return { type: "id64", value: trimmed };
    }

    if (/^\d+$/.test(trimmed)) {
        return { type: "id64", value: trimmed };
    }

    return { type: "vanity", value: trimmed };
}

export async function resolveSteamId(input, apiKey) {
    if (!apiKey) {
        throw new Error("STEAM_API_KEY is not configured on the server");
    }

    const parsed = parseSteamInput(input);

    if (parsed.type === "empty") {
        throw new Error("Steam ID is required");
    }

    if (parsed.type === "id64") {
        if (!STEAM_ID64_REGEX.test(parsed.value)) {
            throw new Error(
                "Invalid Steam ID format. Use your 17-digit steamID64 or profile URL."
            );
        }
        return parsed.value;
    }

    const url =
        "https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/" +
        `?key=${apiKey}&vanityurl=${encodeURIComponent(parsed.value)}`;

    const { data } = await axios.get(url);
    const result = data?.response;

    if (result?.success === 1 && result.steamid) {
        return String(result.steamid);
    }

    if (result?.success === 42) {
        throw new Error(
            `Steam profile "${parsed.value}" was not found. Check your custom URL or use steamID64 from steamid.io`
        );
    }

    throw new Error(
        "Could not resolve Steam profile. Use your 17-digit steamID64 from steamid.io"
    );
}

export function buildOwnedGamesUrl(apiKey, steamId64) {
    const params = new URLSearchParams({
        key: apiKey,
        steamid: steamId64,
        include_appinfo: "true",
        include_played_free_games: "true",
    });

    return `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?${params}`;
}

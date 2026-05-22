import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client_id = process.env.FORGE_CLIENT_ID;
    const client_secret = process.env.FORGE_CLIENT_SECRET;

    if (!client_id || !client_secret) {
      return NextResponse.json({ error: "Missing FORGE_CLIENT_ID or FORGE_CLIENT_SECRET" }, { status: 500 });
    }

    const params = new URLSearchParams();
    params.append("client_id", client_id);
    params.append("client_secret", client_secret);
    params.append("grant_type", "client_credentials");
    params.append("scope", "viewables:read");

    const tokenRes = await fetch("https://developer.api.autodesk.com/authentication/v2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const data = await tokenRes.json();

    if (!tokenRes.ok) {
      return NextResponse.json({ error: data }, { status: tokenRes.status });
    }

    return NextResponse.json({ access_token: data.access_token, expires_in: data.expires_in });
  } catch (err) {
    console.error("token/public error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

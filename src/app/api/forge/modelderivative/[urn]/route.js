import { NextResponse } from "next/server";

async function getAppToken(scope = "data:read data:write") {
  const client_id = process.env.FORGE_CLIENT_ID;
  const client_secret = process.env.FORGE_CLIENT_SECRET;

  if (!client_id || !client_secret) throw new Error("Missing FORGE_CLIENT_ID / FORGE_CLIENT_SECRET");

  const params = new URLSearchParams();
  params.append("client_id", client_id);
  params.append("client_secret", client_secret);
  params.append("grant_type", "client_credentials");
  params.append("scope", scope);

  const r = await fetch("https://developer.api.autodesk.com/authentication/v2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!r.ok) {
    const body = await r.text();
    throw new Error(`Auth token fetch failed: ${r.status} ${body}`);
  }

  return r.json();
}

export async function GET(req, { params }) {
  try {
    const { urn } = params;
    if (!urn) return NextResponse.json({ error: "Missing urn param" }, { status: 400 });

    // Get an app token with data:read/data:write
    const token = await getAppToken("data:read data:write");

    // Try to get manifest (translation status)
    const manifestRes = await fetch(`https://developer.api.autodesk.com/modelderivative/v2/designdata/${urn}/manifest`, {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });

    if (manifestRes.ok) {
      // manifest exists: return parsed manifest
      const manifest = await manifestRes.json();
      return NextResponse.json(manifest);
    }

    // If manifest not found (404), create translation job
    if (manifestRes.status === 404) {
      const jobBody = {
        input: { urn },
        output: {
          formats: [{ type: "svf", views: ["2d", "3d"] }],
        },
      };

      const jobRes = await fetch("https://developer.api.autodesk.com/modelderivative/v2/designdata/job", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobBody),
      });

      const jobJson = await jobRes.json();

      if (!jobRes.ok) {
        return NextResponse.json({ error: jobJson }, { status: jobRes.status });
      }

      return NextResponse.json({ status: "started", detail: jobJson });
    }

    //.other errors
    const text = await manifestRes.text();
    return NextResponse.json({ error: text }, { status: manifestRes.status });
  } catch (err) {
    console.error("modelderivative route error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

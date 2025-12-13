import { NextRequest, NextResponse } from "next/server";

const HIRO_API_KEY = process.env.HIRO_API_KEY;

export async function GET(request: NextRequest) {
  try {
    const address = request.nextUrl.searchParams.get("address");

    if (!address) {
      return NextResponse.json({ error: "Missing address parameter" }, { status: 400 });
    }

    const externalUrl = `https://api.mainnet.hiro.so/names/address/${encodeURIComponent(address)}`;
    const headers: Record<string, string> = { Accept: "application/json" };
    if (HIRO_API_KEY) headers["x-api-key"] = HIRO_API_KEY;

    const response = await fetch(externalUrl, { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[BNS LOOKUP] Failed ${response.status} for ${externalUrl}. Body: ${errorText}`);
      // Be non-blocking: return empty name instead of propagating an error
      return NextResponse.json({ bnsName: "" });
    }

    const data = await response.json();
    const bnsName = Array.isArray(data)
      ? data[0] ?? ""
      : Array.isArray((data as any).names)
        ? (data as any).names[0] ?? ""
        : (data as any).name ?? (data as any).bnsName ?? "";

    return NextResponse.json({ bnsName });
  } catch (err) {
    console.error("[BNS LOOKUP] Unexpected error:", err);
    // Be non-blocking in failures
    return NextResponse.json({ bnsName: "" });
  }
}

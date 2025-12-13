import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const address: string | undefined = body?.address;
    if (!address || typeof address !== "string") {
      return NextResponse.json({ error: "Missing address" }, { status: 400 });
    }

    // Provide empty CacheLifeConfig to satisfy signature
    revalidateTag(`volume:${address}`, {});
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("/api/revalidate error:", err);
    return NextResponse.json({ error: err?.message || "Server Error" }, { status: 500 });
  }
}

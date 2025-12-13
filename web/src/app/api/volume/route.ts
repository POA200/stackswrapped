import { NextRequest } from "next/server";
import { fetchVolumeStats } from "@/lib/stacks-data";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");
    const yearParam = searchParams.get("year");
    const year = yearParam ? Number(yearParam) : 2025;

    if (!address) {
      return Response.json({ error: "Missing address" }, { status: 400 });
    }

    console.log("[API VOLUME] Fetching data for address:", address, "year:", year);
    
    const data = await fetchVolumeStats(address, year);
    
    console.log("[API VOLUME] Fetched data:", {
      totalTransactions: data?.totalTransactions,
      busiestMonth: data?.busiestMonth,
      avgTransactionsPerMonth: data?.avgTransactionsPerMonth,
      monthlyDataLength: data?.monthlyData?.length,
    });
    
    return Response.json({ ok: true, data });
  } catch (err) {
    console.error("/api/volume error", err);
    return Response.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
  }
}

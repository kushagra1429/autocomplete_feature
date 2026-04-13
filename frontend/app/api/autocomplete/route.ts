import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json([]);
  }

  const res = await fetch(`http://localhost:5000/api/search?q=${query}`);
  const data = await res.json();

  return NextResponse.json(data);
}
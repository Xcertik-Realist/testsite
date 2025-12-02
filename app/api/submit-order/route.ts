// app/api/submit-order/route.ts
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const order = await request.json();
    const filePath = path.join(process.cwd(), "salesman.txt");
    await fs.appendFile(filePath, JSON.stringify(order, null, 2) + "\n\n---\n\n");

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

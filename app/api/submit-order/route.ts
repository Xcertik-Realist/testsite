import { NextResponse } from "next/server";
import CryptoJS from "crypto-js";
import fs from "fs/promises";
import path from "path";

const KEY = "ScandinavianFirs2025SecureKey!@#123";

export async function POST(request: Request) {
  const order = await request.json();
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(order), KEY).toString();
  const log = `${new Date().toISOString()} | ${encrypted}\n`;

  const filePath = path.join(process.cwd(), "salesman.txt");
  await fs.appendFile(filePath, log);

  return NextResponse.json({ success: true });
}

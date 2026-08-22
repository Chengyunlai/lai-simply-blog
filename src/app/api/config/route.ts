import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { revalidatePath } from "next/cache";

const CONFIG_PATH = join(process.cwd(), "blog.config.json");

export async function GET() {
  // Only work in dev mode
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ success: false, error: "Only available in dev mode" }, { status: 403 });
  }

  try {
    if (!existsSync(CONFIG_PATH)) {
      return NextResponse.json({ success: true, config: {} });
    }
    const content = await readFile(CONFIG_PATH, "utf-8");
    const config = JSON.parse(content);
    return NextResponse.json({ success: true, config });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to read config" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // Only work in dev mode
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ success: false, error: "Only available in dev mode" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { config } = body;

    if (!config) {
      return NextResponse.json({ success: false, error: "Missing config" }, { status: 400 });
    }

    await writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");

    revalidatePath("/", "layout");

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to save config" }, { status: 500 });
  }
}

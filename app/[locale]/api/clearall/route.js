import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    if (!secret || secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: "Invalid or missing secret" }, { status: 401 });
    }

    revalidatePath("/", "layout");
    
    return NextResponse.json({ 
      revalidated: true, 
      scope: "ENTIRE_SITE", 
      now: Date.now() 
    });

  } catch (error) {
    return NextResponse.json({ message: "Error processing request", error: error.message }, { status: 500 });
  }
}
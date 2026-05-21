import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // TODO: implement AI analysis logic
  // 1. Parse multipart form data (CVs + job description)
  // 2. Extract text from each PDF
  // 3. Send to OpenRouter via Vercel AI SDK
  // 4. Parse and rank results
  // 5. Store results in Supabase
  // 6. Return ranked results

  return NextResponse.json({ message: "Analysis endpoint placeholder" }, { status: 200 });
}

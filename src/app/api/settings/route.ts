export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, role, created_at")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("[settings] Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile });
  } catch (err) {
    console.error("[settings] Unhandled GET error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { full_name } = body;

    if (typeof full_name !== "string" || !full_name.trim()) {
      return NextResponse.json({ error: "full_name is required" }, { status: 400 });
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .update({ full_name: full_name.trim(), updated_at: new Date().toISOString() })
      .eq("id", user.id)
      .select("id, full_name, email, role, created_at")
      .single();

    if (error) {
      console.error("[settings] Update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase.auth.updateUser({ data: { full_name: full_name.trim() } });

    return NextResponse.json({ profile });
  } catch (err) {
    console.error("[settings] Unhandled PATCH error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}

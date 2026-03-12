import { sql } from "@/lib/db";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { name, address } = await req.json();
  const rows = await sql`
    UPDATE core_schools SET name = ${name}, address = ${address}, updated_at = NOW()
    WHERE id = ${Number(id)}
    RETURNING *
  `;
  if (!rows.length) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(rows[0]);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await sql`DELETE FROM core_schools WHERE id = ${Number(id)}`;
  return Response.json({ ok: true });
}

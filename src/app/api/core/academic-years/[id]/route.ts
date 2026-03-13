import { sql } from "@/lib/db";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const rows = await sql`SELECT * FROM core_academic_years WHERE id = ${Number(id)}`;
  if (!rows.length) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(rows[0]);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { name, is_active } = await req.json();
  const rows = await sql`
    UPDATE core_academic_years SET name = ${name}, is_active = ${is_active}
    WHERE id = ${Number(id)} RETURNING *
  `;
  if (!rows.length) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(rows[0]);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await sql`DELETE FROM core_academic_years WHERE id = ${Number(id)}`;
  return Response.json({ ok: true });
}

import { sql } from "@/lib/db";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const rows = await sql`
    SELECT id, school_id, full_name, nis, nisn, gender, date_of_birth, phone, email
    FROM core_students WHERE id = ${Number(id)}
  `;
  if (!rows.length) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(rows[0]);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const b = await req.json();
  const rows = await sql`
    UPDATE core_students SET
      full_name = ${b.full_name}, nis = ${b.nis}, nisn = ${b.nisn ?? null},
      gender = ${b.gender ?? null}, phone = ${b.phone ?? null}, email = ${b.email ?? null},
      updated_at = NOW()
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
  await sql`DELETE FROM core_students WHERE id = ${Number(id)}`;
  return Response.json({ ok: true });
}

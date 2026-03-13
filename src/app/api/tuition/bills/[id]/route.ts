import { sql } from "@/lib/db";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const rows = await sql`
    SELECT id, title, total_amount, status, student_id, product_id, academic_year_id
    FROM tuition_bills WHERE id = ${Number(id)}
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
    UPDATE tuition_bills SET title = ${b.title}, total_amount = ${b.total_amount},
      status = ${b.status ?? 'unpaid'}, updated_at = NOW()
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
  await sql`DELETE FROM tuition_bills WHERE id = ${Number(id)}`;
  return Response.json({ ok: true });
}

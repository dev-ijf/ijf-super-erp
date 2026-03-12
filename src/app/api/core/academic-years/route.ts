import { sql } from "@/lib/db";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 10)));
  const offset = (page - 1) * limit;

  const [data, countResult] = await Promise.all([
    sql`SELECT * FROM core_academic_years ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`,
    sql`SELECT COUNT(*)::int AS total FROM core_academic_years`,
  ]);

  const total = countResult[0].total;
  return Response.json({ data, page, limit, total, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const { name, is_active } = await req.json();
  const rows = await sql`
    INSERT INTO core_academic_years (name, is_active) VALUES (${name}, ${is_active ?? false})
    RETURNING *
  `;
  return Response.json(rows[0], { status: 201 });
}

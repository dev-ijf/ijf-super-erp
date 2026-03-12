import { sql } from "@/lib/db";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 10)));
  const offset = (page - 1) * limit;

  const [data, countResult] = await Promise.all([
    sql`SELECT * FROM tuition_payment_methods ORDER BY id LIMIT ${limit} OFFSET ${offset}`,
    sql`SELECT COUNT(*)::int AS total FROM tuition_payment_methods`,
  ]);

  const total = countResult[0].total;
  return Response.json({ data, page, limit, total, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const { name, code, category, coa } = await req.json();
  const rows = await sql`
    INSERT INTO tuition_payment_methods (name, code, category, coa)
    VALUES (${name}, ${code}, ${category}, ${coa ?? null})
    RETURNING *
  `;
  return Response.json(rows[0], { status: 201 });
}

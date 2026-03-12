import { sql } from "@/lib/db";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 10)));
  const offset = (page - 1) * limit;

  const [data, countResult] = await Promise.all([
    sql`
      SELECT p.id, p.name, p.payment_type, p.coa, p.description,
        cs.name AS school_name
      FROM tuition_products p
      LEFT JOIN core_schools cs ON cs.id = p.school_id
      ORDER BY p.id
      LIMIT ${limit} OFFSET ${offset}
    `,
    sql`SELECT COUNT(*)::int AS total FROM tuition_products`,
  ]);

  const total = countResult[0].total;
  return Response.json({ data, page, limit, total, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const { school_id, name, payment_type, coa } = await req.json();
  const rows = await sql`
    INSERT INTO tuition_products (school_id, name, payment_type, coa)
    VALUES (${school_id}, ${name}, ${payment_type}, ${coa ?? null})
    RETURNING *
  `;
  return Response.json(rows[0], { status: 201 });
}

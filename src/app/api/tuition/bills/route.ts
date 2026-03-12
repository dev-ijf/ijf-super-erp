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
      SELECT b.id, b.title, b.total_amount, b.paid_amount, b.status,
        b.due_date, b.related_month, b.created_at,
        s.full_name AS student_name, s.nis,
        p.name AS product_name, p.payment_type
      FROM tuition_bills b
      LEFT JOIN core_students s ON s.id = b.student_id
      LEFT JOIN tuition_products p ON p.id = b.product_id
      ORDER BY b.id DESC
      LIMIT ${limit} OFFSET ${offset}
    `,
    sql`SELECT COUNT(*)::int AS total FROM tuition_bills`,
  ]);

  const total = countResult[0].total;
  return Response.json({ data, page, limit, total, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const b = await req.json();
  const rows = await sql`
    INSERT INTO tuition_bills (student_id, product_id, academic_year_id, title, total_amount, min_payment, status, related_month)
    VALUES (${b.student_id}, ${b.product_id}, ${b.academic_year_id}, ${b.title},
            ${b.total_amount}, ${b.min_payment ?? 0}, 'unpaid', ${b.related_month ?? null})
    RETURNING *
  `;
  return Response.json(rows[0], { status: 201 });
}

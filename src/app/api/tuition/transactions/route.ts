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
      SELECT t.id, t.reference_no, t.total_amount, t.status,
        t.payment_date, t.created_at,
        u.full_name AS user_name,
        pm.name AS payment_method_name
      FROM tuition_transactions t
      LEFT JOIN core_users u ON u.id = t.user_id
      LEFT JOIN tuition_payment_methods pm ON pm.id = t.payment_method_id
      ORDER BY t.id DESC
      LIMIT ${limit} OFFSET ${offset}
    `,
    sql`SELECT COUNT(*)::int AS total FROM tuition_transactions`,
  ]);

  const total = countResult[0].total;
  return Response.json({ data, page, limit, total, totalPages: Math.ceil(total / limit) });
}

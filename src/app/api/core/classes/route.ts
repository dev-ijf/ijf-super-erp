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
      SELECT c.id, c.name, c.school_id,
        cs.name AS school_name, lg.name AS level_name
      FROM core_classes c
      LEFT JOIN core_schools cs ON cs.id = c.school_id
      LEFT JOIN core_level_grades lg ON lg.id = c.level_grade_id
      ORDER BY lg.level_order, c.name
      LIMIT ${limit} OFFSET ${offset}
    `,
    sql`SELECT COUNT(*)::int AS total FROM core_classes`,
  ]);

  const total = countResult[0].total;
  return Response.json({ data, page, limit, total, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const { school_id, level_grade_id, name } = await req.json();
  const rows = await sql`
    INSERT INTO core_classes (school_id, level_grade_id, name)
    VALUES (${school_id}, ${level_grade_id}, ${name})
    RETURNING *
  `;
  return Response.json(rows[0], { status: 201 });
}

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
      SELECT
        s.id, s.full_name, s.nis, s.nisn, s.gender, s.date_of_birth,
        s.phone, s.email, s.created_at,
        cs.name AS school_name,
        cc.name AS class_name,
        clg.name AS level_name
      FROM core_students s
      LEFT JOIN core_schools cs ON cs.id = s.school_id
      LEFT JOIN core_student_class_histories sch
        ON sch.student_id = s.id AND sch.status = 'active'
      LEFT JOIN core_classes cc ON cc.id = sch.class_id
      LEFT JOIN core_level_grades clg ON clg.id = sch.level_grade_id
      ORDER BY s.full_name
      LIMIT ${limit} OFFSET ${offset}
    `,
    sql`SELECT COUNT(*)::int AS total FROM core_students`,
  ]);

  const total = countResult[0].total;
  return Response.json({ data, page, limit, total, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const rows = await sql`
    INSERT INTO core_students (school_id, full_name, nis, nisn, gender, date_of_birth, phone, email)
    VALUES (${body.school_id}, ${body.full_name}, ${body.nis}, ${body.nisn ?? null},
            ${body.gender ?? null}, ${body.date_of_birth ?? null}, ${body.phone ?? null}, ${body.email ?? null})
    RETURNING *
  `;
  return Response.json(rows[0], { status: 201 });
}

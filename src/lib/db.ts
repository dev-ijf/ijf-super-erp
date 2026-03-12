import { neon } from '@neondatabase/serverless';

/**
 * Neon serverless HTTP client — Edge Runtime compatible.
 *
 * Usage in API routes:
 *   import { sql } from '@/lib/db';
 *   const rows = await sql`SELECT * FROM core_schools WHERE id = ${id}`;
 *
 * This uses the HTTP query function (neon()) which works on Vercel Edge,
 * Cloudflare Workers, and any standard Web API environment.
 */
export const sql = neon(process.env.DATABASE_URL!);

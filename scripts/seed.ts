import { config } from 'dotenv';
config({ path: '.env.local' });
import { neon } from '@neondatabase/serverless';

async function main() {
  console.log('🌱 Starting seed...');

  const sql = neon(process.env.DATABASE_URL!);

  // ──────────────────────────────────────────────
  // 1. Schools
  // ──────────────────────────────────────────────
  console.log('  → Seeding core_schools...');
  await sql`
    INSERT INTO core_schools (id, name, address) VALUES
      (1, 'SMA Cendekia', 'Jl. Merpati 1, Jakarta'),
      (2, 'SMP Cendekia', 'Jl. Merpati 2, Jakarta')
    ON CONFLICT (id) DO NOTHING
  `;

  // ──────────────────────────────────────────────
  // 2. Academic Years
  // ──────────────────────────────────────────────
  console.log('  → Seeding core_academic_years...');
  await sql`
    INSERT INTO core_academic_years (id, name, is_active) VALUES
      (1, '2023/2024', FALSE),
      (2, '2024/2025', TRUE)
    ON CONFLICT (id) DO NOTHING
  `;

  // ──────────────────────────────────────────────
  // 2B. Settings
  // ──────────────────────────────────────────────
  console.log('  → Seeding core_settings...');
  await sql`
    INSERT INTO core_settings (school_id, setting_key, setting_value, description) VALUES
      (NULL, 'app_title', 'DigiEduka Portal', 'Judul aplikasi utama global'),
      (NULL, 'global_logo_url', 'https://digieduka.web.id/assets/logo.png', 'Logo default untuk seluruh yayasan'),
      (NULL, 'primary_color', '#2563eb', 'Warna tema utama (Biru) global'),
      (1, 'primary_color', '#1e40af', 'Warna tema spesifik untuk SMA Cendekia (Biru Gelap)'),
      (1, 'school_logo_url', 'https://digieduka.web.id/assets/logo_sma.png', 'Logo khusus SMA Cendekia'),
      (2, 'primary_color', '#047857', 'Warna tema spesifik untuk SMP Cendekia (Hijau)')
    ON CONFLICT (school_id, setting_key) DO NOTHING
  `;

  // ──────────────────────────────────────────────
  // 3. Users
  // ──────────────────────────────────────────────
  console.log('  → Seeding core_users...');
  await sql`
    INSERT INTO core_users (id, school_id, full_name, email, password_hash, role) VALUES
      (1, NULL, 'System Superadmin', 'superadmin@yayasan.com', 'hash', 'superadmin'),
      (2, 1, 'Finance SMA', 'finance@sma-cendekia.com', 'hash', 'school_finance'),
      (3, 2, 'Finance SMP', 'finance@smp-cendekia.com', 'hash', 'school_finance'),
      (4, NULL, 'Budi Santoso', 'budi.ayah@email.com', 'hash', 'parent'),
      (5, NULL, 'Siti Aminah', 'siti.ibu@email.com', 'hash', 'parent')
    ON CONFLICT (id) DO NOTHING
  `;

  // ──────────────────────────────────────────────
  // 3B. Regional Data
  // ──────────────────────────────────────────────
  console.log('  → Seeding regional data...');
  await sql`INSERT INTO core_provinces (id, name) VALUES (1, 'DKI Jakarta') ON CONFLICT (id) DO NOTHING`;
  await sql`INSERT INTO core_cities (id, province_id, name) VALUES (1, 1, 'Jakarta Selatan') ON CONFLICT (id) DO NOTHING`;
  await sql`INSERT INTO core_districts (id, city_id, name) VALUES (1, 1, 'Kebayoran Lama') ON CONFLICT (id) DO NOTHING`;
  await sql`INSERT INTO core_subdistricts (id, district_id, name, postal_code) VALUES (1, 1, 'Pondok Pinang', '12240') ON CONFLICT (id) DO NOTHING`;

  // ──────────────────────────────────────────────
  // 4. Students
  // ──────────────────────────────────────────────
  console.log('  → Seeding core_students...');
  await sql`
    INSERT INTO core_students (
      id, school_id, full_name, nis, nisn, previous_school, gender, place_of_birth,
      date_of_birth, religion, child_order, siblings_count, child_status, address,
      province_id, city_id, district_id, subdistrict_id, postal_code, phone,
      email, living_with, blood_type, weight_kg, height_cm, allergies,
      vision_condition, hearing_condition, special_needs, chronic_diseases,
      physical_abnormalities, recurring_diseases
    ) VALUES
      (1, 1, 'Ahmad Santoso', 'SMA-001', '0012345678', 'SMP Negeri 1', 'L', 'Jakarta',
       '2008-05-15', 'Islam', 1, 2, 'Kandung', 'Jl. Merpati No. 45',
       1, 1, 1, 1, '12240', '081299998888', 'ahmad@email.com', 'Orang Tua',
       'O', 55.50, 165, 'Tidak ada', 'Normal', 'Normal', 'Tidak',
       'Tidak ada', 'Tidak ada', 'Tidak ada'),
      (2, 2, 'Aisyah Santoso', 'SMP-001', '0034567890', 'SD Negeri 2', 'P', 'Jakarta',
       '2011-08-20', 'Islam', 2, 2, 'Kandung', 'Jl. Merpati No. 45',
       1, 1, 1, 1, '12240', '081277776666', 'aisyah@email.com', 'Orang Tua',
       'A', 42.00, 150, 'Alergi Seafood', 'Minus 1', 'Normal', 'Tidak',
       'Asma', 'Tidak ada', 'Asma')
    ON CONFLICT (id) DO NOTHING
  `;

  // ──────────────────────────────────────────────
  // 4B. Student Documents
  // ──────────────────────────────────────────────
  console.log('  → Seeding core_student_documents...');
  await sql`
    INSERT INTO core_student_documents (student_id, document_type, file_name, file_path) VALUES
      (1, 'KARTU KELUARGA', 'kk_ahmad_santoso.pdf', '/storage/documents/kk_ahmad_santoso.pdf'),
      (1, 'AKTA KELAHIRAN', 'akta_ahmad_santoso.pdf', '/storage/documents/akta_ahmad_santoso.pdf')
  `;

  // ──────────────────────────────────────────────
  // 5. Parent-Student Relations
  // ──────────────────────────────────────────────
  console.log('  → Seeding core_parent_student_relations...');
  await sql`
    INSERT INTO core_parent_student_relations (user_id, student_id, relation_type) VALUES
      (4, 1, 'father'),
      (4, 2, 'father'),
      (5, 1, 'mother'),
      (5, 2, 'mother')
    ON CONFLICT (user_id, student_id) DO NOTHING
  `;

  // ──────────────────────────────────────────────
  // 6. Level Grades
  // ──────────────────────────────────────────────
  console.log('  → Seeding core_level_grades...');
  await sql`
    INSERT INTO core_level_grades (id, school_id, name, level_order) VALUES
      (1, 1, 'Kelas 11', 11),
      (2, 1, 'Kelas 12', 12),
      (3, 2, 'Kelas 8', 8)
    ON CONFLICT (id) DO NOTHING
  `;

  // ──────────────────────────────────────────────
  // 7. Classes & Student Class Histories
  // ──────────────────────────────────────────────
  console.log('  → Seeding core_classes...');
  await sql`
    INSERT INTO core_classes (id, school_id, level_grade_id, name) VALUES
      (1, 1, 1, '11 IPA 1'),
      (2, 1, 2, '12 IPA 1'),
      (3, 2, 3, '8A')
    ON CONFLICT (id) DO NOTHING
  `;

  console.log('  → Seeding core_student_class_histories...');
  await sql`
    INSERT INTO core_student_class_histories (student_id, class_id, level_grade_id, academic_year_id, status) VALUES
      (1, 1, 1, 1, 'completed'),
      (1, 2, 2, 2, 'active'),
      (2, 3, 3, 2, 'active')
  `;

  // ──────────────────────────────────────────────
  // 8. Payment Methods
  // ──────────────────────────────────────────────
  console.log('  → Seeding tuition_payment_methods...');
  await sql`
    INSERT INTO tuition_payment_methods (id, name, code, category, coa) VALUES
      (1, 'Credit Card', 'CC', 'Credit Card', '1101.02.001'),
      (2, 'GoPay', 'GOPAY', 'e-Wallet', '1101.02.002'),
      (3, 'Bank Transfer BCA', 'BCA_TF', 'Virtual Account', '1101.01.001')
    ON CONFLICT (id) DO NOTHING
  `;

  // ──────────────────────────────────────────────
  // 9. Payment Instructions
  // ──────────────────────────────────────────────
  console.log('  → Seeding payment instructions...');
  await sql`
    INSERT INTO tuition_payment_instruction_groups (id, payment_method_id, title) VALUES
      (1, 2, 'Pembayaran melalui Aplikasi Gojek'),
      (2, 3, 'Pembayaran melalui m-BCA'),
      (3, 3, 'Pembayaran melalui ATM BCA')
    ON CONFLICT (id) DO NOTHING
  `;

  await sql`
    INSERT INTO tuition_payment_instruction_steps (group_id, step_number, instruction_text) VALUES
      (1, 1, 'Buka aplikasi Gojek di HP Anda.'),
      (1, 2, 'Pilih menu Bayar lalu scan QRIS yang muncul di layar.'),
      (1, 3, 'Konfirmasi nominal pembayaran dan masukkan PIN GoPay Anda.'),
      (2, 1, 'Buka aplikasi m-BCA dan lakukan login.'),
      (2, 2, 'Pilih menu M-Transfer > BCA Virtual Account.'),
      (2, 3, 'Masukkan nomor Virtual Account yang tertera pada halaman pembayaran.'),
      (2, 4, 'Periksa detail tagihan, lalu masukkan PIN m-BCA Anda untuk menyelesaikan transaksi.'),
      (3, 1, 'Masukkan kartu ATM dan PIN BCA Anda.'),
      (3, 2, 'Pilih Transaksi Lainnya > Transfer > ke Rekening BCA Virtual Account.'),
      (3, 3, 'Masukkan nomor Virtual Account.'),
      (3, 4, 'Pastikan nama dan nominal sesuai, lalu tekan Benar.')
  `;

  // ──────────────────────────────────────────────
  // 10. Products
  // ──────────────────────────────────────────────
  console.log('  → Seeding tuition_products...');
  await sql`
    INSERT INTO tuition_products (id, school_id, name, payment_type, coa) VALUES
      (1, 1, 'SPP SMA', 'monthly', '4101.01.000'),
      (2, 1, 'Building Fee SMA', 'installment', '4102.01.000'),
      (3, 2, 'SPP SMP', 'monthly', '4101.02.000')
    ON CONFLICT (id) DO NOTHING
  `;

  // ──────────────────────────────────────────────
  // 11. Bills
  // ──────────────────────────────────────────────
  console.log('  → Seeding tuition_bills...');
  await sql`
    INSERT INTO tuition_bills (id, student_id, product_id, academic_year_id, title, total_amount, paid_amount, min_payment, status, related_month) VALUES
      (1, 1, 1, 2, 'SPP October 2024', 1500000, 1500000, 0, 'paid', '2024-10-01'),
      (2, 1, 1, 2, 'SPP November 2024', 1500000, 0, 0, 'unpaid', '2024-11-01'),
      (3, 1, 2, 2, 'Building Fee', 15000000, 5000000, 500000, 'partial', NULL),
      (4, 2, 3, 2, 'SPP October 2024', 1000000, 0, 0, 'unpaid', '2024-10-01')
    ON CONFLICT (id) DO NOTHING
  `;

  // ──────────────────────────────────────────────
  // 12. Transactions
  // ──────────────────────────────────────────────
  console.log('  → Seeding tuition_transactions...');
  await sql`
    INSERT INTO tuition_transactions (id, user_id, academic_year_id, reference_no, total_amount, payment_method_id, status, payment_date) VALUES
      (1, 4, 2, 'TRX-BUDI-001', 1500000, 1, 'success', '2024-10-05 10:00:00')
    ON CONFLICT (id) DO NOTHING
  `;

  // ──────────────────────────────────────────────
  // 13. Transaction Details
  // ──────────────────────────────────────────────
  console.log('  → Seeding tuition_transaction_details...');
  await sql`
    INSERT INTO tuition_transaction_details (transaction_id, bill_id, amount_paid) VALUES
      (1, 1, 1500000)
  `;

  // ──────────────────────────────────────────────
  // 14. Notification Templates
  // ──────────────────────────────────────────────
  console.log('  → Seeding notif_templates...');
  await sql`
    INSERT INTO notif_templates (id, school_id, name, type, trigger_event, content) VALUES
      (1, NULL, 'Payment Success WA', 'whatsapp', 'PAYMENT_SUCCESS',
       'Halo {name}, pembayaran untuk {bill_title} sebesar {amount} telah berhasil diterima. Terima kasih.')
    ON CONFLICT (id) DO NOTHING
  `;

  // ──────────────────────────────────────────────
  // Reset sequences to max id + 1
  // ──────────────────────────────────────────────
  console.log('  → Resetting sequences...');
  await sql`
    DO $$
    DECLARE
      t RECORD;
      seq_name TEXT;
      max_val BIGINT;
    BEGIN
      FOR t IN
        SELECT tablename FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename IN (
          'core_schools','core_academic_years','core_settings','core_users',
          'core_provinces','core_cities','core_districts','core_subdistricts',
          'core_students','core_student_documents','core_level_grades','core_classes',
          'core_student_class_histories','tuition_products','tuition_payment_methods',
          'tuition_payment_instruction_groups','tuition_payment_instruction_steps',
          'tuition_bills','tuition_transactions','tuition_transaction_details',
          'tuition_payment_logs','notif_templates','notif_logs'
        )
      LOOP
        seq_name := pg_get_serial_sequence(t.tablename, 'id');
        IF seq_name IS NOT NULL THEN
          EXECUTE format('SELECT COALESCE(MAX(id), 0) + 1 FROM %I', t.tablename) INTO max_val;
          EXECUTE format('SELECT setval(%L, %s, false)', seq_name, max_val);
        END IF;
      END LOOP;
    END $$
  `;

  console.log('✅ Seed completed successfully!');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});

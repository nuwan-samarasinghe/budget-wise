-- ==========================================
-- Initial Seed Data (no rollback)
-- Assumes:
--   - All tables/constraints created
--   - bwise_savings has NO column income_month
-- ==========================================

-- ---------- USERS ----------
-- Plain password (for reference only): Password123!
-- Stored with Spring Security format id for bcrypt
-- NOTE: Hash below is a well-known bcrypt of "password".
-- If you need the hash to match "Password123!" exactly, replace it with your own bcrypt.
WITH pwd AS (
  SELECT '$2a$10$bsMLRdsozxjittUn53zSburPg4fvx4ECzq/T1NIOh9dNB1qYA/GUy'::varchar AS hashed
)
INSERT INTO public.bwise_user (id, created_at, updated_at, full_name, is_active, password, username)
SELECT * FROM (
  VALUES
    ('c2f7d2a3-6d54-4ebf-bd7a-6a7bb4b1c0a1'::uuid, NOW(), NULL::timestamp, 'Oliver',      TRUE, (SELECT hashed FROM pwd), 'oliver@gmail.com'),
    ('7a5c8c9b-a1b3-4f3d-9f5d-2f1c4a7b9e22'::uuid, NOW(), NULL::timestamp, 'Jane Doe',        TRUE, (SELECT hashed FROM pwd), 'jane@gmail.com'),
    ('e1b5b0c2-9f6a-4d3f-85a4-7f2d9c8b6a33'::uuid, NOW(), NULL::timestamp, 'John Smith',      TRUE, (SELECT hashed FROM pwd), 'john@gmail.com'),
    ('a4b6c7d8-e9fa-4b0c-b1c2-d3e4f5a6b7c8'::uuid, NOW(), NULL::timestamp, 'James',  TRUE, (SELECT hashed FROM pwd), 'james@gmail.com')
) AS t(id, created_at, updated_at, full_name, is_active, password, username);

-- ==========================================================
-- FULL SEED: categories + monthly income/budget/expense/savings
-- Period: 2023-01 .. 2025-12
-- Rerunnable (deterministic UUIDs + ON CONFLICT DO NOTHING)
-- ==========================================================

-- -------------------------------
-- 1) Standard categories per user
-- -------------------------------
WITH category_list(name) AS (
  VALUES
    ('Miscellaneous'), ('School Supplies'), ('Bank Fees'), ('Public Transit'), ('Pet Food'),
    ('Vet Visits'), ('Car Insurance'), ('Dining Out'), ('Phone'), ('Household Items'),
    ('Uniforms'), ('Health Insurance'), ('Fuel'), ('Investments'), ('Pet Insurance'),
    ('Car Payment'), ('Gifts'), ('Credit Card Payments'), ('Childcare'), ('Electricity'),
    ('Gym Membership'), ('Home Country Maintainance'), ('Groceries'), ('Rent'), ('Gas'),
    ('Office Supplies'), ('Mortgage'), ('Subscriptions'), ('Hobbies'), ('Courses / Learning'),
    ('Maintenance & Repairs'), ('Coffee / Snacks'), ('Internet'), ('Emergency Fund'),
    ('Home Insurance'), ('Toiletries'), ('Savings'), ('Books'), ('Vacations'),
    ('Electronics'), ('Pet Supplies'), ('Haircuts / Grooming'), ('Movies / Events'),
    ('Tuition'), ('Parking'), ('Medications'), ('Trash'), ('Clothing'),
    ('Counsil Taxes'), ('Streaming Services'), ('Kids’ Activities'), ('Car Repairs'),
    ('Commuting'), ('Student Loans'), ('Medical Bills'), ('Property Taxes'), ('Water'), ('Donations')
)
INSERT INTO public.bwise_category (id, created_at, updated_at, name)
SELECT
  (
    substr(md5(u.id::text || c.name),1,8) || '-' ||
    substr(md5(u.id::text || c.name),9,4) || '-' ||
    substr(md5(u.id::text || c.name),13,4) || '-' ||
    substr(md5(u.id::text || c.name),17,4) || '-' ||
    substr(md5(u.id::text || c.name),21,12)
  )::uuid AS id,
  NOW() AS created_at,
  NULL::timestamp AS updated_at,
  c.name AS name
FROM public.bwise_user u
CROSS JOIN category_list c
WHERE NOT EXISTS (
  SELECT 1
  FROM public.bwise_category bc
  WHERE bc.user_id = u.id AND bc.name = c.name
);

-- make sure the CTE runs before continuing
SELECT 1;
-- (ignore result)

-- ----------------------------------------
-- 2) Month range & per-user income profile
-- ----------------------------------------
WITH months AS (
  SELECT gs::date AS month_start
  FROM generate_series(date '2023-01-01', date '2025-12-01', interval '1 month') AS gs
),
users_profile AS (
  -- Build a deterministic monthly base income per user using md5(id)
  -- base_income roughly in 2,800 .. 8,200 range
  SELECT
    u.id AS user_id,
    u.username,
    2800
      + (get_byte(decode(md5(u.id::text),'hex'),0) * 12)
      + (get_byte(decode(md5(u.id::text),'hex'),1) * 8)
      + (get_byte(decode(md5(u.id::text),'hex'),2) * 4)
      +  get_byte(decode(md5(u.id::text),'hex'),3)
    AS base_income,
    1::smallint AS income_type,              -- 1 = payroll (adjust if you use enums)
    'Payroll'::varchar AS source_label
  FROM public.bwise_user u
),

-- small seasonal variation (kept stable across years)
income_calc AS (
  SELECT
    up.user_id,
    up.username,
    m.month_start,
    ROUND(up.base_income + (extract(month from m.month_start)::int - 6) * 15.0, 2) AS income_amt
  FROM users_profile up
  CROSS JOIN months m
),

-- -------------------------
-- 3) Insert monthly INCOME
-- -------------------------
ins_income AS (
  INSERT INTO public.bwise_income
    (id, created_at, updated_at, amount, from_date, income_month, income_type, note, recurrent, source, to_date, user_id)
  SELECT
    (
      substr(md5(ic.user_id::text || ic.month_start::text || 'income'),1,8) || '-' ||
      substr(md5(ic.user_id::text || ic.month_start::text || 'income'),9,4) || '-' ||
      substr(md5(ic.user_id::text || ic.month_start::text || 'income'),13,4) || '-' ||
      substr(md5(ic.user_id::text || ic.month_start::text || 'income'),17,4) || '-' ||
      substr(md5(ic.user_id::text || ic.month_start::text || 'income'),21,12)
    )::uuid AS id,
    ic.month_start + time '00:00'  AS created_at,
    NULL::timestamp                AS updated_at,
    ic.income_amt                  AS amount,
    NULL::date                     AS from_date,
    ic.month_start                 AS income_month,
    1::smallint                    AS income_type,
    initcap(ic.username) || ' monthly income' AS note,
    TRUE                           AS recurrent,
    'Payroll'                      AS source,
    NULL::date                     AS to_date,
    ic.user_id                     AS user_id
  FROM income_calc ic
  ON CONFLICT DO NOTHING
  RETURNING 1
)

SELECT 1;
-- (ignore result)

-- -------------------------------------------------------
-- 4) Decide expense/savings & split across 7 categories
--    Constraint: expense + savings = income
--    Weights deterministic and same for all users/months
-- -------------------------------------------------------
WITH months AS (
  SELECT gs::date AS month_start
  FROM generate_series(date '2023-01-01', date '2025-12-01', interval '1 month') AS gs
),
users_profile AS (
  SELECT
    u.id AS user_id,
    u.username,
    2800
      + (get_byte(decode(md5(u.id::text),'hex'),0) * 12)
      + (get_byte(decode(md5(u.id::text),'hex'),1) * 8)
      + (get_byte(decode(md5(u.id::text),'hex'),2) * 4)
      +  get_byte(decode(md5(u.id::text),'hex'),3)
    AS base_income
  FROM public.bwise_user u
),
income_calc AS (
  SELECT
    up.user_id,
    up.username,
    m.month_start,
    ROUND(up.base_income + (extract(month from m.month_start)::int - 6) * 15.0, 2) AS income_amt
  FROM users_profile up
  CROSS JOIN months m
),
-- month-varying expense share (68/70/72%)
expense_savings AS (
  SELECT
    ic.*,
    (CASE
      WHEN (extract(month from ic.month_start)::int % 3) = 0 THEN 0.68
      WHEN (extract(month from ic.month_start)::int % 3) = 1 THEN 0.70
      ELSE 0.72
    END) AS exp_ratio,
    ROUND(ic.income_amt * (CASE
      WHEN (extract(month from ic.month_start)::int % 3) = 0 THEN 0.68
      WHEN (extract(month from ic.month_start)::int % 3) = 1 THEN 0.70
      ELSE 0.72
    END), 2) AS expense_amt,
    ROUND(ic.income_amt - ROUND(ic.income_amt * (CASE
      WHEN (extract(month from ic.month_start)::int % 3) = 0 THEN 0.68
      WHEN (extract(month from ic.month_start)::int % 3) = 1 THEN 0.70
      ELSE 0.72
    END), 2), 2) AS savings_amt
  FROM income_calc ic
),
-- weights across seven named categories
weight_def AS (
  SELECT * FROM (VALUES
    ('Rent',            0.40, 1),
    ('Groceries',       0.22, 2),
    ('Electricity',     0.06, 3),
    ('Internet',        0.05, 4),
    ('Fuel',            0.08, 5),
    ('Dining Out',      0.12, 6),
    ('Subscriptions',   0.07, 7)
  ) AS w(name, weight, rnk)
),
-- join to actual category IDs per user
cat_pick AS (
  SELECT
    bc.user_id,
    bc.id AS category_id,
    bc.name,
    wd.weight,
    wd.rnk
  FROM public.bwise_category bc
  JOIN weight_def wd ON wd.name = bc.name
),
-- compute per-category expense amounts with exact rounding fix
cat_amounts AS (
  SELECT
    es.user_id,
    es.month_start,
    cp.category_id,
    cp.name,
    cp.rnk,
    es.expense_amt,
    -- rounded suggestion
    ROUND(es.expense_amt * cp.weight, 2) AS amt_rounded,
    -- window sums for rounding adjustment
    SUM(ROUND(es.expense_amt * cp.weight, 2))
      OVER (PARTITION BY es.user_id, es.month_start ORDER BY cp.rnk
            ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING) AS sum_before,
    MAX(cp.rnk) OVER (PARTITION BY es.user_id, es.month_start) AS max_rnk
  FROM expense_savings es
  JOIN cat_pick cp ON cp.user_id = es.user_id
),
cat_amounts_fixed AS (
  SELECT
    user_id, month_start, category_id, name, rnk,
    CASE
      WHEN rnk = max_rnk
        THEN ROUND(expense_amt - COALESCE(sum_before,0), 2)
      ELSE amt_rounded
    END AS cat_expense
  FROM cat_amounts
),

-- -------------------------
-- 5) Insert monthly BUDGET
--    (per category, equals planned expense)
-- -------------------------
ins_budget AS (
  INSERT INTO public.bwise_budget
    (id, created_at, updated_at, affect_on, amount, budget_month, from_date, note, recurrent, to_date, category_id, user_id)
  SELECT
    (
      substr(md5(ca.user_id::text || ca.month_start::text || ca.category_id::text || 'budget'),1,8) || '-' ||
      substr(md5(ca.user_id::text || ca.month_start::text || ca.category_id::text || 'budget'),9,4) || '-' ||
      substr(md5(ca.user_id::text || ca.month_start::text || ca.category_id::text || 'budget'),13,4) || '-' ||
      substr(md5(ca.user_id::text || ca.month_start::text || ca.category_id::text || 'budget'),17,4) || '-' ||
      substr(md5(ca.user_id::text || ca.month_start::text || ca.category_id::text || 'budget'),21,12)
    )::uuid AS id,
    ca.month_start + time '00:05'           AS created_at,
    NULL::timestamp                         AS updated_at,
    ca.month_start + interval '5 day'       AS affect_on,
    ca.cat_expense                          AS amount,
    ca.month_start                          AS budget_month,
    NULL::date                              AS from_date,
    'Planned ' || ca.name                   AS note,
    TRUE                                    AS recurrent,
    NULL::date                              AS to_date,
    ca.category_id                          AS category_id,
    ca.user_id                              AS user_id
  FROM cat_amounts_fixed ca
  ON CONFLICT DO NOTHING
  RETURNING 1
),

-- --------------------------
-- 6) Insert monthly EXPENSE
--    (per category, matches budget)
-- --------------------------
ins_expense AS (
  INSERT INTO public.bwise_expense
    (id, created_at, updated_at, affect_on, amount, income_month, from_date, note, recurrent, to_date, category_id, user_id)
  SELECT
    (
      substr(md5(ca.user_id::text || ca.month_start::text || ca.category_id::text || 'expense'),1,8) || '-' ||
      substr(md5(ca.user_id::text || ca.month_start::text || ca.category_id::text || 'expense'),9,4) || '-' ||
      substr(md5(ca.user_id::text || ca.month_start::text || ca.category_id::text || 'expense'),13,4) || '-' ||
      substr(md5(ca.user_id::text || ca.month_start::text || ca.category_id::text || 'expense'),17,4) || '-' ||
      substr(md5(ca.user_id::text || ca.month_start::text || ca.category_id::text || 'expense'),21,12)
    )::uuid AS id,
    ca.month_start + time '00:10'           AS created_at,
    NULL::timestamp                         AS updated_at,
    ca.month_start + (ca.rnk || ' day')::interval AS affect_on,
    ca.cat_expense                          AS amount,
    ca.month_start                          AS income_month,
    NULL::date                              AS from_date,
    'Actual ' || ca.name                    AS note,
    TRUE                                    AS recurrent,
    NULL::date                              AS to_date,
    ca.category_id                          AS category_id,
    ca.user_id                              AS user_id
  FROM cat_amounts_fixed ca
  ON CONFLICT DO NOTHING
  RETURNING 1
)

-- --------------------------
-- 7) Insert monthly SAVINGS
-- --------------------------
INSERT INTO public.bwise_savings
  (id, created_at, updated_at, affect_on, amount, from_date, note, recurrent, to_date, user_id, saving_month)
SELECT
  (
    substr(md5(es.user_id::text || es.month_start::text || 'savings'),1,8) || '-' ||
    substr(md5(es.user_id::text || es.month_start::text || 'savings'),9,4) || '-' ||
    substr(md5(es.user_id::text || es.month_start::text || 'savings'),13,4) || '-' ||
    substr(md5(es.user_id::text || es.month_start::text || 'savings'),17,4) || '-' ||
    substr(md5(es.user_id::text || es.month_start::text || 'savings'),21,12)
  )::uuid AS id,
  es.month_start + time '00:15'          AS created_at,
  NULL::timestamp                        AS updated_at,
  es.month_start + interval '15 day'     AS affect_on,
  es.savings_amt                         AS amount,
  NULL::date                             AS from_date,
  'Monthly savings allocation'           AS note,
  TRUE                                   AS recurrent,
  NULL::date                             AS to_date,
  es.user_id                             AS user_id,
  es.month_start                          AS saving_month
FROM expense_savings es
ON CONFLICT DO NOTHING;

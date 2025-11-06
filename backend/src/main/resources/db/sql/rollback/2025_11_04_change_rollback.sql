-- Remove the unique constraint
ALTER TABLE public.bwise_income
  DROP CONSTRAINT IF EXISTS UKa37dkqlu9gfrtocokilefwsqn;

-- Re-add the column to bwise_savings
-- NOTE: Original type was DATE. If it used to be NOT NULL, re-apply that
-- only after you’ve backfilled values to avoid failures.
ALTER TABLE public.bwise_savings
  ADD COLUMN income_month DATE;
-- To enforce NOT NULL again (optional, do after backfill):
-- ALTER TABLE public.bwise_savings ALTER COLUMN income_month SET NOT NULL;
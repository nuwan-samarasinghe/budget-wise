-- Add unique constraint on (user_id, income_month)
ALTER TABLE public.bwise_income
  ADD CONSTRAINT UKa37dkqlu9gfrtocokilefwsqn
  UNIQUE (user_id, income_month);

-- Drop income_month from bwise_savings
ALTER TABLE public.bwise_savings
  DROP COLUMN income_month;
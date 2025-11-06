-- =============================
--  Initial Schema Rollback
--  Drops all created objects
-- =============================

-- Drop FKs first
ALTER TABLE IF EXISTS public.bwise_budget DROP CONSTRAINT IF EXISTS fkjt2xo268wdaknresn8llagg8r;
ALTER TABLE IF EXISTS public.bwise_category DROP CONSTRAINT IF EXISTS fkh76gftl0xgwlk4noh3sttukop;
ALTER TABLE IF EXISTS public.bwise_savings DROP CONSTRAINT IF EXISTS fkdh3218k40umdhr6f9gabjl983;
ALTER TABLE IF EXISTS public.bwise_expense DROP CONSTRAINT IF EXISTS fkac3pfy6v2slpegnbx5bn5b9qk;
ALTER TABLE IF EXISTS public.bwise_expense DROP CONSTRAINT IF EXISTS fk45unbu6qp2kryjuqncfob1mnn;
ALTER TABLE IF EXISTS public.bwise_budget DROP CONSTRAINT IF EXISTS fk4429stot6ypx6f1xb987bg68q;
ALTER TABLE IF EXISTS public.bwise_income DROP CONSTRAINT IF EXISTS fk15nx89cni6hh1oyf24sb96emd;

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS public.bwise_savings;
DROP TABLE IF EXISTS public.bwise_expense;
DROP TABLE IF EXISTS public.bwise_budget;
DROP TABLE IF EXISTS public.bwise_income;
DROP TABLE IF EXISTS public.bwise_category;
DROP TABLE IF EXISTS public.bwise_user;

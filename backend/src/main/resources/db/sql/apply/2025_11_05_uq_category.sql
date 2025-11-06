-- Create a unique index on normalized name per user
CREATE UNIQUE INDEX IF NOT EXISTS bwise_category_user_name_uq
        ON public.bwise_category (lower(btrim(name)));
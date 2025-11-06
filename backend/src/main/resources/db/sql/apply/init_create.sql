-- =============================
--  Initial Schema Creation
--  Author: nuwansamarasinghe
-- =============================

-- TABLE: bwise_user
CREATE TABLE public.bwise_user (
  id UUID NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITHOUT TIME ZONE,
  full_name VARCHAR(255),
  is_active BOOLEAN NOT NULL,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  CONSTRAINT bwise_user_pkey PRIMARY KEY (id)
);

ALTER TABLE public.bwise_user
  ADD CONSTRAINT uk4epl3q0c5vamd6fxonj21frwi UNIQUE (username);


-- TABLE: bwise_category
CREATE TABLE public.bwise_category (
  id UUID NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITHOUT TIME ZONE,
  name VARCHAR(255),
  user_id UUID,
  CONSTRAINT bwise_category_pkey PRIMARY KEY (id)
);


-- TABLE: bwise_income
CREATE TABLE public.bwise_income (
  id UUID NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITHOUT TIME ZONE,
  amount NUMERIC(38, 2),
  from_date DATE,
  income_month DATE NOT NULL,
  income_type SMALLINT,
  note VARCHAR(255),
  recurrent BOOLEAN NOT NULL,
  source VARCHAR(255),
  to_date DATE,
  user_id UUID,
  CONSTRAINT bwise_income_pkey PRIMARY KEY (id)
);


-- TABLE: bwise_budget
CREATE TABLE public.bwise_budget (
  id UUID NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITHOUT TIME ZONE,
  affect_on DATE,
  amount NUMERIC(38, 2),
  budget_month DATE NOT NULL,
  from_date DATE,
  note VARCHAR(255),
  recurrent BOOLEAN NOT NULL,
  to_date DATE,
  category_id UUID,
  user_id UUID,
  CONSTRAINT bwise_budget_pkey PRIMARY KEY (id)
);


-- TABLE: bwise_expense
CREATE TABLE public.bwise_expense (
  id UUID NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITHOUT TIME ZONE,
  affect_on DATE,
  amount NUMERIC(38, 2),
  income_month DATE NOT NULL,
  from_date DATE,
  note VARCHAR(255),
  recurrent BOOLEAN NOT NULL,
  to_date DATE,
  category_id UUID,
  user_id UUID,
  CONSTRAINT bwise_expense_pkey PRIMARY KEY (id)
);


-- TABLE: bwise_savings
CREATE TABLE public.bwise_savings (
  id UUID NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITHOUT TIME ZONE,
  affect_on DATE,
  amount NUMERIC(38, 2),
  from_date DATE,
  note VARCHAR(255),
  recurrent BOOLEAN NOT NULL,
  income_month DATE NOT NULL,
  to_date DATE,
  user_id UUID,
  saving_month DATE NOT NULL,
  CONSTRAINT bwise_savings_pkey PRIMARY KEY (id)
);


-- =====================================
-- FOREIGN KEYS
-- =====================================
ALTER TABLE public.bwise_income
  ADD CONSTRAINT fk15nx89cni6hh1oyf24sb96emd
  FOREIGN KEY (user_id) REFERENCES public.bwise_user (id);

ALTER TABLE public.bwise_budget
  ADD CONSTRAINT fk4429stot6ypx6f1xb987bg68q
  FOREIGN KEY (user_id) REFERENCES public.bwise_user (id);

ALTER TABLE public.bwise_expense
  ADD CONSTRAINT fk45unbu6qp2kryjuqncfob1mnn
  FOREIGN KEY (user_id) REFERENCES public.bwise_user (id);

ALTER TABLE public.bwise_expense
  ADD CONSTRAINT fkac3pfy6v2slpegnbx5bn5b9qk
  FOREIGN KEY (category_id) REFERENCES public.bwise_category (id);

ALTER TABLE public.bwise_savings
  ADD CONSTRAINT fkdh3218k40umdhr6f9gabjl983
  FOREIGN KEY (user_id) REFERENCES public.bwise_user (id);

ALTER TABLE public.bwise_category
  ADD CONSTRAINT fkh76gftl0xgwlk4noh3sttukop
  FOREIGN KEY (user_id) REFERENCES public.bwise_user (id);

ALTER TABLE public.bwise_budget
  ADD CONSTRAINT fkjt2xo268wdaknresn8llagg8r
  FOREIGN KEY (category_id) REFERENCES public.bwise_category (id);

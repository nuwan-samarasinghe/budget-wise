-- Drop the unique  index on normalized name per category
ALTER TABLE category DROP CONSTRAINT uk_category_name;
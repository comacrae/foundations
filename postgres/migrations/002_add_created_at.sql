ALTER TABLE authors 
ADD COLUMN created_at timestamptz default now();

ALTER TABLE books
ADD COLUMN created_at timestamptz default now();
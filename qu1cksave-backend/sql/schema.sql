DROP TABLE IF EXISTS member;

CREATE TABLE member(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), email VARCHAR(40) UNIQUE, password VARCHAR(120), roles jsonb, name VARCHAR(50));
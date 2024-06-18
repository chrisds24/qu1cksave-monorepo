DROP TABLE IF EXISTS job;
DROP TABLE IF EXISTS member;
DROP TABLE IF EXISTS resume;

CREATE TABLE member(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), email VARCHAR(320) UNIQUE, password VARCHAR(255), roles jsonb, name VARCHAR(255));
-- Missing cover later and one other file (to allow 1 extra file upload)
-- Columns are: id, member_id, resume_id, title, company_name, job_description, notes, is_remote, country, us_state, city, date_saved, date_applied, date_posted, job_status, links, found_from
CREATE TABLE job(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), member_id UUID NOT NULL, resume_id UUID, title VARCHAR(80) NOT NULL, company_name VARCHAR(80) NOT NULL, job_description VARCHAR(12000), notes VARCHAR(12000), is_remote VARCHAR(10),country VARCHAR(255), us_state VARCHAR(10), city VARCHAR(255), date_saved TIMESTAMPTZ NOT NULL DEFAULT NOW(), date_applied jsonb, date_posted jsonb, job_status VARCHAR(20) NOT NULL, links jsonb, found_from VARCHAR(80));
-- Columns are: id, member_id, file_name
CREATE TABLE resume(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), member_id UUID NOT NULL, file_name VARCHAR(255) NOT NULL);
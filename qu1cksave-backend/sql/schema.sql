DROP TABLE IF EXISTS job;
DROP TABLE IF EXISTS member;
DROP TABLE IF EXISTS resume;

-- Columns are: id, email, password, roles, name
CREATE TABLE member(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), email VARCHAR(320) UNIQUE, password TEXT, roles jsonb, name VARCHAR(255));
-- Add cover letter later
-- Columns are: id, member_id, resume_id, cover_letter_id, title, company_name, job_description, notes, is_remote, salary_type, salary_min, salary_max, country, us_state, city, date_saved, date_applied, date_posted, job_status, links, found_from
-- description and notes used to be VARCHAR(12000)
CREATE TABLE job(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), member_id UUID NOT NULL, resume_id UUID, cover_letter_id UUID, title VARCHAR(255) NOT NULL, company_name VARCHAR(255) NOT NULL, job_description TEXT, notes TEXT, is_remote VARCHAR(10), salary_type VARCHAR(10), salary_min integer, salary_max integer, country VARCHAR(255), us_state VARCHAR(10), city VARCHAR(255), date_saved TIMESTAMPTZ NOT NULL DEFAULT NOW(), date_applied jsonb, date_posted jsonb, job_status VARCHAR(20) NOT NULL, links jsonb, found_from VARCHAR(255));
-- Columns are: id, member_id, job_id, file_name, mime_type
-- job_id is optional, since there could be resumes uploaded by a member that don't belong to a job (For the Documents page)
CREATE TABLE resume(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), member_id UUID NOT NULL, job_id UUID, file_name VARCHAR(255) NOT NULL, mime_type VARCHAR(255) NOT NULL);
CREATE TABLE cover_letter(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), member_id UUID NOT NULL, job_id UUID, file_name VARCHAR(255) NOT NULL, mime_type VARCHAR(255) NOT NULL);

-- FOREIGN KEYS
-- https://www.postgresql.org/docs/current/tutorial-fk.html
-- https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK
-- https://stackoverflow.com/questions/46184534/reference-to-foreign-key-row-postgresql

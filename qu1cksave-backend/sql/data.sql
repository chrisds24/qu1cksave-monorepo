DELETE FROM member;
INSERT INTO member(id, email, password, name, roles) VALUES('269a3d55-4eee-4a2e-8c64-e1fe386b76f8', 'molly@books.com', '$2b$10$Y00XOZD/f5gBSpDusPUgU.iJufk6Nxx6gAoHRG8t2eHyGgoP2bK4y', 'Molly Member', '["member"]');

-- Use JavaScript Date to convert year, month, and date into a meaningful date.
-- job_status values: Applied, Not Applied, Assessment, Interview, Job Offered, Accepted Offer, Declined Offer, Rejected, Ghosted, Closed
DELETE FROM job_app;
INSERT INTO job_app(id, member_id, job_title, company_name, job_description, notes, country, us_state, city, date_applied, date_posted, job_status, links, found_from) VALUES ('018ead6b-d160-772d-a001-2606322ebd1c', '269a3d55-4eee-4a2e-8c64-e1fe386b76f8', 'Software Engineer, Quantum Error Correction, Quantum AI', 'Google', 'I am a short description.', 'Useless note.', 'United States', 'CA', 'Los Angeles', '{"year": 2024, "month": 3, "date": 3}', '{"year": 2024, "month": 2, "date": 29}', 'Applied', '["https://www.google.com/about/careers/applications/jobs/results/128445096799412934-software-engineer-quantum-error-correction-quantum-ai?utm_source=about&utm_medium=referral&utm_campaign=footer-link&q=%22Software%20Engineer%22"]', 'Google Careers');


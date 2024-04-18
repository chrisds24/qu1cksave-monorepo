DELETE FROM member;
INSERT INTO member(id, email, password, name, roles) VALUES('269a3d55-4eee-4a2e-8c64-e1fe386b76f8', 'molly@books.com', '$2b$10$Y00XOZD/f5gBSpDusPUgU.iJufk6Nxx6gAoHRG8t2eHyGgoP2bK4y', 'Molly Member', '["member"]');

-- Use JavaScript Date to convert year, month, and date into a meaningful date.
-- job_status values: Applied, Not Applied, Assessment, Interview, Job Offered, Accepted Offer, Declined Offer, Rejected, Ghosted, Closed
DELETE FROM job;
INSERT INTO job(id, member_id, title, company_name, job_description, notes, is_remote, country, us_state, city, date_applied, date_posted, job_status, links, found_from) VALUES ('018ead6b-d160-772d-a001-2606322ebd1c', '269a3d55-4eee-4a2e-8c64-e1fe386b76f8', 'Software Engineer, Quantum Error Correction, Quantum AI', 'Google', 'I am a short description.', 'Useless note.', 'Remote', 'United States', 'CA', 'Los Angeles', '{"year": 2024, "month": 3, "date": 3}', '{"year": 2024, "month": 2, "date": 29}', 'Applied', '["https://www.google.com/about/careers/applications/jobs/results/128445096799412934-software-engineer-quantum-error-correction-quantum-ai?utm_source=about&utm_medium=referral&utm_campaign=footer-link&q=%22Software%20Engineer%22"]', 'Google Careers');
INSERT INTO job(id, member_id, title, company_name, job_description, is_remote, country, us_state, city, date_applied, date_posted, job_status, links, found_from) VALUES ('018eae1f-d0e7-7fa8-a561-6aa358134f7e', '269a3d55-4eee-4a2e-8c64-e1fe386b76f8', 'Software Engineer', 'Microsoft', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'On-site', 'United States', 'WA', 'Redmond', '{"year": 2024, "month": 3, "date": 5}', '{"year": 2024, "month": 3, "date": 4}', 'Applied', '["https://jobs.careers.microsoft.com/us/en/job/1706603/Software-Engineer?jobsource=linkedin"]', 'LinkedIn');
INSERT INTO job(id, member_id, title, company_name, is_remote, job_status) VALUES ('018eae28-8323-7918-b93a-6cdb9d189786', '269a3d55-4eee-4a2e-8c64-e1fe386b76f8', 'Software Engineer', 'Fake Company', 'Hybrid', 'Not Applied');

INSERT INTO job(id, member_id, title, company_name, is_remote, job_status) VALUES ('018eae28-8323-7918-b93a-6cdb9d189781', '269a3d55-4eee-4a2e-8c64-e1fe386b76f8', 'Software Engineer', 'Fake Company 1', 'Hybrid', 'Assessment');
INSERT INTO job(id, member_id, title, company_name, is_remote, job_status) VALUES ('018eae28-8323-7918-b93a-6cdb9d189782', '269a3d55-4eee-4a2e-8c64-e1fe386b76f8', 'Software Engineer', 'Fake Company 2', 'Hybrid', 'Interview');
INSERT INTO job(id, member_id, title, company_name, is_remote, job_status) VALUES ('018eae28-8323-7918-b93a-6cdb9d189783', '269a3d55-4eee-4a2e-8c64-e1fe386b76f8', 'Software Engineer', 'Fake Company 3', 'Hybrid', 'Job Offered');
INSERT INTO job(id, member_id, title, company_name, is_remote, job_status) VALUES ('018eae28-8323-7918-b93a-6cdb9d189784', '269a3d55-4eee-4a2e-8c64-e1fe386b76f8', 'Software Engineer', 'Fake Company 4', 'Hybrid', 'Accepted Offer');
INSERT INTO job(id, member_id, title, company_name, is_remote, job_status) VALUES ('018eae28-8323-7918-b93a-6cdb9d189785', '269a3d55-4eee-4a2e-8c64-e1fe386b76f8', 'Software Engineer', 'Fake Company 5', 'Hybrid', 'Declined Offer');
INSERT INTO job(id, member_id, title, company_name, is_remote, job_status) VALUES ('018eae28-8323-7918-b93a-6cdb9d189787', '269a3d55-4eee-4a2e-8c64-e1fe386b76f8', 'Software Engineer', 'Fake Company 6', 'Hybrid', 'Rejected');
INSERT INTO job(id, member_id, title, company_name, is_remote, job_status) VALUES ('018eae28-8323-7918-b93a-6cdb9d189788', '269a3d55-4eee-4a2e-8c64-e1fe386b76f8', 'Software Engineer', 'Fake Company 7', 'Hybrid', 'Ghosted');
INSERT INTO job(id, member_id, title, company_name, is_remote, job_status) VALUES ('018eae28-8323-7918-b93a-6cdb9d189789', '269a3d55-4eee-4a2e-8c64-e1fe386b76f8', 'Software Engineer', 'Fake Company 8', 'Hybrid', 'Closed');






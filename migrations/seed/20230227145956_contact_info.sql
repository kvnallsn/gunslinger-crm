-- +goose Up
-- +goose StatementBegin
INSERT INTO grades (name) VALUES
	('O-1'),
	('O-2'),
	('O-3'),
	('O-4'),
	('O-5'),
	('O-6'),
	('O-7'),
	('O-8'),
	('O-9'),
	('O-10'),
	('GS-9'),
	('GS-10'),
	('GS-11'),
	('GS-12'),
	('GS-13'),
	('GS-14'),
	('GS-15'),
	('SES-1'),
	('SES-2'),
	('SES-3'),
	('SES-4'),
	('SES-5'),
	('E-1'),
	('E-2'),
	('E-3'),
	('E-4'),
	('E-5'),
	('E-6'),
	('E-7'),
	('E-8'),
	('E-9'),
	('W-1'),
	('W-2'),
	('W-3'),
	('W-4'),
	('W-5'),
	('N/A');

INSERT INTO contact_phone_types (name) VALUES
	('DSN'),
	('Cell'),
	('STU-III'),
	('STE'),
	('VoSIP'),
	('SVoIP'),
	('TSVoIP'),
	('NSTS'),
	('Commercial');

INSERT INTO contact_email_types (name) VALUES
	('Personal'),
	('NIPR'),
	('SIPR'),
	('JWICS'),
	('NSANet');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM grades;
DELETE FROM contact_phone_types;
DELETE FROM contact_email_types;
-- +goose StatementEnd

-- +goose Up
INSERT INTO grades (id, name) VALUES
    ('00000000-0000-2000-b000-000000000001', 'O-1'),
    ('00000000-0000-2000-b000-000000000002', 'O-2'),
    ('00000000-0000-2000-b000-000000000003', 'O-3'),
    ('00000000-0000-2000-b000-000000000004', 'O-4'),
    ('00000000-0000-2000-b000-000000000005', 'O-5'),
    ('00000000-0000-2000-b000-000000000006', 'O-6'),
    ('00000000-0000-2000-b000-000000000007', 'O-7'),
    ('00000000-0000-2000-b000-000000000008', 'O-8'),
    ('00000000-0000-2000-b000-000000000009', 'O-9'),
    ('00000000-0000-2000-b000-00000000000a', 'O-10'),
    ('00000000-0000-2000-b000-00000000000b', 'E-1'),
    ('00000000-0000-2000-b000-00000000000c', 'E-2'),
    ('00000000-0000-2000-b000-00000000000d', 'E-3'),
    ('00000000-0000-2000-b000-00000000000e', 'E-4'),
    ('00000000-0000-2000-b000-00000000000f', 'E-5'),
    ('00000000-0000-2000-b000-000000000010', 'E-6'),
    ('00000000-0000-2000-b000-000000000011', 'E-7'),
    ('00000000-0000-2000-b000-000000000012', 'E-8'),
    ('00000000-0000-2000-b000-000000000013', 'E-9'),
    ('00000000-0000-2000-b000-000000000014', 'W-1'),
    ('00000000-0000-2000-b000-000000000015', 'W-2'),
    ('00000000-0000-2000-b000-000000000016', 'W-3'),
    ('00000000-0000-2000-b000-000000000017', 'W-4'),
    ('00000000-0000-2000-b000-000000000018', 'W-5'),
    ('00000000-0000-2000-b000-000000000019', 'SES'),
    ('00000000-0000-2000-b000-00000000001a', 'ST'),
    ('00000000-0000-2000-b000-00000000001b', 'GS-09'),
    ('00000000-0000-2000-b000-00000000001c', 'GS-10'),
    ('00000000-0000-2000-b000-00000000001d', 'GS-11'),
    ('00000000-0000-2000-b000-00000000001e', 'GS-12'),
    ('00000000-0000-2000-b000-00000000001f', 'GS-13'),
    ('00000000-0000-2000-b000-000000000020', 'GS-14'),
    ('00000000-0000-2000-b000-000000000021', 'GS-15'),
    ('00000000-0000-2000-b000-000000000022', 'Mr'),
    ('00000000-0000-2000-b000-000000000023', 'Ms'),
    ('00000000-0000-2000-b000-000000000024', 'Mrs'),
    ('00000000-0000-2000-b000-000000000025', 'Dr');

INSERT INTO contact_phone_types (id, name) VALUES
    ('00000000-0000-3000-b000-000000000000', 'Commercial'),
    ('00000000-0000-3000-b000-000000000001', 'DSN'),
    ('00000000-0000-3000-b000-000000000002', 'Cell'),
    ('00000000-0000-3000-b000-000000000003', 'STU-III'),
    ('00000000-0000-3000-b000-000000000004', 'STE'),
    ('00000000-0000-3000-b000-000000000005', 'VoSIP'),
    ('00000000-0000-3000-b000-000000000006', 'SVoIP'),
    ('00000000-0000-3000-b000-000000000007', 'TSVoIP'),
    ('00000000-0000-3000-b000-000000000008', 'NSTS');

INSERT INTO contact_email_types (id, name) VALUES
    ('00000000-0000-4000-b000-000000000000', 'Personal'),
    ('00000000-0000-4000-b000-000000000001', 'Unclassified'),
    ('00000000-0000-4000-b000-000000000002', 'Secret'),
    ('00000000-0000-4000-b000-000000000003', 'Top Secret');

INSERT INTO engagement_methods (id, name) VALUES
    ('00000000-0000-5000-b000-000000000000', 'Phone Call'),
    ('00000000-0000-5000-b000-000000000001', 'Text / Direct Message'),
    ('00000000-0000-5000-b000-000000000002', 'Email'),
    ('00000000-0000-5000-b000-000000000003', 'Meeting (In-Person)'),
    ('00000000-0000-5000-b000-000000000004', 'Meeting (Virtual)'),
    ('00000000-0000-5000-b000-000000000005', 'Conference (In-Person)'),
    ('00000000-0000-5000-b000-000000000006', 'Conference (Virtual)');

INSERT INTO users
    (id, email, username, active, admin)
VALUES
    ('00000000-0000-1000-b000-000000000001', 'admin@crm.local', 'admin', true, true),
    ('00000000-0000-1000-b000-000000000011', 'gunslinger01@crm.local', 'gunslinger01', true, false),
    ('00000000-0000-1000-b000-000000000012', 'gunslinger02@crm.local', 'gunslinger02', true, false),
    ('00000000-0000-1000-b000-000000000013', 'gunslinger03@crm.local', 'gunslinger03', true, false),
    ('00000000-0000-1000-b000-000000000014', 'gunslinger04@crm.local', 'gunslinger04', false, false),
    ('00000000-0000-1000-b000-000000000015', 'gunslinger05@crm.local', 'gunslinger05', true, false);

INSERT INTO auth_password
    (user_id, password)
VALUES
    ('00000000-0000-1000-b000-000000000001', '$argon2id$v=19$m=8192,t=10,p=1$3aRBd4O7u7LsTEjpVVg/7w$WycMmsSAJHuUL5AmtXy0jiHwvvDVy141dPKmqmk70C8'),
    ('00000000-0000-1000-b000-000000000011', '$argon2id$v=19$m=8192,t=10,p=1$BT5STD3EKRLsASlBPuKXVQ$zVLWe8paTCclFFs60GHQNlkMrpCWU5YLo6cOyvjHUt0'),
    ('00000000-0000-1000-b000-000000000012', '$argon2id$v=19$m=8192,t=10,p=1$ADD7Cl1jV5tNh2zenIWN2Q$kvYvMFA0+Eqx0Xv7MsEZsd6lmL6BHhBjQBBGOPqxz68'),
    ('00000000-0000-1000-b000-000000000013', '$argon2id$v=19$m=8192,t=10,p=1$md1hWWkHGOA6tCcRiMMB2g$IIC+Vrik3L79QIYwRY40Q8qATuxUPtdEZjfKblFeGDY'),
    ('00000000-0000-1000-b000-000000000014', '$argon2id$v=19$m=8192,t=10,p=1$DIJLi3jIW+Gyiv+KDzUv7g$UQ5h2BooH2PYpmG1irKHIDSGLud7RPofUdmiDfklPQM'),
    ('00000000-0000-1000-b000-000000000015', '$argon2id$v=19$m=8192,t=10,p=1$aQMxdygeoRuHICR3kNgt/g$Opq9rxeNJtwcCkOiJiI1iWtw3bxGwOQqyFMcjhS0Pck');

INSERT INTO groups
    (id, name)
VALUES
    ('00000000-0000-1000-b000-000000000021', '67CW CAG'),
    ('00000000-0000-1000-b000-000000000022', '67CW Staff');

INSERT INTO group_members
    (group_id, user_id, level)
VALUES
    ('00000000-0000-1000-b000-000000000021', '00000000-0000-1000-b000-000000000011', 'owner'),
    ('00000000-0000-1000-b000-000000000021', '00000000-0000-1000-b000-000000000012', 'owner'),
    ('00000000-0000-1000-b000-000000000021', '00000000-0000-1000-b000-000000000013', 'owner'),
    ('00000000-0000-1000-b000-000000000022', '00000000-0000-1000-b000-000000000011', 'owner'),
    ('00000000-0000-1000-b000-000000000022', '00000000-0000-1000-b000-000000000014', 'owner');

INSERT INTO organizations
    (id, name)
VALUES
    ('00000000-0000-1000-b000-000000000030', 'Twitter'),
    ('00000000-0000-1000-b000-000000000031', 'Microsoft'),
    ('00000000-0000-1000-b000-000000000032', 'Google'),
    ('00000000-0000-1000-b000-000000000033', 'Amazon'),
    ('00000000-0000-1000-b000-000000000034', '67 CW');

INSERT INTO locations
    (id, city, state)
VALUES
    ('00000000-0000-1000-b000-000000000040', 'San Francisco', 'CA'),
    ('00000000-0000-1000-b000-000000000041', 'Redmond', 'WA'),
    ('00000000-0000-1000-b000-000000000042', 'Mountain View', 'CA'),
    ('00000000-0000-1000-b000-000000000043', 'Seattle', 'WA'),
    ('00000000-0000-1000-b000-000000000044', 'San Antonio', 'TX');

INSERT INTO contacts
    (id, user_id, last_name, first_name, grade, location, org, title)
VALUES
    ('00000000-0000-1000-b000-000000000050', null, 'Musk', 'Elon', '00000000-0000-2000-b000-000000000022', '00000000-0000-1000-b000-000000000040', '00000000-0000-1000-b000-000000000030', 'CEO'),
    ('00000000-0000-1000-b000-000000000051', null, 'Gates', 'William', '00000000-0000-2000-b000-000000000022', '00000000-0000-1000-b000-000000000041', '00000000-0000-1000-b000-000000000031', 'Chairman'),
    ('00000000-0000-1000-b000-000000000052', null, 'Nadella', 'Satya', '00000000-0000-2000-b000-000000000022', '00000000-0000-1000-b000-000000000041', '00000000-0000-1000-b000-000000000031', 'CEO'),
    ('00000000-0000-1000-b000-000000000053', null, 'Scott', 'Kevin', '00000000-0000-2000-b000-000000000022', '00000000-0000-1000-b000-000000000041', '00000000-0000-1000-b000-000000000031', 'CTO'),
    ('00000000-0000-1000-b000-000000000054', null, 'Pichai', 'Sundar', '00000000-0000-2000-b000-000000000022', '00000000-0000-1000-b000-000000000042', '00000000-0000-1000-b000-000000000032', 'CEO'),
    ('00000000-0000-1000-b000-000000000055', null, 'Porat', 'Ruth', '00000000-0000-2000-b000-000000000024', '00000000-0000-1000-b000-000000000042', '00000000-0000-1000-b000-000000000032', 'CFO'),
    ('00000000-0000-1000-b000-000000000056', null, 'Jassy', 'Andy', '00000000-0000-2000-b000-000000000022', '00000000-0000-1000-b000-000000000043', '00000000-0000-1000-b000-000000000033', 'CEO'),
    ('00000000-0000-1000-b000-000000000057', '00000000-0000-1000-b000-000000000011', 'Commander', 'Colonel', '00000000-0000-2000-b000-000000000006', '00000000-0000-1000-b000-000000000044', '00000000-0000-1000-b000-000000000034', 'CC'),
    ('00000000-0000-1000-b000-000000000058', '00000000-0000-1000-b000-000000000012', 'Commander', 'Vice', '00000000-0000-2000-b000-000000000006', '00000000-0000-1000-b000-000000000044', '00000000-0000-1000-b000-000000000034', 'CV'),
    ('00000000-0000-1000-b000-000000000059', '00000000-0000-1000-b000-000000000013', 'Chief', 'Staff', '00000000-0000-2000-b000-000000000021', '00000000-0000-1000-b000-000000000044', '00000000-0000-1000-b000-000000000034', 'COS'),
    ('00000000-0000-1000-b000-00000000005a', '00000000-0000-1000-b000-000000000014', 'CAG', 'Captain', '00000000-0000-2000-b000-000000000003', '00000000-0000-1000-b000-000000000044', '00000000-0000-1000-b000-000000000034', 'CAG'),
    ('00000000-0000-1000-b000-00000000005b', '00000000-0000-1000-b000-000000000015', 'Exec', 'Captain', '00000000-0000-2000-b000-000000000003', '00000000-0000-1000-b000-000000000044', '00000000-0000-1000-b000-000000000034', 'CCE');


INSERT INTO contact_emails
    (contact_id, system_id, address)
VALUES
    ('00000000-0000-1000-b000-000000000050', '00000000-0000-4000-b000-000000000001', 'elon.musk@twitter.com'),
    ('00000000-0000-1000-b000-000000000050', '00000000-0000-4000-b000-000000000001', 'elon.musk@tesla.com'),
    ('00000000-0000-1000-b000-000000000050', '00000000-0000-4000-b000-000000000001', 'elon.musk@spacex.com'),
    ('00000000-0000-1000-b000-000000000051', '00000000-0000-4000-b000-000000000001', 'bill@microsoft.com'),
    ('00000000-0000-1000-b000-000000000057', '00000000-0000-4000-b000-000000000001', 'cc@us.af.mil'),
    ('00000000-0000-1000-b000-000000000057', '00000000-0000-4000-b000-000000000002', 'cc@mail.smil.mil'),
    ('00000000-0000-1000-b000-000000000057', '00000000-0000-4000-b000-000000000003', 'cc@af.ic.gov');

INSERT INTO contact_phones
    (contact_id, system_id, number)
VALUES
    ('00000000-0000-1000-b000-000000000050', '00000000-0000-3000-b000-000000000002', '111-867-5309'),
    ('00000000-0000-1000-b000-000000000051', '00000000-0000-3000-b000-000000000002', '333-333-3333'),
    ('00000000-0000-1000-b000-000000000052', '00000000-0000-3000-b000-000000000002', '111-111-1111'),
    ('00000000-0000-1000-b000-000000000053', '00000000-0000-3000-b000-000000000002', '222-222-2222'),
    ('00000000-0000-1000-b000-000000000057', '00000000-0000-3000-b000-000000000001', '969-6700'),
    ('00000000-0000-1000-b000-000000000057', '00000000-0000-3000-b000-000000000000', '210-977-6700'),
    ('00000000-0000-1000-b000-000000000057', '00000000-0000-3000-b000-000000000007', '587-1389');

INSERT INTO topics
    (id, created_by, topic)
VALUES
    ('00000000-0000-1000-b000-000000000081', '00000000-0000-1000-b000-000000000011', 'Retention'),
    ('00000000-0000-1000-b000-000000000082', '00000000-0000-1000-b000-000000000011', 'PDS'),
    ('00000000-0000-1000-b000-000000000083', '00000000-0000-1000-b000-000000000011', 'Readiness');

INSERT INTO engagements
    (id, method, title, summary, created_by, date)
VALUES
    ('00000000-0000-1000-b000-000000000061', '00000000-0000-5000-b000-000000000005', 'Microsoft BUILD', 'Microsoft Build is an annual conference event held by Microsoft, enabling the community of developers and software engineers to discover the latest innovations in code and application', '00000000-0000-1000-b000-000000000011', '2023-02-22 13:00:22.765638+00'),
    ('00000000-0000-1000-b000-000000000062', '00000000-0000-5000-b000-000000000002', 'Securing Networks', 'Google I/O is an annual developer conference held by Google in Mountain View, California.', '00000000-0000-1000-b000-000000000011', '2023-02-15 04:57:00.765638+00');

INSERT INTO engagement_topics
    (engagement_id, topic_id)
VALUES
    ('00000000-0000-1000-b000-000000000061', '00000000-0000-1000-b000-000000000081'),
    ('00000000-0000-1000-b000-000000000061', '00000000-0000-1000-b000-000000000082'),
    ('00000000-0000-1000-b000-000000000061', '00000000-0000-1000-b000-000000000083'),
    ('00000000-0000-1000-b000-000000000062', '00000000-0000-1000-b000-000000000082');

INSERT INTO engagement_contacts
    (engagement_id, contact_id, org_id)
VALUES
    ('00000000-0000-1000-b000-000000000061', '00000000-0000-1000-b000-000000000057', '00000000-0000-1000-b000-000000000034'),
    ('00000000-0000-1000-b000-000000000061', '00000000-0000-1000-b000-000000000058', '00000000-0000-1000-b000-000000000034'),
    ('00000000-0000-1000-b000-000000000061', '00000000-0000-1000-b000-000000000051', '00000000-0000-1000-b000-000000000031'),
    ('00000000-0000-1000-b000-000000000061', '00000000-0000-1000-b000-000000000052', '00000000-0000-1000-b000-000000000031'),
    ('00000000-0000-1000-b000-000000000061', '00000000-0000-1000-b000-000000000053', '00000000-0000-1000-b000-000000000031'),
    ('00000000-0000-1000-b000-000000000062', '00000000-0000-1000-b000-000000000057', '00000000-0000-1000-b000-000000000034'),
    ('00000000-0000-1000-b000-000000000062', '00000000-0000-1000-b000-00000000005a', '00000000-0000-1000-b000-000000000034'),
    ('00000000-0000-1000-b000-000000000062', '00000000-0000-1000-b000-000000000054', '00000000-0000-1000-b000-000000000032'),
    ('00000000-0000-1000-b000-000000000062', '00000000-0000-1000-b000-000000000055', '00000000-0000-1000-b000-000000000032'),
    ('00000000-0000-1000-b000-000000000062', '00000000-0000-1000-b000-000000000056', '00000000-0000-1000-b000-000000000033');


INSERT INTO engagement_notes
    (id, engagement_id, created_by, note)
VALUES
    ('00000000-0000-1000-b000-000000000071', '00000000-0000-1000-b000-000000000061', '00000000-0000-1000-b000-000000000011', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
    ('00000000-0000-1000-b000-000000000072', '00000000-0000-1000-b000-000000000061', '00000000-0000-1000-b000-000000000011', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consectetur adipiscing elit duis tristique. Erat imperdiet sed euismod nisi porta lorem mollis aliquam. Felis donec et odio pellentesque diam. Nunc id cursus metus aliquam eleifend mi in. Massa massa ultricies mi quis hendrerit dolor magna. Nisi scelerisque eu ultrices vitae auctor eu augue ut. Amet volutpat consequat mauris nunc congue nisi vitae. Nisi porta lorem mollis aliquam ut porttitor. Molestie a iaculis at erat pellentesque adipiscing commodo. Amet nisl purus in mollis nunc sed id semper risus. Proin libero nunc consequat interdum varius sit. Faucibus interdum posuere lorem ipsum dolor sit. Leo duis ut diam quam nulla porttitor massa id. Tortor aliquam nulla facilisi cras fermentum odio eu feugiat. Elit ullamcorper dignissim cras tincidunt. Posuere morbi leo urna molestie at elementum eu facilisis sed. Enim sit amet venenatis urna cursus eget. Aliquam sem et tortor consequat. Fames ac turpis egestas sed. Odio ut sem nulla pharetra. Egestas erat imperdiet sed euismod nisi porta lorem. Vestibulum morbi blandit cursus risus at. Ac tincidunt vitae semper quis lectus nulla at. Faucibus scelerisque eleifend donec pretium vulputate sapien nec sagittis. Lectus quam id leo in vitae turpis. Et egestas quis ipsum suspendisse.'),
    ('00000000-0000-1000-b000-000000000073', '00000000-0000-1000-b000-000000000062', '00000000-0000-1000-b000-000000000011', 'Stability....');

INSERT INTO engagement_note_permissions
    (note_id, group_id)
VALUES
    ('00000000-0000-1000-b000-000000000071', '00000000-0000-1000-b000-000000000022'),
    ('00000000-0000-1000-b000-000000000072', '00000000-0000-1000-b000-000000000021'),
    ('00000000-0000-1000-b000-000000000073', '00000000-0000-1000-b000-000000000021');

INSERT INTO contact_notes
    (id, contact_id, created_by, note)
VALUES
    ('00000000-0000-6000-b000-000000000071', '00000000-0000-1000-b000-000000000051', '00000000-0000-1000-b000-000000000011', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
    ('00000000-0000-6000-b000-000000000072', '00000000-0000-1000-b000-000000000052', '00000000-0000-1000-b000-000000000011', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consectetur adipiscing elit duis tristique. Erat imperdiet sed euismod nisi porta lorem mollis aliquam. Felis donec et odio pellentesque diam. Nunc id cursus metus aliquam eleifend mi in. Massa massa ultricies mi quis hendrerit dolor magna. Nisi scelerisque eu ultrices vitae auctor eu augue ut. Amet volutpat consequat mauris nunc congue nisi vitae. Nisi porta lorem mollis aliquam ut porttitor. Molestie a iaculis at erat pellentesque adipiscing commodo. Amet nisl purus in mollis nunc sed id semper risus. Proin libero nunc consequat interdum varius sit. Faucibus interdum posuere lorem ipsum dolor sit. Leo duis ut diam quam nulla porttitor massa id. Tortor aliquam nulla facilisi cras fermentum odio eu feugiat. Elit ullamcorper dignissim cras tincidunt. Posuere morbi leo urna molestie at elementum eu facilisis sed. Enim sit amet venenatis urna cursus eget. Aliquam sem et tortor consequat. Fames ac turpis egestas sed. Odio ut sem nulla pharetra. Egestas erat imperdiet sed euismod nisi porta lorem. Vestibulum morbi blandit cursus risus at. Ac tincidunt vitae semper quis lectus nulla at. Faucibus scelerisque eleifend donec pretium vulputate sapien nec sagittis. Lectus quam id leo in vitae turpis. Et egestas quis ipsum suspendisse.'),
    ('00000000-0000-6000-b000-000000000073', '00000000-0000-1000-b000-000000000050', '00000000-0000-1000-b000-000000000011', 'Where to begin...');

INSERT INTO contact_note_permissions
    (note_id, group_id)
VALUES
    ('00000000-0000-6000-b000-000000000071', '00000000-0000-1000-b000-000000000021'),
    ('00000000-0000-6000-b000-000000000071', '00000000-0000-1000-b000-000000000022'),
    ('00000000-0000-6000-b000-000000000072', '00000000-0000-1000-b000-000000000021'),
    ('00000000-0000-6000-b000-000000000073', '00000000-0000-1000-b000-000000000021');

-- +goose Down
-- +goose StatementBegin
DELETE FROM engagement_topics;
DELETE FROM engagement_note_permissions;
DELETE FROM engagement_notes;
DELETE FROM engagement_contacts;
DELETE FROM engagements;
DELETE FROM contact_note_permissions;
DELETE FROM contact_notes;
DELETE FROM contact_phones;
DELETE FROM contact_emails;
DELETE FROM contacts;
DELETE FROM topics;
DELETE FROM group_members;
DELETE FROM groups;
DELETE FROM locations;
DELETE FROM organizations;
DELETE FROM auth_password;
DELETE FROM users;
DELETE FROM engagement_methods;
DELETE FROM contact_email_types;
DELETE FROM contact_phone_types;
DELETE FROM grades;
-- +goose StatementEnd

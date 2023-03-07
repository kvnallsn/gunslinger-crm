-- +goose Up
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
    ('00000000-0000-1000-b000-000000000021', 'CAG'),
    ('00000000-0000-1000-b000-000000000022', 'Staff');

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
    ('00000000-0000-1000-b000-000000000031', 'Microsoft'),
    ('00000000-0000-1000-b000-000000000032', 'Google'),
    ('00000000-0000-1000-b000-000000000033', 'Amazon');

INSERT INTO locations
    (id, city, state)
VALUES
    ('00000000-0000-1000-b000-000000000041', 'Redmond', 'WA'),
    ('00000000-0000-1000-b000-000000000042', 'Mountain View', 'CA'),
    ('00000000-0000-1000-b000-000000000043', 'Seattle', 'WA');

INSERT INTO contacts
    (id, last_name, first_name, grade, location, org, title)
VALUES
    ('00000000-0000-1000-b000-000000000051', 'Gates', 'William', '701d3f24-4dc8-41da-a599-54de44c9b670', '00000000-0000-1000-b000-000000000041', '00000000-0000-1000-b000-000000000031', 'Chairman'),
    ('00000000-0000-1000-b000-000000000052', 'Nadella', 'Satya', '701d3f24-4dc8-41da-a599-54de44c9b670', '00000000-0000-1000-b000-000000000041', '00000000-0000-1000-b000-000000000031', 'CEO'),
    ('00000000-0000-1000-b000-000000000053', 'Scott', 'Kevin', '701d3f24-4dc8-41da-a599-54de44c9b670', '00000000-0000-1000-b000-000000000041', '00000000-0000-1000-b000-000000000031', 'CTO'),
    ('00000000-0000-1000-b000-000000000054', 'Pichai', 'Sundar', '701d3f24-4dc8-41da-a599-54de44c9b670', '00000000-0000-1000-b000-000000000042', '00000000-0000-1000-b000-000000000032', 'CEO'),
    ('00000000-0000-1000-b000-000000000055', 'Porat', 'Ruth', '701d3f24-4dc8-41da-a599-54de44c9b670', '00000000-0000-1000-b000-000000000042', '00000000-0000-1000-b000-000000000032', 'CFO'),
    ('00000000-0000-1000-b000-000000000056', 'Jassy', 'Andy', '701d3f24-4dc8-41da-a599-54de44c9b670', '00000000-0000-1000-b000-000000000043', '00000000-0000-1000-b000-000000000033', 'CEO');

INSERT INTO topics
    (id, created_by, topic)
VALUES
    ('00000000-0000-1000-b000-000000000081', '00000000-0000-1000-b000-000000000011', 'Retention'),
    ('00000000-0000-1000-b000-000000000082', '00000000-0000-1000-b000-000000000011', 'PDS'),
    ('00000000-0000-1000-b000-000000000083', '00000000-0000-1000-b000-000000000011', 'Readiness');

INSERT INTO engagements
    (id, created_by, date)
VALUES
    ('00000000-0000-1000-b000-000000000061', '00000000-0000-1000-b000-000000000011', '2023-02-22 13:00:22.765638+00'),
    ('00000000-0000-1000-b000-000000000062', '00000000-0000-1000-b000-000000000011', '2023-02-15 04:57:00.765638+00');

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
    ('00000000-0000-1000-b000-000000000061', '00000000-0000-1000-b000-000000000051', '00000000-0000-1000-b000-000000000031'),
    ('00000000-0000-1000-b000-000000000061', '00000000-0000-1000-b000-000000000052', '00000000-0000-1000-b000-000000000031'),
    ('00000000-0000-1000-b000-000000000061', '00000000-0000-1000-b000-000000000053', '00000000-0000-1000-b000-000000000031'),
    ('00000000-0000-1000-b000-000000000062', '00000000-0000-1000-b000-000000000054', '00000000-0000-1000-b000-000000000032'),
    ('00000000-0000-1000-b000-000000000062', '00000000-0000-1000-b000-000000000055', '00000000-0000-1000-b000-000000000032'),
    ('00000000-0000-1000-b000-000000000062', '00000000-0000-1000-b000-000000000056', '00000000-0000-1000-b000-000000000033');


INSERT INTO engagement_notes
    (id, engagement_id, created_by, public, note)
VALUES
    ('00000000-0000-1000-b000-000000000071', '00000000-0000-1000-b000-000000000061', '00000000-0000-1000-b000-000000000011', true, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
    ('00000000-0000-1000-b000-000000000072', '00000000-0000-1000-b000-000000000061', '00000000-0000-1000-b000-000000000011', false, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consectetur adipiscing elit duis tristique. Erat imperdiet sed euismod nisi porta lorem mollis aliquam. Felis donec et odio pellentesque diam. Nunc id cursus metus aliquam eleifend mi in. Massa massa ultricies mi quis hendrerit dolor magna. Nisi scelerisque eu ultrices vitae auctor eu augue ut. Amet volutpat consequat mauris nunc congue nisi vitae. Nisi porta lorem mollis aliquam ut porttitor. Molestie a iaculis at erat pellentesque adipiscing commodo. Amet nisl purus in mollis nunc sed id semper risus. Proin libero nunc consequat interdum varius sit. Faucibus interdum posuere lorem ipsum dolor sit. Leo duis ut diam quam nulla porttitor massa id. Tortor aliquam nulla facilisi cras fermentum odio eu feugiat. Elit ullamcorper dignissim cras tincidunt. Posuere morbi leo urna molestie at elementum eu facilisis sed. Enim sit amet venenatis urna cursus eget. Aliquam sem et tortor consequat. Fames ac turpis egestas sed. Odio ut sem nulla pharetra. Egestas erat imperdiet sed euismod nisi porta lorem. Vestibulum morbi blandit cursus risus at. Ac tincidunt vitae semper quis lectus nulla at. Faucibus scelerisque eleifend donec pretium vulputate sapien nec sagittis. Lectus quam id leo in vitae turpis. Et egestas quis ipsum suspendisse.'),
    ('00000000-0000-1000-b000-000000000073', '00000000-0000-1000-b000-000000000062', '00000000-0000-1000-b000-000000000011', false, 'Stability....');

INSERT INTO engagement_note_permissions
    (note_id, group_id)
VALUES
    ('00000000-0000-1000-b000-000000000072', '00000000-0000-1000-b000-000000000021'),
    ('00000000-0000-1000-b000-000000000073', '00000000-0000-1000-b000-000000000021');

-- +goose Down
-- +goose StatementBegin
DELETE FROM engagement_topics;
DELETE FROM engagement_note_permissions;
DELETE FROM engagement_notes;
DELETE FROM engagement_contacts;
DELETE FROM engagements;
DELETE FROM contacts;
DELETE FROM topics;
DELETE FROM group_members;
DELETE FROM groups;
DELETE FROM locations;
DELETE FROM organizations;
DELETE FROM auth_password;
DELETE FROM users;
-- +goose StatementEnd

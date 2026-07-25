INSERT INTO users (email, password_hash, full_name, role)
VALUES (
    'admin@frontdesk.dev',
    crypt('FrontDesk2024!', gen_salt('bf')),
    'Admin User',
    'ADMIN'
);

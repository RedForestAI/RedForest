-- supabase/seed.sql
--
-- create test users
INSERT INTO
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) (
        select
            '00000000-0000-0000-0000-000000000000',
            ('00000000-0000-0000-0000-' || LPAD(i::text, 12, '0'))::uuid,
            'authenticated',
            'authenticated',
            'user' || i::text || '@example.com',
            crypt ('password123', gen_salt ('bf')),
            current_timestamp,
            current_timestamp,
            current_timestamp,
            '{"provider":"email","providers":["email"]}',
            '{}',
            current_timestamp,
            current_timestamp,
            '',
            '',
            '',
            ''
        FROM
            generate_series(1, 10) as i
    );

-- test user email identities
INSERT INTO
    auth.identities (
        provider_id, -- changed from uuid to provider_id (01/23/2024)
        user_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    ) (
        select
            uuid_generate_v4 (),
            id,
            format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb,
            'email',
            current_timestamp,
            current_timestamp,
            current_timestamp
        from
            auth.users
    );

-- Storage buckets
INSERT INTO
    storage.buckets (
        id,
        name,
        public,
        owner,
        avif_autodetection
    )
VALUES
    ('readings', 'readings', true, null, false);


-- Storage policies
-- Select
CREATE POLICY "Allow authenticated select" ON storage.objects FOR
  SELECT USING (
    bucket_id = 'readings' AND auth.role() = 'authenticated'
  );

-- Uploads
CREATE POLICY "Allow authenticated uploads" ON storage.objects FOR
  INSERT WITH CHECK (
    bucket_id = 'readings' AND auth.role() = 'authenticated'
  );

-- Deletes
CREATE POLICY "Allow authenticated deletes" ON storage.objects FOR
  DELETE USING (
    bucket_id = 'readings' AND auth.role() = 'authenticated'
  );

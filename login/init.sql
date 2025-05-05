-- Create the users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL -- Storing plain text passwords for demo vulnerability
);

-- Generate random username and password that meets specific criteria
DO $$
DECLARE
    generated_username TEXT;
    generated_password TEXT := ''; -- Initialize as empty string
    pwd_len INT;
    chars TEXT[] := '{}';
    lower_chars TEXT := 'abcdefghijklmnopqrstuvwxyz';
    upper_chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    num_chars TEXT := '0123456789';
    all_chars TEXT := lower_chars || upper_chars || num_chars;
    i INT;
    temp_char TEXT;
BEGIN
    -- Generate a username like 'user_xxxxx'
    generated_username := 'user_' || substr(md5(random()::text), 1, 5);

    -- Generate password meeting criteria
    -- 1. Determine random length (5-10)
    pwd_len := floor(random() * 6) + 5; -- Results in 5, 6, 7, 8, 9, 10

    -- 2. Ensure at least one of each required type (Cast start position to integer)
    -- Add one lowercase
    chars := array_append(chars, substr(lower_chars, (floor(random() * length(lower_chars)) + 1)::integer, 1));
    -- Add one uppercase
    chars := array_append(chars, substr(upper_chars, (floor(random() * length(upper_chars)) + 1)::integer, 1));
    -- Add one number
    chars := array_append(chars, substr(num_chars, (floor(random() * length(num_chars)) + 1)::integer, 1));

    -- 3. Fill remaining length with random alphanumeric chars (Cast start position to integer)
    FOR i IN 1..(pwd_len - 3) LOOP
        chars := array_append(chars, substr(all_chars, (floor(random() * length(all_chars)) + 1)::integer, 1));
    END LOOP;

    -- 4. Shuffle the array and concatenate into the final password string
    SELECT string_agg(c, '' ORDER BY random())
    INTO generated_password
    FROM unnest(chars) AS c;

    -- Insert the generated user
    -- Use ON CONFLICT DO NOTHING in case the script runs again somehow or table already has users
    INSERT INTO users (username, password)
    VALUES (generated_username, generated_password)
    ON CONFLICT (username) DO NOTHING;

    -- Output the generated credentials to the container logs
    RAISE NOTICE '************************************************************';
    RAISE NOTICE 'Demo user initialized:';
    RAISE NOTICE 'Username: %', generated_username;
    RAISE NOTICE 'Password: %', generated_password;
    RAISE NOTICE '************************************************************';
END $$;

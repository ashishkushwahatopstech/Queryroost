-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    picture TEXT,
    plan TEXT NOT NULL DEFAULT 'free', -- 'free' or 'premium'
    google_id TEXT,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at INTEGER,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

-- Sites Table
CREATE TABLE IF NOT EXISTS sites (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    site_url TEXT NOT NULL,
    permission_level TEXT,
    added_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Cached Search Console Performance Queries Table
CREATE TABLE IF NOT EXISTS queries_cache (
    id TEXT PRIMARY KEY,
    site_url TEXT NOT NULL,
    query TEXT NOT NULL,
    clicks INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    ctr REAL DEFAULT 0,
    position REAL DEFAULT 0,
    date TEXT NOT NULL,
    fetched_at INTEGER NOT NULL
);

-- Standalone Tool Daily Usage Counter
CREATE TABLE IF NOT EXISTS tool_usage (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    ip_address TEXT,
    tool_name TEXT NOT NULL,
    used_count INTEGER DEFAULT 1,
    date_str TEXT NOT NULL -- Format: YYYY-MM-DD
);

-- Admin Global Settings Table
CREATE TABLE IF NOT EXISTS admin_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at INTEGER NOT NULL
);

-- Initialize default admin settings
INSERT OR IGNORE INTO admin_settings (key, value, updated_at) VALUES 
('require_premium_meta_preview', 'false', strftime('%s', 'now')),
('require_premium_keyword_density', 'false', strftime('%s', 'now')),
('require_premium_sitemap_validator', 'false', strftime('%s', 'now')),
('max_free_daily_tool_uses', '3', strftime('%s', 'now'));

-- Seed Admin User (ashishkushwaha88643@gmail.com) with Premium
INSERT OR IGNORE INTO users (id, email, name, plan, created_at, updated_at) VALUES
('admin_user_001', 'ashishkushwaha88643@gmail.com', 'Ashish Kushwaha (Admin)', 'premium', strftime('%s', 'now'), strftime('%s', 'now'));

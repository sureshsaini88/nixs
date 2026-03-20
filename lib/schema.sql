-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  balance DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admin table
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_ads_accounts table
CREATE TABLE IF NOT EXISTS user_ads_accounts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  license VARCHAR(255),
  ads_account_id VARCHAR(255),
  ads_account_name VARCHAR(255),
  ad_type VARCHAR(100),
  operate VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin
INSERT INTO admins (username, password) 
VALUES ('nixs_adyvibe.in', '$2a$10$rQz8vH0vJ0X8vJ0X8vJ0XO6X8vJ0X8vJ0X8vJ0X8vJ0X8vJ0X8vJ0')
ON CONFLICT (username) DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_ads_accounts_updated_at BEFORE UPDATE ON user_ads_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create snapchat_ad_applications table
CREATE TABLE IF NOT EXISTS snapchat_ad_applications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) DEFAULT 'snapchat',
  ad_num INTEGER NOT NULL,
  gmail VARCHAR(255) NOT NULL,
  timezone VARCHAR(100),
  deposit_amount DECIMAL(10,2) NOT NULL,
  public_profile_name VARCHAR(255),
  public_profile_id VARCHAR(255),
  has_domain BOOLEAN DEFAULT false,
  unlimited_domain BOOLEAN DEFAULT false,
  domain VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create snapchat_accounts table
CREATE TABLE IF NOT EXISTS snapchat_accounts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  application_id INTEGER REFERENCES snapchat_ad_applications(id),
  account_name VARCHAR(255),
  email VARCHAR(255),
  timezone VARCHAR(100),
  balance DECIMAL(10,2) DEFAULT 0.00,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create snapchat_deposit_records table
CREATE TABLE IF NOT EXISTS snapchat_deposit_records (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  account_id INTEGER REFERENCES snapchat_accounts(id),
  account_name VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  type VARCHAR(50) DEFAULT 'deposit',
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create triggers for snapchat tables
DROP TRIGGER IF EXISTS update_snapchat_ad_applications_updated_at ON snapchat_ad_applications;
CREATE TRIGGER update_snapchat_ad_applications_updated_at BEFORE UPDATE ON snapchat_ad_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_snapchat_accounts_updated_at ON snapchat_accounts;
CREATE TRIGGER update_snapchat_accounts_updated_at BEFORE UPDATE ON snapchat_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create tiktok_ad_applications table
CREATE TABLE IF NOT EXISTS tiktok_ad_applications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) DEFAULT 'tiktok',
  ad_num INTEGER NOT NULL,
  ad_name VARCHAR(255) NOT NULL,
  timezone VARCHAR(100),
  business_category VARCHAR(255),
  deposit_amount DECIMAL(10,2) NOT NULL,
  has_domain BOOLEAN DEFAULT false,
  unlimited_domain BOOLEAN DEFAULT false,
  domain VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tiktok_accounts table
CREATE TABLE IF NOT EXISTS tiktok_accounts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  application_id INTEGER REFERENCES tiktok_ad_applications(id),
  account_name VARCHAR(255),
  email VARCHAR(255),
  timezone VARCHAR(100),
  balance DECIMAL(10,2) DEFAULT 0.00,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tiktok_deposit_records table
CREATE TABLE IF NOT EXISTS tiktok_deposit_records (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  account_id INTEGER REFERENCES tiktok_accounts(id),
  account_name VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  type VARCHAR(50) DEFAULT 'deposit',
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create triggers for tiktok tables
DROP TRIGGER IF EXISTS update_tiktok_ad_applications_updated_at ON tiktok_ad_applications;
CREATE TRIGGER update_tiktok_ad_applications_updated_at BEFORE UPDATE ON tiktok_ad_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tiktok_accounts_updated_at ON tiktok_accounts;
CREATE TRIGGER update_tiktok_accounts_updated_at BEFORE UPDATE ON tiktok_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

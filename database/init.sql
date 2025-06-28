-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(21) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    avatar_id VARCHAR(50),
    avatar_name VARCHAR(100),
    avatar_emoji VARCHAR(10),
    avatar_color VARCHAR(7),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create boards table
CREATE TABLE IF NOT EXISTS boards (
    id VARCHAR(21) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    kingdom_id VARCHAR(50) NOT NULL,
    created_by VARCHAR(21) REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create board_elements table
CREATE TABLE IF NOT EXISTS board_elements (
    id VARCHAR(21) PRIMARY KEY,
    board_id VARCHAR(21) REFERENCES boards(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('card', 'image', 'timeline')),
    position_x INTEGER NOT NULL,
    position_y INTEGER NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    rotation DECIMAL(5,2) DEFAULT 0,
    z_index INTEGER DEFAULT 0,
    content JSONB NOT NULL,
    created_by VARCHAR(21) REFERENCES users(id) ON DELETE SET NULL,
    locked_by VARCHAR(21) REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create images table
CREATE TABLE IF NOT EXISTS images (
    id VARCHAR(21) PRIMARY KEY,
    board_id VARCHAR(21) REFERENCES boards(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    size INTEGER NOT NULL,
    mime_type VARCHAR(100),
    created_by VARCHAR(21) REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create board_users table for tracking board participants
CREATE TABLE IF NOT EXISTS board_users (
    board_id VARCHAR(21) REFERENCES boards(id) ON DELETE CASCADE,
    user_id VARCHAR(21) REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (board_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_boards_kingdom_id ON boards(kingdom_id);
CREATE INDEX idx_boards_created_by ON boards(created_by);
CREATE INDEX idx_board_elements_board_id ON board_elements(board_id);
CREATE INDEX idx_board_elements_type ON board_elements(type);
CREATE INDEX idx_images_board_id ON images(board_id);
CREATE INDEX idx_board_users_user_id ON board_users(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_boards_updated_at BEFORE UPDATE ON boards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_board_elements_updated_at BEFORE UPDATE ON board_elements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
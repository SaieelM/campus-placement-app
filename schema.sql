-- Schema for Campus Listing Database
CREATE DATABASE IF NOT EXISTS campus_db;
USE campus_db;

CREATE TABLE IF NOT EXISTS listings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL DEFAULT 'General',
  organization VARCHAR(255),
  description TEXT,
  phone VARCHAR(50),
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample Data (Optional)
INSERT INTO listings (name, email, role, category, organization, description, phone, location)
VALUES 
  ('Alex Johnson', 'alex.j@example.com', 'Senior Software Engineer', 'Engineering', 'TechCorp Solutions', 'Passionate about full-stack web applications, cloud infrastructure, and modern JavaScript ecosystem.', '+1 (555) 234-5678', 'San Francisco, CA'),
  ('Sophia Chen', 'sophia.c@example.com', 'UI/UX Product Designer', 'Design', 'Creative Design Studio', 'Specializing in design systems, micro-interactions, and accessible user interface experiences.', '+1 (555) 876-5432', 'New York, NY'),
  ('Marcus Vance', 'marcus.v@example.com', 'Data Analyst & Placement Lead', 'Placement', 'Campus Career Hub', 'Helping students connect with top industry partners, resume workshops, and campus placement drives.', '+1 (555) 345-6789', 'Austin, TX');

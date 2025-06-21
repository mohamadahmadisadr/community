-- Community Platform Database Schema
-- Generated from React Components Analysis
-- Date: June 21, 2025

-- ===========================
-- USERS TABLE
-- ===========================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    bio TEXT,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE
);

-- ===========================
-- RESTAURANTS TABLE
-- ===========================
CREATE TABLE restaurants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cuisine VARCHAR(100),
    address VARCHAR(500),
    city VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(10),
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(500),
    hours JSON, -- {monday: "9:00-17:00", tuesday: "9:00-17:00", etc}
    price_range ENUM('$', '$$', '$$$', '$$$$'),
    rating DECIMAL(2,1) DEFAULT 0.0,
    total_reviews INT DEFAULT 0,
    features JSON, -- ["outdoor-seating", "wifi", "parking", "pet-friendly"]
    images JSON, -- ["url1", "url2", "url3"]
    specialty VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Legacy fields for backward compatibility
    hasWifi BOOLEAN DEFAULT FALSE,
    hasOutdoorSeating BOOLEAN DEFAULT FALSE,
    hasParking BOOLEAN DEFAULT FALSE,
    petFriendly BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_city (city),
    INDEX idx_cuisine (cuisine),
    INDEX idx_rating (rating)
);

-- ===========================
-- CAFES TABLE
-- ===========================
CREATE TABLE cafes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address VARCHAR(500),
    city VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(10),
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(500),
    hours JSON, -- {monday: "9:00-17:00", tuesday: "9:00-17:00", etc}
    price_range ENUM('$', '$$', '$$$', '$$$$'),
    rating DECIMAL(2,1) DEFAULT 0.0,
    total_reviews INT DEFAULT 0,
    features JSON, -- ["wifi", "outdoor-seating", "parking", "pet-friendly", "study-friendly"]
    images JSON, -- ["url1", "url2", "url3"]
    specialty VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Legacy fields for backward compatibility
    hasWifi BOOLEAN DEFAULT FALSE,
    hasOutdoorSeating BOOLEAN DEFAULT FALSE,
    hasParking BOOLEAN DEFAULT FALSE,
    petFriendly BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_city (city),
    INDEX idx_rating (rating)
);

-- ===========================
-- RENTAL PROPERTIES TABLE
-- ===========================
CREATE TABLE rental_properties (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type ENUM('apartment', 'house', 'condo', 'townhouse', 'studio', 'room', 'basement', 'other') NOT NULL,
    category ENUM('long-term', 'short-term', 'vacation', 'student', 'shared', 'sublet') NOT NULL,
    
    -- Location
    address VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10),
    
    -- Property Details
    bedrooms INT NOT NULL DEFAULT 0,
    bathrooms DECIMAL(2,1) NOT NULL DEFAULT 0,
    area INT NOT NULL, -- in square feet
    furnished ENUM('furnished', 'semi-furnished', 'unfurnished') NOT NULL,
    parking ENUM('none', 'street', 'driveway', 'garage', 'parking-lot'),
    pet_policy ENUM('no-pets', 'cats-only', 'dogs-only', 'cats-and-dogs', 'all-pets'),
    smoking_policy ENUM('no-smoking', 'smoking-allowed', 'outdoor-only'),
    
    -- Pricing
    rent DECIMAL(10,2) NOT NULL,
    deposit DECIMAL(10,2) DEFAULT 0,
    utilities_included JSON, -- ["electricity", "water", "gas", "internet", "cable", "heating"]
    
    -- Features & Amenities
    features JSON, -- ["balcony", "dishwasher", "laundry-in-unit", "air-conditioning", etc]
    amenities JSON, -- ["gym", "pool", "concierge", "rooftop", etc]
    
    -- Availability
    available_from DATE NOT NULL,
    lease_term ENUM('month-to-month', '6-months', '1-year', '2-years', 'flexible') NOT NULL,
    viewing_schedule TEXT,
    
    -- Contact
    phone VARCHAR(20),
    email VARCHAR(255),
    preferred_contact ENUM('phone', 'email', 'text', 'app-message'),
    
    -- Media
    images JSON, -- ["url1", "url2", "url3"]
    virtual_tour VARCHAR(500),
    
    -- Meta
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    views_count INT DEFAULT 0,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_city (city),
    INDEX idx_type (type),
    INDEX idx_category (category),
    INDEX idx_rent (rent),
    INDEX idx_bedrooms (bedrooms),
    INDEX idx_available_from (available_from)
);

-- ===========================
-- JOBS TABLE
-- ===========================
CREATE TABLE jobs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    responsibilities TEXT,
    
    -- Job Details
    job_type ENUM('full-time', 'part-time', 'contract', 'internship', 'freelance') NOT NULL,
    experience_level ENUM('entry', 'mid', 'senior', 'executive') NOT NULL,
    industry VARCHAR(100),
    category VARCHAR(100),
    
    -- Location
    location VARCHAR(255),
    city VARCHAR(100),
    province VARCHAR(100),
    remote_option ENUM('on-site', 'remote', 'hybrid'),
    
    -- Compensation
    salary_min DECIMAL(10,2),
    salary_max DECIMAL(10,2),
    salary_type ENUM('hourly', 'monthly', 'yearly'),
    benefits JSON, -- ["health-insurance", "dental", "vacation", "401k"]
    
    -- Application
    application_method ENUM('email', 'website', 'phone', 'in-person'),
    application_email VARCHAR(255),
    application_url VARCHAR(500),
    application_deadline DATE,
    
    -- Contact
    contact_person VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    
    -- Meta
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    views_count INT DEFAULT 0,
    applications_count INT DEFAULT 0,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_city (city),
    INDEX idx_job_type (job_type),
    INDEX idx_experience_level (experience_level),
    INDEX idx_industry (industry),
    INDEX idx_salary_range (salary_min, salary_max)
);

-- ===========================
-- SERVICES TABLE
-- ===========================
CREATE TABLE services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    provider_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    
    -- Service Details
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    service_type ENUM('one-time', 'recurring', 'project-based', 'hourly'),
    
    -- Location
    location VARCHAR(255),
    city VARCHAR(100),
    province VARCHAR(100),
    service_area VARCHAR(255), -- "Within 25km of downtown"
    mobile_service BOOLEAN DEFAULT FALSE,
    
    -- Pricing
    price_min DECIMAL(10,2),
    price_max DECIMAL(10,2),
    price_type ENUM('fixed', 'hourly', 'daily', 'project', 'negotiable'),
    price_description TEXT,
    
    -- Availability
    availability JSON, -- {monday: "9:00-17:00", tuesday: "9:00-17:00", etc}
    booking_required BOOLEAN DEFAULT TRUE,
    advance_notice VARCHAR(100), -- "24 hours", "1 week", etc
    
    -- Provider Info
    experience_years INT,
    certifications JSON, -- ["certified", "licensed", "insured", "bonded"]
    rating DECIMAL(2,1) DEFAULT 0.0,
    total_reviews INT DEFAULT 0,
    
    -- Contact
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(500),
    
    -- Media
    images JSON, -- ["url1", "url2", "url3"]
    portfolio_url VARCHAR(500),
    
    -- Meta
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    views_count INT DEFAULT 0,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_city (city),
    INDEX idx_category (category),
    INDEX idx_service_type (service_type),
    INDEX idx_rating (rating)
);

-- ===========================
-- EVENTS TABLE
-- ===========================
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    organizer VARCHAR(255) NOT NULL,
    
    -- Event Details
    category VARCHAR(100) NOT NULL,
    event_type ENUM('public', 'private', 'invite-only') DEFAULT 'public',
    
    -- Date & Time
    start_date DATE NOT NULL,
    start_time TIME,
    end_date DATE,
    end_time TIME,
    timezone VARCHAR(50) DEFAULT 'America/Toronto',
    
    -- Location
    venue_name VARCHAR(255),
    address VARCHAR(500),
    city VARCHAR(100),
    province VARCHAR(100),
    is_online BOOLEAN DEFAULT FALSE,
    online_link VARCHAR(500),
    
    -- Pricing & Capacity
    is_free BOOLEAN DEFAULT TRUE,
    ticket_price DECIMAL(10,2),
    max_capacity INT,
    current_attendees INT DEFAULT 0,
    
    -- Registration
    registration_required BOOLEAN DEFAULT FALSE,
    registration_deadline DATE,
    registration_link VARCHAR(500),
    
    -- Contact
    contact_person VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(500),
    
    -- Media
    images JSON, -- ["url1", "url2", "url3"]
    
    -- Meta
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    views_count INT DEFAULT 0,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_city (city),
    INDEX idx_category (category),
    INDEX idx_start_date (start_date),
    INDEX idx_is_free (is_free)
);

-- ===========================
-- REVIEWS/COMMENTS TABLE
-- ===========================
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    entity_type ENUM('restaurant', 'cafe', 'rental', 'job', 'service', 'event') NOT NULL,
    entity_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    author_name VARCHAR(255), -- For anonymous reviews
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_approved BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at)
);

-- ===========================
-- FAVORITES/SAVED ITEMS TABLE
-- ===========================
CREATE TABLE favorites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    entity_type ENUM('restaurant', 'cafe', 'rental', 'job', 'service', 'event') NOT NULL,
    entity_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (user_id, entity_type, entity_id),
    INDEX idx_user_favorites (user_id, entity_type)
);

-- ===========================
-- SEARCH HISTORY TABLE
-- ===========================
CREATE TABLE search_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    search_term VARCHAR(255) NOT NULL,
    search_type ENUM('restaurants', 'cafes', 'rentals', 'jobs', 'services', 'events', 'general'),
    filters JSON, -- Store applied filters
    results_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_search (user_id, created_at),
    INDEX idx_search_term (search_term)
);

-- ===========================
-- MESSAGES/INQUIRIES TABLE
-- ===========================
CREATE TABLE messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    from_user_id INT,
    to_user_id INT,
    entity_type ENUM('restaurant', 'cafe', 'rental', 'job', 'service', 'event'),
    entity_id INT,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    sender_name VARCHAR(255), -- For anonymous messages
    sender_email VARCHAR(255),
    sender_phone VARCHAR(20),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_recipient (to_user_id, is_read),
    INDEX idx_entity (entity_type, entity_id)
);

-- ===========================
-- REPORTS TABLE
-- ===========================
CREATE TABLE reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    reporter_user_id INT,
    entity_type ENUM('restaurant', 'cafe', 'rental', 'job', 'service', 'event', 'user', 'review') NOT NULL,
    entity_id INT NOT NULL,
    reason VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('pending', 'reviewed', 'resolved', 'dismissed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    resolved_by INT,
    
    FOREIGN KEY (reporter_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_entity (entity_type, entity_id)
);

-- ===========================
-- CONSTANTS AND REFERENCE DATA
-- ===========================

-- Canadian Cities (referenced in components)
INSERT INTO reference_cities (name, province) VALUES
('Toronto', 'Ontario'),
('Vancouver', 'British Columbia'),
('Montreal', 'Quebec'),
('Calgary', 'Alberta'),
('Edmonton', 'Alberta'),
('Ottawa', 'Ontario'),
('Winnipeg', 'Manitoba'),
('Quebec City', 'Quebec'),
('Hamilton', 'Ontario'),
('Kitchener', 'Ontario'),
('London', 'Ontario'),
('Halifax', 'Nova Scotia'),
('Victoria', 'British Columbia'),
('Windsor', 'Ontario'),
('Oshawa', 'Ontario'),
('Saskatoon', 'Saskatchewan'),
('Regina', 'Saskatchewan'),
('St. Johns', 'Newfoundland and Labrador'),
('Barrie', 'Ontario'),
('Kelowna', 'British Columbia');

CREATE TABLE reference_cities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    UNIQUE KEY unique_city_province (name, province)
);

-- ===========================
-- INDEXES FOR PERFORMANCE
-- ===========================

-- Full-text search indexes
ALTER TABLE restaurants ADD FULLTEXT(name, description, cuisine);
ALTER TABLE cafes ADD FULLTEXT(name, description);
ALTER TABLE rental_properties ADD FULLTEXT(title, description);
ALTER TABLE jobs ADD FULLTEXT(title, company, description);
ALTER TABLE services ADD FULLTEXT(title, provider_name, description);
ALTER TABLE events ADD FULLTEXT(title, description, organizer);

-- Composite indexes for common queries
CREATE INDEX idx_restaurants_city_cuisine ON restaurants(city, cuisine);
CREATE INDEX idx_rentals_city_bedrooms_rent ON rental_properties(city, bedrooms, rent);
CREATE INDEX idx_jobs_city_type ON jobs(city, job_type);
CREATE INDEX idx_services_city_category ON services(city, category);
CREATE INDEX idx_events_city_date ON events(city, start_date);

-- ===========================
-- TRIGGERS FOR DATA INTEGRITY
-- ===========================

-- Update rating when new review is added
DELIMITER //
CREATE TRIGGER update_restaurant_rating AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    IF NEW.entity_type = 'restaurant' AND NEW.rating IS NOT NULL THEN
        UPDATE restaurants 
        SET rating = (
            SELECT AVG(rating) 
            FROM reviews 
            WHERE entity_type = 'restaurant' AND entity_id = NEW.entity_id AND rating IS NOT NULL
        ),
        total_reviews = (
            SELECT COUNT(*) 
            FROM reviews 
            WHERE entity_type = 'restaurant' AND entity_id = NEW.entity_id
        )
        WHERE id = NEW.entity_id;
    END IF;
END//
DELIMITER ;

-- Similar triggers would be created for cafes, services, etc.

-- ===========================
-- VIEWS FOR COMMON QUERIES
-- ===========================

-- Active listings view
CREATE VIEW active_rentals AS
SELECT * FROM rental_properties 
WHERE is_active = TRUE AND available_from >= CURDATE();

CREATE VIEW active_jobs AS
SELECT * FROM jobs 
WHERE is_active = TRUE AND (application_deadline IS NULL OR application_deadline >= CURDATE());

CREATE VIEW upcoming_events AS
SELECT * FROM events 
WHERE is_active = TRUE AND start_date >= CURDATE();

-- ===========================
-- NOTES
-- ===========================
/*
Key Design Decisions:
1. JSON fields for flexible arrays (features, images, hours)
2. Enum types for controlled vocabularies
3. Backward compatibility fields for legacy data
4. Comprehensive indexing for search performance
5. Foreign key relationships with appropriate cascade rules
6. Audit fields (created_at, updated_at, created_by)
7. Soft delete pattern with is_active flags
8. Rating aggregation through triggers
9. Full-text search capabilities
10. Reference tables for normalized data

This schema supports:
- Multi-entity platform (restaurants, cafes, rentals, jobs, services, events)
- User management and authentication
- Reviews and ratings system
- Favorites and saved items
- Search and filtering
- Messaging between users
- Content moderation and reporting
- Analytics and tracking
*/
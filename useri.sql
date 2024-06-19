CREATE USER sebi WITH ENCRYPTED PASSWORD 'sebi';
GRANT ALL PRIVILEGES ON DATABASE cti_2024 TO sebi ;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO sebi;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO sebi;

CREATE USER sebi1 WITH ENCRYPTED PASSWORD 'sebi1';
GRANT ALL PRIVILEGES ON DATABASE cti_2024 TO sebi1 ;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO sebi1;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO sebi1;
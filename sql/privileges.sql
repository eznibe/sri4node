CREATE USER sri4node WITH PASSWORD 'sri4node';
GRANT ALL PRIVILEGES ON SCHEMA sri4node TO sri4node;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA sri4node TO sri4node;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA sri4node TO sri4node;
ALTER USER sri4node SET search_path = sri4node;
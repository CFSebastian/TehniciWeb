DROP TYPE IF EXISTS categ_mobila;
DROP TYPE IF EXISTS tipuri_mobila;


CREATE TYPE categ_mobila AS ENUM( 'dormitor', 'sufragerie', 'living', 'bucatarie', 'baie','hol','exterior','general');
CREATE TYPE tipuri_mobila AS ENUM('cmfort', 'decor', 'depozitare','multiuse');

CREATE TABLE IF NOT EXISTS mobila (
   id serial PRIMARY KEY,
   nume VARCHAR(50) UNIQUE NOT NULL,
   descriere TEXT,
   pret NUMERIC(8,2) NOT NULL,
   volum INT NOT NULL CHECK (volum>=0),   
   camera_mobila categ_mobila DEFAULT 'general',
   calorii INT NOT NULL CHECK (calorii>=0),
   	stil VARCHAR(50),
   categorie tipuri_mobila DEFAULT 'multiuse',
   materiale VARCHAR [], --pot sa nu fie specificare deci nu punem NOT NULL
   pt_diabetici BOOLEAN NOT NULL DEFAULT FALSE,
   imagine VARCHAR(300),
   data_adaugare TIMESTAMP DEFAULT current_timestamp
)
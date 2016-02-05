
CREATE TABLE IF NOT EXISTS organization
(id serial NOT NULL, name text NOT NULL, description text, 
CONSTRAINT organization_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS contact
(id serial NOT NULL, first_name text NOT NULL, last_name text NOT NULL, login text, password text,
organization_id integer,
CONSTRAINT contact_pkey PRIMARY KEY (id), 
CONSTRAINT contact_organization_id_fkey FOREIGN KEY (organization_id) 
REFERENCES organization (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE
);

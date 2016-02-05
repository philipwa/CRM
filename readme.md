Developer Test

Summary:
	Build a bug free CRM application that meets the requirements listed below.
	When finished, please submit:
	All source code
	Installation/access/running instructions as required
	Whatever other information/artifacts/explanations you feel are helpful or appropriate
Context:
	An organization is a company/group/business/charity
	Example; Avanti Systems is an organization
	A contact is a person
	Example; Matthew Schulz is a contact
Requirements:
	As a non-technical user, I want to be able to manage (create, read, update, delete) organizations and contacts
	As a non-technical user, I want to be able to associate contacts to organizations
Hints:
	Build for quality over quantity
	Use your time wisely and make intelligent compromises (you can't build an entire CRM application in the time provided, so don't try to)
	On average, individuals invest 6-16 hours. Please share the time you have spent so we can adjust the average moving forward and share with future candidates.
	How much time you spend is not taken into consideration for the role; only the finished application you build.

Requirements:
node.js
PostgresSQl 9.2 and greater

Install one:

1) Create the database schema
Command line:
psql -U username -d crm -a -f schema.sql

2) Pull down the code from github

3) Edit the config/local.json file, change the user, password, database. ( if needed )

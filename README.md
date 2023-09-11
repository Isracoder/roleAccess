# roleAccess
role based access system using express, typeorm , and aws rds for the gsg express training course

### To run this project 🏃: 

- clone the repo
- run npm i
- choose how to set up your db :   
         - use aws rds and set up a config file with the host , password , and username   
         - use another db option such as dbeaver with xamp and configure the username and password

## This is a role based access system with the following details  🕴️🔐 :

    - User : 
        - Attributes: id (primary key), username, password, email, etc.
        - Relationship: Many-to-Many with Role entity, One-to-One with Profile entity.
    - Role :
        - Attributes: id (primary key), name (e.g., "admin," "user," "editor").
        - Relationship: Many-to-Many with User entity and Many-to-Many with Permission entity.
    - Permission:
        - Attributes: id (primary key), name (e.g., "create_post," "edit_user," "delete_comment").
        - Relationship: Many-to-Many with Role entity.
    - Profile:
        - Attributes: id (primary key), firstName, lastName, dateOfBirth, etc.
        - Relationship: One-to-One with User entity.

The Project has the following API endpoints:

    Create User
    Create Permission 
    Create Role (Set permissions of the role while creating the role)
    Assign Role to User
    Get User (with his roles and permissions)
Any api endpoint with put or post requires info to be sent in the body per the code

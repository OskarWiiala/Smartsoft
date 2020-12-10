# Food Recipes Web App (Smartsoft)

Installation instructions:

1. Checkout the main branch.

2. Run npm install.

3. Export the [SQL file](Smartsoft_db.sql) into your Metropolia MySQL phpMyAdmin to create the database tables.

4. Create an .env file including:

        DB_HOST=mysql.metropolia.fi
        DB_USER=<yourusername>
        DB_PASS=<yourpassword>
        DB_NAME=<yourdatabasename>
        HTTPS_PORT=8000
        HTTP_PORT=3000
        NODE_ENV=development
        PROXY_PASS=/app
        
5. Run the following commands to create https keys and certificate:
   
           $ openssl genrsa -out ssl-key.pem 2048
           
           $ openssl req -new -key ssl-key.pem -out certrequest.csr
           
           $ openssl x509 -req -in certrequest.csr -signkey ssl-key.pem -out ssl-cert.pem
           
6. Create a directory called 'thumbnails' in the project folder.
           
7. Run the app:

            $ nodemon app
            
8. Go to localhost:3000, or open front-end/index.html in browser.
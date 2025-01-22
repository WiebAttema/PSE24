# Project Software Engineering 2024
Group: F

## Project description: <br />
Code insight revolutionized coding education by providing an efficient and intuitive platform for both educators and students. For teachers it offers quick generation of coding assignments using artificial intelligence. The platforms intuitive dashboard simplifies course management and the schedule page keeps you on track with all your upcoming tasks.
Students benefit from endless coding exercises tailor-made by their teachers and easy insights on their submitted assignments. The grades page shows them a clear overview of all there achievements and they can easily keep track of upcoming deadlines via the schedule page.
Overall, Code insight enhances learning outcomes, saves time for educators and students, and prepares students with the coding skills needed for the evolving tech landscape.

## URL: <br />
https://pse.lightnet.dev/

## Software Stack
- React
- Flask
- Nginx
- SQLAlchemy
For more specific libraries, please refer to either `./backend/requirements.txt` or `./frontend/package.json`

## How our project works
During production our project consist of 3 parts:
1. A docker container running the backend, which is a Flask server running using Gunicorn
2. A docker container running the frontend, which uses Nginx to serve static HTML files.
3. A Nginx system daemon which servers as a reverse proxy, sending request to either the frontend container or the backend container, depending on the requested path.


## How to build
This section is about how to build the project for a web server, specifically each of the 3 parts mentioned before.
### Building the backend
The backend requires the entire `./backend` directory except `./backend/db_init.py` as well as the `./instance` directory. It is build on the web server itself using the Dockerfile.

Note that it uses `./backend/requirements.txt` for installing the Python dependencies. New dependencies should be added to this file, otherwise the backend container won't run.

You can create `./backend/requirements.txt` by using a virtual environment during development so only the required modules are installed. When you are done you can do `pip3 list > ./backend/requirements.txt`. Do note that you have to format the file, it should only have lines containing `MODULE==VERSION`.

### Building the frontend
The frontend container requires the following files/directories:
- `./frontend/build/`
- `./frontend/Dockerfile`
- `./frontend/nginx.conf`
The `./frontend/build/` directory is build by running `npm ci` and `npm run build` inside `./frontend/`.

Note that you need to have npm and node.js installed to build, as well as additional libraries found inside `./frontend/package.json`.

### Building the Nginx system daemon
This is the only part which involves a lot of manual work. The bare minimum is installing Nginx on the web server, and adding the following in `/etc/nginx/sites-available/default`:
```
server {
    listen 80 default_server;
    location / {
        proxy_pass http://localhost:8082;
    }
    location /api/ {
        proxy_pass http://localhost:8083;
    }
}
```
Nginx comes with a lot of default configuration, if it conflicts it needs to be removed. The snippet provided is the bare minimum. It should work provided that Nginx and the containers are running, but all traffic is through HTTP in this case.

Our actual server listens to port 80 only to redirect traffic to it to port 443, which has implemented HTTPS. But this requires additional configuration, as well as certificates.

### Building the whole project
Assuming the Nginx system daemon has been set up the rest is simple. All you need to do is run `./transfer_to_server.sh` and it will build `./frontend/build/` and transfer all the required files to the remote server. 

Note that you need to have your public key be known to the server for this to work, and that the IP and the path are hard coded. For another server you would need to manually replace the IP in the script, and possibly also the path. 

On the server you navigate to `~/docker/`, where you will find `/frontend`, `/backend`, `/instance`, and `compose.yaml`. You build and start the containers using `docker compose up --build -d` in the `~/docker/` directory. To stop the containers you use `docker compose down` in the same directory.


## How to test
You start the backend testing by running `flask --app backend run --debug` in `./`. To use the frontend you either build it as described before, backend will be able to find `./frontend/build/` without Nginx.

To manage dependencies it is best to create a virtual environment using `python3 -m venv .venv`, activate it using `. .venv/bin/activate`, and then run `pip3 install -r ./backend/requirements.txt`. This will install all dependencies into a virtual environment. Any new dependencies can be added as described before.

You can run the unit tests with the command `pytest` in `./`, but as of writing this they do not function properly.

To initialize the database with dummy data, use `python3 ./backend/db_init.py`.

To view the database structure you can run `./generate_er.py`, this will generate Entity-Relationship diagram called `./er_diagram.png`. For more details of the database you should look in `./backend/db_models.py`.

## How the directory structure works
These are the main directories to look at:
- `./backend/` This directory contains all the Python files, and everything needed to run the backend. The database is not in this directory, it will initialize an empty one if no database was included.
- `./backend/AI/` Contains the Python code needed to communicate with the OpenAI API, as well as the `.txt` files needed for the prompts.
- `./instance/` Contains the database. During runtime on the server it is mounted as a Docker Volume.
- `./tests/` Contains the unit tests.
- `./frontend/` Contains everything needed to build the frontend.
- `./frontend/build/` Contains the static HTML files build using React.
- `./frontend/src/` Contains the React source code.
- `./frontend/src/pages/` Contains the top-level components for the different pages.
- `./frontend/src/components/` Contains all the different components used on the pages, as well as the `.css` files used for styling.


## How the files work
This is a brief description of some important files.
- `./compose.yaml` This file defines what docker compose will do.
- `./generate_er.py` This file will create a diagram of the database.
- `./pytest.ini` Is used to configure Pytest.
- `transfer_to_server.sh` Is used to build and transfer all the files needed for production to the server.
- `./backend/__init__.py` This is the file containing the application factory. Most of the global configuration is found here.
- `./backend/wsgi.py` This file is so that Gunicorn has a starting point during deployment, and for additional configuration.
- `./backend/db_models.py` This file contains the database models, the definitions for the tables and the relations, as well as database configuration.
- `./backend/db_init.py` This file is used to initialize the database with dummy data.
- `./backend/*py` The files not mentioned already are used to separate specific functionality, improving modularity.

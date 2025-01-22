import pytest
from backend import create_app
from backend.db import db


@pytest.fixture
def app():
    app = create_app({'TESTING': True,
                      'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:'})
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def runner(app):
    return app.test_cli_runner()


def test_register(client):
    for i in range(10):
        response = client.post('/register', json={
            'name': f'test{i}',
            'email': f'test{i}@test.com',
            'password': f'password{i}'
        })
        assert response.status_code == 200
        assert b'Registered!' in response.data
    for i in range(10):
        response = client.post('/register', json={
            'name': f'test{i}',
            'email': f'test{i}@test.com',
            'password': f'password{i}'
        })
        assert response.status_code == 401
        assert b'Email already registered.' in response.data


def test_login(client):
    # First register a user
    client.post('/register', json={
        'name': 'test',
        'email': 'test@test.com',
        'password': 'password'
    })

    # Then try to log in
    response = client.post('/login', json={
        'email': 'test@test.com',
        'password': 'password'
    })
    assert response.status_code == 200
    assert b'Logged in!' in response.data

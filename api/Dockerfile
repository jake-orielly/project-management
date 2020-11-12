FROM python:3.7
COPY . /app
RUN pip install -r /app/requirements.txt
CMD gunicorn --bind 0.0.0.0:5000 --chdir /app wsgi:app

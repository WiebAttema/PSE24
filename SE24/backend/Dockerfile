FROM python:3.9-slim
WORKDIR /app/backend
COPY . /app/backend
# COPY requirements.txt requirements.txt
ENV PYTHONPATH=/app
RUN pip3 install --no-cache-dir -r requirements.txt

EXPOSE 8083
CMD ["gunicorn", "-w", "1", "wsgi:app", "--bind", "0.0.0.0:8083"]

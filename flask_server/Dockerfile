FROM python:3.7.0

ADD . /flask_server
WORKDIR /flask_server

RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt 

CMD [ "python", "app.py" ]
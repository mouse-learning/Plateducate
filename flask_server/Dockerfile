FROM python:3.7.0

ADD . /flask_server
WORKDIR /flask_server

RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

EXPOSE 5000
EXPOSE 8501


CMD [ "flask", "run" ]
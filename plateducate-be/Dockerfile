FROM python:3.7.0

ADD . /plateducate-be
WORKDIR /plateducate-be

RUN pip install --upgrade pip && \
    pip install -r requirements.txt

EXPOSE 4000

CMD [ "python", "index.py" ]
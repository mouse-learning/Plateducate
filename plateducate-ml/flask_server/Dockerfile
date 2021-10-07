FROM python:3.6

# '''Add . directory into /tensorflow-deployment in docker container'''
ADD . /app
WORKDIR /app

RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r darkflow-tf-serving.txt 

WORKDIR /app/darkflow \
    && pip install .

RUN apt-get update \
    && apt-get install -y libgl1-mesa-glx

EXPOSE 5000

WORKDIR /app
CMD [ "flask", "run" ]
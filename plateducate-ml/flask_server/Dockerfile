FROM python:3.7.0

# '''Add . directory into /tensorflow-deployment in docker container'''
ADD . /tensorflow-deployment
WORKDIR /tensorflow-deployment

RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

EXPOSE 5000
EXPOSE 8501


CMD [ "flask", "run" ]
FROM python:3.7.0

# '''Add . directory into /tensorflow-deployment in docker container'''
ADD . /Plateducate/plateducate-ml
WORKDIR /Plateducate/plateducate-ml

# RUN apt-get update
# RUN apt-get install ffmpeg libsm6 libxext6  -y


RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt 
    # export PYTHONPATH=$PYTHONPATH:/tensorflow-api/models/research/:/tensorflow-api/models/research/slim/

# ENV PYTHONPATH "${PYTHONPATH}:/tensorflow-api/models/research/:/tensorflow-api/models/research/slim/"

EXPOSE 5000
EXPOSE 8501


CMD [ "flask", "run" ]
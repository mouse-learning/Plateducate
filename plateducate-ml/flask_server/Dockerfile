FROM nvidia/cuda:10.0-cudnn7-devel-ubuntu18.04
CMD nvidia-smi

RUN apt-get update && apt-get install --no-install-recommends --no-install-suggests -y curl software-properties-common
RUN apt-get install unzip
RUN apt-get update \
    && add-apt-repository ppa:deadsnakes/ppa \
    && apt-get update \
    && apt-get -y install python3.6 \
    && apt -y install libpython3.6-dev
RUN update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.6 1
RUN apt install -y python3-pip


# '''Add . directory into /tensorflow-deployment in docker container'''
ADD . /plateducate-ml-server
WORKDIR /plateducate-ml-server

RUN pip3 install --upgrade pip && \
    pip3 install --no-cache-dir -r darkflow.txt 

WORKDIR /plateducate-ml-server/darkflow

RUN python3 setup.py build_ext --inplace

RUN pip3 install .

RUN apt-get update \
    && apt-get install -y libgl1-mesa-glx

WORKDIR /plateducate-ml-server

EXPOSE 5000

ENV LC_ALL=C.UTF-8 
ENV LANG=C.UTF-8

WORKDIR /plateducate-ml-server
CMD [ "flask", "run" ]
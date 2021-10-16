FROM tensorflow/serving:1.13.1

# '''Add . directory into /tensorflow-deployment in docker container'''
WORKDIR /tensorflow-serving

RUN apt-get update \
    && apt-get install -y curl

# # Install nvidia-docker
# RUN distribution=$(. /etc/os-release;echo $ID$VERSION_ID) \
#     && curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | apt-key add - \
#     && curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | tee /etc/apt/sources.list.d/nvidia-docker.list

# # Install nvidia-container-runtime for GPU access
# RUN apt-get update \
#     && apt-get install -y nvidia-container-runtime

# RUN apt-get install -y nvidia-docker2

# CMD nvidia-smi

EXPOSE 8500
EXPOSE 8501

# Deploying a Custom Deep Learning Tensorflow Model using Tensorflow Serving with Docker Compose and Flask

## Environment Pre-requisites

Make sure you have [docker](https://docs.docker.com/get-docker/) and [docker compose](https://docs.docker.com/compose/install/) installed in your computer.

## Execution

1. Clone the repository into your local machine using:

    ```git clone https://github.com/nardienapratama/tensorflow-deployment```
    
2. Enter the `tensorflow-deployment` directory.
3. Start up the application by running `docker-compose up` or `sudo docker-compose up` if you are in Linux.
4. Enter http://localhost:5000/ in your browser to the application running.
    
## Sources Used

This boilerplate is based on this [tutorial](https://towardsdatascience.com/deploying-deep-learning-models-using-tensorflow-serving-with-docker-and-flask-3b9a76ffbbda) and the image classification model was created based on this [tutorial](https://androidkt.com/tensorflow-model-for-prediction-from-scratch/), though modifications have been made accordingly.

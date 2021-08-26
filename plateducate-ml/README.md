# Deploying a Custom Deep Learning Tensorflow Model using Tensorflow Serving with Docker Compose and Flask

## Environment Pre-requisites

Make sure you have [Docker Compose](https://docs.docker.com/compose/install/) installed in your computer. 

## Execution

1. Clone the repository into your local machine using:

    ```git clone -b ml/object-detection --single-branch https://github.com/mouse-learning/Plateducate.git```
    
2. Enter the `tensorflow-deployment` directory.
3. Start up the application by running `docker-compose up --build` or `sudo docker-compose up --build` if you are in Linux. After having run the command, assuming you have not deleted the container, you can run the application again without using the `--build` tag, i.e. `docker-compose up` or `sudo docker-compose up`.
4. Enter http://localhost:5000/ in your browser to see the application running.
    
## Sources Used

This boilerplate is based on this [tutorial](https://towardsdatascience.com/deploying-deep-learning-models-using-tensorflow-serving-with-docker-and-flask-3b9a76ffbbda) and the image classification model was created based on this [tutorial](https://androidkt.com/tensorflow-model-for-prediction-from-scratch/), though modifications have been made accordingly.

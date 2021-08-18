# Deploying a Custom Deep Learning Tensorflow Model using Tensorflow Serving with Docker and Flask

This boilerplate was based on this [tutorial](https://towardsdatascience.com/deploying-deep-learning-models-using-tensorflow-serving-with-docker-and-flask-3b9a76ffbbda) and the image classification model was created based on this [tutorial](https://androidkt.com/tensorflow-model-for-prediction-from-scratch/).

## Environment Setup (Linux)

1. Set up a virtual environment using Python 3.7.0 and install the required dependencies by running:

``` 
pip install -r requirements.txt
```
*Note: the dependencies include the tensorflow-gpu==2.0.0, which would need CUDA and CUDNN installed. Follow steps 1-4 in this [link](https://towardsdatascience.com/deploying-deep-learning-models-using-tensorflow-serving-with-docker-and-flask-3b9a76ffbbda) to set it up.

2. Make sure you have [docker](https://docs.docker.com/get-docker/) installed.

## Code Execution

1. Clone the repository by running:
    ```
    $ git clone https://github.com/nardienapratama/tensorflow-deployment.git
    ```
    
2. `cd` into `tensorflow-deployment`.
3. Install the docker image of Tensorflow Serving and create a new docker instance by running this command:
    ```
    $ docker run -p 8501:8501 — name=pets -v “<path-to-pets-folder>:/models/pets/1” -e MODEL_NAME=pets tensorflow/serving
    ```
    If the command runs successfully, the output should look like this:
    
    ![](https://github.com/nardienapratama/tensorflow-deployment/blob/main/documentation/docker-tf-serving-image-success.png)
    
4. Activate your virtual environment with Python 3.7.0.
5. Set the following Flask variables in the `tensorflow-deployment` directory:
    ```
    $ export FLASK_APP=app
    ```
    
    and 
    
    ```
    $ export FLASK_ENV=development
    ```
6. In the `tensorflow-deployment` directory, run:
    ```
    python app.py
    ```
    
7. And you're good to go!

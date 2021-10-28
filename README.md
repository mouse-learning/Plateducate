# mouselearning
An Android Mobile Food Image Recognition Application which aims to helps users lose weight in order to avoid health problems, such as heart-related issues and asthma.

# Team Members
1. Nardiena Althafia Pratama - 46223713
2. Muhammad Naufal - 46223638
3. Davin Iddo Irawan Alfian - 46223740
4. Owen Jordan - 45802942
5. Huu Minh Quan Tran - 45262612
6. Aditya S Hadinata - 43642498


# Option 1: Set Up Without Docker Compose
## Prerequisites
1. Docker
2. Python 3.6.0 and 3.7.0
3. Tensorflow serving - it is recommended to set this up using [docker](https://www.tensorflow.org/tfx/serving/docker)
4. React Native and its development environment - choose the React Native CLI Quickstart option in this [link](https://reactnative.dev/docs/environment-setup)

## Environment Set Up
Two python environments are needed to run this project, one with Python 3.6.0 and one with Python 3.7.0.

### First Environment: ML Flask Server (Python 3.6.0)
1. Run `cd plateducate-ml/flask_server` and run `pip install -r darkflow.txt`.

> If your system does not have a dedicated GPU, replace the `tensorflow-GPU` module with `tensorflow`. Otherwise, leave the file as it is.

3. Enter the `darkflow` directory by running `cd /darkflow`.
4. Run `python setup.py build_ext --inplace` and `pip install .` to install the darkflow open source library.

### Second Environment: BE Flask Server (Python 3.7.0)
1. Run `cd plateducate-be/` and run `pip install -r requirements.txt`.

## Database Set Up
1. Install MySQL [here](https://dev.mysql.com/doc/mysql-installation-excerpt/5.7/en/).
2. Export the schema using the `.sql` file included in the repository.

## Execution
### Machine Learning Application
#### 1. Tensorflow Serving
On one terminal, do this step:

1. Run tensorflow serving by running this command in your terminal:
```
docker run -p 8501:8501 --name=object-detection --mount type=bind,source=PATH-TO-PROJECT/plateducate-ml/serving/conf/,target=/tensorflow-serving/conf/ --mount type=bind,source=PATH-TO-PROJECT/plateducate-ml/serving/model-data/,target=/tensorflow-serving/models/ -t tensorflow/serving:1.13.1 --model_config_file=/tensorflow-serving/conf/tensorflow-serving.conf --model_config_file_poll_wait_seconds=60
```

#### 2. Machine Learning Server
Open a different terminal and do these steps:

1. Run `cd/plateducate-ml/flask_server/`
2. Run `flask run`.

### Back End Server
Open another terminal and do these steps:

1. Run `cd/plateducate-be/`.
2. Run `flask run -p 4000`.
3. Ensure that the URLs in the backend endpoints refer to `localhost` instead of the Docker container name, since we are not using Docker Compose.

### Front End Client
Open a terminal and do these steps:
1. Run `cd plateducateFE/`.
2. Run `npm i` to install the needed modules.
3. Run `npx react-native start`.

On a different terminal, do these:
1. Run `cd plateducateFE/`.
2. Run `npx react-native android-start`.

The application should now start running on Android Studio.

# Option 2: Set Up With Docker Compose (Linux and GPU Only)

## Platform and Hardware Requirements
1. Linux Distribution from this [list](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html#linux-distributions)
2. NVIDIA GPU

## Prerequisites
1. Docker and Docker Compose
2. [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html)
3. Tensorflow serving - it is recommended to set this up using [docker](https://www.tensorflow.org/tfx/serving/docker)
4. React Native and its development environment - choose the React Native CLI Quickstart option in this [link](https://reactnative.dev/docs/environment-setup)

## Database Set Up
1. Install MySQL [here](https://dev.mysql.com/doc/mysql-installation-excerpt/5.7/en/).
2. Export the schema using the `.sql` file included in the repository.

## Execution

### Machine Learning Application
On one terminal, do the following:
1. Enter the `plateducate-ml` directory by running `cd plateducate-ml/`.
2. Run `sudo docker-compose up --build`.

### Backend Server
Open another terminal and do the following:
1. Enter the `Plateducate` project directory (highest level).
2. Run `sudo docker-compose up --build`.

### Front End (Client)
Open a terminal and do these steps:
1. Run `cd plateducateFE/`.
2. Run `npm i` to install the needed modules.
3. Run `npx react-native start`.

On a different terminal, do these:
1. Run `cd plateducateFE/`.
2. Run `npx react-native android-start`.

The application should now start running on Android Studio.

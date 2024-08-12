# 
FROM python:3.7.9

# 
WORKDIR /code

# 
COPY ./requirements.txt /code/requirements.txt

# 
COPY ./model_training.py /code/model_training.py

# 
COPY ./mainSimulationAccessTraces.csv /code/mainSimulationAccessTraces.csv

# 
COPY ./paths_docker.json /code/paths_docker.json

# 
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# 
COPY ./app /code/app

# 
CMD ["uvicorn", "app.api:app", "--proxy-headers", "--host", "0.0.0.0", "--port", "7999"]

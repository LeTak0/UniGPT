FROM node

# Create app directory
WORKDIR /usr/src/app

#create data directory
RUN mkdir data

# Bundle app source
COPY . .

#install dependencies
RUN npm install

#set enviroment variables during build
ARG OPENAI_API_KEY="build"
ARG OPENAI_MODEL_NAME="build"

#set enviroment variables
ENV OPENAI_API_KEY=$OPENAI_API_KEY
ENV OPENAI_MODEL_NAME=$OPENAI_MODEL_NAME

# Build the app
RUN npm run build

# Expose data directory
VOLUME [ "/usr/src/app/data" ]

# Expose port 3000
EXPOSE 3000

# Run the app
CMD [ "node", "build" ]
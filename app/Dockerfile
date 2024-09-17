# Use a Node.js base image
FROM node:latest

RUN apt-get update && apt-get install -y \
    libnss3 \
    libgtk-3-0 \
    libx11-xcb1 \
    libxss1 \
    libasound2 \
    libgbm-dev \
    dbus-x11 \
    dbus \
    libgl1-mesa-glx \
    libgl1-mesa-dri \
    xdg-utils \   
    libcanberra-gtk-module \
    libcanberra-gtk3-module \
    && rm -rf /var/lib/apt/lists/*


# Set the working directory inside the container
WORKDIR /usr/src/app

# Install Electron Forge
RUN npm install -g @electron-forge/cli

# Bundle app source
COPY . .

# Install dependencies, including Electron
RUN npm install

# Command to run your app (adjust as needed)
CMD ["sh", "-c", "dbus-launch --exit-with-session npm run dev"]
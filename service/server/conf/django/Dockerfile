FROM python:3.9.6

# Change UTC timezone to Asia/Taipei local time
RUN cd / && ln -sf /usr/share/zoneinfo/Asia/Taipei /etc/localtime

# unixodbc unixodbc-dev freetds-common freetds-bin freetds-dev tdsodbc => For mssql linux driver
RUN apt-get update && apt-get install -y \
    tree vim

# For google chrome package install
# RUN apt-get install -y gconf-service libasound2 libatk1.0-0 libcairo2 libcups2 libfontconfig1 libgdk-pixbuf2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libxss1 fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils
# Download and install google chrome
# RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
# RUN dpkg -i google-chrome-stable_current_amd64.deb; apt-get -fy install
# RUN rm -f google-chrome-stable_current_amd64.deb

# Switch to "server" directory, and install python package
RUN mkdir /server
WORKDIR /server
COPY requirements.txt /server/
RUN pip3 install --upgrade pip && pip3 install -r requirements.txt

WORKDIR /server/website/backend/project
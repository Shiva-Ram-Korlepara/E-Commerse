#!/bin/bash

git clone https://github.com/Shiva-Ram-Korlepara/E-Commerse.git
cd E-Commerse

cd Backend
npm install

cd ../frontend
npm install

cd ../Backend
node server.js

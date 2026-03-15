#!/bin/bash

git clone https://github.com/Shiva-Ram-Korlepara/E-Commerse.git
cd e-commerse

cd backend
npm install

cd ../frontend
npm install

cd ../backend
node server.js

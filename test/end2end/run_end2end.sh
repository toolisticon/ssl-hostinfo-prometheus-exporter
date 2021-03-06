#!/bin/bash
docker build -t toolisticon/ssl-hostinfo-prometheus-exporter .
cd test/setup
docker-compose rm -sf
docker volume rm setup_prometheus_data
docker-compose up -d --force-recreate
cd ../..
pytest test/end2end/test_*.py --junitxml=target/reports/junit.xml
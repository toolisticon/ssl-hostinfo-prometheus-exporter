#!/usr/bin/env python

import os
import sys
import time
import json
import pytest
import requests
import helper

# Global variable (yuck!) used to record listener process info
listener = None

url = 'http://localhost:9090/api/v1/query?query=security_ssl_expire_days_remaining'


def test_read():
    r = requests.get(url)
    assert helper.is_successful(r)
    data = r.json()
    assert len(data) != 0

def test_structure():
    data = requests.get(url).json()
    assert data['status'] == 'success'
    metricsResults = data['data']['result']
    assert len(metricsResults) == 2
    assert metricsResults[0]['metric']['__name__'] == 'security_ssl_expire_days_remaining'
    assert metricsResults[1]['metric']['__name__'] == 'security_ssl_expire_days_remaining'

#!/bin/bash

# Bash script for local build automated deployment

# Provision two ec2 instances # Set up and deploy both instances # Set up load balencer
ansible-playbook -v -i inventories/hosts  main.yml --tags provision && ansible-playbook -v -i inventories/hosts main.yml -t setup -t local -t start && ansible-playbook -v -i inventories/hosts main.yml -t elb
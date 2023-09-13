# Project Deployment with Ansible

## Ansible commands
Each command can be run independantly or sequentially.

Run commmands from same folder as this readme.md is contained in, (i.e ~/ansible)

-???- 
Maybe make a bash script?? or test if they work as a single command
-???-

### 1. Create ec2 instances
ansible-playbook -v -i inventories/hosts  main.yml --tags provision

### 2. Setup ec2 steps
ansible-playbook -v -i inventories/hosts main.yml --tags setup

### 3a. Git ec2 steps (remote build only)
ansible-playbook -v -i inventories/hosts main.yml --tags deploy

### 3b. local npm build ec2 steps (local build only)
ansible-playbook -v -i inventories/hosts main.yml --tags local

### 4. nginx ec2 steps
ansible-playbook -v -i inventories/hosts main.yml --tags start

Can combine tags 2,3,4. (either 3a or 3b not both)
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

### 3. Git ec2 steps
ansible-playbook -v -i inventories/hosts main.yml --tags deploy

### 4. nginx ec2 steps
ansible-playbook -v -i inventories/hosts main.yml --tags start
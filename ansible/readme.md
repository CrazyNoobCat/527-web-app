# Project Deployment with Ansible

## Ansible commands
Each command can be run independantly or sequentially.

Run commmands from same folder as this readme.md is contained in, (i.e ~/ansible)

### Conjoint Ansible Steps from a bash script
sudo ./automate_movie_rater.sh

### Individual Ansible Steps

#### 1. Create ec2 instances
ansible-playbook -v -i inventories/hosts  main.yml --tags provision

#### 2. Setup ec2 steps
ansible-playbook -v -i inventories/hosts main.yml --tags setup

#### 3a. Git ec2 steps (remote build only)
ansible-playbook -v -i inventories/hosts main.yml --tags deploy

#### 3b. local npm build ec2 steps (local build only)
ansible-playbook -v -i inventories/hosts main.yml --tags local

#### 4. nginx ec2 steps
ansible-playbook -v -i inventories/hosts main.yml --tags start

#### 5. nginx ec2 steps
ansible-playbook -v -i inventories/hosts main.yml --tags elb

Can combine tags 2,3,4,5. (either 3a or 3b not both)


#### In order to tear down the created services
ansible-playbook -v -i inventories/hosts main.yml -t remove
- Note: Old host names must be manually removed from ansible/inventories/hosts


## The absolute paths found in the following file must be updated:
1. ansible/roles/deploy/defaults/main.yml
2. ansible/roles/ec2-provision/defaults/main.yml
3. ansible/roles/load_balencer/defaults/main.yml
4. ansible/roles/local/defaults/main.yml
5. ansible/roles/setup/defaults/main.yml

# Get environment variables
ENV ?= $(shell aws configure get env)
COLOR ?= $(shell aws configure get color)
GROUP ?= $(shell aws configure get group)
APPLICATION ?= $(shell aws configure get application)
REGION ?= $(shell aws configure get region)
PROFILE ?= $(shell aws configure get profile)
VAR_FILE ?= vars/$(GROUP)-$(APPLICATION)-$(ENV)-$(COLOR)-$(REGION).tfvars

workspace-select:
	@AWS_PROFILE=$(PROFILE) terraform workspace new $(GROUP)-$(APPLICATION)-$(ENV)-$(COLOR)-$(REGION) || AWS_PROFILE=$(PROFILE) terraform workspace select $(GROUP)-$(APPLICATION)-$(ENV)-$(COLOR)-$(REGION)
	
init:
	AWS_PROFILE=$(PROFILE) terraform init -var-file=$(VAR_FILE) -var-file=vars/secrets.tfvars

go-build:
	go mod tidy && GOOS=linux GOARCH=amd64 go build -o modules/lambda/src-secure/main modules/lambda/src-secure/main.go
	zip -j modules/lambda/src-secure/main.zip modules/lambda/src-secure/main

apply: workspace-select go-build
	AWS_PROFILE=$(PROFILE) terraform apply -var-file=$(VAR_FILE) -var-file=vars/secrets.tfvars

destroy: workspace-select go-build
	AWS_PROFILE=$(PROFILE) terraform destroy -var-file=$(VAR_FILE) -var-file=vars/secrets.tfvars

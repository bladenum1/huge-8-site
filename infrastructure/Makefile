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
	AWS_PROFILE=$(PROFILE) terraform init -var-file=$(VAR_FILE)

apply: workspace-select
	AWS_PROFILE=$(PROFILE) terraform apply -var-file=$(VAR_FILE)

destroy: workspace-select
	AWS_PROFILE=$(PROFILE) terraform destroy -var-file=$(VAR_FILE)

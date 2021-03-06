# data
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# remote state
terraform {
  backend "s3" {
    bucket = "account-backend-us-east-1"
    key    = "terraform.tfstate"
    region = "us-east-1"
  }
}

module "cloudfront" {
    source                      = "./modules/cloudfront"
    region                      = "${var.region}"
    profile                     = "${var.profile}"
    group                       = "${var.group}"
    application                 = "${var.application}"
    env                         = "${var.env}"
    color                       = "${var.color}"
    created_by                  = "${var.created_by}"
    comment                     = "${var.comment}"
    bucket_id                   = "${module.s3.bucket_id}"
    bucket_regional_domain_name = "${module.s3.bucket_regional_domain_name}"
}

module "s3" {
    source          = "./modules/s3"
    region          = "${var.region}"
    profile         = "${var.profile}"
    group           = "${var.group}"
    application     = "${var.application}"
    env             = "${var.env}"
    color           = "${var.color}"
    created_by      = "${var.created_by}"
    comment         = "${var.comment}"
    canonical_id    = "${module.cloudfront.canonical_id}"
}

# Lambdas for handling secure requests
module "lambda" {
    source          = "./modules/lambda"
    region          = "${var.region}"
    profile         = "${var.profile}"
    group           = "${var.group}"
    application     = "${var.application}"
    env             = "${var.env}"
    color           = "${var.color}"
    created_by      = "${var.created_by}"
    comment         = "${var.comment}"
    users           = "${var.users}"
}

# API for request processing
module "api" {
    source                        = "./modules/api"
    region                        = "${var.region}"
    profile                       = "${var.profile}"
    group                         = "${var.group}"
    application                   = "${var.application}"
    env                           = "${var.env}"
    color                         = "${var.color}"
    created_by                    = "${var.created_by}"
    comment                       = "${var.comment}"
    lambda_secure_invoke_arn      = "${module.lambda.lambda_secure_invoke_arn}"
    lambda_secure_name            = "${module.lambda.lambda_secure_name}"
}
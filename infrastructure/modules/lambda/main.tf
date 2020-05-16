data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# Policy for logs and s3
data "aws_iam_policy_document" "lambda_policy" {
    statement {
        sid         = "AllowLogging"
        effect      = "Allow"
        actions     = [
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents"
        ]
        resources   = [
            "arn:aws:logs:*:*:*"
        ]
    }
    statement {
        sid         = "AllowS3"
        effect      = "Allow"
        actions     = [
            "s3:Get*",
            "s3:List*",
            "s3:Put*",
        ]
        resources   = [
            "arn:aws:s3:::huge-8-site-nonprod-blue-us-east-1",
            "arn:aws:s3:::huge-8-site-nonprod-blue-us-east-1/*"
        ]
    }
    statement {
        sid         = "AllowCFInvalidation"
        effect      = "Allow"
        actions     = [
            "cloudfront:CreateInvalidation",
        ]
        resources   = [
            "*"
        ]
    }
}
resource "aws_iam_policy" "lambda" {
    name        = "${var.group}-${var.application}-lambda-${var.env}-${var.color}-${data.aws_region.current.name}"
    policy      = "${data.aws_iam_policy_document.lambda_policy.json}"
    description = "${var.comment}"
}

# Role to attach to lambdas, and lambda_policy
data "aws_iam_policy_document" "lambda_role" {
    statement {
        sid         = "AllowAssumeRole"
        effect      = "Allow"
        actions     = ["sts:AssumeRole"]
        principals  {
                type        = "Service"
                identifiers = ["lambda.amazonaws.com"]
        }
    }
}
resource "aws_iam_role" "lambda" {
    name                  = "${var.group}-${var.application}-lambda-${var.env}-${var.color}-${data.aws_region.current.name}"
    assume_role_policy    = "${data.aws_iam_policy_document.lambda_role.json}"
    depends_on            = [
            "aws_cloudwatch_log_group.lambda_secure"
        ]
    tags = {
        Name = "${var.group}-${var.application}-${var.env}-${var.color}-${data.aws_region.current.name}"
        Environment = "${var.env}"
        DeployColor = "${var.color}"
        Group = "${var.group}"
        Application = "${var.application}"
        CreatedBy = "${var.created_by}"
        Function = "role"
    }
}

# Attach lambda policy to role
resource "aws_iam_role_policy_attachment" "policy-attach" {
    role       = "${aws_iam_role.lambda.name}"
    policy_arn = "${aws_iam_policy.lambda.arn}"
}

# Log group data to expire logs after 2 weeks
resource "aws_cloudwatch_log_group" "lambda_secure" {
    name              = "${var.group}-${var.application}-lambda-${var.env}-${var.color}-${data.aws_region.current.name}"
    retention_in_days = 14
    tags = {
        Name = "${var.group}-${var.application}-${var.env}-${var.color}-${data.aws_region.current.name}"
        Environment = "${var.env}"
        DeployColor = "${var.color}"
        Group = "${var.group}"
        Application = "${var.application}"
        CreatedBy = "${var.created_by}"
        Function = "logs"
    }
}

# Lambda function to process secure
resource "aws_lambda_function" "lambda_secure" {
    function_name       = "${var.group}-${var.application}-secure-${var.env}-${var.color}-${data.aws_region.current.name}"
    handler             = "main"
    role                = "${aws_iam_role.lambda.arn}"
    filename            = "./modules/lambda/src-secure/main.zip"
    source_code_hash    = "${filebase64sha256("./modules/lambda/src-secure/main.zip")}"
    runtime             = "go1.x"
    timeout             = 30
    depends_on          = ["aws_cloudwatch_log_group.lambda_secure"]
    description         = "${var.comment}"
    environment {
        variables = {
            GO="GO"
            USERS="${var.users}"
        }
    }
    tags = {
        Name = "${var.group}-${var.application}-${var.env}-${var.color}-${data.aws_region.current.name}"
        Environment = "${var.env}"
        DeployColor = "${var.color}"
        Group = "${var.group}"
        Application = "${var.application}"
        CreatedBy = "${var.created_by}"
        Function = "lambda"
    }
}
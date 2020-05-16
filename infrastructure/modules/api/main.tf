data "aws_caller_identity" "current" {}
data "aws_region" "current" {}


# API Gateway
resource "aws_api_gateway_rest_api" "api" {
  name                = "${var.group}-${var.application}-${var.env}-${var.color}-${data.aws_region.current.name}"
  tags = {
        Name = "${var.group}-${var.application}-${var.env}-${var.color}-${data.aws_region.current.name}"
        Environment = "${var.env}"
        DeployColor = "${var.color}"
        Group = "${var.group}"
        Application = "${var.application}"
        CreatedBy = "${var.created_by}"
        Function = "api"
    }
  description          = "${var.comment}"
}

# API secure resource
resource "aws_api_gateway_resource" "api-secure" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  parent_id   = "${aws_api_gateway_rest_api.api.root_resource_id}"
  path_part   = "secure"
}

# API secure method
resource "aws_api_gateway_method" "api-secure" {
  rest_api_id       = "${aws_api_gateway_rest_api.api.id}"
  resource_id       = "${aws_api_gateway_resource.api-secure.id}"
  http_method       = "POST"
  authorization     = "NONE"
  api_key_required  = true
}

# Gateway, Method and Integration response for secure
resource "aws_api_gateway_integration" "api-secure" {
  rest_api_id               = "${aws_api_gateway_rest_api.api.id}"
  resource_id               = "${aws_api_gateway_resource.api-secure.id}"
  http_method               = "${aws_api_gateway_method.api-secure.http_method}"
  integration_http_method   = "POST"
  type                      = "AWS_PROXY"
  timeout_milliseconds      = 29000
  uri                       = "${var.lambda_secure_invoke_arn}"
}
resource "aws_api_gateway_method_response" "api-secure" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  resource_id = "${aws_api_gateway_resource.api-secure.id}"
  http_method = "${aws_api_gateway_method.api-secure.http_method}"
  status_code = "200"
}
resource "aws_api_gateway_integration_response" "api-secure" {
  depends_on = [
    "aws_api_gateway_integration.api-secure",
  ] 
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  resource_id = "${aws_api_gateway_resource.api-secure.id}"
  http_method = "${aws_api_gateway_method.api-secure.http_method}"
  status_code = "${aws_api_gateway_method_response.api-secure.status_code}"
}

# Allow access to invoke secure lambda function with POST body
resource "aws_lambda_permission" "api-secure" {
  statement_id  = "AllowExecution"
  action        = "lambda:InvokeFunction"
  function_name = "${var.lambda_secure_name}"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${data.aws_caller_identity.current.account_id}:${aws_api_gateway_rest_api.api.id}/*/${aws_api_gateway_method.api-secure.http_method}/secure"
}

# Deployment for the api "nonprod"
resource "aws_api_gateway_deployment" "api" {
  depends_on = [
    "aws_api_gateway_integration.api-secure",
    "aws_api_gateway_integration_response.api-secure",
  ] 
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  stage_name  = "nonprod"
  description = "${var.comment}"
}

# CORS
# aws_api_gateway_method._
resource "aws_api_gateway_method" "_" {
  rest_api_id   = "${aws_api_gateway_rest_api.api.id}"
  resource_id   = "${aws_api_gateway_resource.api-secure.id}"
  http_method   = "OPTIONS"
  authorization = "NONE"
}

# aws_api_gateway_integration._
resource "aws_api_gateway_integration" "_" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  resource_id = "${aws_api_gateway_resource.api-secure.id}"
  http_method = aws_api_gateway_method._.http_method

  type = "MOCK"

  request_templates = {
    "application/json" = "{ \"statusCode\": 200 }",
    # "application/json" = "{ \"headers\": [\"test\":\"1\""
  }
}

# aws_api_gateway_integration_response._
resource "aws_api_gateway_integration_response" "_" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  resource_id = "${aws_api_gateway_resource.api-secure.id}"
  http_method = aws_api_gateway_method._.http_method
  status_code = 200

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'email,password,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
    "method.response.header.Access-Control-Allow-Methods" = "'OPTIONS,POST'",
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }
  depends_on = [
    aws_api_gateway_integration._,
    aws_api_gateway_method_response._,
  ]
}

# aws_api_gateway_method_response._
resource "aws_api_gateway_method_response" "_" {
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  resource_id = "${aws_api_gateway_resource.api-secure.id}"
  http_method = aws_api_gateway_method._.http_method
  status_code = 200

  response_models = {
    "application/json" = "Empty"
  }
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
      "method.response.header.Access-Control-Allow-Methods" = true,
      "method.response.header.Access-Control-Allow-Origin" = true
  }
  depends_on = [
    aws_api_gateway_method._,
  ]
}

# Securely configure apikey and deployment
resource "aws_api_gateway_usage_plan" "api" {
  name = "${var.group}-${var.application}-${var.env}-${var.color}-${data.aws_region.current.name}"

  api_stages {
    api_id = "${aws_api_gateway_rest_api.api.id}"
    stage  = "${aws_api_gateway_deployment.api.stage_name}"
  }
}
resource "aws_api_gateway_api_key" "api" {
  name = "${var.group}-${var.application}-${var.env}-${var.color}-${data.aws_region.current.name}"
}
resource "aws_api_gateway_usage_plan_key" "api" {
  key_id        = "${aws_api_gateway_api_key.api.id}"
  key_type      = "API_KEY"
  usage_plan_id = "${aws_api_gateway_usage_plan.api.id}"
}
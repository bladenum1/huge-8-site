output "lambda_secure_invoke_arn" {
  value = "${aws_lambda_function.lambda_secure.invoke_arn}"
}
output "lambda_secure_name" {
  value = "${aws_lambda_function.lambda_secure.function_name}"
}
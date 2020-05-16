output "api_key" {
    value = "${aws_api_gateway_api_key.api.value}"
}
output "api_url" {
    value = "${aws_api_gateway_deployment.api.invoke_url}"
}
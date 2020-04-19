output "canonical_id" {
  value = "${aws_cloudfront_origin_access_identity.origin_access_identity.s3_canonical_user_id}"
}
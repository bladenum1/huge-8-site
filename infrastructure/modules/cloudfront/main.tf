# data
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
    comment = "${var.comment}"
}

resource "aws_cloudfront_distribution" "cdn" {
    origin {
        domain_name = "${var.bucket_regional_domain_name}"
        origin_id   = "${var.bucket_id}"

        s3_origin_config {
            origin_access_identity = "origin-access-identity/cloudfront/${aws_cloudfront_origin_access_identity.origin_access_identity.id}"
        }
    }

    # aliases             = ["${var.domain}"]
    enabled             = true
    is_ipv6_enabled     = true
    comment             = "${var.comment}"
    default_root_object = "index.html"

    default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "${var.bucket_id}"
        
        forwarded_values {
            query_string = false
            headers = ["Origin", "Access-Control-Request-Headers", "Access-Control-Request-Method"]
            cookies {
                forward = "none"
            }
    }

    viewer_protocol_policy = "redirect-to-https"
        min_ttl                = 0
        default_ttl            = 2400
        max_ttl                = 8600
    }
    restrictions {
        geo_restriction {
            restriction_type = "none"
        }
    }

    viewer_certificate {
        # acm_certificate_arn =  "${var.viewer_certificate}"
        cloudfront_default_certificate = true
    }

    tags = {
        Name = "${var.group}-${var.application}-${var.env}-${var.color}-${data.aws_region.current.name}"
        Environment = "${var.env}"
        DeployColor = "${var.color}"
        Group = "${var.group}"
        Application = "${var.application}"
        CreatedBy = "${var.created_by}"
        Function = "cloudfront"
    }
}
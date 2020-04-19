# data
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

resource "aws_s3_bucket" "bucket" {
    bucket = "${var.group}-${var.application}-${var.env}-${var.color}-${data.aws_region.current.name}"
    force_destroy = true
    server_side_encryption_configuration {
        rule {
            apply_server_side_encryption_by_default {
                sse_algorithm = "AES256"
            }
        }
    }
    versioning {
        enabled = false
    }
    tags = {
        Name = "${var.group}-${var.application}-${var.env}-${var.color}-${data.aws_region.current.name}"
        Environment = "${var.env}"
        DeployColor = "${var.color}"
        Group = "${var.group}"
        Application = "${var.application}"
        CreatedBy = "${var.created_by}"
        Function = "s3"
    }
}
data "aws_iam_policy_document" "s3_policy" {
    statement {
        actions   = ["s3:GetObject"]
        resources = ["${aws_s3_bucket.bucket.arn}/*"]

        principals {
            type        = "CanonicalUser"
            identifiers = ["${var.canonical_id}"]
        }
    }

    statement {
        actions   = ["s3:ListBucket"]
        resources = ["${aws_s3_bucket.bucket.arn}"]

        principals {
            type        = "CanonicalUser"
            identifiers = ["${var.canonical_id}"]
        }
    }
}
resource "aws_s3_bucket_policy" "bucket_policy" {
    bucket = "${aws_s3_bucket.bucket.bucket}"
    policy = "${data.aws_iam_policy_document.s3_policy.json}"
}
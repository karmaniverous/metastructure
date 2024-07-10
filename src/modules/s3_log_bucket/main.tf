/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/


resource "aws_s3_bucket" "s3_access_log" {
  bucket = var.bucket_name
  tags = {
    ENV = terraform.workspace
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "s3_access_log_sse" {
  bucket = aws_s3_bucket.s3_access_log.bucket
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
    bucket_key_enabled = true
  }
}

# PCI requires a policy that enforces upload encryption, but there doesn't 
# appear to be any way to force logging.s3.amazonaws.com to deliver encrypted 
# logs. When we put an enforcement policy in place like the one commented out 
# below, the logs simply don't appear.
resource "aws_s3_bucket_policy" "s3_access_log_policy" {
  bucket = aws_s3_bucket.s3_access_log.bucket
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowLogging"
        Effect = "Allow"
        Principal = {
          Service = "logging.s3.amazonaws.com"
        }
        Action   = "s3:PutObject"
        Resource = "${aws_s3_bucket.s3_access_log.arn}/*"
      },
      # {
      #   Sid      = "EnforceEncryptionMethod"
      #   Effect   = "Deny"
      #   Action   = "s3:PutObject"
      #   Resource = "${aws_s3_bucket.s3_access_log.arn}/*"
      #   Condition : {
      #     StringNotEquals : {
      #       "s3:x-amz-server-side-encryption" : [
      #         AES256,
      #         "aws:kms"
      #       ]
      #     }
      #   }
      # }
    ]
  })
}

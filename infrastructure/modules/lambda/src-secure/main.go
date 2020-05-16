package main

import (
	"context"
	"encoding/json"
	"os"
	"strings"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/aws/external"
	"github.com/aws/aws-sdk-go-v2/service/cloudfront"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

// Users
type Users struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Upload
type Upload struct {
	Key     string `json:"key"`
	Content string `json:"content"`
}

func listKeys() []string {
	cfg, err := external.LoadDefaultAWSConfig()
	if err != nil {
		panic("failed to load config, " + err.Error())
	}

	svc := s3.New(cfg)
	input := &s3.ListObjectsV2Input{
		Bucket: aws.String("huge-8-site-nonprod-blue-us-east-1"),
		Prefix: aws.String("content"),
	}

	req := svc.ListObjectsV2Request(input)
	result, err := req.Send(context.Background())
	if err != nil {
		// TODO: Handle Error
	}
	var keys []string
	for i := 0; i < len(result.Contents); i++ {
		keys = append(keys, *result.Contents[i].Key)
	}
	return keys
}

func upload(key string, body string) (*s3.PutObjectResponse, error) {
	cfg, err := external.LoadDefaultAWSConfig()
	if err != nil {
		panic("failed to load config, " + err.Error())
	}

	svc := s3.New(cfg)
	input := &s3.PutObjectInput{
		Bucket: aws.String("huge-8-site-nonprod-blue-us-east-1"),
		Key:    aws.String(key),
		Body:   aws.ReadSeekCloser(strings.NewReader(body)),
	}

	req := svc.PutObjectRequest(input)
	result, err := req.Send(context.Background())
	if err != nil {
		return nil, err
	}
	return result, nil
}

func invalidate(key string) (*cloudfront.CreateInvalidationResponse, error) {
	cfg, err := external.LoadDefaultAWSConfig()
	if err != nil {
		panic("failed to load config, " + err.Error())
	}

	svc := cloudfront.New(cfg)
	var quantity int64 = 1
	tmp := append([]byte("/"), []byte(key)...)
	input := &cloudfront.CreateInvalidationInput{
		DistributionId: aws.String("E3877DPZ7XEOE7"),
		InvalidationBatch: &cloudfront.InvalidationBatch{
			CallerReference: aws.String(time.Now().String()),
			Paths: &cloudfront.Paths{
				Items:    []string{string(tmp)},
				Quantity: &quantity,
			},
		},
	}
	req := svc.CreateInvalidationRequest(input)
	result, err := req.Send(context.Background())
	if err != nil {
		return nil, err
	}
	return result, nil
}

func handler(cxt context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	authorized := false
	users := make([]Users, 0)
	json.Unmarshal([]byte(os.Getenv("USERS")), &users)
	for i := 0; i < len(users); i++ {
		if users[i].Email == request.Headers["email"] && request.Headers["password"] == users[i].Password {
			authorized = true
			break
		}
	}

	if authorized == false {
		return events.APIGatewayProxyResponse{
			StatusCode: 403,
			Headers: map[string]string{
				"Access-Control-Allow-Headers": "email,password,Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with",
				"Access-Control-Allow-Origin":  "*",
				"Access-Control-Allow-Methods": "OPTIONS,POST",
			},
			Body: "{\"authorized\":false}",
		}, nil
	}

	tmp := []byte("{\"authorized\":true")
	if string(request.Body) == "list_editable" {
		keys := append(append([]byte(",\"keys\":[\""), strings.Join(listKeys(), "\",\"")...), "\"]}"...)
		tmp = append(tmp, keys...)
	} else if strings.Contains(string(request.Body), "content") {
		up := Upload{}
		json.Unmarshal([]byte(request.Body), &up)
		resp, err := upload(up.Key, up.Content)
		if err != nil {
			// TODO: handle error
		}
		tmp = append(tmp, []byte(`,"upload":"success","uploadResponse":`)...)
		resp_txt, err := json.Marshal(resp)
		if err != nil {
			// TODO: handle error
		}
		tmp = append(tmp, []byte(resp_txt)...)
		tmp = append(tmp, ',')
		resp_invalidate, err := invalidate(up.Key)
		if err != nil {
			// TODO: handle error
		}
		resp_invalidate_txt, err := json.Marshal(resp_invalidate)
		if err != nil {
			// TODO: handle error
		}
		tmp = append(tmp, []byte(`"invalidationResponse":`)...)
		tmp = append(tmp, []byte(resp_invalidate_txt)...)
		tmp = append(tmp, '}')
	} else {
		tmp = append(tmp, '}')
	}
	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers: map[string]string{
			"Access-Control-Allow-Headers": "email,password,Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with",
			"Access-Control-Allow-Origin":  "*",
			"Access-Control-Allow-Methods": "OPTIONS,POST",
		},
		Body: string(tmp),
	}, nil
}

func main() {
	lambda.Start(handler)
}

# Lambda Backend

## Formater & installing dependencies

This project should be formmated with [Black Formatter](https://dev.to/adamlombard/how-to-use-the-black-python-code-formatter-in-vscode-3lo0)

To install dependencies, you need to ensure they will run on lambda, as such make use of the following code:

`pip install --platform manylinux2014_x86_64 --python 3.11 --only-binary=:all: --upgrade --target ./python package_name`

### Known Dependencies
- boto3
- pyjwt
- datetime
- passlib[bcrypt]

## Explanation

`lambda_function.py` is the main file that contains the code for the lambda function. It is triggered by the API Gateway and it returns the response to the API Gateway based on the result of a function call. All routes are defined in this file including route rules (e.g. sign-in required to access). 

`utils/dbHelper.py` contains the code for the database helper class. It contains functions that are used to interact with the database. All functions will call this helper class to interact with the database.

`utils/customTypes.py` contains the code for the custom types that are used in the lambda function. This includes the types for the User object, Roles & Movie objects.

`functions/` contains the code for the different API calls that are used in the lambda function. Each group of API calls is seperated into its own file. For example, all user related calls are in `functions/users.py`.

## Deployment

**Note: Do not change the python folder name, it is required for the lambda dependencies layer to work**

1. Create a new lambda function in AWS Lambda
2. Create the dependencies zip
    ```bash	
    cd back-end
    zip -r dependencies_package.zip python/
    ```
3. Zip the lambda function code
    ```bash
    cd back-end
    zip -r code_package.zip . -x packages/\* -x \*.zip -x \*.md
    ```
4. Upload the dependencies zip to the lambda function dependencies layer
5. Upload the lambda function code zip to the lambda function code layer
6. Update secrets in AWS Secret Manager
7. Integrate with API Gateway

*Secrets Required:*

- `JWT_SECRET_KEY`: This is the secret key used to sign the JWT tokens. It can be any string. ***Note:* Using a static secret like this is unsecure, if anyone gets ahold of this they can decrypt any JWT**

## Required Permissions (TBC)

- DynamoDB: `dynamodb:Query`, `dynamodb:PutItem`, `dynamodb:UpdateItem`, `dynamodb:DeleteItem`

- Secrets Manager: `secretsmanager:GetSecretValue`

- CloudWatch: `logs:CreateLogGroup`, `logs:CreateLogStream`, `logs:PutLogEvents`


## API Routes

These are defined in [Postman](https://www.postman.com/dark-resonance-216951/workspace/527-api-development/api/1ec5862d-da26-4657-8a2f-a7e35312bc47?action=share&creator=29195322)

## DynamoDB Tables

### users
Primary Key: `username`

### movies
Primary Key: `movieId`

## Notes:

- **We should consider uploading our deployment zip through s3 as it is larger than 10MB**
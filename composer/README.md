# asset-network

command for adding an admin participant to the network (cli):
```
participantData="{\"\$class\": \"org.asset-network.com.Admin\", \"address1\": \"123 fake street\", \"address2\": \"APT A\", \"country\": \"USA\", \"postcode\": \"92109\", \"userId\": \"1\", \"firstName\": \"testey\", \"lastName\": \"McAdmin\", \"accountType\": \"Admin\", \"email\": \"test@admin.com\"}"
```
then,
```
composer participant add -c admin@asset-network  -d "$participantData"
```
and finally,
```
composer identity issue -c admin@asset-network -f testadmin.card -u testadmin -a "resource:org.asset-network.com.Admin#1" -x true
```

Use https://www.jsonwebtoken.io/ to generate a JWT for this user
payload should contain =
{
  "timestamp": 1531263970, (or current time)
  "username": "testadmin"
}

Follow the POSTMAN steps from https://www.codementor.io/gangachris125/passport-jwt-authentication-for-hyperledger-composer-rest-server-jqfgkoljn


//expected format
{
  "$class": "org.asset-network.com.Admin",
  "address1": "string",
  "address2": "string",
  "country": "string",
  "postcode": "string",
  "userId": "string",
  "firstName": "string",
  "lastName": "string",
  "accountType": "string",
  "email": "string"
}

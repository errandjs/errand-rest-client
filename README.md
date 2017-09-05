# errand-rest-client
[errand](https://github.com/errandjs/errand) worker component used for rest APIs

## Usage

```

npm install errand-rest-client

```

Notes:

1. For dependencies and suggested usage of errand worker components refer to [errand](https://github.com/errandjs/errand)
2. Set environment variable ERRAND_MONGODB_URL with connection string for mongodb server, if not set module will default to `mongodb://localhost:27017`

## Example

```

{
	"tasks": [
		{
			"task": "errand-rest-client",
			"data": {
				"description": "replace-with-task-description",
				"request": {
					"database": "replace-with-mongodb-database-name",
					"collection": "replace-with-name-of-target-collection-for-result",
					"method": "replace-with-rest-client-method",
					"parameters": {
						...
					}
				}
			}
		}
	]
}

```

Notes:

* **tasks** - [errand](https://github.com/errandjs/errand) task list
* **tasks[].task** - required `errand-rest-client` task name
* **tasks[].data.description** - optional task description
* **tasks[].data.request.database** - required mongodb database name
* **tasks[].data.request.collection** - required mongodb collection used with request, used for either payload for request or response from request
* **tasks[].data.request.method** - required rest client method
* **tasks[].data.request.parameters** - required rest client method parameters, the parameter payload will vary depending on method

### get.array.into.collection Example

```

{
	"tasks": [
		{
			"task": "errand-mongodb",
			"data": {
				"description": "replace-with-task-description",
				"request": {
					"method": "get.array.into.collection",
					"parameters": {
						"url": "replace-with-rest-API-endpoint",
						"index":"replace-with-key-to-use-for-upserting-results",
						"request":{},
						"helpers": [
							{ "replace": { "regexp":"\\$date", "newSubstr": "date"}}
						]
					}
				}
			}
		}
	]
}

```

Notes:

* **tasks[].data.request.parameters.url** - use to define URL for API request.
* **tasks[].data.request.parameters.index** - used to define key to be used for upserting results.
* **tasks[].data.request.parameters.helpers** - used to add helpers to transform response.


### put.array.from.collection Example

```

{
	"tasks": [
		{
			"task": "errand-mongodb",
			"data": {
				"description": "replace-with-task-description",
				"request": {
					"database": "replace-with-mongodb-database-name",
					"collection": "replace-with-name-of-target-collection-for-result",
					"method": "put.array.from.collection",
					"parameters": {
						"url": "replace-with-rest-API-endpoint"
					}
				}
			}
		}
	]
}

```

Notes:

* **tasks[].data.request.parameters.url** - use to define URL for API request.

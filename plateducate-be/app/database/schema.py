from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError

user_schema = {
    "type": "object",
    "properties": {
        "username": {
            "type": "string",
            "maxLength": 255
        },
        "email": {
            "type": "string",
            "format": "email"
        },
        "password": {
            "type": "string",
            "minLength": 5
        },
        "firstname": {
            "type": "string",
            "maxLength": 255
        },
        "lastname": {
            "type": "string",
            "maxLength": 255
        },
        "imgsrc": {
            "type": "string"
        },
    },
    "required": ["username", "email", "password"],
    "additionalProperties": False
}

from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError

user_schema = {
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
        },
        "username": {
            "type": "string",
            "maxLength": 18
        },
        "email": {
            "type": "string",
            "format": "email"
        },
        "password": {
            "type": "string",
            "minLength": 5
        },
        "imgsrc": {
            "type": "string"
        },
    },
    "required": ["email", "password"],
    "additionalProperties": False
}

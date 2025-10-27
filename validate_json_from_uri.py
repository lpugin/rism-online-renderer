#!/usr/bin/env python3
"""
Validate a JSON document fetched from a URI against a local JSON Schema.

Usage:
    python validate_json_from_uri.py --url https://example.com/data.json --schema ./schemas/sourceData.schema.json
"""

import argparse
import json
import sys
import urllib.request
from urllib.error import URLError, HTTPError
from jsonschema import Draft202012Validator, validate
from jsonschema.exceptions import ValidationError, SchemaError


def load_json_from_uri(uri: str):
    """Fetch and parse JSON data from a URI."""
    try:
        with urllib.request.urlopen(uri) as response:
            charset = response.headers.get_content_charset() or "utf-8"
            data = response.read().decode(charset)
            return json.loads(data)
    except (URLError, HTTPError) as e:
        print(f"❌ Error fetching JSON from URI: {e}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON content: {e}")
        sys.exit(1)


def load_local_schema(schema_path: str):
    """Load a local JSON Schema from a file."""
    try:
        with open(schema_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"❌ Schema file not found: {schema_path}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"❌ Invalid schema JSON: {e}")
        sys.exit(1)


def validate_json(data, schema):
    """Validate JSON data against the given schema."""
    try:
        Draft202012Validator.check_schema(schema)
        validator = Draft202012Validator(schema)
        errors = sorted(validator.iter_errors(data), key=lambda e: e.path)
        if not errors:
            print("✅ JSON is valid according to schema.")
        else:
            print("❌ JSON validation failed:\n")
            for err in errors:
                path = ".".join(str(x) for x in err.path) or "<root>"
                print(f" - {path}: {err.message}")
            sys.exit(1)
    except SchemaError as e:
        print(f"❌ Invalid JSON Schema: {e}")
        sys.exit(1)
    except ValidationError as e:
        print(f"❌ JSON validation error: {e}")
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="Validate JSON from URI against a local JSON Schema.")
    parser.add_argument("--url", required=True, help="URI of the JSON document to validate")
    parser.add_argument("--schema", required=True, help="Path to the local JSON Schema file")
    args = parser.parse_args()

    print(f"📥 Fetching JSON from {args.url}")
    data = load_json_from_uri(args.url)

    print(f"📄 Loading schema from {args.schema}")
    schema = load_local_schema(args.schema)

    print(f"🔍 Validating JSON against schema...")
    validate_json(data, schema)


if __name__ == "__main__":
    main()

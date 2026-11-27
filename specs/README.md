# OpenAPI Specification Example

This directory would contain OpenAPI specification files for API generation with Orval.

## Example Structure

```
specs/
  ├── openapi.yaml          # Main API specification
  ├── greetings.yaml        # Greetings endpoints
  └── common/
      └── schemas.yaml      # Shared schemas
```

## Example Specification

```yaml
openapi: 3.0.0
info:
  title: Greetings API
  version: 1.0.0

paths:
  /greetings.json:
    get:
      operationId: getGreetings
      tags:
        - greetings
      responses:
        '200':
          description: List of greetings
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Greeting'
              examples:
                default:
                  value:
                    - id: 1
                      language: "en"
                      languageName: "English"
                      text: "Hello, World!"
                      note: "The classic first program."

components:
  schemas:
    Greeting:
      type: object
      required:
        - id
        - language
        - languageName
        - text
        - note
      properties:
        id:
          type: integer
          description: Unique identifier
        language:
          type: string
          description: Language code (ISO 639-1)
        languageName:
          type: string
          description: Display name of the language
        text:
          type: string
          description: The greeting text
        note:
          type: string
          description: Additional information about the greeting
```

## Integration

Once you have an OpenAPI spec:

1. Place it in this directory (e.g., `specs/openapi.yaml`)
2. Update `orval.config.ts` to point to your spec
3. Run `npx orval` or `npx projen gen:api`
4. Generated code appears in `src/lib/api/generated/`

## Best Practices

- **Use examples** in your OpenAPI spec - Orval converts them to typed fixture builders
- **Tag operations** - Orval splits generated code by tags
- **Version your contracts** - Use a separate npm package for shared contracts
- **Never edit generated code** - Always fix the source spec and regenerate

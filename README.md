# Plist Generator Server

A typescript and bun rewrite of [plistserver](https://github.com/nekohaxx/plistserver) by [nekohaxx](https://github.com/nekohaxx) used by the [Feather App](https://github.com/khcrysalis/Feather). Made just for fun. Do what you want with this.

## Prerequisites

- [Bun](https://bun.sh/) for local development
- [Docker](https://www.docker.com/) for containerized deployment

## Installation

### Local Development

```bash
# Install dependencies
bun install

# Start development server with hot reload
bun dev

# Start production server
bun src/init.ts
```

### Docker Deployment

```bash
# Build container
docker build -t plist-gen-server .

# Run container
docker run -p 3000:3000 plist-gen-server
```

## API Documentation

### Endpoints

#### GET /
Returns server information and API documentation.

#### GET /genPlist
Generates a manifest.plist file for iOS app distribution.

#### Query Parameters

- `bundleid`: Your app bundle identifier
- `name`: App name
- `version`: App version
- `fetchurl`: App IPA download URL

#### Example

```
http://localhost:3000/genPlist?bundleid=com.example.app&name=MyApp&version=1.0.0&fetchurl=https://example.com/app.ipa
```

## Environment Variables

```
PORT #Server port (default: 3000)
HOSTNAME #Server hostname (default: 0.0.0.0)
```

## License

MIT

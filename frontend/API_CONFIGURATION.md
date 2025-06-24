# API Configuration Guide

This document explains how API URLs are configured in the application and how to set up different environments.

## Overview

The application uses Angular's environment configuration system to manage API URLs across different environments (development, staging, production).

## Configuration Files

### Environment Files

- **`src/environments/environment.ts`** - Development environment
- **`src/environments/environment.prod.ts`** - Production environment

### API Configuration Service

- **`src/app/core/config/api.config.ts`** - Centralized API configuration service

## Setup

### 1. Development Environment

Update `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000', // Your local development API
};
```

### 2. Production Environment

Update `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com', // Your production API URL
};
```

### 3. Staging Environment (Optional)

Create `src/environments/environment.staging.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://your-staging-api.com',
};
```

## Usage

### In Services

```typescript
import { ApiConfig } from '../../core/config/api.config';

@Injectable({ providedIn: 'root' })
export class MyService {
  private apiConfig = inject(ApiConfig);

  getData(): Observable<any> {
    return this.http.get(this.apiConfig.buildUrl('endpoint'));
  }
}
```

### Direct Access

```typescript
import { ApiConfig } from '../../core/config/api.config';

const apiConfig = inject(ApiConfig);
const url = apiConfig.buildUrl('products/123');
```

## Features

### URL Building

The `ApiConfig` service provides a `buildUrl()` method that:

- Automatically handles leading/trailing slashes
- Validates endpoint parameters
- Ensures proper URL formatting

### Validation

- Validates that API URL is configured
- Throws descriptive errors for missing configuration
- Validates endpoint parameters

### Environment Switching

Angular automatically switches environment files based on build configuration:

- `ng serve` - Uses `environment.ts`
- `ng build` - Uses `environment.prod.ts`
- `ng build --configuration=staging` - Uses `environment.staging.ts`

## Best Practices

1. **Never hardcode API URLs** in services or components
2. **Use the ApiConfig service** for all API calls
3. **Validate environment configuration** at startup
4. **Use different URLs** for different environments
5. **Document API endpoints** in your service files

## Troubleshooting

### Common Issues

1. **"API URL is not configured"** - Check your environment files
2. **CORS errors** - Ensure your API server allows requests from your frontend domain
3. **404 errors** - Verify the API endpoint path is correct

### Debugging

To debug API configuration:

```typescript
console.log('API URL:', this.apiConfig.apiUrl);
console.log('Full endpoint:', this.apiConfig.buildUrl('products'));
```

## Security Considerations

1. **HTTPS in production** - Always use HTTPS for production APIs
2. **Environment variables** - Consider using environment variables for sensitive URLs
3. **CORS configuration** - Properly configure CORS on your API server
4. **API keys** - Store API keys in environment variables, not in code

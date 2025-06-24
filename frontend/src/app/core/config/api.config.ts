import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiConfig {
  private readonly _apiUrl: string;

  constructor() {
    this._apiUrl = this.validateApiUrl(environment.apiUrl);
  }

  get apiUrl(): string {
    return this._apiUrl;
  }

  private validateApiUrl(apiUrl: string): string {
    if (!apiUrl) {
      throw new Error(
        'API URL is not configured. Please check your environment configuration.'
      );
    }

    // Remove trailing slash if present
    return apiUrl.replace(/\/$/, '');
  }

  /**
   * Builds a complete API endpoint URL
   * @param endpoint - The API endpoint (e.g., 'products', 'users/123')
   * @returns Complete API URL
   */
  buildUrl(endpoint: string): string {
    if (!endpoint) {
      throw new Error('Endpoint cannot be empty');
    }

    // Remove leading slash if present
    const cleanEndpoint = endpoint.replace(/^\//, '');
    return `${this._apiUrl}/${cleanEndpoint}`;
  }
}

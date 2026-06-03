/**
 * Base API Service
 *
 * This class serves as the abstraction layer between UI components and data sources.
 * Currently uses mock data, but can be extended to use real API endpoints.
 *
 * Key principle: All API logic is centralized here. UI components never directly
 * access mock data or make HTTP calls. This allows seamless backend integration later.
 */
export class ApiService {
    constructor(baseUrl = '') {
        this.timeout = 5000;
        this.baseUrl = baseUrl;
    }
    /**
     * Simulate API call with mock data
     * In production, replace with actual HTTP calls using axios
     */
    async simulateApiCall(data, delay = 300, shouldFail = false) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (shouldFail) {
                    resolve({
                        success: false,
                        error: 'API call failed',
                    });
                }
                else {
                    resolve({
                        success: true,
                        data,
                    });
                }
            }, delay);
        });
    }
    /**
     * Error handler for API calls
     * Can be extended for logging, analytics, etc.
     */
    handleError(error) {
        console.error('API Error:', error);
        return {
            success: false,
            error: error?.message || 'An error occurred',
        };
    }
}

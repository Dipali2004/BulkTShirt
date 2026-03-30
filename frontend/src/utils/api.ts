import axios from 'axios';

const apiClient = axios.create({
  baseURL: (process.env.REACT_APP_API_URL || 'http://localhost:8082/api/v1') + '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

const coreApiClient = axios.create({
  baseURL: (process.env.REACT_APP_CORE_API_URL || 'http://localhost:8081/api/v1') + '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to add interceptors to an axios instance
const setupInterceptors = (instance: any) => {
  instance.interceptors.request.use((config: any) => {
    const fullUrl = (config.baseURL || '') + config.url;
    console.log(`DEBUG: Request Interceptor [${fullUrl}] -> ${config.method?.toUpperCase()}`);
    
    const token = localStorage.getItem('jwt-token')?.trim();
    console.log("DEBUG: Token retrieved from localStorage:", token ? "YES (exists)" : "NO (not found)");

    if (token) {
      // Step 1: Set Authorization header in multiple ways to ensure compatibility
      // For modern Axios (v1.0+)
      if (config.headers.set) {
        config.headers.set('Authorization', `Bearer ${token}`);
      } 
      // Fallback for older Axios versions
      config.headers['Authorization'] = `Bearer ${token}`;
      
      console.log("DEBUG: Authorization header attached successfully");
    } else {
      console.warn("DEBUG: No token found in localStorage for this request");
    }
    
    // Log final headers (masking sensitive data)
    const sanitizedHeaders = { ...config.headers };
    if (sanitizedHeaders['Authorization']) {
        sanitizedHeaders['Authorization'] = 'Bearer [MASKED]';
    }
    console.log("DEBUG: Final Request Headers:", sanitizedHeaders);
    
    return config;
  }, (error: any) => {
    console.error("DEBUG: Request Interceptor Error:", error);
    return Promise.reject(error);
  });

  instance.interceptors.response.use((response: any) => {
    console.log(`DEBUG: Response Success [${response.status}] from ${response.config.url}`);
    return response;
  }, (error: any) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    
    console.error(`DEBUG: Response Error [${status}] from ${url}`);
    
    if (error.response) {
      console.error("DEBUG: Error Payload:", error.response.data);
      
      const isAuthRequest = url.includes('auth/login') || url.includes('auth/logout') || url.includes('auth/register') || url.includes('auth/csrf-token');
      const isUnauthorized = status === 401 || status === 403;
      
      // If we get a 401/403 on a protected resource, the token is likely invalid/expired
      if (isUnauthorized && !isAuthRequest) {
        console.warn("DEBUG: Token invalid or expired. Clearing storage...");
        localStorage.removeItem('jwt-token');
        localStorage.removeItem('user');
        
        // Emit a custom event so the UI can redirect to login if needed
        window.dispatchEvent(new CustomEvent('auth-expired'));
      }
    }
    
    return Promise.reject(error);
  });
};

setupInterceptors(apiClient);
setupInterceptors(coreApiClient);

export { coreApiClient };
export default apiClient;

class API {
    private baseUrl: string;
    private url: string;
  
    constructor(baseUrl: string) {
      this.baseUrl = baseUrl;
      this.url = baseUrl;
    }
  
    private cloneWithUrl(url: string): API {
      const apiClone = new API(this.baseUrl);
      apiClone.url = url;
      return apiClone;
    }
  
    public from(route: string): API {
      return this.cloneWithUrl(`${this.url}/${route}`);
    }
  
    public byId(id: string): API {
      return this.cloneWithUrl(`${this.url}/${id}`);
    }
  
    public resource(resource: string): API {
      return this.cloneWithUrl(`${this.url}/${resource}`);
    }
  
    public async get(): Promise<any> {
      try {
        const response = await fetch(this.url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.data;
      } catch (error) {
        console.error('GET request error:', error);
        throw error;
      }
    }
  
    public async create(body: any): Promise<any> {
      try {
        const response = await fetch(this.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.data;
      } catch (error) {
        console.error('POST request error:', error);
        throw error;
      }
    }
  
    // Add more methods as needed (put, delete, etc.)
  }
  
  export default API;
  
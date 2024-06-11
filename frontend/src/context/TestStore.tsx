import { nanoid } from "nanoid";

export function setTestStore() {
    return {
        config: {
            UseStatisticalDistribution: true,
        },
        headers: [] as { key: string; value: string; id: string }[],
        endpoints: [] as { Method: string; URL: string; id: string }[],
        addEndpoint() {
            const newEndpoint = { Method: 'GET', URL: '', id: nanoid(4) }
            this.endpoints.push(newEndpoint)
        },
        removeEndpoint(id: string) {
            this.endpoints = this.endpoints.filter((endpoint) => endpoint.id !== id)
        },
        handleInputChange(value: string, type: string) {
            this.config = { ...this.config, [type]: value }
        },
        handleEndpointChange(value: string, type: string, id: string) {
            const newEndpoints = this.endpoints.map((endpoint) => {
                if (endpoint.id === id) {
                    return { ...endpoint, [type]: value }
                }
                return endpoint;
            })
            this.endpoints = newEndpoints;
        },
        addHeader() {
            const newHeader = { key: '', value: '', id: nanoid(4) }
            this.headers.push(newHeader)
        },
        removeHeader(id: string) {
            this.headers = this.headers.filter((header) => header.id !== id)
        },
        handleHeaderInputChange(type: string, value: string, id: string) {
            const newHeaders = this.headers.map((header) => {
                if (header.id === id) {
                    return { ...header, [type]: value }
                }
                return header;
            })
            this.headers = newHeaders;
        }
    };
}

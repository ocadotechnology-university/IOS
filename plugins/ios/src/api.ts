import { IdentityApi, DiscoveryApi, FetchApi, createApiRef } from '@backstage/core-plugin-api';

export const iosApiRef = createApiRef<IosApi>({
  id: 'ios',
});

export type IosIn = {
  username: string
  comment: string
}

export interface IosApi {
  insertComment(username: string, comment: string): Promise<void>;
  deleteComment(username: string, comment: string): Promise<void>;
}

export class IosClient implements IosApi {
  private readonly identityApi: IdentityApi;
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  constructor(options: {
    identityApi: IdentityApi;
    discoveryApi: DiscoveryApi;
    fetchApi: FetchApi;
  }) {
    this.identityApi = options.identityApi;
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }

  async insertComment(username: string, comment: string): Promise<void> {
    const baseUrl = await this.discoveryApi.getBaseUrl('ios-backend');
    const url = `${baseUrl}/db/${username}/${comment}`;
    return await this.fetchApi
      .fetch(url, { method: 'POST' })
      .then(res => res.json());
  }
  
  async deleteComment(username: string, comment: string): Promise<void> {
    const baseUrl = await this.discoveryApi.getBaseUrl('ios-backend');
    const url = `${baseUrl}/db/${username}/${comment}`;
    return await this.fetchApi
      .fetch(url, { method: 'DELETE' })
      .then(res => res.json());
  }

  async getComments(): Promise<IosIn[]> {
    const baseUrl = await this.discoveryApi.getBaseUrl('ios-backend');
    const url = `${baseUrl}/db/get`;
    return await this.fetchApi
      .fetch(url)
      .then(res => res.json());
  }
}  

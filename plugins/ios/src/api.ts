import { IdentityApi, DiscoveryApi, FetchApi, createApiRef } from '@backstage/core-plugin-api';

export const iosApiRef = createApiRef<IosApi>({
  id: 'ios',
});

export type IosIn = {
  project_id: number,
  project_name: string,
  project_description: string,
  project_owner: string,
  project_contributors: string
}

export interface IosApi {
  insertProject(
    project_name: string, 
    project_description: string, 
    project_owner: string, 
    project_contributors: string): Promise<void>;

  deleteProject(project_id: number): Promise<void>;

  updateProject(
    project_id: number, 
    project_name: string,
    project_description: string,
    project_owner: string,
    project_contributors: string): Promise<void>;

  getProjects(): Promise <IosIn[]>;
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

  async insertProject(
    project_name: string,
    project_description: string,
    project_owner: string,
    project_contributors: string
  ): Promise<void> {
    const baseUrl = await this.discoveryApi.getBaseUrl('ios-backend');
    const url = `${baseUrl}/db/`;
  
    const payload = {
      project_name,
      project_description,
      project_owner,
      project_contributors
    };
  
    const response = await this.fetchApi.fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload) 
    });
  
    if (!response.ok) {
      throw new Error(`Failed to insert comment: ${response.statusText}`);
    }
  
    return await response.json();
  }
  
  
  async deleteProject(    
    project_id: number
    ): Promise<void> {
    const baseUrl = await this.discoveryApi.getBaseUrl('ios-backend');
    const url = `${baseUrl}/db/`;

    const payload = {
      project_id
    };

    const response = await this.fetchApi.fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload) 
    });

    if (!response.ok) {
      throw new Error(`Failed to delete comment: ${response.statusText}`);
    }
  
    return await response.json();
  }

  async getProjects(): Promise<IosIn[]> {
    const baseUrl = await this.discoveryApi.getBaseUrl('ios-backend');
    const url = `${baseUrl}/db`;
    return await this.fetchApi
      .fetch(url)
      .then(res => res.json());
  }

  async updateProject(
    project_id: number,    
    project_name: string,
    project_description: string,
    project_owner: string,
    project_contributors: string
    ): Promise<void> {
    const baseUrl = await this.discoveryApi.getBaseUrl('ios-backend');
    const url = `${baseUrl}/db`;
    
    const payload = {
      project_id,
      project_name,
      project_description,
      project_owner,
      project_contributors
    };
    
    const response = await this.fetchApi.fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload) 
    });

    return await response.json();
  }

}  

import { IdentityApi, DiscoveryApi, FetchApi, createApiRef } from '@backstage/core-plugin-api';
import { Member, Project } from './types';

export const iosApiRef = createApiRef<IosApi>({
  id: 'ios',
});


export interface IosApi {
  insertProject(
    project_title: string,
    enitity_ref: string, 
    project_description: string, 
    project_manager_username: string,
    project_manager_ref: string,
    project_docs_ref: string,
    project_life_cycle_status: string,
    project_team_owner_name: string,
    project_team_owner_ref: string,
    project_views: number,
    project_rating: number,
    project_version: string,
    ) : Promise<void>;

  deleteProject(project_id: number): Promise<void>;

  updateProject(
    project_id: number,
    enitity_ref: string,
    project_title: string, 
    project_description: string, 
    project_manager_username: string, 
    project_manager_ref: string,
    project_docs_ref: string,
    project_life_cycle_status: string,
    project_team_owner_name: string,
    project_team_owner_ref: string,
    project_version: string,
    ) : Promise<void>;

  getProjects(

  ): Promise <Project[]>;
  getMembers(project_id: number): Promise <Member[]>
  insertMember( 
    username: string
  ): Promise <void>;
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
    project_title: string, 
    enitity_ref: string,
    project_description: string, 
    project_manager_username: string, 
    project_manager_ref: string,
    project_docs_ref: string,
    project_life_cycle_status: string,
    project_team_owner_name: string,
    project_team_owner_ref: string,
    project_rating: number,
    project_views: number,
    project_version: string,
  ): Promise<void> {
    const baseUrl = await this.discoveryApi.getBaseUrl('ios-backend');
    const url = `${baseUrl}/projects/`;
  
    const payload = {
      project_title, 
      enitity_ref,
      project_description, 
      project_manager_username, 
      project_manager_ref,
      project_docs_ref,
      project_life_cycle_status,
      project_team_owner_name,
      project_team_owner_ref,
      project_rating,
      project_views,
      project_version,
    };
  
    const response = await this.fetchApi.fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload) 
    });
  
    if (!response.ok) {
      throw new Error(`Failed to insert project: ${response.statusText}`);
    }
  
    return await response.json();
  }
  
  
  async deleteProject(    
    project_id: number
    ): Promise<void> {
    const baseUrl = await this.discoveryApi.getBaseUrl('ios-backend');
    const url = `${baseUrl}/projects/${project_id}`;

    const response = await this.fetchApi.fetch(url, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete project: ${response.statusText}`);
    }
  
    return await response.json();
  }

  async getProjects(): Promise<Project[]> {
    const baseUrl = await this.discoveryApi.getBaseUrl('ios-backend');
    const url = `${baseUrl}/projects`;
    return await this.fetchApi
      .fetch(url)
      .then(res => res.json());
  }

  async updateProject(
    project_id: number,
    enitity_ref?: string,
    project_title?: string, 
    project_description?: string, 
    project_manager_username?: string,
    project_manager_ref?: string,
    project_docs_ref?: string,
    project_life_cycle_status?: string,
    project_team_owner_name?: string,
    project_team_owner_ref?: string,
    project_version?: string,
    ): Promise<void> {
    const baseUrl = await this.discoveryApi.getBaseUrl('ios-backend');
    const url = `${baseUrl}/projects/${project_id}`;
    
    const payload = {
      project_title, 
      enitity_ref,
      project_description, 
      project_manager_username,
      project_manager_ref,
      project_docs_ref,
      project_life_cycle_status,
      project_team_owner_name,
      project_team_owner_ref,
      project_version,
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

  async getMembers(project_id: number) : Promise<Member[]>{
    const baseUrl = await this.discoveryApi.getBaseUrl('ios-backend');
    const url = `${baseUrl}/projects/${project_id}/members`;
    return await this.fetchApi
      .fetch(url)
      .then(res => res.json());
  }

  async insertMember(
    username: string,
  ) : Promise <void> {
    const baseUrl = await this.discoveryApi.getBaseUrl('ios-backend');
    const url = `${baseUrl}/ios_members`;
    const { user_avatar } = await this.identityApi.getProfileInfo();
    const payload = { username, user_avatar}

    const response = await this.fetchApi.fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload) 
    });
  
    if (!response.ok) {
      throw new Error(`Failed to insert member: ${response.statusText}`);
    }
  
    return await response.json();
  }

}  

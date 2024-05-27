import { IdentityApi, DiscoveryApi, FetchApi, createApiRef } from '@backstage/core-plugin-api';
import { Member, Project } from './types';

export const iosApiRef = createApiRef<IosApi>({
  id: 'ios',
});


export interface IosApi {
  insertProject(
    project_title: string,
    entity_ref: string, 
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
    project_repository_link: string,
    ) : Promise<void>;

  deleteProject(project_id: number): Promise<void>;

  updateProject(
    project_id: number,
    entity_ref: string,
    project_title: string, 
    project_description: string, 
    project_manager_username: string, 
    project_manager_ref: string,
    project_docs_ref: string,
    project_life_cycle_status: string,
    project_team_owner_name: string,
    project_team_owner_ref: string,
    project_version: string,
    project_repository_link: string,
    ) : Promise<void>;

  getProjects(

  ): Promise <Project[]>;

  getProjectByRef(
    entity_ref: string,
  ): Promise<Project>
  getProjectByID(
    project_id: number,
  ): Promise<Project>
  getMembers(project_id: number): Promise <Member[]>
  insertMember( 
    project_id: number,
    user_entity_ref: string,
  ): Promise <void>;
  insertComment(
    project_id_ref: number,
    comment_id_ref: number,
    user_ref: string,
    comment_text: string,
  ): Promise<void> ;
  getComments(
    project_id_ref: number,
  ): Promise<Comment[]>
  getReplies(
    comment_id_ref: number,
  ): Promise<Reply[]>
  getUserData(
    user_ref: string,
  ): Promise<Member[]>
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
    entity_ref: string,
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
    project_repository_link: string,
  ): Promise<void> {
    const baseUrl = await this.discoveryApi.getBaseUrl('ios-backend');
    const url = `${baseUrl}/projects/`;
  
    const payload = {
      project_title, 
      entity_ref,
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
      project_repository_link,
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

  async getProjectByRef(
    entity_ref: string,
  ): Promise<Project> {
    const baseUrl = await this.discoveryApi.getBaseUrl('ios-backend');
    const encodedEntityRef = encodeURIComponent(entity_ref);
    const url = `${baseUrl}/projects/${encodedEntityRef}`;
    return await this.fetchApi
    .fetch(url)
    .then(res => res.json());
    
  }
  async getProjectByID(
    project_id: number,
  ): Promise<Project> {
    const baseUrl = await this.discoveryApi.getBaseUrl('ios-backend');
    const encodedEntityRef = encodeURIComponent(project_id);
    const url = `${baseUrl}/projects/id/${encodedEntityRef}`;
    return await this.fetchApi
    .fetch(url)
    .then(res => res.json());
    
  }

  async updateProject(
    project_id: number,
    project_title?: string, 
    project_description?: string, 
    project_manager_username?: string,
    project_manager_ref?: string,
    project_docs_ref?: string,
    project_life_cycle_status?: string,
    project_team_owner_name?: string,
    project_team_owner_ref?: string,
    project_version?: string,
    project_repository_link?: string,
    ): Promise<void> {
    const baseUrl = await this.discoveryApi.getBaseUrl('ios-backend');
    const url = `${baseUrl}/projects/${project_id}`;
    const payload = {
      project_title, 
      project_description, 
      project_manager_username,
      project_manager_ref,
      project_docs_ref,
      project_life_cycle_status,
      project_team_owner_name,
      project_team_owner_ref,
      project_version,
      project_repository_link,
    };
    
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!", payload);
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
    project_id: number,
    user_entity_ref: string,
  ) : Promise <void> {
    const baseUrl = await this.discoveryApi.getBaseUrl('ios-backend');
    const url = `${baseUrl}/ios_members`;
    //const { user_avatar } = await this.identityApi.getProfileInfo();
    const payload = { project_id, user_entity_ref}
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
  async insertComment(
    project_id_ref: number,
    comment_id_ref: number,
    user_ref: string,
    comment_text: string,
  ): Promise<void> {
    const baseUrl = await this.discoveryApi.getBaseUrl('ios-backend');
    const url = `${baseUrl}/projects/${project_id_ref}/comments`;
  
    const payload = {
      user_ref,
      comment_text,
      comment_id_ref,
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

  };

  async getComments(project_id_ref: number): Promise<Comment[]> {
    const baseUrl = await this.discoveryApi.getBaseUrl('ios-backend');
    const url = `${baseUrl}/projects/${project_id_ref}/comments`;

    return await this.fetchApi
      .fetch(url)
      .then(res => res.json());
  }

  async getReplies(comment_id_ref: number): Promise<Reply[]> {
    const baseUrl = await this.discoveryApi.getBaseUrl('ios-backend');
    const url = `${baseUrl}/projects/replies/${comment_id_ref}`;
  
    return await this.fetchApi
      .fetch(url)
      .then(res => res.json());
  }

  async getUserData(user_ref: string): Promise<Member[]> {
    const baseUrl = await this.discoveryApi.getBaseUrl('ios-backend');
    const url = `${baseUrl}/ios_members/data`;

    const payload = {
        user_ref,
    };

    try {
        const response = await this.fetchApi.fetch(url, {
            method: 'POST',  
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),  // Include payload in the body
        });
        if (!response.ok) {
            throw new Error(`Error fetching user data: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error; // Re-throw the error to handle it in the calling function
    }
  }

}  
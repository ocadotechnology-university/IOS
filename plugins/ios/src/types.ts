export type Project = {
    project_id: number,
    project_title: string, 
    project_description: string, 
    project_manager_username: string,
    project_manager_ref: string,
    project_docs_ref: string,
    project_life_cycle_status: string,
    project_team_owner_name: string,
    project_team_owner_ref: string,
    project_rating: number,
    project_views: number,
    project_start_date: Date, 
    project_update_date: Date 
}

export type Member = {
    user_id: number;
    username: string;
    user_avatar: string;
    entity_ref: string;
}
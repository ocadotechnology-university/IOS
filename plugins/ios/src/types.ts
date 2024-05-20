export type Project = {
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
    project_rating: number,
    project_views: number,
    project_version: string,
    project_start_date: Date, 
    project_update_date: Date 
}

export type Member = {
    user_id: number;
    user_entity_ref: string,
    user_avatar: string;
}

export type Comment = {
    comment_id: number;
    project_id_ref: number;
    user_id_ref: string;
    comment_text: string;
    comment_date: string;
    comment_version: string;
}
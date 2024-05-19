/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function up(knex) {
    await knex.schema.createTable('ios-table', table => {
        table.increments('project_id').notNullable().unique().comment("Unique id of a project");
        table.string('entity_ref').notNullable().comment("Entity reference on a component");
        table.string('project_title').notNullable().unique().comment("Unique title of a project");
        table.string('project_description').notNullable().comment("Description of a project");
        table.string('project_manager_ref').notNullable().comment("Reference to user that manages a project");
        table.string('project_manager_username').notNullable().comment("Username of project manager");
        table.string('project_docs_ref').notNullable().comment("Reference to docs of a project");
        table.string('project_life_cycle_status').notNullable().comment("Life cycle of a project");
        table.string('project_team_owner_ref').notNullable().comment("Reference to a team that owns a project");
        table.string('project_team_owner_name').notNullable().comment("Name of a team that owns");
        table.integer('project_rating').notNullable().comment("Number of starts project has");
        table.integer('project_views').notNullable().comment("Number of views project has");
        table.timestamp('project_start_date').notNullable().comment("Date and time of start of a project");
        table.timestamp('project_update_date').notNullable().comment("Date and time of start of a project");
        table.string('project_version').notNullable().comment("Current version of the project");
    });
    
    await knex.schema.createTable('ios-table-users', table => {
        table.increments('user_id').notNullable().unique().comment("User id");
        table.string('user_entity_ref').notNullable().comment("Username from catalog ");
        table.text('user_avatar').comment("Link to avatar of user");
        table.specificType('user_projects_ids', 'INTEGER[]').comment("Ids of projects that user in");
    });

    await knex.schema.createTable('ios-table-comments', table => {
        table.increments('comment_id').notNullable().unique().comment("Unique ID of the comment");
        table.integer('project_id_ref').notNullable().comment("Id of the project to that comment belongs");
        table.integer('user_id_ref').notNullable().comment("Id of user that left comment");
        table.string('comment_text').notNullable().comment("Text of the comment");
        table.timestamp('comment_date').notNullable().comment("Date when comment was left");
        table.string('comment_version').notNullable().comment("Version of the project when comment was left");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {

};
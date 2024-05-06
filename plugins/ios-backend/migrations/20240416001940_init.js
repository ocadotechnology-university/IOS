/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function up(knex) {
    await knex.schema.createTable('ios-table', table => {
        table.increments('project_id').notNullable().unique().comment("Unique id of a project");
        table.string('project_title').notNullable().unique().comment("Unique title of a project");
        table.string('project_description').notNullable().comment("Description of a project");
        table.string('project_manager_username').notNullable().comment("User that manages a project");
        table.string('project_manager_ref').notNullable().comment("Reference to user that manages a project");
        table.string('project_docs_ref').notNullable().comment("Reference to docs of a project");
        table.string('project_life_cycle_status').notNullable().comment("Life cycle of a project");
        table.string('project_team_owner_name').notNullable().comment("Team that owns a project");
        table.string('project_team_owner_ref').notNullable().comment("Reference to a team that owns a project");
        table.integer('project_rating').notNullable().comment("Number of starts project has");
        table.integer('project_views').notNullable().comment("Number of views project has");
        table.date('project_start_date').notNullable().comment("Date of start of a project");
    });
    
    await knex.schema.createTable('ios-table-users', table => {
        table.integer('user_id').notNullable().comment("User id ");
        table.string('username').notNullable().comment("Username from catalog ");
        table.text('user_avatar').notNullable().comment("Link to avatar of user");
        table.string('entity_ref').notNullable().comment("Link to user entity");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {

};

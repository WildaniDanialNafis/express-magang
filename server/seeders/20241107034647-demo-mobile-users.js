// seeders/20231107100000-demo-users.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Mobile_Users', [
      {
        email: 'user@example.com',
        password: '$2a$10$IFIyodNCUN3VXsInk.oca.qCjfbU/F6jBAwFITYF5UTDEO.nS5CPe',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'user2@example.com',
        password: '$2a$10$IFIyodNCUN3VXsInk.oca.qCjfbU/F6jBAwFITYF5UTDEO.nS5CPe',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Mobile_Users', null, {});
  }
};

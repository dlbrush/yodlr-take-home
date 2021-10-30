$(() => {
  const userData = $('#user-data');
  userData.text('Loading user data...');
  
  API.getUsers()
  .then(users => {
    new UserTable($('#user-data'), users, $('#table-update'));
  })
  .catch(error => {
    console.error(error);
    userData.text('Failed to load user data: ', error.message);
  });
});
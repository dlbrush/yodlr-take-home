$(() => {
  const alert = $('#register-alert');

  function submit(evt) {
    evt.preventDefault();
    const data = {
      email: evt.target.email.value,
      firstName: evt.target['first-name'].value,
      lastName: evt.target['last-name'].value
    };
    API.sendRegistration(data)
    .then(user => {
      alert.removeClass('hidden');
      alert.addClass(['alert', 'alert-success', 'mt-3']);
      alert.text(`Successfully registered user ${user.firstName} ${user.lastName}! Go to the admin page to see all users.`);
    })
    .catch(error => {
      alert.removeClass('hidden');
      alert.addClass(['alert', 'alert-danger', 'mt-3']);
      alert.text(`Failed to register: ${error.message}`);
    })
  };

  $('#register-form').on('submit', submit);
});
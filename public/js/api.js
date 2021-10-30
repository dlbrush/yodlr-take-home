// Should always be trying to locate the same server as the origin of the page
const basePath = window.location.origin;

class API {
  static getUsers() {
    return $.getJSON(`${basePath}/users`);
  }

  static sendRegistration(data) {
    return $.post(`${basePath}/users`, data);
  }

  static updateUser(id, data) {
    return $.ajax(`${basePath}/users/${id}`, {
      method: 'PUT',
      data
    });
  }
}
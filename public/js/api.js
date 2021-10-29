// Should always be trying to locate the same server as the origin of the page
const basePath = window.location.origin;

class API {
  static getUsers() {
    return $.getJSON(`${basePath}/users`);
  }

  static sendRegistration(data) {
    console.log(data);
    return $.post(`${basePath}/users`, data)
  }
}
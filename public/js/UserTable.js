class UserTable {
  constructor(target, users, updateAlert) {
    this.target = target;
    this.users = users;
    this.updateAlert = updateAlert;
    this.sortBy = this.sortBy.bind(this);
    this.activateUser = this.activateUser.bind(this);
    this.build();
  }

  build() {
    // Establish table and header
    const userTable = $(`
      <table class="table" id="user-table">
      </table>`
    );
    const tableHeader = $(
      `<thead id="user-table-header">
        <tr>
          <th id="id-header" class="table-active sortable sorted-dsc" scope="col">ID <i class="sort fas fa-caret-down"></i></th>
          <th id="firstName-header" class="sortable" scope="col">First <i class="sort"></i></th>
          <th id="lastName-header" class="sortable" scope="col">Last <i class="sort"></i></th>
          <th id="email-header" class="sortable" scope="col">Email <i class="sort"></i></th>
          <th id="state-header" class="sortable" scope="col">State <i class="sort"></i></th>
          <th id="activate-header" scope="col">Activate</th>
        </tr>
      </thead>`
    );
    // Give each header the sortBy event handler except for activate column
    const sortListener = this.sortBy;
    tableHeader.children('tr').eq(0).children().each(function() {
      if (this.id !== 'activate-header') {
        $(this).on('click', sortListener);
      }
    });
    userTable.append(tableHeader);

    // Then build body with a row for each user
    const tableBody = $('<tbody id="user-table-body"></tbody>');
    this.appendUserRows(tableBody);
    userTable.append(tableBody);

    // Empty current user data and replace with table
    this.target.empty();
    this.target.append(userTable);
  }

  sortBy(evt) {
    // Get category from Id of target header
    const sortCat = evt.target.id.split('-')[0];

    // Set direction to dsc by default, switch to asc if the column is already sorted dsc
    let sortDir = 'dsc';
    if ($(evt.target).hasClass('sorted-dsc')) sortDir = 'asc';

    // Sort users
    this.users.sort((a, b) => {
      if (sortCat === 'id') {
        a.id = parseInt(a.id);
        b.id = parseInt(b.id);
      }
      // Sort in least to greatest order if dsc, opposite otherwise
      if (sortDir === 'dsc') {
        if(a[sortCat] < b[sortCat]) return -1;
        if(a[sortCat] > b[sortCat]) return 1;
        return 0;
      } else {
        if(a[sortCat] > b[sortCat]) return -1;
        if(a[sortCat] < b[sortCat]) return 1;
        return 0;
      }
    });

    // Empty the table and replenish with new sorted rows
    const tableBody = $('#user-table-body');
    tableBody.empty();
    this.appendUserRows(tableBody);

    // Remove classes and arrow from current active header
    $('.table-active i').removeClass(['fas', 'fa-caret-down', 'fa-caret-up']);
    $('.table-active').removeClass(['table-active', 'sorted-dsc', 'sorted-asc']);

    // Set classes on sorted column
    $(evt.target).addClass(['table-active', `sorted-${sortDir}`]);

    //Add arrow indicator
    const iconDirection = sortDir === 'dsc' ? 'down' : 'up';
    $(evt.target).children('i').eq(0).addClass(['fas', `fa-caret-${iconDirection}`]);
  }

  appendUserRows(tableBody) {
    const activateUser = this.activateUser;
    this.users.forEach(function (user) {
      const userRow = $(
        `<tr class="user-row">
          <th class="user-id" scope="row">${user.id}</th>
          <td class="user-firstName">${user.firstName}</td>
          <td class="user-lastName">${user.lastName}</td>
          <td class="user-email">${user.email}</td>
          <td class="user-state">${user.state}</td>
        </tr>`
      );
      // Add column and button for activating the user
      const activateCell = $('<td class="user-activate"></td>')
      const activateButton = $('<button class="btn btn-primary">Activate User</button>');
      activateButton.on('click', activateUser);
      if (user.state === 'active') {
        activateButton.prop('disabled', true);
      }
      activateCell.append(activateButton);
      userRow.append(activateCell);
      tableBody.append(userRow);
    });
  };

  activateUser(evt) {
    const id = parseInt($(evt.target).parent().siblings('.user-id').eq(0).text());
    const user = this.users.find(user => user.id === id);
    user.state = 'active';
    API.updateUser(id, user)
    .then(user => {
      const tableBody = $('#user-table-body');
      tableBody.empty();
      this.appendUserRows(tableBody);
      this.updateAlert.addClass(['alert', 'alert-success']);
      this.updateAlert.text(`User ${user.id} successfully activated.`);
    })
    .catch(error => {
      // Reset to pending if activation doesn't work
      user.state = 'pending';
      console.error(error);
      this.updateAlert.addClass(['alert', 'alert-danger']);
      this.updateAlert.text(`Unable to activate user ${user.id}.`);
    })
    return;
  }
}
$(() => {
  const userData = $('#user-data');
  userData.text('Loading user data...');
  
  API.getUsers()
  .then(users => {
    console.log(users);
    // Establish table and header
    const userTable = $('<table class="table" id="user-table"></table>');
    const tableHeader = $(
      `<thead id="user-table-header">
        <th id="id-header" class="table-active sorted-dsc" scope="col">ID <i class="sort fas fa-caret-down"></i></th>
        <th id="firstName-header" scope="col">First <i class="sort"></i></th>
        <th id="lastName-header" scope="col">Last <i class="sort"></i></th>
        <th id="email-header" scope="col">Email <i class="sort"></i></th>
        <th id="state-header" scope="col">State <i class="sort"></i></th>
      </thead>`
    );
    // Give each header the sortBy event handler
    tableHeader.children().each(function() {
      $(this).on('click', sortBy);
    });
    userTable.append(tableHeader);

    // Then build body with a row for each user
    const tableBody = $('<tbody id="user-table-body"></tbody>');
    appendUserRows(users, tableBody);
    userTable.append(tableBody)

    // Empty current user data and replace with table
    userData.empty();
    userData.append(userTable);
  })
  .catch(error => {
    console.log(error);
    userData.text('Failed to load user data: ', error);
  });

  function sortBy(evt) {
    // Get category from Id of target header
    const sortCat = evt.target.id.split('-')[0];
    let sortDir = 'dsc';
    if ($(evt.target).hasClass('sorted-dsc')) sortDir = 'asc';
    // Get all rows from the body of the table
    const tableBody = $('#user-table-body');
    const userRows = [];
    const tableRows = tableBody.children();
    tableRows.each(function() {
      const rowData = {};
      $(this).children().each(function() {
        const key = this.className.split('-')[1];
        const val = this.innerText;
        rowData[key] = val;
      });
      userRows.push(rowData);
    });
    console.log(userRows);
    // Sort rows by whatever category we chose - if ID, convert to number first
    userRows.sort((a, b) => {
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
    tableBody.empty();
    appendUserRows(userRows, tableBody);
    // Remove classes and arrow from current active header
    $('.table-active i').removeClass(['fas', 'fa-caret-down', 'fa-caret-up']);
    $('.table-active').removeClass();
    // Set classes on sorted column
    $(evt.target).addClass(['table-active', `sorted-${sortDir}`]);
    //Add arrow indicator
  }

  function appendUserRows(users, tableBody) {
    users.forEach(function (user) {
      const userRow = $(
        `<tr class="user-row">
          <th class="user-id" scope="row">${user.id}</th>
          <td class="user-firstName">${user.firstName}</td>
          <td class="user-lastName">${user.lastName}</td>
          <td class="user-email">${user.email}</td>
          <td class="user-state">${user.state}</td>
        </tr>`
      )
      tableBody.append(userRow);
    });
  }
});
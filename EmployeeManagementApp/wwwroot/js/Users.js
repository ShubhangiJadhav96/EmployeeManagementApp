$(document).ready(function () {
    loadUsers();

    $("#btnSaveRole").click(function () {
        saveRole();
    });
});

function loadUsers() {
    var token = sessionStorage.getItem("authToken");

    $.ajax({
        url: APIURL + "/api/users",
        method: "GET",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + token
        }
    })
        .done(function (users) {
            renderUsersTable(users);
        })
        .fail(function (xhr) {
            if (xhr.status === 401 || xhr.status === 403) {
                showMessageDialog("You are not authorized to view this page.", ERROR);
                window.location.href = "/Home/Index";
            } else {
                showMessageDialog("Failed to load users.", ERROR);
            }
        });
}

function renderUsersTable(users) {
    var $tbody = $("#usersTableBody");
    $tbody.empty();

    users.forEach(function (user) {
        var row =
            "<tr>" +
            "<td>" + user.fullName + "</td>" +
            "<td>" + user.email + "</td>" +
            "<td>" + user.role + "</td>" +
            "<td>" +
            "<button class='btn btn-sm btn-primary btnEditRole' " +
            "data-id='" + user.userId + "' " +
            "data-name='" + user.fullName + "' " +
            "data-role='" + user.role + "'>Edit</button>" +
            "</td>" +
            "</tr>";
        $tbody.append(row);
    });

    // Wire up Edit buttons after rows are rendered
    $(".btnEditRole").click(function () {
        var id = $(this).data("id");
        var name = $(this).data("name");
        var role = $(this).data("role");

        $("#editUserId").val(id);
        $("#editUserName").text(name);
        $("#editRoleSelect").val(role);

        $("#editRoleModal").modal("show");
    });
}

function saveRole() {
    var token = sessionStorage.getItem("authToken");
    var userId = $("#editUserId").val();
    var newRole = $("#editRoleSelect").val();

    $.ajax({
        url: APIURL + "/api/users/" + userId + "/role",
        method: "PATCH",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ Role: newRole }),
        headers: {
            "Authorization": "Bearer " + token
        }
    })
        .done(function () {
            $("#editRoleModal").modal("hide");
            showMessageDialog("Role updated successfully.", SUCCESS);
            loadUsers(); // refresh the table
        })
        .fail(function (xhr) {
            var errorMessage = "Failed to update role.";
            try {
                errorMessage = $.parseJSON(xhr.responseText).message || errorMessage;
            } catch (e) { }
            showMessageDialog(errorMessage, ERROR);
        });
}
$(document).ready(function () {
    loadDepartments();

    $("#btnAddDepartment").click(function () {
        openAddModal();
    });

    $("#btnSaveDepartment").click(function () {
        saveDepartment();
    });
});

function loadDepartments() {
    debugger;
    var token = sessionStorage.getItem("authToken");

    var settings = {
        async: true,
        crossDomain: true,
        cache: false,
        dataType: "json",
        url: APIURL + "/api/departments",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    };

    $.ajax(settings)
        .done(function (departments) {
            renderDepartmentsTable(departments);
        })
        .fail(function (xhr, textStatus, errorThrown) {
            if (xhr.status === 401) {
                window.location.href = "/Account/Login";
            } else {
                showMessageDialog("Failed to load departments.", ERROR);
            }
        });
}

function renderDepartmentsTable(departments) {
    var $tbody = $("#departmentsTableBody");
    $tbody.empty();

    var role = sessionStorage.getItem("authRole");
    var isAdmin = (role === "Admin");

    departments.forEach(function (dept) {
        var actionButtons = "";
        if (isAdmin) {
            actionButtons =
                "<button class='btn btn-sm btn-primary btnEditDept' " +
                "data-id='" + dept.departmentId + "' " +
                "data-name='" + dept.name + "' " +
                "data-manager='" + dept.manager + "' " +
                "data-budget='" + dept.budget + "'>Edit</button> " +
                "<button class='btn btn-sm btn-danger btnDeleteDept' " +
                "data-id='" + dept.departmentId + "'>Delete</button>";
        }

        var row =
            "<tr>" +
            "<td>" + dept.name + "</td>" +
            "<td>" + dept.manager + "</td>" +
            "<td>" + dept.budget + "</td>" +
            "<td>" + dept.employeeCount + "</td>" +
            "<td>" + actionButtons + "</td>" +
            "</tr>";
        $tbody.append(row);
    });

    // Hide Add button too, if not Admin
    if (!isAdmin) {
        $("#btnAddDepartment").hide();
    }

    // Wire up buttons
    $(".btnEditDept").click(function () {
        var id = $(this).data("id");
        var name = $(this).data("name");
        var manager = $(this).data("manager");
        var budget = $(this).data("budget");
        openEditModal(id, name, manager, budget);
    });

    $(".btnDeleteDept").click(function () {
        var id = $(this).data("id");
        confirmDelete(id);
    });
}

function openAddModal() {
    $("#departmentModalTitle").text("Add Department");
    $("#departmentId").val("");
    $("#departmentName").val("");
    $("#departmentManager").val("");
    $("#departmentBudget").val("");
    $("#departmentModal").modal("show");
}

function openEditModal(id, name, manager, budget) {
    $("#departmentModalTitle").text("Edit Department");
    $("#departmentId").val(id);
    $("#departmentName").val(name);
    $("#departmentManager").val(manager);
    $("#departmentBudget").val(budget);
    $("#departmentModal").modal("show");
}

function saveDepartment() {
    var token = sessionStorage.getItem("authToken");
    var id = $("#departmentId").val();
    var name = $("#departmentName").val().trim();
    var manager = $("#departmentManager").val().trim();
    var budget = $("#departmentBudget").val();

    if (name === "") {
        showMessageDialog("Department name is required.", WARNING);
        return;
    }

    var jsonData = JSON.stringify({
        Name: name,
        Manager: manager,
        Budget: parseFloat(budget) || 0
    });

    var isEdit = id !== "";
    var settings = {
        async: true,
        crossDomain: true,
        cache: false,
        dataType: "json",
        url: isEdit ? (APIURL + "/api/departments/" + id) : (APIURL + "/api/departments"),
        method: isEdit ? "PUT" : "POST",
        contentType: "application/json; charset=utf-8",
        data: jsonData,
        headers: {
            "Authorization": "Bearer " + token
        }
    };

    $.ajax(settings)
        .done(function (response) {
            $("#departmentModal").modal("hide");
            showMessageDialog(isEdit ? "Department updated successfully." : "Department created successfully.", SUCCESS);
            loadDepartments();
        })
        .fail(function (xhr, textStatus, errorThrown) {
            var errorMessage = "Failed to save department.";
            try {
                errorMessage = $.parseJSON(xhr.responseText).message || errorMessage;
            } catch (e) { }
            showMessageDialog(errorMessage, ERROR);
        });
}

function confirmDelete(id) {
    bootbox.confirm("Are you sure you want to delete this department?", function (result) {
        if (result) {
            deleteDepartment(id);
        }
    });
}

function deleteDepartment(id) {
    var token = sessionStorage.getItem("authToken");

    var settings = {
        async: true,
        crossDomain: true,
        cache: false,
        dataType: "json",
        url: APIURL + "/api/departments/" + id,
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    };

    $.ajax(settings)
        .done(function (response) {
            showMessageDialog("Department deleted successfully.", SUCCESS);
            loadDepartments();
        })
        .fail(function (xhr, textStatus, errorThrown) {
            showMessageDialog("Failed to delete department.", ERROR);
        });
}
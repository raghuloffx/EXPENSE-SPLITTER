

let people = JSON.parse(localStorage.getItem("people")) || [];
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function saveData() {
    localStorage.setItem("people", JSON.stringify(people));
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function startProject() {
    document.getElementById("home").style.display = "none";
    document.getElementById("groupSection").style.display = "block";
}


function addPerson() {
    let input = document.getElementById("name");
    let name = input.value.trim();

    if (name === "") {
        alert("Enter a roommate name!");
        return;
    }

    if (people.includes(name)) {
        alert("This name is already added!");
        return;
    }

    people.push(name);
    saveData();
    input.value = "";

    showPeople();
}

function showPeople() {
    let list = document.getElementById("people");
    list.innerHTML = "";

    people.forEach(person => {
        let item = document.createElement("li");
        item.appendChild(document.createTextNode(person + " "));

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Remove";

        deleteButton.onclick = function () {
            let hasExpenses = expenses.some(
                expense => expense.paidBy === person
            );

            if (hasExpenses) {
                alert(
                    "This roommate has paid expenses. " +
                    "Delete those expenses first."
                );
                return;
            }

            if (!confirm("Remove " + person + " from the group?")) {
                return;
            }

            people = people.filter(p => p !== person);
            saveData();
            showPeople();
        };

        item.appendChild(deleteButton);
        list.appendChild(item);
    });
}

function nextStep() {
    if (people.length < 2) {
        alert("Add at least 2 roommates!");
        return;
    }

    let select = document.getElementById("paidBy");
    select.innerHTML = "";

    people.forEach(person => {
        let option = document.createElement("option");
        option.value = person;
        option.textContent = person;
        select.appendChild(option);
    });

    document.getElementById("groupSection").style.display = "none";
    document.getElementById("expenseSection").style.display = "block";
}

function addExpense() {
    let name = document.getElementById("expenseName").value.trim();
    let amount = Number(document.getElementById("amount").value);
    let paidBy = document.getElementById("paidBy").value;

    if (name === "" || !Number.isFinite(amount) || amount <= 0) {
        alert("Enter an expense name and a valid amount!");
        return;
    }

    expenses.push({ name, amount, paidBy });
    saveData();

    document.getElementById("expenseName").value = "";
    document.getElementById("amount").value = "";

    showSummary();
}


function showSummary() {
    let total = 0;
    let paid = {};

    people.forEach(person => {
        paid[person] = 0;
    });

    let list = document.getElementById("expenseList");
    let balances = document.getElementById("balances");

    list.innerHTML = "";
    balances.innerHTML = "";

    expenses.forEach((expense, index) => {
        total += Number(expense.amount);
        paid[expense.paidBy] =
            (paid[expense.paidBy] || 0) + Number(expense.amount);

        let item = document.createElement("li");
        item.textContent =
            `${expense.name}: ₹${Number(expense.amount).toFixed(2)} — Paid by ${expense.paidBy} `;

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.onclick = function () {
            if (confirm("Delete this expense?")) {
                expenses.splice(index, 1);
                saveData();
                showSummary();
            }
        };

        item.appendChild(deleteButton);
        list.appendChild(item);
    });

    document.getElementById("total").textContent =
        `₹${total.toFixed(2)}`;

    document.getElementById("expenseCount").textContent =
        expenses.length;

    let share = people.length > 0 ? total / people.length : 0;

    document.getElementById("personShare").textContent =
        `₹${share.toFixed(2)}`;

    people.forEach(person => {
        let balance = paid[person] - share;
        let message;

        if (balance > 0.005) {
            message = `should receive ₹${balance.toFixed(2)}`;
        } else if (balance < -0.005) {
            message = `owes ₹${Math.abs(balance).toFixed(2)}`;
        } else {
            message = "is settled";
        }

        let item = document.createElement("li");
        item.textContent = `${person}: ${message}`;
        balances.appendChild(item);
    });
}

document.getElementById("enterGalaxy").addEventListener("click", function () {
    document.getElementById("welcomeScreen").style.display = "none";
    document.getElementById("home").style.display = "block";
});

function resetGroup() {
    if (!confirm("Delete all roommates and expenses?")) {
        return;
    }

    // Clear saved data
    people = [];
    expenses = [];
    localStorage.removeItem("people");
    localStorage.removeItem("expenses");

    // Clear lists
    document.getElementById("people").innerHTML = "";
    document.getElementById("expenseList").innerHTML = "";
    document.getElementById("balances").innerHTML = "";
    document.getElementById("paidBy").innerHTML = "";

    // Reset statistics
    document.getElementById("total").textContent = "₹0.00";
    document.getElementById("expenseCount").textContent = "0";
    document.getElementById("personShare").textContent = "₹0.00";

    // Clear input fields
    document.getElementById("name").value = "";
    document.getElementById("expenseName").value = "";
    document.getElementById("amount").value = "";

    // Return to roommates screen
    document.getElementById("expenseSection").style.display = "none";
    document.getElementById("groupSection").style.display = "block";
}
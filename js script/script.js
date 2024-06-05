document.addEventListener('DOMContentLoaded', function() {
    fetchRecords();

    document.getElementById('expenseForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        fetch('../../../workspace/Finance Tracker App/php script/process.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetchRecords();
                this.reset();
            } else {
                alert('Failed to add record');
            }
        });
    });

    function fetchRecords() {
        fetch('../../../workspace/Finance Tracker App/php script/process.php?action=fetch')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayRecords(data.records);
                displayTotals(data.totals);
            } else {
                alert('Failed to fetch records');
            }
        });
    }

    function displayRecords(records) {
        const recordsBody = document.getElementById('recordsBody');
        recordsBody.innerHTML = '';
        records.forEach(record => {
            const row = document.createElement('tr');
            row.id = 'row=' + record.id;
            row.innerHTML = `<td>${record.person}</td>
            <td>${record.amount}</td>
            <td>${record.purpose}</td>
            <td>${record.datetime}</td>
            <td><button onclick="deleteEntry('${record.id}')">Delete</button></td>`;
            recordsBody.appendChild(row);
        });
    }


    function displayTotals(totals) {
        const individualTotals = document.getElementById('individualTotals');
        individualTotals.innerHTML = '';
        for (const person in totals.individual) {
            const div = document.createElement('div');
            div.id = 'total-' + person;
            div.textContent = `${person}: ${totals.individual[person]}`;
            individualTotals.appendChild(div);
        }
        document.getElementById('grandTotal').textContent = totals.grand;
    }
});

function deleteEntry(id) {
    fetch ('../../../workspace/Finance Tracker App/php script/delete.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'id=' + id
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success'){
            console.log(data);
        let rowDel = document.getElementById('row=' + id);
        if (rowDel){
            rowDel.remove();
        }
        updatePersonTotal(data.person, -data.amount);
        updateGrandTotal(-data.amount);
    }       
    }
    )
    
}

function updatePersonTotal(person, amountChange) {
    const personTotalElement = document.getElementById('total-' + person);
    if (personTotalElement) {
        const currentTotal = parseFloat(personTotalElement.textContent) || 0;
        const newTotal = currentTotal + amountChange;
        personTotalElement.textContent = newTotal.toFixed(2);
    }
}


function updateGrandTotal(amountChange) {
    const grandTotalElement = document.getElementById('grandTotal');
    const currentTotal = parseFloat(grandTotalElement.textContent) || 0;
    const newTotal = currentTotal + amountChange;
    grandTotalElement.textContent = newTotal.toFixed(2);
}

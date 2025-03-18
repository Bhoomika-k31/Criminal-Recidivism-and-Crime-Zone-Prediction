// Show database and update URL
document.getElementById('report-icon').addEventListener('click', () => {
    history.pushState(null, '', '/home_page/view-database');

    // Fetch the CSV data
    fetch('synthetic_recidivism_data.csv')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.text();
        })
        .then(data => {
            // Parse and render the entire table initially
            renderTable(data);

            // Show the database modal
            document.getElementById('database-modal').classList.remove('hidden');
        })
        .catch(error => console.error('Error loading CSV:', error));
});

// Back button to return to the home page
document.getElementById('back-button').addEventListener('click', () => {
    history.pushState(null, '', '/home_page/');
    document.getElementById('database-modal').classList.add('hidden');
});

// Search functionality
document.getElementById('search-button').addEventListener('click', () => {
    const searchId = document.getElementById('search-id').value.trim(); // Input for Unique_ID
    fetch('synthetic_recidivism_data.csv')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.text();
        })
        .then(data => {
            const rows = data.split('\n').map(row => row.split(','));
            const headers = rows[0]; // Get the header row
            const filteredRows = rows.filter(row => row[0].trim() === searchId); // Match Unique_ID (column 0)

            if (filteredRows.length > 0) {
                // Render the filtered results (show all details)
                const tableHTML = `
                    <tr>${headers.map(header => `<th>${header.trim()}</th>`).join('')}</tr>
                    ${filteredRows.map(row => `
                        <tr>${row.map(col => `<td>${col.trim()}</td>`).join('')}</tr>
                    `).join('')}
                `;
                document.getElementById('database-table').innerHTML = tableHTML;
            } else {
                // Show "not found" message
                document.getElementById('database-table').innerHTML = `
                    <tr><td colspan="${headers.length}" style="text-align: center;">No results found for ID: ${searchId}</td></tr>
                `;
            }
        })
        .catch(error => console.error('Error loading CSV:', error));
});

// Render the full table
function renderTable(data) {
    const rows = data.split('\n');
    const tableHTML = rows.map((row, index) => {
        const cols = row.split(',');
        if (index === 0) {
            return `<tr>${cols.map(col => `<th>${col.trim()}</th>`).join('')}</tr>`;
        }
        return `<tr>${cols.map(col => `<td>${col.trim()}</td>`).join('')}</tr>`;
    }).join('');
    document.getElementById('database-table').innerHTML = tableHTML;
}

// Handle modal close (if close button exists)
document.getElementById('close-database')?.addEventListener('click', () => {
    history.pushState(null, '', '/home_page/');
    document.getElementById('database-modal').classList.add('hidden');
});

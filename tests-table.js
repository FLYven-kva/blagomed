document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('testsSearchInput');
    const tableBody = document.getElementById('testsTableBody');
    const tableEmpty = document.getElementById('testsTableEmpty');

    fetch('price.json')
        .then(response => {
            if (!response.ok) throw new Error('Ошибка загрузки: ' + response.statusText);
            return response.json();
        })
        .then(data => {
            // Фильтруем только валидные записи с кодом, названием и ценой
            const tests = data.Price
                .filter(item => item && item.Column2 && item.Column3 && item.Column4)
                .map(item => ({
                    code: item.Column2,
                    name: item.Column3,
                    price: item.Column4.replace(/\s+/g, ' ').trim()
                }));

            renderTable(tests);

            searchInput.addEventListener('input', function() {
                const searchTerm = searchInput.value.toLowerCase();
                const filtered = tests.filter(test =>
                    (test.name?.toLowerCase() || '').includes(searchTerm) ||
                    (test.code?.toLowerCase() || '').includes(searchTerm)
                );
                renderTable(filtered);
            });
        })
        .catch(error => {
            tableBody.innerHTML = `<tr><td colspan="3" class="text-danger">Ошибка загрузки данных</td></tr>`;
            tableEmpty.style.display = 'none';
        });

    function renderTable(tests) {
        tableBody.innerHTML = '';
        if (!tests.length) {
            tableEmpty.style.display = '';
            return;
        }
        tableEmpty.style.display = 'none';
        tests.forEach(test => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${test.code}</td>
                <td>${test.name}</td>
                <td>${test.price}</td>
            `;
            tableBody.appendChild(row);
        });
    }
}); 
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const servicesList = document.getElementById('servicesList');

    fetch('price.json')
        .then(response => {
            if (!response.ok) throw new Error('Ошибка загрузки: ' + response.statusText);
            return response.json();
        })
        .then(data => {
            // Фильтруем некорректные записи и преобразуем данные
            const services = data.Price
                .filter(service => service && service.Column2 && service.Column3 && service.Column4)
                .map(service => ({
                    code: service.Column2,
                    name: service.Column3,
                    price: service.Column4.replace(/\s+/g, ' ').trim()
                }));

            displayServices(services);

            searchInput.addEventListener('input', function() {
                const searchTerm = searchInput.value.toLowerCase();
                const filteredServices = services.filter(service => 
                    (service.name?.toLowerCase() || '').includes(searchTerm) ||
                    (service.code?.toLowerCase() || '').includes(searchTerm)
                );
                displayServices(filteredServices);
            });
        })
        .catch(error => {
            console.error('Ошибка:', error);
            servicesList.innerHTML = '<p>Ошибка загрузки данных</p>';
        });

    function displayServices(services) {
        servicesList.innerHTML = '';
        if (services.length === 0) {
            servicesList.innerHTML = '<p>Услуги не найдены</p>';
            return;
        }
        
        services.forEach(service => {
            const serviceItem = document.createElement('div');
            serviceItem.className = 'service-item';
            serviceItem.innerHTML = `
                <h2>${service.name || 'Нет названия'}</h2>
                ${service.code ? `<p>Код: ${service.code}</p>` : ''}
                <p>Цена: ${service.price}</p>
            `;
            servicesList.appendChild(serviceItem);
        });
    }
});
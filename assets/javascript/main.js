// Получаем элементы поиска
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

let searchResultsInLocalStorage = JSON.parse(localStorage.getItem('searchResults'))
let wordToHighlight = searchResultsInLocalStorage[searchResultsInLocalStorage.length]
highlightWords(wordToHighlight)

// Хранение найденных слов и их страниц
let searchResults = [];

// Функция для поиска слов на странице
function highlightWords(word) {
    if (!word) {
        return
    }
    const regex = new RegExp(word, "gi")
    const content = document.querySelector('body');
    debugger
    content.innerHTML = content.innerHTML.replace(regex, '<span class="highlight">$1</span>');
}

// Обработчик события на кнопку поиска
searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    if (!searchTerm) return;
    // Проверяем, есть ли результаты из localStorage
    const results = JSON.parse(localStorage.getItem('searchResults')) || {};
    debugger
    // Если результаты уже есть, переходим к следующему
    if (results[searchTerm]) {
        const { page, index } = results[searchTerm];
        debugger
        if (window.location.pathname !== "/"+page) {
            window.location.href = page; // Переход на страницу с результатами
        } else {
            
            const highlightedElements = document.querySelectorAll('.highlight');
            if (index < highlightedElements.length) {
                highlightedElements[index].scrollIntoView({ behavior: 'smooth' });
                results[searchTerm].index += 1; // Увеличиваем индекс
                localStorage.setItem('searchResults', JSON.stringify(results));
            } else {
                alert('Нет больше результатов.');
            }
        }
    } else {
        // Поиск по всем страницам
        searchResults = [];
        const allPages = ['/main.html', '/help.html', '/order.html']; // Список всех страниц

        allPages.forEach(page => {
            fetch(page)
                .then(response => response.text())
                .then(html => {
                    // let tempDiv = document.createElement('div');
                    // tempDiv.innerHTML = html;
                    // debugger
                    const contentText = html;

                    // Проверяем наличие слова на странице
                    if (contentText.toLowerCase().includes(searchTerm.toLowerCase())) {
                        searchResults.push(page);
                    }
                })
                .finally(() => {
                    if (searchResults.length > 0) {
                        results[searchTerm] = { page: searchResults[0], index: 0 };
                        localStorage.setItem('searchResults', JSON.stringify(results));
                        window.location.href = searchResults[0]; // Переход на первую найденную страницу
                        
                    } else {
                        alert('Слово не найдено на сайте.');
                    }
                });
        });
    }
});

// // Добавляем стили для выделения слов
// const style = document.createElement('style');
// style.innerHTML = 
//     .highlight = {
//         background-color: yellow; /* Цвет выделения */
//     }
// ;
// document.head.appendChild(style);

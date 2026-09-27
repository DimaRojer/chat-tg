Telegram Chat (тестовое задание Green API)

Стек

React + TS, React Router, Vite, SCSS

Запуск
npm install
npm run dev

Откроется на http://localhost:5173. При первом заходе кинет на /auth — там вводишь idInstance и apiTokenInstance от своего инстанса Green API (берутся в личном кабинете console.green-api.com). Всё хранится в localStorage.

Сборка: npm run build, посмотреть собранное — npm run preview.

Если надо почистить чаты или логин — в консоли браузера:

localStorage.removeItem("chats") // только чаты
localStorage.clear() // всё разом

и обновить страницу.

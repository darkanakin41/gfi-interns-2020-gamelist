const categoryList = $('#category-list')
const categoriesSelect = $('#categoriesSelect')
const gameList = $('#game-list')
let categories = []

function load(on) {
    const loader = $('#loader')
    if (on) {
        loader.removeClass('d-none')
    } else {
        loader.addClass('d-none')
    }
}

async function updateGames() {
    load(true)
    try {
        const response = await axios.get('http://localhost:3000/category')
        categoryList.html('')
        categories = response.data

        for (const category of categories) {
            categoryList.append(
                `<button type="button" data-id="${category.id}" class="list-group-item list-group-item-action category-button">${category.title}</button>`
            )
            categoriesSelect.append(
                `<option value="${category.id}">${category.title}</option>`
            )
        }
        $('.category-button').on('click', function() {
            gameList.html('')
            $('.category-button').removeClass('active')
            $(this).addClass('active')

            const categoryId = $(this).data('id')
            const category = categories.find(item => item.id == categoryId)
            for (const game of category.games) {
                gameList.append(
                    `<button type="button" data-id="${game.id}" class="list-group-item list-group-item-action game-button">${game.title}</button>`
                )
            }
        })
    } finally {
        load(false)
    }
}

$(document).ready(async function() {
    await updateGames()

    $('#addGame').on('click', async function() {
        const form = $('#addGameForm')
        const categoryId = $('#categoriesSelect').val()
        const gameTitle = $('#gameTitle').val()
        const category = categories.find(item => item.id == categoryId)
        category.games.push({ title: gameTitle })
        gameList.html('')

        try {
            load(true)
            await axios.put(`http://localhost:3000/category/${categoryId}`, category)
        } finally {
            load(false)
        }

        await updateGames()
    })
})
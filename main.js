/***********************************************************************************************************************
 *                                                  Fonctions
 ***********************************************************************************************************************/
let data = undefined

/**
 * Récupère les données auprès de l'API
 *
 * @param {boolean} force on force la récupération
 */
async function getData (force = false) {
  if (data === undefined || force) {
    let response = await axios.get('http://localhost:3000/category')
    data = response.data
    return data
  } else {
    return data
  }
}

/**
 * Met à jour le menu (div#navigation ul.menu) avec les données de l'API
 */
async function afficherLeMenu () {
  data = await getData(true);

  let $navigation = $('#navigation');
  $navigation.find('ul').remove();

  let $menu = $("<ul></ul>");
  $menu.addClass("menu");
  $menu.addClass("vertical");
  $menu.addClass("accordion-menu");
  $menu.attr("data-accordion-menu", "data-accordion-menu");

  // On vide le menu
  $menu.empty();

  data.forEach(function (item) {
    let $li = $('<li><a href="#"></a></li>')
    $li.find('a').text(item.title);

    let $submenu = $('<ul></ul>');
    $submenu.addClass('vertical');
    $submenu.addClass('menu');
    $submenu.addClass('nested');

    item.games.forEach(function (game) {
      let $gameLink = $('<li><a></a></li>');
      $gameLink.find('a').attr('href', game.url);
      $gameLink.find('a').attr('target', '_blank');
      $gameLink.find('a').text(game.title);

      $submenu.append($gameLink);
    })

    $li.append($submenu);

    $menu.append($li);
  });

  $navigation.append($menu);
  $menu.foundation();
}

/**
 * Récupère la catégorie souhaité, ou undefined si elle n'existe pas
 * @param {string} title
 * @returns {object|undefined} la catégorie ou undefined si elle n'existe pas
 */
async function getCategory (title) {
  let data = await getData()

  let categories = data.filter(function (item) {
    return item.title.toLowerCase() === title.toLowerCase()
  })

  if (categories.length === 0) {
    return undefined
  }

  return categories[0]
}

/**
 * Enregistre les modifications apportées à la catégorie
 * @param {object} category la catégorie à sauvegarder
 */
async function saveCategory (category) {
  if (category.id === undefined) {
    let data = await getData()
    category.id = data[data.length - 1].id + 1
    await axios.post('http://localhost:3000/category', category)
  } else {
    await axios.put('http://localhost:3000/category/' + category.id, category)
  }
}

/**
 * Réinitialise les fonctions du formulaire
 */
function resetForm(){
  $("#edit-form :input[type=text]").each(function(index, field){
    $(field).val("");
  });
}

$(document).ready(async function () {

  // Action sur le bouton de sauvegarde
  $('input[value=Valider]').on('click', async function (event) {
    event.preventDefault()

    const $categoryInput = $('.categoryInsert')
    const $urlInput = $('.urlInsert')
    const $gameInput = $('.titleInsert')

    let category = await getCategory($categoryInput.val())

    if (category === undefined) {
      category = {
        id: undefined,
        title: $categoryInput.val(),
        games: []
      }
    }

    category.games.push({
      title: $gameInput.val(),
      url: $urlInput.val()
    })

    resetForm();
    await saveCategory(category)
    await afficherLeMenu()
  });


  $('input[value=Supprimer]').on('click', async function (event) {
    event.preventDefault()

    const $categoryInput = $('.categoryInsert')
    const $gameInput = $('.titleInsert')

    let category = await getCategory($categoryInput.val())

    for(i = 0; i < category.games.length; i++){
      if (category.games[i].title.toLowerCase() === $gameInput.val().toLowerCase()) {
        category.games.splice(i, 1)
      }
    }

    if (category.games.length === 0) {
      await axios.delete('http://localhost:3000/category/' + category.id)
    } else {
      await saveCategory(category);
    }

    resetForm();
    await afficherLeMenu()
  })

  await afficherLeMenu()
})

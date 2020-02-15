$(document).ready( function() {
	let data = [];

	async function afficherLeMenu(){
		let response = await axios.get('http://localhost:3000/category')
		let	data = response.data
		let mainList = $('.main-list')
		mainList.empty()
		
		let i = 0
		while (i < data.length) {
			let j = 0
			let code = `<li><a href="#">${data[i].title}</a><ul>`
			while (j < data[i].games.length) {
				code += `<li><a href="${data[i].games[j].url}" target="_blank">${data[i].games[j].title}</a></li>`
				j++
			}
			code = code + `</ul></li>`
			mainList.append(code)

			i++
		}


		$('ul.main-list > li > a').on('click', function() {
			let parent = $(this).parent()

			if (parent.hasClass('sous-menu')) {
				parent.removeClass('sous-menu')
			} else {
				$('.sous-menu').removeClass('sous-menu')
				parent.addClass('sous-menu')
			}
		})	
	}
	
	$('#edit-form').submit(function(event) {
	  event.preventDefault()
	  const category = $(this).find('.categoryInsert').val()
	  const game = $(this).find('.titleInsert').val()

	  console.log(category, game)
	})

	$('input[value=Valider]').on('click', async function(event){
		event.preventDefault();
		
		let response = await axios.get('http://localhost:3000/category')
		let	data = response.data

		const categoryFormulaire = $('.categoryInsert').val()
		const urlFormulaire = $(".urlInsert").val()
		const gameFormulaire = $(".titleInsert").val()

		let postData = {
			id: data.length + 1,
			title: categoryFormulaire,
			games: [
			{
				title: gameFormulaire,
				url: urlFormulaire,
			}
			]
		}

		await axios.post('http://localhost:3000/category', postData)

		afficherLeMenu();
	});	


	$('input[value=Supprimer]').on('click', async function(event){
		event.preventDefault();

		const categoryFormulaire = $('.categoryInsert').val()
		const urlFormulaire = $(".urlInsert").val()
		const gameFormulaire = $(".titleInsert").val()

		let response = await axios.get('http://localhost:3000/category')
		let data = response.data

		let categoryTrouve = undefined;
		let i = 0;

		while(i < data.length){
			if (data[i].title == categoryFormulaire){
				categoryTrouve = data[i];
			}

			i++;
		}

		i = 0;

		while(i < categoryTrouve.games.length){
			if(categoryTrouve.games[i].title == gameFormulaire){
				categoryTrouve.games.splice(i, 1);
	
			}
			i++;
		}

		if(categoryTrouve.games.length == 0){
			axios.delete("http://localhost:3000/category/" + categoryTrouve.id);
		}else{
			axios.put("http://localhost:3000/category/" + categoryTrouve.id, categoryTrouve);
		}

		afficherLeMenu();
	});

	afficherLeMenu()

})
              
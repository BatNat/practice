var fs = require('fs');

var builder = (function(){
	var basePath = 'dist/pages/';
	var indexFile = 'app/index/index.html';

	// читаем директорию
	var readDir = function(){
		return fs.readdirSync(basePath);
	};

	// формируем объект путь:тайл
	var getPagesList = function() {
		var pagesList = {};

		var files = readDir();

		files.forEach(function (file) {
			var
				path = basePath + file;

			var fileContent = fs.readFileSync(path, 'utf-8');

			var
				regExp = /<title>(.*)<\/title>/gmi,
				matches = regExp.exec(fileContent),
				title = matches[1],
				pathToPage = 'pages/' + file;

			pagesList[pathToPage] = title;
		});

		return pagesList;
	};

	// генерируем лишки
	var generateMarkupForList = function(){
		var pagesList = getPagesList();
		var linksList = "";
		var i = 1;

		for (var page in pagesList) {

			var markup = "<li>" +
								"<a href='" + page + "'>" + i + '. ' + pagesList[page] + "</a>" +
							"<li>";

			linksList += markup;
			i++;
		}

		return linksList;
	}

	// разметка для списка
	var generateWrapMarkup = function(markup) {
		var markup = '<ul class="makeups_list">' + markup + '</ul>';

		return markup
	};

	//читаем индекс и вставляем разметку в список
	var generateIndexHtml = function(){
		var indexMarkup = fs.readFileSync(indexFile, 'utf-8');
		var pagesMarkups = generateMarkupForList();
		var regExp = /<ul class="makeups_list">(.*)<\/ul>/gmi;

		return indexMarkup.replace(regExp, generateWrapMarkup(pagesMarkups));
	}

	return {
		init: function(){
			fs.writeFile('app/index/index.html', generateIndexHtml()); //вставляем в нее разметку
			fs.createReadStream(indexFile).pipe(fs.createWriteStream('dist/index.html')); // копируем заготовку
		}
	}
}());

builder.init();
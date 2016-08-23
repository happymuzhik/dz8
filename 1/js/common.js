;(function(w, document, undefined){

w.Ajax = function(url){
	return new Promise(function(resolve, reject){
		let req = new XMLHttpRequest();
		req.open('GET', url, true);
		req.responseType = 'json';
		req.addEventListener('load', function() {
  			resolve(req.response);
		});
		req.addEventListener('error', function() {
  			reject();
		});
		req.send();
  	});
};

})(window, document);

;(function(w, document, undefined){

let search_arr = null;
let allow_search = false;
let input = document.getElementById('cities_input');
let timer = false
let city_template = Handlebars.compile(document.getElementById('city_template').innerHTML);

let draw_el = function(name){
	let el = city_template({name:name});
	let buf = document.createElement('div');
	buf.innerHTML = el;
	return buf.firstElementChild;
};

let draw_res = function(arr){
	container = document.getElementById('res_cont');
	container.innerHTML = '';
	arr.sort(function (a, b) {
		if (a.name > b.name) {return 1;}
		if (a.name < b.name) {return -1;}
		return 0;
	});
	for (let i = 0; i < arr.length; i++){		
		container.appendChild(draw_el(arr[i].name));
	};
};

let debounce = function(time){
	return new Promise(function(resolve, reject){
		if (timer){
			clearTimeout(timer);
		}
		timer = setTimeout(function(){
			resolve();
			clearTimeout(timer);
		}, time);
	});
};

let url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';
Ajax(url).then(
	function(response){
		search_arr = response;
		allow_search = true;
		draw_res(search_arr);
	}
);

input.addEventListener('input', function(){
	let str = this.value;
	if(allow_search){
		debounce(500).then(
			function(){
				let res = [];
				if(str.trim().length > 0){
					for (let i = 0; i < search_arr.length; i++) {
						if (search_arr[i].name.toUpperCase().indexOf(str.toUpperCase())>-1){
							res.push(search_arr[i]);
						}
					};
				}else{
					res = search_arr;
				}				
				draw_res(res);
			}
		);
	}
});

input.focus();

})(window, document);
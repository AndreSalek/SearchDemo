let form = document.getElementById('googleBtn');
let downlBtn = document.getElementById('downloadBtn');

form.addEventListener('click', sendRequest)
downlBtn.addEventListener('click', downloadResults)

function sendRequest(e) {
	flushElements();
	let query = document.getElementById('query');
	let url = '/search'
	let headers = {
		method: 'GET',
		headers: {
			'Content-Type': 'text/html'
		}
	}
	let urlData = new URLSearchParams({
		q: query.value
	})
	// Fetch data manually
	fetch(url + '?' + urlData, headers)
		.then(result => {
			result.json().then(jsonObj => {
				if (result.ok) {
					showResult(jsonObj);
					show(downlBtn, 'inline-block');
				}
				else if (result.status >= 400) {
					hide(downlBtn)
					displayError(jsonObj.error)
				};
			})
		})
		.catch(err => {
			hide(downlBtn);
			displayError('An error occcured while displaying data.');
		}) 

		
}

function downloadResults() {
	let content = document.getElementById('results');
	let fileName = 'results.xml';

	if (content.innerHTML === '') {
		hide(downlBtn);
		displayError('There are no results to be displayed');
	}

	// This serializes elements into 1 line string 
	let xmlString = new XMLSerializer().serializeToString(content);
	const blob = new Blob([xmlString], { type: "application/xml" });
	let url = window.URL.createObjectURL(blob);

	let element = document.createElement('a');
	element.setAttribute('href', url);
	element.setAttribute('download', fileName);
	element.style.display = 'none';

	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}

function showResult(jsonObject) {
	let content = document.getElementById('results');

	for (let i = 0; i < jsonObject.items.length; i++) {
		let item = jsonObject.items[i];
		let wrapper = document.createElement('div');
		wrapper.id = 'searchItem';
		wrapper.className = 'item';

		// HEADER - clickable link
		let headerLink = document.createElement('a');
		headerLink.href = item.link;
		let image = document.createElement('img');
		// Check multiple locations for image path and use the first not null
		image.src = !(item.pagemap.metatags[0] === null) ? item.pagemap.metatags[0]['og:image'] :
					!(item.pagemap.cse_thumbnail === null) ? item.pagemap.cse_thumbnail[0].src :
					!(item.pagemap.cse_image === null) ? item.pagemap.cse_image[0].src :
					"";
		image.width = 25;
		image.height = 25;
		image.style.display = 'inline-flex';

		let siteName = document.createElement('div');
		siteName.textContent = item.pagemap.metatags[0]['og:site_name'] ?? '';
		siteName.style.display = 'block';

		let lineupWrapper = document.createElement('div');
		lineupWrapper.style.display = 'flex'

		let lineupWrapper2 = document.createElement('div');
		lineupWrapper2.style.display = 'block'

		let siteUrl = document.createElement('div');
		siteUrl.textContent = item.link;
		
		let title = document.createElement('div');
		title.innerHTML = item.htmlTitle;

		// SNIPPET - content description
		let snippet = document.createElement('div');
		snippet.innerHTML = item.snippet;

		// Append to correct nodes
		lineupWrapper2.append(siteName, siteUrl)
		lineupWrapper.append(image, lineupWrapper2)
		headerLink.append(lineupWrapper, title);
		wrapper.append(headerLink, snippet)
		content.append(wrapper);
	}
}

function flushElements() {
	let content = document.getElementById('results');
	let warning = document.getElementById('errors');
	content.innerHTML = '';
	warning.innerHTML = '';
}

function displayError(err) {
	let warning = document.getElementById('errors');
	warning.innerHTML = err;
}

function show(x, displaystyle) {
	return x.style.display === 'none' ? x.style.display = displaystyle ?? 'block' : false
}

function hide(x) {
	return x.style.display === 'block' ? x.style.display = 'none' : false;
}

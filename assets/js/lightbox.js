/*!
 * With the help of https://github.com/jhvanderschee/jekyllcodex
 * Licensed under the MIT license - https://opensource.org/licenses/MIT
 * Copyright (c) since 2021 Natalia Stanko
 */
 
function is_youtubelink(url) {
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return (url.match(p)) ? RegExp.$1 : false;
}
function is_imagelink(url) {
    var p = /([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/i;
    return (url.match(p)) ? true : false;
}
// function is_vimeolink(url,el) {
//     var id = false;
//     var xmlhttp = new XMLHttpRequest();
//     xmlhttp.onreadystatechange = function() {
//         if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
//             if (xmlhttp.status == 200) {
//                 var response = JSON.parse(xmlhttp.responseText);
//                 id = response.video_id;
//                 // console.log(id);
//                 el.classList.add('lightbox-vimeo');
//                 el.setAttribute('data-id',id);

//                 el.addEventListener('click', function(event) {
//                     event.preventDefault();
//                     document.getElementById('lightbox').innerHTML = '<a id="close"></a><a id="next">&rsaquo;</a><a id="prev">&lsaquo;</a><div class="videoWrapperContainer"><div class="videoWrapper"><iframe src="https://player.vimeo.com/video/'+el.getAttribute('data-id')+'/?autoplay=1&byline=0&title=0&portrait=0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div></div>';
//                     document.getElementById('lightbox').style.display = 'block';

//                     setGallery(this);
//                 });
//             }
//             else if (xmlhttp.status == 400) {
//                 alert('There was an error 400');
//             }
//             else {
//                 alert('something else other than 200 was returned');
//             }
//         }
//     };
//     xmlhttp.open("GET", 'https://vimeo.com/api/oembed.json?url='+url, true);
//     xmlhttp.send();
// }
function setGallery(el) {

    // remove the active lightbox
    document.getElementById('lightbox').addEventListener('click', function(cEvent) {
        if (cEvent.target.id != 'next' && cEvent.target.id != 'prev') {
            exitGallery();
        }
    });

    /**
     * remove the active lightbox
     */
    function exitGallery() {
        this.innerHTML = '<div id="lightbox"><a id="close"></a><a id="next">&rsaquo;</a><a id="prev">&lsaquo;</a></div>';
        document.getElementById('lightbox').style.display = 'none';
        document.removeEventListener('keydown', hadleKeyboardNavigation, false);
    };

    var elements = document.body.querySelectorAll('.gallery');
    elements.forEach(element => {
        element.classList.remove('gallery');
	});

	if (el.closest('ul, p')) {
		var link_elements = el.closest('ul, p').querySelectorAll("a[class*='lightbox-']");
		link_elements.forEach(link_element => {
			link_element.classList.remove('current');
		});
		link_elements.forEach(link_element => {
			if (el.getAttribute('href') == link_element.getAttribute('href')) {
				link_element.classList.add('current');
			}
		});

		if (link_elements.length>1) {
			document.getElementById('lightbox').classList.add('gallery');
			link_elements.forEach(link_element => {
				link_element.classList.add('gallery');
			});
		}

		var currentkey;
		var gallery_elements = document.querySelectorAll('a.gallery');

		Object.keys(gallery_elements).forEach(function (k) {
			if (gallery_elements[k].classList.contains('current')) currentkey = k;
		});

		if (currentkey==(gallery_elements.length-1)) {
            var nextkey = 0;
        } else {
            var nextkey = parseInt(currentkey)+1;
        }

		if (currentkey==0) {
            var prevkey = parseInt(gallery_elements.length-1);
        } else {
            var prevkey = parseInt(currentkey)-1;
        }

        /* getElementById click events are destroyed everytime the #lighbox is deleted */

		document.getElementById('next').addEventListener('click', function() {
			gallery_elements[nextkey].click();
		});

		document.getElementById('prev').addEventListener('click', function() {
			gallery_elements[prevkey].click();
		});

        var hadleKeyboardNavigation = function(KeyboardEvent) {
            if (KeyboardEvent.key == 'Escape') {
                KeyboardEvent.preventDefault();
                exitGallery();
            }
            if (KeyboardEvent.key == 'ArrowLeft') {
                KeyboardEvent.preventDefault();
			    gallery_elements[prevkey].click();
            }
            // right arrow
            if (KeyboardEvent.key == 'ArrowRight') {
                KeyboardEvent.preventDefault();
                gallery_elements[nextkey].click();

            }
            if (KeyboardEvent.key !== undefined) {
                // Handle the event with KeyboardEvent.key and set handled true.

                KeyboardEvent.preventDefault();
            }
            document.removeEventListener('keydown', hadleKeyboardNavigation, false);
        };
        document.addEventListener('keydown', hadleKeyboardNavigation, false);
	}
}

document.addEventListener("DOMContentLoaded", function() {

    // create lightbox div in the footer
    var newdiv = document.createElement('div');
    newdiv.setAttribute('id',"lightbox");
    document.body.appendChild(newdiv);

    
    // display the lightbox on click
    var elements = document.querySelectorAll('a.lightbox-image');
    elements.forEach(element => {
        element.addEventListener('click', function(event) {
            event.preventDefault();

            // add navigation
            document.getElementById('lightbox').innerHTML = '<a id="close"></a><a id="next">&rsaquo;</a><a id="prev">&lsaquo;</a><div id="title"></div>';

            const imagediv = document.createElement('div');
            const style = "url(" + this.getAttribute('href') + ") center center / contain no-repeat";
            imagediv.setAttribute('class', 'img');
            imagediv.style.background = style;
            imagediv.setAttribute('title', this.getAttribute('title'));

            const image = document.createElement('img');
            image.setAttribute('alt', this.getAttribute('title'));
            image.setAttribute('src', this.getAttribute('href'));

            imagediv.appendChild(image);
            document.getElementById('lightbox').appendChild(imagediv);
            
            const titleInner = document.createElement('span');
            titleInner.appendChild(document.createTextNode(this.getAttribute('title')));
            document.getElementById('title').appendChild(titleInner);

            document.getElementById('lightbox').style.display = 'block';
            setGallery(this);
        });
    });

    // add the youtube lightbox on click
    // var elements = document.querySelectorAll('a.lightbox-youtube');
    // elements.forEach(element => {
    //     element.addEventListener('click', function(event) {
    //         event.preventDefault();
    //         document.getElementById('lightbox').innerHTML = '<a id="close"></a><a id="next">&rsaquo;</a><a id="prev">&lsaquo;</a><div class="videoWrapperContainer"><div class="videoWrapper"><iframe src="https://www.youtube.com/embed/'+this.getAttribute('data-id')+'?autoplay=1&showinfo=0&rel=0"></iframe></div>';
    //         document.getElementById('lightbox').style.display = 'block';
    //         setGallery(this);
    //     });
    // });

});
function getReady() {
	var sects = document.getElementsByClassName("secTitle");
	var i;
	// section title buttons
	for (i = 0; i < sects.length; i++) {
		sects[i].addEventListener("click", function() {
			/* Toggle between adding and removing the "active" class,
			to highlight the button that controls the panel */
			this.classList.toggle("active");

			/* Toggle between hiding and showing the active panel */
			var panel = this.nextElementSibling;
			if (panel.style.display === "block") {
				panel.style.display = "none";
				panel.setAttribute("aria-hidden", "true");
				this.setAttribute("aria-expanded", "false");
				this.children[0].rows[0].cells[0].children[0].innerHTML = "&plus;";
				document.getElementById("messages").textContent = "Section was collapsed.";
			} else {
				panel.style.display = "block";
				panel.setAttribute("aria-hidden", "false");
				this.setAttribute("aria-expanded", "true");
				document.getElementById("messages").textContent = "Section was expanded.";
				this.children[0].rows[0].cells[0].children[0].innerHTML = "&minus;";
			}
		});
	}
	
	// keyboard shortcuts
	window.addEventListener('keydown', function (e){
		if (e.keyCode == 69 && document.getElementById("expandBtn")) {  // e or E
			document.getElementById("expandBtn").click();
		} else if (e.keyCode == 67 && document.getElementById("collapseBtn")) {  // c or C
			document.getElementById("collapseBtn").click();
		} else if (e.keyCode == 65 && document.getElementById("accessBtn")) {  // a or A
			document.getElementById("accessBtn").click();
		}
	})
}

expandAll = function() {
	var sects = document.getElementsByClassName("secTitle");
	for (i = 0; i < sects.length; i++) {
		var panel = sects[i].nextElementSibling;
		panel.style.display = "block";
		panel.setAttribute("aria-hidden", "false");
		sects[i].setAttribute("aria-expanded", "true");
		sects[i].children[0].rows[0].cells[0].children[0].innerHTML = "&minus;";
	}
	document.getElementById("messages").textContent = "All sections were expanded.";
}

collapseAll = function() {
	var sects = document.getElementsByClassName("secTitle");
	for (i = 0; i < sects.length; i++) {
		var panel = sects[i].nextElementSibling;
		panel.style.display = "none";
		panel.setAttribute("aria-hidden", "true");
		sects[i].setAttribute("aria-expanded", "false");
		sects[i].children[0].rows[0].cells[0].children[0].innerHTML = "&plus;";
	}
	document.getElementById("messages").textContent = "All sections were collapsed.";
}
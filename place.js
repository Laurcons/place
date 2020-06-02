

// game constants
var boardSize = 500;
var colors = [
	"#FFFFFF",
	"#E4E4E4",
	"#888888",
	"#222222",
	"#FFA7D1",
	"#E50000",
	"#E59500",
	"#A06A42",
	"#E5D900",
	"#94E044",
	"#02BE01",
	"#00D3DD",
	"#0083C7",
	"#0000EA",
	"#CF6EE4",
	"#820080"
];
var refreshRate = 0.5 * 1000; // in milliseconds

// other variables
var tiles = [];
var offsetX = 0, offsetY = 0;
var scaling = 2;
var scalingRange = {max: 40, min: 2};
var selectedColor = 0;
var dragStart;
var isMouseHeld = false;
var preDragOffset;
var requestCode;
var tilePlacementDisabled = false;
var timeoutRemaining = 0;
var totalTimeout;
var mousePos;

$(document).ready(function() {

	$("#place-canvas")[0].getContext("2d")
		.imageSmoothingEnabled = false;

	$("#place-canvas")
		.attr("height", boardSize + "px")
		.attr("width", boardSize + "px");

	applyOffset();
	applyScaling();

	// place the color selector buttons
	$("#color-buttons").empty();
	colors.forEach(function(color, index) {

		$("#color-buttons")
			.append(
				$("<button>")
					.addClass("btn-color")
					.css("background-color", color)
					.css("display", "inline")
					.attr("data-color", index)
					.html("")
					.click(function() {
						// change color
						selectedColor = $(this).data("color");
						// put X wherever
						$(".btn-color").html("");
						$(this).html("<h2>X</h2>");
						// display
						$("#selected-color")
							.html(colors[selectedColor])
							.css("background-color", colors[selectedColor]);
					}));

	});
	$("button.btn-color[data-color=3]").trigger("click");

	// auto update
	setInterval(updateBoard, refreshRate);

	ajax_allTiles();

	$("#reset-board-btn").click(function() {

		offsetX = offsetY = 0;
		scaling = 2;
		applyOffset();
		applyScaling();

	});

	$("#canvas-div").on("DOMMouseScroll mousewheel", function(event) {

		event.preventDefault();

		var middle = {
			x: $("#canvas-div").width() / 2,
			y: $("#canvas-div").height() / 2
		};
		var canvSize = {
			x: $("#canvas-div").width(),
			y: $("#canvas-div").height()
		};


		if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
	    	if (scaling >= scalingRange.max)
	    		return;
		    // scroll up (zoom in)
		    scaling *= 2;
		    // move the canvas, correct for the zoom
		    // WARNING TO WHOEVER MIGHT HAVE TO UPDATE THESE TWO LINES OF CODE
		    // this code was an absolute pain to write. and i just kinda
		    //  happened to get it right after A DAY of code changing.
		    // just don't touch it.
		    // same applies for the other side (zoom out)
		    offsetX -= mousePos.x - offsetX;
		    offsetY -= mousePos.y - offsetY;
	    }
	    else {
	    	if (scaling <= scalingRange.min)
	    		return;
	        // scroll down (zoom out)
	        scaling /= 2;
		    // move the canvas, correct for the zoom
		    offsetX += parseInt((mousePos.x - offsetX) / 2);
		    offsetY += parseInt((mousePos.y - offsetY) / 2);
	    }

	    applyOffset();
	    applyScaling();

	});

	$("#canvas-div").on("mousedown", function(event) {

		dragStart = screenToDiv("#canvas-div", event.pageX, event.pageY);
		preDragOffset = {
			x: offsetX,
			y: offsetY
		};
		isMouseHeld = true;

	});

	$("#canvas-div").on("mousemove", function(event) {

		//console.log(screenToDiv("#canvas-div", event.pageX, event.pageY));
		mousePos = {
			x: event.pageX,
			y: event.pageY
		};

		if (!isMouseHeld)
			return;

		// figure out the distance the mouse covered, and decide between a click or a drag
		var dragEnd = screenToDiv("#canvas-div", event.pageX, event.pageY);

		var dragDistance =
			Math.sqrt(Math.pow(dragEnd.x - dragStart.x, 2) + Math.pow(dragEnd.y - dragStart.y, 2));

		if (dragDistance >= 5) {
			offsetX = preDragOffset.x + (dragEnd.x - dragStart.x);
			offsetY = preDragOffset.y + (dragEnd.y - dragStart.y);

			applyOffset();
		}

	});

	$("#canvas-div").on("mouseup", function(event) {

		isMouseHeld = false;

		// figure out the distance the mouse covered, and decide between a click or a drag
		var dragEnd = screenToDiv("#canvas-div", event.pageX, event.pageY);
		var dragDistance =
			Math.sqrt(Math.pow(dragEnd.x - dragStart.x, 2) + Math.pow(dragEnd.y - dragStart.y, 2));

		if (dragDistance < 5 && !tilePlacementDisabled) {
			var coords = dragStart;
			// is a click
			// determine the clicked tile and change its color visually, and send the xhr
			coords.x -= offsetX;
			coords.y -= offsetY;
			coords.x = parseInt(coords.x / scaling);
			coords.y = parseInt(coords.y / scaling);
			coords.x -= parseInt($("#place-canvas").css("border-left-width"));
			coords.y -= parseInt($("#place-canvas").css("border-top-width"));
			// check if the click was outside the board
			if (coords.x >= boardSize || coords.x < 0 ||
				coords.y >= boardSize || coords.y < 0)
				return;
			// set color
			var oldColor = tiles[coords.x][coords.y];
			tiles[coords.x][coords.y] = selectedColor;
			// send xhr
			ajax_sendTile(coords, oldColor);
			// visually redraw
			redrawTile(coords);

		}

	});

	$(window).on("keydown", function(e) {

		//console.log(e.which);

		if (e.which == 40) { // down

			console.log("down");
			offsetY -= 20;

		} else if (e.which == 39) { // right

			console.log("right");
			offsetX -= 20;

		} else if (e.which == 38) { // up

			console.log("up");
			offsetY += 20;

		} else if (e.which == 37) { // left

			console.log("left");
			offsetX += 20;

		}

		applyOffset();

	});

});

function redrawAllTiles() {

	clearCanvas();

	var ctx = $("#place-canvas")[0].getContext("2d");

	var imageData = ctx.createImageData(boardSize, boardSize);
	var i = 0;

	for (ty = 0; ty < boardSize; ty++) {
		for (tx = 0; tx < boardSize; tx++) {

			var colorHashtag = colors[tiles[tx][ty]];
			var colorHex = "0x" + colorHashtag.split("#").join("");
			var colorNum = parseInt(colorHex);

			imageData.data[i+0] = (colorNum & 0xFF0000) >> 16;
			imageData.data[i+1] = (colorNum & 0x00FF00) >> 8;
			imageData.data[i+2] = (colorNum & 0x0000FF);
			imageData.data[i+3] = 255;

			i+=4;

		}
	}

	ctx.putImageData(imageData, 0, 0);

	applyOffset();

}

function applyOffset() {

	$("#offset-span")
		.html(offsetX + " " + offsetY);
	$("#canvas-pan-div")
		.css("top", offsetY + "px")
		.css("left", offsetX + "px");

}

function applyScaling() {

	$("#scaling-span")
		.html(scaling);
    $("#canvas-zoom-div")
    	.css("transform", "scale(" + scaling + ")");

}

function redrawTile(pos) {

	var canvas = $("#place-canvas");
	var ctx = canvas[0].getContext("2d");

	cx = pos.x;
	cy = pos.y;

	// draw
	ctx.fillStyle = colors[tiles[pos.x][pos.y]];
	ctx.fillRect(cx, cy, 1, 1);

}

function clearCanvas() {

	var canvas = $("#place-canvas")[0];
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

}

function screenToCanvas(pageX, pageY) {

    return screenToDiv("#place-canvas", pageX, pageY);

}

function screenToDiv(selector, pageX, pageY) {

    var rect = $(selector)[0].getBoundingClientRect();
    return {
      x: parseInt(pageX - rect.left),
      y: parseInt(pageY - rect.top)
    };

}

function ajax_allTiles() {

	$.ajax({
		url: "/place/api/all-tiles",
		method: "GET",
		dataType: "json",
		//data: ,
		success: function(result) {
	
			if (result.status == "success") {

				requestCode = result.request_code;
				totalTimeout = result.timeout * 1000;
	
				for (y = 0; y < boardSize; y++) {
					var row = [];
					for (x = 0; x < boardSize; x++) {
						row[x] = 0;
					}
					tiles[y] = row;
				}

				result.tiles.forEach(function(tile, index) {

					if (tile.X < boardSize && tile.Y < boardSize)
						tiles[tile.X][tile.Y] = tile.Color;

				});

				redrawAllTiles();
	
			} else {
				console.error("AJAX status: " + result.status);
			}
	
		},
		error: function(req, err) {
			console.error("AJAX error: " + err);
		},
		complete: function() {
	
		}
	
	});

}

function ajax_sendTile(position, oldColor) {

	tilePlacementDisabled = true;
	$.ajax({
		url: "/place/api/send-tile",
		method: "POST",
		dataType: "json",
		//data: "tile=" + selectedColor + "&x=" + position.x + "&y=" + position.y,
		data: arrayToFormData([["tile", selectedColor],["x", position.x], ["y", position.y], ["req", requestCode]]),
		success: function(result) {
	
			if (result.status == "success") {
	
				// enable countdown timeout thing
				timeoutRemaining = totalTimeout;

			} else if (result.status == "timeout-denied") {

				// revert tile
				tiles[position.x][position.y] = oldColor;
				redrawTile(position);
	
			} else {
				console.error("AJAX status: " + result.status);
			}
	
		},
		error: function(req, err) {
			console.error("AJAX error: " + err);
		},
		complete: function() {
			tilePlacementDisabled = false;
		}
	
	});

}

function ajax_newTiles() {

	$.ajax({
		url: "/place/api/new-tiles",
		method: "POST",
		dataType: "json",
		//data: "req=" + requestCode,
		data: arrayToFormData([["req", requestCode]]),
		success: function(result) {
	
			if (result.status == "success") {

				result.tiles.forEach(function(tile) {

					tiles[tile.X][tile.Y] = tile.Color;
					redrawTile({
						x: tile.X,
						y: tile.Y
					});
					console.log("New tiles");

				});
	
			} else {
				console.error("AJAX status: " + result.status);
			}
	
		},
		error: function(req, err) {
			console.error("AJAX error: " + err);
		},
		complete: function() {
	
		}
	
	});

}

function updateBoard() {

	if (timeoutRemaining >= 0) {
		timeoutRemaining -= refreshRate;
		var timeoutInt = parseInt(timeoutRemaining / 1000);
		$("#timeout-span")
			.html("You have to wait another " + timeoutInt + " seconds!")
			.css("background-color", "");
	} else {
		$("#timeout-span")
			.html("You can now place any tile anywhere!")
			.css("background-color", "rgb(2, 190, 1)");
	}
	ajax_newTiles();

}

function arrayToFormData(array) {

	var output = "";
	var length = array.length;
	array.forEach(function(item, index) {

		var elem = item[0];
		elem += "=";
		elem += item[1];
		if (index != length - 1)
			elem += "&";
		output += elem;

	});
	return output;

}
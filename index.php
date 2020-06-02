<!DOCTYPE html>
<html>
<head>
	<title>Laurcons/place</title>
	<link rel="stylesheet" href="style.css">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
</head>

<body>

	<div style="/*margin-left: 4vw; width: 1280px;*/ text-align: center;">

		<h1>Laurcons/place</h1>

		There is a canvas of 500x500 pixels.<br>
		Individually you can create something.<br>
		Together you can create something more.<br>


	</div>

	<div id="canvas-container">

		<table id="canvas-table" border="1px" style="border-collapse: collapse; padding: 10pt;">

			<tr>

				<td rowspan="3">

					<div id="canvas-div">

						<div id="canvas-pan-div">

							<div id="canvas-zoom-div">

								<canvas id="place-canvas">

								</canvas>

							</div>

						</div>

					</div>

					<div id="color-buttons" style="border: 1px solid; border-top: 0px; text-align: center;">

					</div>

				</td>
				<td style="vertical-align: top;">

					Selected color is: <span id="selected-color"></span><br>

					<span id="timeout-span"></span><br>

					Debug: Offset: <span id="offset-span"></span> Scaling: <span id="scaling-span"></span><br>

					<button id="reset-board-btn">Reset the board position</button> 

				</td>

			</tr>
			<tr>
				<td height="50%" style="border-top: 1px dashed; vertical-align: top;">
					Use the mouse (or the arrow keys) to move around the canvas.<br>
					Use the mouse wheel to zoom around.<br>
					Click to place a tile.<br>
					Wait and observe.
				</td>
			</tr>
			<tr>
				<td height="20%" style="border-top: 1px dashed; vertical-align: top;">
					This game was inspired by Reddit's 2017 April Fools, r/place.<br>
					A YouTube timelapse music video can be found <a href="https://www.youtube.com/watch?v=c8bp950PHZE" target="_blank">here</a>.<br>
					You can check out the subreddit <a href="https://reddit.com/r/place" target="_blank">here</a>.<br>
					Read more about r/place on <a href="https://en.wikipedia.org/wiki/Place_(Reddit)" target="_blank">Wikipedia</a>.<br>
					The blog post about how Reddit did r/place, which was an immense help while building Laurcons/place, can be found <a href="https://redditblog.com/2017/04/13/how-we-built-rplace/" target="_blank">here</a>.
				</td>
			</tr>

		</table>

	</div>

</body>

<script src="place.js"></script>

</html>
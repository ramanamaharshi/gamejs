<html>
	<head>
		<title>--</title>
		<meta charset="UTF-8">
	</head>
	<body>
		<?php
			$aIncludeFiles = array();
			$aIncludeFolders = array('framework', 'classes');
			foreach ($aIncludeFolders as $sIncludeFolder) {
				$aFiles = scandir($sIncludeFolder);
				foreach ($aFiles as $sFile) {
					if (preg_match('/\.js$/', $sFile)) {
						$aIncludeFiles []= '/' . $sIncludeFolder . '/' . $sFile;
					}
				}
			}
			foreach ($aIncludeFiles as $sIncludeFile) {
				echo "\n" . '<script type="text/javascript" src="' . $sIncludeFile . '"></script>';
			}
		?>
		<script type="text/javascript" src="/main.js"></script>
	</body>
</html>
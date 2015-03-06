<html>
	<head>
		<title>--</title>
		<meta charset="UTF-8">
	</head>
	<body>
		<?php
			
			function aListFiles ($sDir) {
				$aFiles = array();
				$aScanFiles = scandir($sDir);
				foreach ($aScanFiles as $sScanFile) {
					if ($sScanFile == '..' || $sScanFile == '.') continue;
					$sFile = $sDir . '/' . $sScanFile;
					if (is_dir($sFile)) {
						$aDirFiles = aListFiles($sFile);
						foreach ($aDirFiles as $sDirFile) {
							$aFiles []= $sDirFile;
						}
					} else {
						$aFiles []= $sFile;
					}
				}
				return $aFiles;
			}
			
			$aFilesInInclude = aListFiles('includes');
			
			$aIncludeFiles = array();
			$aGameFiles = array();
			$aTestFiles = array();
			
			foreach ($aFilesInInclude as $sFileInInclude) {
				if (preg_match('#\.js$#', $sFileInInclude)) {
					if (preg_match('#/games/#', $sFileInInclude)) {
						$aGameFiles []= $sFileInInclude;
					} else if (preg_match('#/tests/#', $sFileInInclude)) {
						$aTestFiles []= $sFileInInclude;
					} else {
						$aIncludeFiles []= $sFileInInclude;
					}
				}
			}
			
			$sMainFile = '';
			if (isset($_REQUEST['game'])) {
				$sGame = $_REQUEST['game'];
				foreach ($aGameFiles as $sGameFile) {
					if (preg_match('#/games/' . preg_quote($sGame) . '/#', $sGameFile)) {
						if (preg_match('#/main\.js$#', $sGameFile)) {
							$sMainFile = $sGameFile;
						} else {
							$aIncludeFiles []= $sGameFile;
						}
					}
				}
			}
			if (isset($_REQUEST['test'])) {
				$sTest = $_REQUEST['test'];
				foreach ($aTestFiles as $sTestFile) {
					if (preg_match('/' . preg_quote($sTest) . '.js$/', $sTestFile)) {
						$sMainFile = $sTestFile;
					}
				}
			}
			
			$aIncludeScripts = array();
			foreach ($aIncludeFiles as $sIncludeFile) {
				$aIncludeScripts []= '/' . $sIncludeFile;
			}
			$aIncludeScripts []= '/' . $sMainFile;
			
			echo "\n";
			foreach ($aIncludeScripts as $sScript) {
				echo "\t\t" . '<script type="text/javascript" src="' . $sScript . '"></script>' . "\n";
			}
			echo "\n";
			
		?>
	</body>
</html>

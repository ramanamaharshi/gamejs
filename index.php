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
			
			$aFolderContents = array();
			foreach (array('lib', 'tests', 'games') as $sFolder) {
				$aFolderContents[$sFolder] = array();
				$aFiles = aListFiles('js/' . $sFolder);
				foreach ($aFiles as $sFile)  {
					if (preg_match('#\.js$#', $sFile)) {
						$aFolderContents[$sFolder] []= $sFile;
					}
				}
			}
			
			$sMainFile = '';
			if (isset($_REQUEST['game'])) {
				$sGame = $_REQUEST['game'];
				$aGameFiles = $aFolderContents['games'];
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
				$aTestFiles = $aFolderContents['tests'];
				foreach ($aTestFiles as $sTestFile) {
					if (preg_match('/' . preg_quote($sTest) . '.js$/', $sTestFile)) {
						$sMainFile = $sTestFile;
					}
				}
			}
			
			$aIncludeScripts = array();
			$aIncludeFiles = $aFolderContents['lib'];
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

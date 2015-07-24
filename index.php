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
			
			$aLibFiles = $aFolderContents['lib'];
			
			$sMainProgramFile = '';
			$aProgramFiles = array();
			if (isset($_REQUEST['game']) || isset($_REQUEST['test'])) {
				$sProgramType = isset($_REQUEST['test']) ? 'test' : 'game';
				$aTypeFolderFiles = $aFolderContents[$sProgramType . 's'];
				$sProgramName = $_REQUEST[$sProgramType];
				foreach ($aTypeFolderFiles as $sFile) {
					$sProgramBase = '/' . $sProgramType . 's/' . preg_quote($sProgramName);
					if (preg_match('#' . $sProgramBase . '/#', $sFile)) {
						if (preg_match('#/main\.js$#', $sFile)) {
							$sMainProgramFile = $sFile;
						} else {
							$aProgramFiles []= $sFile;
						}
					} else if (preg_match('#' . $sProgramBase . '\.js#', $sFile)) {
						$sMainProgramFile = $sFile;
					}
				}
			}
			$aProgramFiles []= $sMainProgramFile;
			
			$aIncludeScripts = array();
			foreach ($aLibFiles as $sLibFile) {
				$aIncludeScripts []= '/' . $sLibFile;
			}
			foreach ($aProgramFiles as $sProgramFile) {
				$aIncludeScripts []= '/' . $sProgramFile;
			}
			
			echo "\n";
			foreach ($aIncludeScripts as $sScript) {
				echo "\t\t" . '<script type="text/javascript" src="' . $sScript . '"></script>' . "\n";
			}
			echo "\n";
			
		?>
	</body>
</html>

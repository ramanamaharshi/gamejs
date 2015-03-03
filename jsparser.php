<?php

$sRelFile = $_REQUEST['file'];
$sFileContent = file_get_contents($sRelFile);

/// parse begin

function sParseMultilineStrings ($sFileContent) {
	
	$sELB = ' \\n\\' . "\n";
	$sPattern = '/^(?<before>[\s\S]+)\n\s*\/\/\/\s?PARSE: multiline string begin\n(?<parse>[\s\S]+)\n\s*\/\/\/\s?PARSE: multiline string end\n(?<after>[\s\S]+)\n$/';
	while (preg_match($sPattern, $sFileContent, $aMatches)) {
		$sParse = $aMatches['parse'];
		$sParse = implode($sELB, explode("\n", $sParse));
		$sFileContent = $aMatches['before'] . "'" . $sELB . $sParse . $sELB . "'" . $aMatches['after'];
	}
	
	return $sFileContent;
	
}

$sFileContent = sParseMultilineStrings($sFileContent);

/// parse end

echo $sFileContent;

?>
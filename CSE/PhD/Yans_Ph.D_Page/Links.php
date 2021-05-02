<?php
 // error_reporting(E_ALL ^ E_NOTICE);
   /* $xmldoc = new DOMDocument();
    $xmldoc->load('RSS/Publications.xml', LIBXML_NOBLANKS);

    $$items = $xmldoc-getElementByTagName("item"); //
    echo "<b>Publications</b>";
    if ($items == null)
    {
    	echo "No items found!";
    }
    else
    {
    	echo "<ul>";
    	foreach ($items as $item)
    	{
    		echo "<li>";
    		$authors = $item->getElementByTagName("authors");
    		$authornames = array();
    		foreach ($authors as $author)
    		{
    			array_push($authornames, substr($author->getElementByTagName("firstname")->nodeValue, 0, 1) . 
    			'. ' . substr($author->getElementByTagName("middlename")->nodeValue(), 0, 1) . "., " . 
    			$author->getElementByTagName("lastname"));
    		}
    		$title = "\"" . $item->getElementByTagName("title")->nodeValue() . "\"";
    		$conference = $item->getElementByTagName("conference");
    		$proceding = $conference->getElementByTagName("proceding");
    		$confName = $conference->getElementByTagName("name");
    		$confDate = $conference->getElementByTagName("date");
    			$confDayFrom = $confDate->getElementByTagName("day_from");
    			$confDayTo =  $confDate->getElementByTagName("day_to");
    			$confMon =  $confDate->getElementByTagName("month");
    			$confYear =  $confDate->getElementByTagName("year");
    		$confLocation =  $conference->getElementByTagName("locatiopn");
    			$confCity =  $confLocation->getElementByTagName("city");
    			$confState =  $confLocation->getElementByTagName("state");
    			$confCountry =  $confLocation->getElementByTagName("country");
    		$pageFrom = $conference->getElementByTagName("page_from");
    		$pageTo = $conference->getElementByTagName("page_to");
    		echo "<b>" . implode(', ', $authernames) . "</b>" . "(" . $confYear . "), \"" . $title . 
    		"\", <i>" . $proceding . "</i>\", " . $confMon . (($confDayFrom > 0 && $confDayTo > 0) ? " " . $confDayFrom .
    		"-" . $confDayTo . ", " . $confYear . ", " . $confCity . ", " . $confState . " " . $confCountry . 
    		", " . (($pageFrom > 0) and ($pageTo > 0) ? "pp " . $pageFrom . "-" . $pageTo : ($pageFrom > 0 ? $pageFrom :
			($pageTo > 0 ? $pageTo : ""))));    		

    	}
    }
    $item = $xmldoc->getElementsByTagname('item');
    echo "act: " . $item->textContent . "<br/>";
    if($item!=null){
        while($item!=null){
            echo $item->firstChild->textContent.'<br/>';
            $item = $item->nextSibling;
        }
    }  */
    $xml = simplexml_load_file("RSS/Links.xml");
    echo "<ol>";
	foreach ($xml->children() as $item)
	{
		echo '<li style="line-height: 19px; font-size: 12px; padding-left: 35px; text-indent: -25px; " class="full-width"><p style="padding-bottom: 0pt; text-indent: -25px; " class="paragraph_style_2"><span style="color: rgb(0, 104, 28); font-family: "ZapfDingbatsITC", "Zapf Dingbats"; font-size: 13px; font-stretch: normal; font-style: normal; font-weight: 400; opacity: 1.00; position: relative; top: -1px; " class="Bullet"></span><span style="width: 15px; " class="inline-block"></span>' ;
		echo  "<a href='" . (substr($item->URL, 0, 7) == 'http://' ? "" : "http://") . $item->URL . "' target='_blank'>" . $item->title . "</a> (open in a new tab)";
		echo "</p></li>";
	}
	echo "</ol>";
	//echo $xml->getName() . ": " . $xml ."<br />";
?>
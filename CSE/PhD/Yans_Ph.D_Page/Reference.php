<?php
 // error_reporting(E_ALL ^ E_NOTICE);
   /* $xmldoc = new DOMDocument();
    $xmldoc->load('RSS/Reference.xml', LIBXML_NOBLANKS);

    $$items = $xmldoc-getElementByTagName("item"); //
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
    $xml = simplexml_load_file("RSS/Reference.xml");
    echo "<ol>";
	foreach ($xml->children() as $item)
	{
		echo '<li style="line-height: 19px; font-size: 12px; padding-left: 5px; text-indent: 5px; " class="full-width"><p style="padding-bottom: 0pt; text-indent: 5px; " class="paragraph_style_2"><span style="color: rgb(0, 104, 28); font-family: "ZapfDingbatsITC", "Zapf Dingbats"; font-size: 13px; font-stretch: normal; font-style: normal; font-weight: 400; opacity: 1.00; position: relative; top: -1px; " class="Bullet"></span><span style="width: 5px; " class="inline-block"></span>' ;
		foreach ($item->children() as $element)
		{
			// if ($item->conference->date->month_from == $item->conference->date->month_to)
// 				echo $item->conference->date->month_from . " == " . strcmp($item->conference->date->month_to, $item->conference->date->month_to);
// 			else
// 				echo "month_to is not empty --- ";
 			switch ($element->getName())
			{
				case "authors":
					echo "<b>";
					$AuthorNames = array();
					
					foreach ($element->children() as $author)
					{
						// echo $author->getName();
						$fullname = array();
						$fname = trim($author->firstname);
						array_push($fullname, ($fname == "" ? "" : substr($fname, 0, 1) . "."), (empty($author->middlename) ? "" : substr($author->middlename, 0, 1) . "."), $author->lastname);
						/* foreach($author->children() as $name)
						{
							//echo $name->getName();
							if ($name->getName() == 'lastname')
							{
								array_push($fullname, $name);
							}
							else {
							    if (strlen($name) > 0)
							    {
									array_push($fullname, substr($name, 0, 1) . ".");
								}
							}
						} */
						// echo " " . implode(" ", $fullname) . " ";
						array_push($AuthorNames, implode(' ', $fullname));
						$name = null;
					}
					echo implode(', ', $AuthorNames) . "</b>";
					break;
				case "title":
					//echo ", \"" . $element . "\"";
					break;
				case "conference":
					//echo "Conference";
					break;
				default:
					//echo $element->getName() . "<br/>";
			} 
		}
		/*echo "empty(year_to) = " . (string) empty($item->conference->date->year_from) . " -- "; */
		echo (empty($item->more_authors) ? "" : "<b>, " . $item->more_authors . "</b>" ) . "(" . $item->conference->date->year_from . "). \"" . $item->title . ".\"<i> " . $item->conference->proceding . "(" . $item->conference->name . ")</i>" . $item->conference->volume . " " . (empty($item->conference->location->city) ? "" : $item->conference->location->city . ", ") . $item->conference->location->state . (empty($item->conference->location->country) ? " " : (" (" . $item->conference->location->country . "). "));
		if (empty($item->conference->date->year_to) || strcmp($item->conference->date->yaer_from, $item->conference->date->year_to) == 0)
			if (empty($item->conference->date->month_to) || strcmp($item->conference->date->month_from, $item->conference->date->month_to) == 0)
				if (empty($item->conference->date->day_to) || strcmp($item->conference->date->day_from, $item->conference->date->day_to) == 0)
					echo $item->conference->date->month_from . " " . $item->conference->date->day_from . ", " . $item->conference->date->year_from;
				else
					echo $item->conference->date->month_from . " " . $item->conference->date->day_from . " - " . $item->conference->date->day_to . ", " . $item->conference->date->year_from;
			elseif (empty($item->conference->date->day_to) || strcmp($item->conference->date->day_from, $item->conference->date->day_to) == 0)
					echo $item->conference->date->month_from . " " . $item->conference->date->day_from . " - " . $item->conference->date->month_to . " " . $item->conference->date->day_from . ", " . $item->conference->date->year_from;
				else
					echo $item->conference->date->month_from . " " . $item->conference->date->day_from . " - " . $item->conference->date->month_to . " " . $item->conference->date->day_to . ", " . $item->conference->date->year_from;
		elseif (empty($item->conference->date->month_to) || strcmp($item->conference->date->month_from, $item->conference->date->month_to) == 0)
				if (empty($item->conference->date->day_to) || ($item->conference->date->day_from == $item->conference->date->day_to))
					echo $item->conference->date->month_from . " " . $item->conference->date->day_from . ", " . $item->conference->date->year_from . " - " . $item->conference->date->month_from . " " . $item->conference->date->day_from . ", " . $item->conference->date->year_to;
				else
					echo $item->conference->date->month_from . " " . $item->conference->date->day_from . ", " . $item->conference->date->year_from . " - " . $item->conference->date->month_from . " " . $item->conference->date->day_to . ", " . $item->conference->date->year_to;
			elseif (empty($item->conference->date->day_to) || strcmp($item->conference->date->day_from, $item->conference->date->day_to) == 0)
					echo $item->conference->date->month_from . " " . $item->conference->date->day_from . ", " . $item->conference->date->year_from . " - " . $item->conference->date->month_to . " " . $item->conference->date->day_from . ", " . $item->conference->date->year_to;
				else
					echo $item->conference->date->month_from . " " . $item->conference->date->day_from . ", " . $item->conference->date->year_from . " - " . $item->conference->date->month_to . " " . $item->conference->date->day_to . ", " . $item->conference->date->year_to;
/*		echo $item->conference->date->month_from . " " . $item->conference->date->day_from . ", " . $item->conference->date->year_from . " - " . $item->conference->date->month_to . " " . $item->conference->date->day_to . ", " . $item->conference->date->year_to;
*/			
		echo (!empty($item->conference->page_from) ? ". pp " . $item->conference->page_from . (!empty($item->conference->page_to) ? "-" . $item->conference->page_to : "") : "");
		
		echo "</p></li>";
	}
	echo "</ol>";
	//echo $xml->getName() . ": " . $xml ."<br />";
?>
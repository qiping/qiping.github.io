<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/1999/REC-html401-19991224/loose.dtd">
<HTML>
<HEAD>
<TITLE>Mac OS X Personal Web Sharing</TITLE>
</HEAD>
<BODY BGCOLOR=#FFFFFF>
<?php 
 Echo "Hello, World! Qiping Yan";
 ?> 
<?php 
 //Gets the IP address
 $ip = getenv("REMOTE_ADDR") ; 
 Echo "Your IP is " . $ip; 
 ?> 
<?php 
echo ' Client IP: '; 
if ( isset($_SERVER["REMOTE_ADDR"]) )    { 
    echo '' . $_SERVER["REMOTE_ADDR"] . ' '; 
} else if ( isset($_SERVER["HTTP_X_FORWARDED_FOR"]) )    { 
    echo '' . $_SERVER["HTTP_X_FORWARDED_FOR"] . ' '; 
} else if ( isset($_SERVER["HTTP_CLIENT_IP"]) )    { 
    echo '' . $_SERVER["HTTP_CLIENT_IP"] . ' '; 
} 
echo "joe ip is:";
$joe = apache_request_headers();
echo $joe['PC-Remote-Addr'];
$page = file_get_contents('http://www.usdiners.com');
echo $page;
echo PHPinfo();
echo file_get_html('http://www.usdiners.com/')->plaintext; 

?>
<CENTER>
<TABLE WIDTH="85%" BORDER="0" CELLSPACING="15" CELLPADDING="0">
	<TR>
		<TD COLSPAN=3>
			<FONT FACE="Lucida Grande,Geneva,Arial,Helvetica,Swiss,SunSans-Regular">
			<CENTER>
			<IMG SRC="images/macosxlogo.gif" ALT="Mac OS X Logo" WIDTH=73 HEIGHT=97 BORDER=0><BR>
			<H1>Your website here.</H1>
			</CENTER>
			<BR>
			
			You can use Mac OS X Personal Web Sharing to publish web pages or share files on the Internet &#151; 
			or on your company&#146;s or school&#146;s local area network &#151; from a folder on your hard disk.
			<BR><BR>
			
			You can display your documents on the Internet &#151; or restrict access to a chosen few within a local area network. 
			Mac OS X Personal Web Sharing makes it a snap.
			<BR><BR>
			
			Here&#146;s how it works: Create your website by changing this page (it's called "index.html" and it's in the Sites folder in your home folder) 
			and creating any other HTML pages you want.
			<BR><BR>
			
			Once you&#146;re online, turn on Personal Web Sharing, then send your web address to other people. 
			<BR><BR>
			
			That&#146;s it. You&#146;re done &#151; your page is ready for viewing.
			<BR><BR>
			</FONT>
		</TD>
	</TR>
	<TR VALIGN=TOP>
		<TD WIDTH=50%>
			<FONT FACE="Lucida Grande,Geneva,Arial,Helvetica,Swiss,SunSans-Regular" SIZE="2">
			
			<B>HTML, anyone?</B>
			<BR><BR>
			
			HTML is easy &#151; so easy that even a first-time user can do it. That's because you don&#146;t have to learn HTML to use it. 
			<BR><BR>

			Leading word processing applications, such as Microsoft Word and AppleWorks 6, actually generate HTML webpages for you 
			with just a few clicks of a mouse.
			<BR><BR>

			HTML &#151; short for hypertext markup language &#151; is what webmasters and designers use 
			to publish text and graphics on the Internet in a form that can be read by any web browser.
			<BR><BR>
			
			To create an HTML webpage in Microsoft Word, all you have to do is choose Save as HTML from the File menu. 
			Word will save your work as an HTML page, ready for publishing on the Internet.
			<BR><BR>

			In AppleWorks 6, choose Save As from the File menu, then choose HTML from the pop-up menu. Next, just type in the name 
			you want to save the page with and click the Save button, and it&#146;s like boom &#151; instant HTML.
			<BR><BR>

			<B>Apache web server</B>
			<BR><BR>

			Something you&#146;ll notice about Mac OS X Personal Web Sharing: as server software goes, it&#146;s as 
			stable as a block of granite. That&#146;s because it&#146;s built on the Apache web server, one of the many industrial-strength, 
			industry-standard technologies that are part of the modern Darwin core foundation underlying Mac OS X.
			<BR><BR>

			<IMG SRC="images/apache_pb.gif" ALT="Powered by Apache" WIDTH=259 HEIGHT=32 BORDER=0><BR><BR>

			<A HREF="http://www.apache.org/httpd/">Apache</A> is, in a nutshell, a continually evolving hunk of server software 
			that&#146;s both free and priceless at the same time. One of the absolute gems to emerge out of the open source movement, 
			Apache is free in the sense that it&#146;s not proprietary. Programmers essentially have the freedom to do what they want 
			with the source code once they have it  &#151;  provided they pass along to other programmers the same rights and privileges 
			to change and modify the source code that they themselves had.
			<BR><BR>

			The Apache server started out as a project at the National Center for Supercomputing Applications, University of Illinois, 
			Urbana-Champaign. Since then Apache has been continuously developed and strengthened by members of the open source community 
			(who also helped develop certain core areas of Mac OS X). The Apache server has earned such a reputation for rock-solid reliability 
			that it currently hosts over half the websites on the Internet &#151; and almost all of the coolest and most heavily-visited ones. 
			Including Apple&#146;s own website &#151; and now yours, too.
			<BR><BR>
			
			For more information about using the Apache web server, see the <A HREF="/manual/">Apache manual</A>.
			</FONT>
		</TD>
		<TD WIDTH=5%></TD>
		<TD WIDTH=45%>
			<FONT FACE="Lucida Grande,Geneva,Arial,Helvetica,Swiss,SunSans-Regular" Size=2>
			<B>Quick Start Guide to <BR>Personal Web Sharing</B></FONT>
			<BR><BR>

			<FONT SIZE=1 FACE="Geneva,Arial,Helvetica,Swiss,SunSans-Regular">
			1. Create the HTML pages for your website and put them in the Sites folder in your home folder.
			<BR><BR>

			Substitute your own content for the text, graphics, and links in this page (index.html)
			to create a customized welcome page. Create other HTML page following your application's instructions 
			for linking pages and graphics.
			<BR><BR>
			
			2. Make sure you have a working network connection. If you need help, see your network administrator.
			<BR><BR>
			
			<img src="images/web_share.gif" alt="Start Web Sharing" width="185" height="68" border="0" align="right">
			3. Open System Preferences and click Sharing. Select Personal Web Sharing and click Start.
			<BR><BR>

			4. Note the address for your website under the services list in Sharing preferences. Be sure to copy the address 
			exactly as it appears.
			<BR><BR>

			Give this address to the people on your network (make sure they don&#146;t forget that last &#147;/&#148;). They can connect 
			to your server and view your published documents by typing this address in their web browser.
			<BR><BR>
		</TD>
	</TR>
</TABLE>
</CENTER>
</BODY>
</HTML>

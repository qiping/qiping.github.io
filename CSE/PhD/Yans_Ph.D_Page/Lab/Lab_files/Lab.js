// Created by iWeb 3.0.4 local-build-20121105

function createMediaStream_id1()
{return IWCreateMediaCollection("http://cse.unr.edu/%7Eyanq/PhD/Yans_Ph.D_Page/Lab/Lab_files/rss.xml",true,255,["No photos yet","%d photo","%d photos"],["","%d clip","%d clips"]);}
function initializeMediaStream_id1()
{createMediaStream_id1().load('http://cse.unr.edu/%7Eyanq/PhD/Yans_Ph.D_Page/Lab',function(imageStream)
{var entryCount=imageStream.length;var headerView=widgets['widget2'];headerView.setPreferenceForKey(imageStream.length,'entryCount');NotificationCenter.postNotification(new IWNotification('SetPage','id1',{pageIndex:0}));});}
function layoutMediaGrid_id1(range)
{createMediaStream_id1().load('http://cse.unr.edu/%7Eyanq/PhD/Yans_Ph.D_Page/Lab',function(imageStream)
{if(range==null)
{range=new IWRange(0,imageStream.length);}
IWLayoutPhotoGrid('id1',new IWPhotoGridLayout(1,new IWSize(402,301),new IWSize(402,42),new IWSize(488,358),27,27,0,new IWSize(2,2)),new IWEmptyStroke(),imageStream,range,(null),null,1.000000,null,'../Media/slideshow.html','widget2',null,'widget3',{showTitle:false,showMetric:false})});}
function relayoutMediaGrid_id1(notification)
{var userInfo=notification.userInfo();var range=userInfo['range'];layoutMediaGrid_id1(range);}
function onStubPage()
{var args=window.location.href.toQueryParams();parent.IWMediaStreamPhotoPageSetMediaStream(createMediaStream_id1(),args.id);}
if(window.stubPage)
{onStubPage();}
setTransparentGifURL('../Media/transparent.gif');function hostedOnDM()
{return false;}
function onPageLoad()
{IWRegisterNamedImage('comment overlay','../Media/Photo-Overlay-Comment.png')
IWRegisterNamedImage('movie overlay','../Media/Photo-Overlay-Movie.png')
loadMozillaCSS('Lab_files/LabMoz.css')
NotificationCenter.addObserver(null,relayoutMediaGrid_id1,'RangeChanged','id1')
fixAllIEPNGs('../Media/transparent.gif');Widget.onload();fixupAllIEPNGBGs();initializeMediaStream_id1()
performPostEffectsFixups()}
function onPageUnload()
{Widget.onunload();}

gsap.registerPlugin(SplitText);
// JavaScript Document
//HTML5 Ad Template JS from DoubleClick by Google

var container;
var content;
var backgroundImage;
var headline1;
var headline2;
var headline3;
var subHeadline1;
var subHeadline2;
var subHeadline3;
var cta;
var bgExit;
var copyContainer;
var randomNum;
var dots;
var dotBox;
var prevBtn;
var nextBtn;
var slideIndex = 1;
var interval;
var msgContainer;
var slideContainer;
var prevBtnContainer;
var nextBtnContainer;
var dynamicObj = {};
var logoImg;
var slidePanel;
var tlInterval;
var onAnim = false;
var ctaColor;
var ctaBGColor;
var activeSlide;
var logo_cta;
var rotateInterval;
var ctaBGColor,ctaColor;
//Container for the Images that needs to preload before showing the content
var imgArr = new Array();
var tl;
var bgExitUrL;

//Container for the Dynamic Elements
var headLinesList = new Array();
var subHeadlinesList = new Array();
var bgImageUrlList = new Array();
var logoImageUrl = new Array();
var exitLinkUrlList = new Array();
var ctaTextList = new Array();

var ua = navigator.userAgent.toLowerCase();

//Function confirm if the creative is visible
enablerInitHandler = function (e) {
    if (Enabler.isVisible()) {
        startAd();
    } else {
        Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, startAd);
    }
};

//Start the creative
startAd = function (e) {
    //Assign All the elements to the element on the page
    container = document.querySelector('#container');
    content = document.querySelector('#content');
    headline = document.querySelectorAll(".headline");
    slideContainer = document.querySelectorAll(".mySlides");
    subHeadline = document.querySelectorAll(".sub-headline");
    cta = document.querySelectorAll(".cta");
    copyContainer = document.querySelector("#copy-container");
    dots = document.querySelectorAll(".dot");
    dotBox = document.querySelectorAll(".dot-box");
    prevBtn = document.querySelector('.prev');
    nextBtn = document.querySelector('.next');
    msgContainer = document.querySelectorAll(".msg-container");
    prevBtnContainer = document.querySelector("#btn-prev");
    nextBtnContainer = document.querySelector("#btn-next");
    slidePanel = document.querySelectorAll('.slide-panel');
    disrupterContainer = document.querySelectorAll('.disruptor-cont');
    disrupterCopy = document.querySelectorAll('.disruptor-copy');
    stoerer = document.querySelectorAll('.stoerer');
    //Add DynamicContent (This is where the copies from the spreadsheet are called from Dynamic Profile)
    addDynamicContent();


    //Carousel creation
    initCarousel();

    //Add listeners
    addListeners();

    ExitsAndCounters.init();
    //Add Animation
//    addAnimation();
    util.preloadImages(imgArr,addAnimation);

    container.style.display = "block";
};

//Add Event Listeners
addListeners = function (e) {


    //AddExits to each elements on the creative

    slideContainer[0].addEventListener('click',function(e){
        e.stopPropagation();
        Enabler.exitOverride("Image_Product_1", exitLinkUrlList[0])

    });

    slideContainer[1].addEventListener('click',function(e){
        e.stopPropagation();
       Enabler.exitOverride("Image_Product_2", exitLinkUrlList[1])

    });

    slideContainer[2].addEventListener('click',function(e){
        e.stopPropagation();
        Enabler.exitOverride("Image_Product_3", exitLinkUrlList[2])

    });



	ctaBGColor = gsap.getProperty(document.querySelectorAll('#product-cta-endframe-copy')[0],"backgroundColor");
	ctaColor = gsap.getProperty(document.querySelectorAll('#product-cta-endframe-copy')[0],"color");

 
document.querySelectorAll('#product-cta-endframe-copy')[0].addEventListener('mouseover',function(){

			gsap.to(document.querySelectorAll('#product-cta-endframe-copy')[0], {duration:.6,color:ctaBGColor,border:'1px solid #ffffff',ease:"sine"});
			gsap.to(document.querySelectorAll('#product-cta-endframe-copy')[0], {duration:.6,backgroundColor:ctaColor,ease:"sine"});

},false);

document.querySelectorAll('#product-cta-endframe-copy')[0].addEventListener('mouseout',function(){
			gsap.to(document.querySelectorAll('#product-cta-endframe-copy')[0], {duration:.6,backgroundColor:ctaBGColor,border:'1px solid transparent',ease:"sine"});
			gsap.to(document.querySelectorAll('#product-cta-endframe-copy')[0], {duration:.6,color:ctaColor,ease:"sine"});

},false);


    
    dots[0].addEventListener('click', function (e) {
        e.stopPropagation();
        if(pageTween != undefined){
            pageTween.kill();
            }
        // tlInterval.kill();  
        Enabler.counter("Pagination-1 Click");
        clearInterval(interval);
        currentSlide(1);
        activeSlide = 0;
        ispageClick = true;
        pageClick(ispageClick);
    }, false);
    dots[1].addEventListener('click', function (e) {
        e.stopPropagation();
        if(pageTween != undefined){
            pageTween.kill();
            }
        // tlInterval.kill();  
        Enabler.counter("Pagination-2 Click");
        clearInterval(interval);
        currentSlide(2);
        activeSlide = 1;
        ispageClick = true;
        pageClick(ispageClick);
    }, false);
    dots[2].addEventListener('click', function (e) {
        e.stopPropagation();
        if(pageTween != undefined){
            pageTween.kill();
            }
        // tlInterval.kill();  
        Enabler.counter("Pagination-3 Click");
        clearInterval(interval);
        currentSlide(3);
        activeSlide = 2;
        ispageClick = true;
        pageClick(ispageClick);
    }, false);
        dotBox[0].addEventListener('click', function (e) {
        e.stopPropagation();
        if(pageTween != undefined){
            pageTween.kill();
            }
        // tlInterval.kill();  
        Enabler.counter("Pagination-1 Click");
        clearInterval(interval);
        currentSlide(1);
        activeSlide = 0;
        ispageClick = true;
        pageClick(ispageClick);
    }, false);
    dotBox[1].addEventListener('click', function (e) {
        e.stopPropagation();
        if(pageTween != undefined){
            pageTween.kill();
            }
        // tlInterval.kill();  
        Enabler.counter("Pagination-2 Click");
        clearInterval(interval);
        currentSlide(2);
        activeSlide = 1;
        ispageClick = true;
        pageClick(ispageClick);
    }, false);
    dotBox[2].addEventListener('click', function (e) {
        e.stopPropagation();
        if(pageTween != undefined){
            pageTween.kill();
            }
        // tlInterval.kill();  
        Enabler.counter("Pagination-3 Click");
        clearInterval(interval);
        currentSlide(3);
        activeSlide = 2;
        ispageClick = true;
        pageClick(ispageClick);
    }, false);

    document.querySelector('#headline-copy').addEventListener("click", (e)=> Enabler.exitOverride('BG_EXIT', bgExitUrL));

    document.querySelector('#replay_btn').addEventListener('mouseover', function(e){

        gsap.to('#replay_btn', {scale:1.06, duration:0.3, ease:'power0.out',transformOrigin:'center'})

    });
    document.querySelector('#replay_btn').addEventListener('mouseout', function(e){

        gsap.to('#replay_btn', {scale:1, duration:0.3, ease:'power0.out',transformOrigin:'center'})

    });

    document.querySelector('#replay_btn').addEventListener('click', function(e){

    //    tl.restart();
    // gsap.to('#background-endframe', {delay:4.5,clipPath: 'inset(0px 0 0 0)',duration:1.3,ease:'sine.out',onComplete:function(){
    //     gsap.to('#logo-wrapper-endframe,.product-cta-endframe', {delay:0.8,autoAlpha:1, duration:0.5 })
    // }});
     slideIndex = 1;
    previousImg = 0;
    gsap.set('#background-endframe',{clipPath: 'inset(590px 0 0 0)'});
    gsap.set('#logo-wrapper-endframe,.product-cta-endframe,#replay_btn', {autoAlpha:0});
    tl.seek(7);    
    });

};


//distribute dynamic content in the creative
addDynamicContent = function (e) {
    
    var headlineColor;
    var subheadlineColor;
    var headlineFontSize;
    var subheadlineFontSize;
    var ctaFontSize;
    var containerBackdropColor;
    var arrowColor;
    var paginationColor;
    

//<!--
// * Dynamic Content Enable code for Profile: 10550622
// *
// * The following code initializes the following dynamic variables for
// * development testing and live serving of Fields associated to the above profile
//-->
//
//<!-- DynamicContent Start: HTML5 invocation code. -->
//<script type="text/javascript">

// Dynamic Content variables and sample values
    // Enabler.setProfileId(10550622);
    Enabler.setProfileId(10837043);
    var devDynamicContent = {};

    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE = [{},{},{}];
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[0]._id = 0;
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[0].id = 1;
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[0].reporting_label = "default";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[0].is_default = true;
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[0].active = true;
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[0].col_template = "red-gradient";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[0].txt_frame_1 = "Ken je onze...";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[0].img_product = {};
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[0].img_product.Type = "file";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[0].img_product.Url = "https://s0.2mdn.net/ads/richmedia/studio/45603338/45603338_20230328062131327_Monat_1.1.jpg";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[0].txt_disrupter = "!";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[0].txt_header = "3 Miljoen Producten!";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[0].txt_price = "";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[0].txt_copy = "Laat je ook deze maand inspireren.";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[0].txt_cta = "Naar shop";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[0].exit_url = {};
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[0].exit_url.Url = "https://www.flyeralarm.com/nl";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[0].txt_button = "Zum Shop";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[0].exit_homepage = {};
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[0].exit_homepage.Url = "https://www.flyeralarm.com/ch";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[1].id = 10;
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[1].reporting_label = "product_offer_7";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[1].is_default = false;
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[1].active = true;
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[1].col_template = "red-gradient";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[1].txt_frame_1 = "AANBIEDINGEN IN MEI";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[1].img_product = {};
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[1].img_product.Type = "file";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[1].img_product.Url = "https://s0.2mdn.net/ads/richmedia/studio/45603338/45603338_20230328062241740_Wasserball.jpg";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[1].txt_disrupter = "-10%";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[1].txt_header = "Opblaasbare strandballen";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[1].txt_price = "";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[1].txt_copy = "Kortingscode: SUMMER23";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[1].txt_cta = "Bekijk Actie";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[1].exit_url = {};
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[1].exit_url.Url = "https://www.flyeralarm.com/be/content/index/open/id/28856/aanbiedingen.html";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[1].txt_button = "Zum Shop";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[1].exit_homepage = {};
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[1].exit_homepage.Url = "https://www.flyeralarm.com/ch";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[2].id = 11;
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[2].reporting_label = "product_offer_8";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[2].is_default = false;
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[2].active = true;
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[2].col_template = "red-gradient";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[2].txt_frame_1 = "AANBIEDINGEN IN MEI";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[2].img_product = {};
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[2].img_product.Type = "file";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[2].img_product.Url = "https://s0.2mdn.net/ads/richmedia/studio/45603338/45603338_20230328062406913_Liegestuhl-Basic.jpg";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[2].txt_disrupter = "-10%";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[2].txt_header = "Ligstoelen ";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[2].txt_price = "";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[2].txt_copy = "Kortingscode: SUMMER23";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[2].txt_cta = "Bekijk Actie";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[2].exit_url = {};
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[2].exit_url.Url = "https://www.flyeralarm.com/be/content/index/open/id/28856/aanbiedingen.html";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[2].txt_button = "Zum Shop";
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[2].exit_homepage = {};
    devDynamicContent.Flyeralarm_Remarketing_BE_Feed_BE[2].exit_homepage.Url = "https://www.flyeralarm.com/ch";
    Enabler.setDevDynamicContent(devDynamicContent);

//</script>
//
//<!--
// * You may access the variables in the following manner
// * AFTER the Studio Enabler is initialized.
// * var Main_Unique_ID = dynamicContent.Flyeralarm_Remarketing_CH_Feed[0].Main_Unique_ID;
// * Note: be sure to use "dynamicContent", not "devDynamicContent"
// * Note: be sure to use ExitOverride to create your exit URL dynamically; follow the instructions on our Help center: https://support.google.com/richmedia/answer/2664807
//-->

    //global feed variable to call its child values
    var mainFeed = dynamicContent.Flyeralarm_Remarketing_BE_Feed_BE;

    console.log(mainFeed);

        bgImageUrlList.push(mainFeed[0].img_product.Url,mainFeed[1].img_product.Url,mainFeed[2].img_product.Url);
    
        imgArr.push(mainFeed[0].img_product.Url,mainFeed[1].img_product.Url,mainFeed[2].img_product.Url);
        
        exitLinkUrlList.push(mainFeed[0].exit_url.Url,mainFeed[1].exit_url.Url,mainFeed[2].exit_url.Url);
        
        headLinesList.push(eval('mainFeed.Carousel_Headline'));

        bgExitUrL = mainFeed[0].exit_homepage.Url;

        var feedLength = mainFeed.length;
        var priceCont = document.querySelectorAll('.product-price-cont');
        
       

        for(var i=0;i<feedLength;i++){

            if(!mainFeed[i].txt_disrupter == '') {
                gsap.set(disrupterContainer[i],{autoAlpha:1} );
                gsap.set(disrupterCopy[i], {innerHTML:mainFeed[i].txt_disrupter});
                Utilities.fitText(disrupterCopy[i], 0,'unset');
            }

            if(mainFeed[i].txt_price != ''){
                gsap.set(priceCont[i], {autoAlpha:1});
            }

        }

        gsap.set('#headline-copy', {innerHTML:mainFeed[0].txt_frame_1});
        gsap.set('#product-title-1-copy', {innerHTML:mainFeed[0].txt_header});
        gsap.set('#product-title-2-copy', {innerHTML:mainFeed[1].txt_header});
        gsap.set('#product-title-3-copy', {innerHTML:mainFeed[2].txt_header});

        gsap.set('#product-desc-1-copy', {innerHTML:mainFeed[0].txt_copy});
        gsap.set('#product-desc-2-copy', {innerHTML:mainFeed[1].txt_copy});
        gsap.set('#product-desc-3-copy', {innerHTML:mainFeed[2].txt_copy});

        gsap.set('#product-price-1-copy', {innerHTML:mainFeed[0].txt_price});
        gsap.set('#product-price-2-copy', {innerHTML:mainFeed[1].txt_price});
        gsap.set('#product-price-3-copy', {innerHTML:mainFeed[2].txt_price});

        gsap.set('#product-cta-1-copy', {innerHTML:mainFeed[0].txt_cta});
        gsap.set('#product-cta-2-copy', {innerHTML:mainFeed[1].txt_cta});
        gsap.set('#product-cta-3-copy', {innerHTML:mainFeed[2].txt_cta});


        // textFit(document.querySelectorAll('.product-desc-copy'));

        gsap.set('#product-cta-endframe-copy', {innerHTML:mainFeed[0].txt_button});
        
        switch(mainFeed[0].col_template){
            case 'red-solid': 
            
                gsap.set('.dyn-bg', {backgroundColor:'#e6001e' } );
                gsap.set('.product-title-copy', {color:'#e6001e' } );
                gsap.set('.product-price-copy', {color:'#e6001e' } );
                gsap.set('.product-cta-copy', {backgroundColor:'#e6001e' } );
                gsap.set('.product-cta-endframe-copy', {color:'#e6001e' } );

                gsap.set('#Path_77,#Path_78', {attr:{fill:'#e6001e'}} );
                gsap.set('.disruptor-path', {attr:{fill:'#e6001e'}});
            
                var style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = `
            
                .dot {
                    display: inline-block;
                    opacity: 1;
                    cursor: pointer;
                    height: 11px;
                    width: 11px;
                    margin: 0 2px;
                    background-color: #e6001e;
                    transition: background-color 0.6s ease;
                    border: 1px solid #e6001e;
                }

                .active {
                    background-color: #ffffff;
                    border: 1px solid #e6001e;
                }
                .dot:hover {
                    background-color: #e6001e;
                    border: 1px solid #ffffff;
                }
                `;
                document.getElementsByTagName('head')[0].appendChild(style);   
            
            break;
            case 'blue-solid': 
            
            gsap.set('.dyn-bg', {backgroundColor:'#7ec1e7' } );
            gsap.set('.product-title-copy', {color:'#7ec1e7' } );
            gsap.set('.product-price-copy', {color:'#7ec1e7' } );
            gsap.set('.product-cta-copy', {backgroundColor:'#7ec1e7' } );
            gsap.set('.product-cta-endframe-copy', {color:'#7ec1e7' } );

            gsap.set('#Path_77,#Path_78', {attr:{fill:'#7ec1e7'}} );
            gsap.set('.disruptor-path', {attr:{fill:'#7ec1e7'}});
        
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = `
        
            .dot {
                display: inline-block;
                opacity: 1;
                cursor: pointer;
                height: 11px;
                width: 11px;
                margin: 0 2px;
                background-color: #7ec1e7;
                transition: background-color 0.6s ease;
                border: 1px solid #7ec1e7;
            }

            .active {
                background-color: #ffffff;
                border: 1px solid #7ec1e7;
            }
            .dot:hover {
                background-color: #7ec1e7;
                border: 1px solid #ffffff;
            }
            `;
            document.getElementsByTagName('head')[0].appendChild(style);   

            break;
            case 'blue-gradient': 
            
            gsap.set('.dyn-bg', {backgroundImage:'linear-gradient(0deg, hsla(202, 69%, 70%, 1) 0%, hsla(208, 72%, 90%, 1) 100%)' } );
            gsap.set('.product-title-copy', {color:'#7ec1e7' } );
            gsap.set('.product-price-copy', {color:'#7ec1e7' } );
            gsap.set('.product-cta-copy', {backgroundColor:'#7ec1e7' } );
            gsap.set('.product-cta-endframe-copy', {color:'#7ec1e7' } );

            gsap.set('#Path_77,#Path_78', {attr:{fill:'#7ec1e7'}} );
            gsap.set('.disruptor-path', {attr:{fill:'#7ec1e7'}});
        
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = `
        
            .dot {
                display: inline-block;
                opacity: 1;
                cursor: pointer;
                height: 11px;
                width: 11px;
                margin: 0 2px;
                background-color: #7ec1e7;
                transition: background-color 0.6s ease;
                border: 1px solid #7ec1e7;
            }

            .active {
                background-color: #ffffff;
                border: 1px solid #7ec1e7;
            }
            .dot:hover {
                background-color: #7ec1e7;
                border: 1px solid #ffffff;
            }
            `;
            document.getElementsByTagName('head')[0].appendChild(style);   

            break;
            case 'green-solid': 
            
                    gsap.set('.dyn-bg', {backgroundColor:'#68A34C' } );
                    gsap.set('.product-title-copy', {color:'#68A34C' } );
                    gsap.set('.product-price-copy', {color:'#68A34C' } );
                    gsap.set('.product-cta-copy', {backgroundColor:'#68A34C' } );
                    gsap.set('.product-cta-endframe-copy', {color:'#68A34C' } );

                    gsap.set('#Path_77,#Path_78', {attr:{fill:'#68A34C'}} );
                    gsap.set('.disruptor-path', {attr:{fill:'#68A34C'}});
                
                    var style = document.createElement('style');
                    style.type = 'text/css';
                    style.innerHTML = `
                
                    .dot {
                        display: inline-block;
                        opacity: 1;
                        cursor: pointer;
                        height: 11px;
                        width: 11px;
                        margin: 0 2px;
                        background-color: #68A34C;
                        transition: background-color 0.6s ease;
                        border: 1px solid #68A34C;
                    }

                    .active {
                        background-color: #ffffff;
                        border: 1px solid #68A34C;
                    }
                    .dot:hover {
                        background-color: #68A34C;
                        border: 1px solid #ffffff;
                    }
                    `;
                    document.getElementsByTagName('head')[0].appendChild(style);
            
            break;
            case 'green-gradient': 

            
                gsap.set('.dyn-bg', {backgroundImage:'linear-gradient(0deg, hsla(101, 36%, 47%, 1) 0%, hsla(80, 42%, 75%, 1) 100%)' } );
                gsap.set('.product-title-copy', {color:'#68A34C' } );
                gsap.set('.product-price-copy', {color:'#68A34C' } );
                gsap.set('.product-cta-copy', {backgroundColor:'#68A34C' } );
                gsap.set('.product-cta-endframe-copy', {color:'#68A34C' } );

                gsap.set('#Path_77,#Path_78', {attr:{fill:'#68A34C'}} );
                gsap.set('.disruptor-path', {attr:{fill:'#68A34C'}});
            
                var style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = `
            
                .dot {
                    display: inline-block;
                    opacity: 1;
                    cursor: pointer;
                    height: 11px;
                    width: 11px;
                    margin: 0 2px;
                    background-color: #68A34C;
                    transition: background-color 0.6s ease;
                    border: 1px solid #68A34C;
                }

                .active {
                    background-color: #ffffff;
                    border: 1px solid #68A34C;
                }
                .dot:hover {
                    background-color: #68A34C;
                    border: 1px solid #ffffff;
                }
                `;
                document.getElementsByTagName('head')[0].appendChild(style);

            break;
            /*
            case 'yellow-solid': 
            
            gsap.set('.dyn-bg', {backgroundColor:'#dfb953' } );
            gsap.set('.product-title-copy', {color:'#dfb953' } );
            gsap.set('.product-price-copy', {color:'#dfb953' } );
            gsap.set('.product-cta-copy', {backgroundColor:'#dfb953' } );
            gsap.set('.product-cta-endframe-copy', {color:'#dfb953' } );

            gsap.set('#Path_77,#Path_78', {attr:{fill:'#dfb953'}} );
            gsap.set('.disruptor-path', {attr:{fill:'#dfb953'}});
        
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = `
        
            .dot {
                display: inline-block;
                opacity: 1;
                cursor: pointer;
                height: 11px;
                width: 11px;
                margin: 0 2px;
                background-color: #dfb953;
                transition: background-color 0.6s ease;
                border: 1px solid #dfb953;
            }

            .active {
                background-color: #ffffff;
                border: 1px solid #dfb953;
            }
            .dot:hover {
                background-color: #dfb953;
                border: 1px solid #ffffff;
            }
            `;
            document.getElementsByTagName('head')[0].appendChild(style);
    
            break;
            case 'yellow-gradient': 

    
            gsap.set('.dyn-bg', {backgroundImage:'linear-gradient(0deg, hsla(44, 69%, 60%, 1) 0%, hsla(44, 100%, 74%, 1) 100%)' } );
            gsap.set('.product-title-copy', {color:'#dfb953' } );
            gsap.set('.product-price-copy', {color:'#dfb953' } );
            gsap.set('.product-cta-copy', {backgroundColor:'#dfb953' } );
            gsap.set('.product-cta-endframe-copy', {color:'#dfb953' } );

            gsap.set('#Path_77,#Path_78', {attr:{fill:'#dfb953'}} );
            gsap.set('.disruptor-path', {attr:{fill:'#dfb953'}});
        
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = `
        
            .dot {
                display: inline-block;
                opacity: 1;
                cursor: pointer;
                height: 11px;
                width: 11px;
                margin: 0 2px;
                background-color: #dfb953;
                transition: background-color 0.6s ease;
                border: 1px solid #dfb953;
            }

            .active {
                background-color: #ffffff;
                border: 1px solid #dfb953;
            }
            .dot:hover {
                background-color: #dfb953;
                border: 1px solid #ffffff;
            }
            `;
            document.getElementsByTagName('head')[0].appendChild(style);

            break;
            */

            case 'premium-solid': 
            
            gsap.set('.dyn-bg', {backgroundColor:'#002249' } );
            gsap.set('.product-title-copy', {color:'#002249' } );
            gsap.set('.product-price-copy', {color:'#002249' } );
            gsap.set('.product-cta-copy', {backgroundColor:'#002249' } );
            gsap.set('.product-cta-endframe-copy', {color:'#002249' } );

            gsap.set('#Path_77,#Path_78', {attr:{fill:'#002249'}} );
            gsap.set('.disruptor-path', {attr:{fill:'#002249'}});
        
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = `
        
            .dot {
                display: inline-block;
                opacity: 1;
                cursor: pointer;
                height: 11px;
                width: 11px;
                margin: 0 2px;
                background-color: #002249;
                transition: background-color 0.6s ease;
                border: 1px solid #002249;
            }

            .active {
                background-color: #ffffff;
                border: 1px solid #002249;
            }
            .dot:hover {
                background-color: #002249;
                border: 1px solid #ffffff;
            }
            `;
            document.getElementsByTagName('head')[0].appendChild(style);
    
            break;
            case 'premium-gradient': 

    
            gsap.set('.dyn-bg', {backgroundImage:'linear-gradient(0deg, hsla(212, 100%, 14%, 1) 0%, hsla(209, 100%, 32%, 1) 100%)' } );
            gsap.set('.product-title-copy', {color:'#0056a4' } );
            gsap.set('.product-price-copy', {color:'#0056a4' } );
            gsap.set('.product-cta-copy', {backgroundColor:'#0056a4' } );
            gsap.set('.product-cta-endframe-copy', {color:'#0056a4' } );

            gsap.set('#Path_77,#Path_78', {attr:{fill:'#0056a4'}} );
            gsap.set('.disruptor-path', {attr:{fill:'#0056a4'}});
        
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = `
        
            .dot {
                display: inline-block;
                opacity: 1;
                cursor: pointer;
                height: 11px;
                width: 11px;
                margin: 0 2px;
                background-color: #0056a4;
                transition: background-color 0.6s ease;
                border: 1px solid #0056a4;
            }

            .active {
                background-color: #ffffff;
                border: 1px solid #0056a4;
            }
            .dot:hover {
                background-color: #0056a4;
                border: 1px solid #ffffff;
            }
            `;
            document.getElementsByTagName('head')[0].appendChild(style);
            break;

            case 'brown-solid': 
                gsap.set('.dyn-bg', {backgroundColor:'#89693f' } );
                gsap.set('.product-title-copy', {color:'#89693f' } );
                gsap.set('.product-price-copy', {color:'#89693f' } );
                gsap.set('.product-cta-copy', {backgroundColor:'#89693f' } );
                gsap.set('.product-cta-endframe-copy', {color:'#89693f' } );

                gsap.set('#Path_77,#Path_78', {attr:{fill:'#89693f'}} );
                gsap.set('.disruptor-path', {attr:{fill:'#89693f'}});
            
                var style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = `
            
                .dot {
                    display: inline-block;
                    opacity: 1;
                    cursor: pointer;
                    height: 11px;
                    width: 11px;
                    margin: 0 2px;
                    background-color: #89693f;
                    transition: background-color 0.6s ease;
                    border: 1px solid #89693f;
                }

                .active {
                    background-color: #ffffff;
                    border: 1px solid #89693f;
                }
                .dot:hover {
                    background-color: #89693f;
                    border: 1px solid #ffffff;
                }
                `;
                document.getElementsByTagName('head')[0].appendChild(style);
                break;

            case 'brown-gradient': 
                gsap.set('.dyn-bg', {backgroundImage:'linear-gradient(0deg, hsla(34, 37%, 39%, 1) 0%, hsla(29, 25%, 84%, 1) 100%)' } );
                gsap.set('.product-title-copy', {color:'#89693f' } );
                gsap.set('.product-price-copy', {color:'#89693f' } );
                gsap.set('.product-cta-copy', {backgroundColor:'#89693f' } );
                gsap.set('.product-cta-endframe-copy', {color:'#89693f' } );

                gsap.set('#Path_77,#Path_78', {attr:{fill:'#89693f'}} );
                gsap.set('.disruptor-path', {attr:{fill:'#89693f'}});
            
                var style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = `
            
                .dot {
                    display: inline-block;
                    opacity: 1;
                    cursor: pointer;
                    height: 11px;
                    width: 11px;
                    margin: 0 2px;
                    background-color: #89693f;
                    transition: background-color 0.6s ease;
                    border: 1px solid #89693f;
                }

                .active {
                    background-color: #ffffff;
                    border: 1px solid #89693f;
                }
                .dot:hover {
                    background-color: #89693f;
                    border: 1px solid #ffffff;
                }
                `;
                document.getElementsByTagName('head')[0].appendChild(style);
                break;

                case 'black-solid': 
                gsap.set('.dyn-bg', {backgroundColor:'#000000' } );
                gsap.set('.product-title-copy', {color:'#000000' } );
                gsap.set('.product-price-copy', {color:'#000000' } );
                gsap.set('.product-cta-copy', {backgroundColor:'#000000' } );
                gsap.set('.product-cta-endframe-copy', {color:'#000000' } );

                gsap.set('#Path_77,#Path_78', {attr:{fill:'#000000'}} );
                gsap.set('.disruptor-path', {attr:{fill:'#000000'}});
            
                var style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = `
            
                .dot {
                    display: inline-block;
                    opacity: 1;
                    cursor: pointer;
                    height: 11px;
                    width: 11px;
                    margin: 0 2px;
                    background-color: #000000;
                    transition: background-color 0.6s ease;
                    border: 1px solid #000000;
                }

                .active {
                    background-color: #ffffff;
                    border: 1px solid #000000;
                }
                .dot:hover {
                    background-color: #000000;
                    border: 1px solid #ffffff;
                }
                `;
                document.getElementsByTagName('head')[0].appendChild(style);
                break;

            case 'black-gradient': 
                gsap.set('.dyn-bg', {backgroundImage:'linear-gradient(0deg, hsla(34, 0%, 0%, 1) 0%, hsla(29, 0%, 39%, 1) 100%)' } );
                gsap.set('.product-title-copy', {color:'#000000' } );
                gsap.set('.product-price-copy', {color:'#000000' } );
                gsap.set('.product-cta-copy', {backgroundColor:'#000000' } );
                gsap.set('.product-cta-endframe-copy', {color:'#000000' } );

                gsap.set('#Path_77,#Path_78', {attr:{fill:'#000000'}} );
                gsap.set('.disruptor-path', {attr:{fill:'#000000'}});
            
                var style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = `
            
                .dot {
                    display: inline-block;
                    opacity: 1;
                    cursor: pointer;
                    height: 11px;
                    width: 11px;
                    margin: 0 2px;
                    background-color: #000000;
                    transition: background-color 0.6s ease;
                    border: 1px solid #000000;
                }

                .active {
                    background-color: #ffffff;
                    border: 1px solid #000000;
                }
                .dot:hover {
                    background-color: #000000;
                    border: 1px solid #ffffff;
                }
                `;
                document.getElementsByTagName('head')[0].appendChild(style);
                break;

            case 'red-gradient': 
            case 'yellow-solid':
            case 'yellow-gradient':
            default:
                gsap.set('.dyn-bg', {backgroundImage:'linear-gradient(0deg, hsla(349, 85%, 39%, 1) 0%, hsla(352, 100%, 45%, 1) 100%)' } );
                gsap.set('.product-title-copy', {color:'#e6001e' } );
                gsap.set('.product-price-copy', {color:'#e6001e' } );
                gsap.set('.product-cta-copy', {backgroundColor:'#e6001e' } );
                gsap.set('.product-cta-endframe-copy', {color:'#e6001e' } );

                gsap.set('#Path_77,#Path_78', {attr:{fill:'#e6001e'}} );
                gsap.set('.disruptor-path', {attr:{fill:'#e6001e'}});

                var style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = `
            
                .dot {
                    display: inline-block;
                    opacity: 1;
                    cursor: pointer;
                    height: 11px;
                    width: 11px;
                    margin: 0 2px;
                    background-color: #e6001e;
                    transition: background-color 0.6s ease;
                    border: 1px solid #e6001e;
                }

                .active {
                    background-color: #ffffff;
                    border: 1px solid #e6001e;
                }
                .dot:hover {
                    background-color: #e6001e;
                    border: 1px solid #ffffff;
                }
                `;
                document.getElementsByTagName('head')[0].appendChild(style);   
        }

        
    //alignment correction since browser has different approach on rendering the text copy/layout.
    // if (ua.indexOf('safari') != -1) {
    //     if (ua.indexOf('chrome') > -1) {

    //     } else {
    //         for (var i = 0; i < 3; i++) {

    //             headline[i].style.letterSpacing = "-1px";
    //             cta[i].style.letterSpacing = "-1px";
    //         }


    //     }
    // }

    //pass along the dynamic profile values to local variable to appear on the creative display

    // logoImg.style.backgroundImage = "url('" + logoImageUrl[0] + "')";
    for (var i = 0; i < 3; i++) {
        slidePanel[i].src = bgImageUrlList[i];
    }
    
   
}


//execute the animation for the unit.
addAnimation = function (e) {

    tl = gsap.timeline({delay:0.5,duration:0.7,ease:"power0.out"});
    var headlineSplitText = new SplitText("#headline-copy", { type: "lines,words" }),
    hllines = headlineSplitText.lines; //an array of all the divs that wrap each character
    
    


    tl.to('#logo-wrapper', {autoAlpha:1, duration:0.5 })
    .to('.slideshow-container', {x:0,duration:1.1,ease:'sine.out'})
    .to('#logo-container',{x:-107,y:-209, scale:0.85,delay:1,duration:1.7, ease:"power3.out"},"logoSplit")
    .to('#logo-subheadline-container', {autoAlpha:0},"logoSplit+=1.5")
    .from(hllines, {duration: 1.2,
        autoAlpha: 0,
        x: -300,
        transformOrigin: "0% 50% -50",
        ease: "back.out",
        stagger: 0.04,onStart:()=>gsap.set('#headline-container',{autoAlpha:1})})
        .to('.slideshow-container', {clipPath: 'inset(0px 0 0 0)',delay:1,duration:1.3,ease:'sine.out',onStart:function(){
            gsap.to('#background-endframe', {x:0,duration:1.1,ease:'sine.out'})
        
            var imgAnim = gsap.timeline();

            imgAnim.to(document.querySelectorAll('.slide-panel')[0], {rotation:0.1,duration:3, x:'-12.5%', ease:'power0.none', onComplete:function(){
            }})
            .to(document.querySelectorAll('.slide-panel')[0], {rotation:0.1,delay:0.3,duration:1.5, x:'0%', ease:'power0.none', onComplete:function(){
                rotateInterval = gsap.delayedCall(1, rotateOnce);
            }})
        
        }})

}

//get random number
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

//Wait for the content to load to call the start od the ad
window.onload = function () {
    if (Enabler.isInitialized()) {
        enablerInitHandler();
    } else {
        Enabler.addEventListener(studio.events.StudioEvent.INIT, enablerInitHandler);
    }
};


/** CAROUSEL FUNCTIONALITY**/
initCarousel = function () {

    showSlides(slideIndex,"right");


}

// Next/previous controls
function plusSlides(n, direction) {
    previousImg = slideIndex;
    showSlides(slideIndex += n, direction);
    // rotateInterval = gsap.delayedCall(5.5, rotateOnce);
}

// Thumbnail image controls
function currentSlide(n) {

    var slides = document.querySelectorAll(".mySlides");
    var ctaBtn = document.querySelectorAll(".cta");
    var dots = document.querySelectorAll(".dot");
    var hl = document.querySelectorAll(".headline");
    var shl = document.querySelectorAll(".sub-headline");



    for(var j=0;j<slides.length;j++){
        TweenMax.set(slides[j],{x:0,scale:1,autoAlpha:0,zIndex:5,rotation:0.1})

    }
    TweenMax.set(slides[n-1],{x:0,scale:1,zIndex:6,rotation:0.1});
    TweenMax.set(slides[n-1],{autoAlpha:1,zIndex:6,rotation:0.1});

    for (var i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    dots[n - 1].className += " active";

    slideIndex = n;
    previousImg = n-1;
     
}
var previousImg = 0;
var ispageClick = false;
var pageTween;

//core function for the carousel layout, this is where the carousel configuration is invoke
function showSlides(n, direction) {
    var tl = new TimelineMax();
    var i;
    var slides = document.querySelectorAll(".mySlides");
    var hl = document.querySelectorAll(".headline");
    var shl = document.querySelectorAll(".sub-headline");
    var ctaBtn = document.querySelectorAll(".cta");
    var dots = document.querySelectorAll(".dot");

    onAnim = true;
    if (n > slides.length) {
        slideIndex = 1
    }
    if (n < 1) {
        slideIndex = slides.length
    }

    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    if(direction == 'right'){


        tl.fromTo(slides[slideIndex-1],.8,{rotation:0.1, x:300,scale:.8,autoAlpha:0,zIndex:1},{x:0,scale:1,autoAlpha:1,onComplete:function(){onAnim = false
        
         

        },onStart:function(){

            if(slideIndex != 1){
           
                var imgAnim = gsap.timeline();

                imgAnim.to(document.querySelectorAll('.slide-panel')[slideIndex-1], {rotation:0.1,delay:0.3, duration:3, x:'-12.5%', ease:'power0.none', onComplete:function(){
                }})
                .to(document.querySelectorAll('.slide-panel')[slideIndex-1], {rotation:0.1,delay:0.3,duration:1.5, x:'0%', ease:'power0.none', onComplete:function(){
                    rotateInterval = gsap.delayedCall(1, rotateOnce);
            }})
            }
        },zIndex:5},"init");



        if(previousImg!=0){
        TweenMax.to(slides[previousImg-1],.8,{x:-300,scale:.8,autoAlpha:1,zIndex:1,onComplete:function(){onAnim = false}});

        }


    }
    if(direction == 'left'){

        tl.fromTo(slides[slideIndex-1],.8,{x:-300,scale:.8,autoAlpha:0,zIndex:1},{x:0,scale:1,autoAlpha:1,onComplete:function(){onAnim = false},zIndex:5},"init")
        if(previousImg!=0){
        TweenMax.to(slides[previousImg-1],.8,{x:300,scale:.8,autoAlpha:1,onComplete:function(){onAnim = false},zIndex:1});

        }

    }

    dots[slideIndex - 1].className += " active";
    activeSlide = slideIndex - 1;

}

//check if carousel starts the auto-rotation, call once then stop after the initial sequence
var firstRotate = true;
var isHover = false;
function rotateOnce() {

    plusSlides(1, "right");
    firstRotate = false;
    if (previousImg == 2 && !firstRotate) {
    // clearInterval(interval);
    rotateInterval.kill();
    gsap.killTweensOf(rotateOnce);
    gsap.to('#background-endframe', {delay:4.5,clipPath: 'inset(0px 0 0 0)',duration:1.3,ease:'sine.out',onComplete:function(){
        gsap.to('#logo-wrapper-endframe,.product-cta-endframe,#replay_btn', {stagger:0.2,delay:0.8,autoAlpha:1, duration:0.5 })
    }});
    

    }
}

function pageClick(isPageClick) {

    if(isPageClick) {
        gsap.set('.slide-panel', {x:0})
        // rotateInterval.kill();
        gsap.killTweensOf(rotateOnce);
        pageTween =  gsap.delayedCall(3.5,function(){
            gsap.to('#background-endframe', {clipPath: 'inset(0px 0 0 0)',duration:1.3,ease:'sine.out',onComplete:function(){
                gsap.to('#logo-wrapper-endframe,.product-cta-endframe,#replay_btn', {stagger:0.2,delay:0.8,autoAlpha:1, duration:0.5 })
            }});
        });
    }

}

if (!String.prototype.includes) {
  String.prototype.includes = function (str) {
    return this.indexOf(str) !== -1;
  }
}


///////////////////////////////////////////////////
/*                  HELPERS                      */
///////////////////////////////////////////////////

var util = (function() {
	var _this = {};

	// element selector
	_this.ele = function(elem) {
		return document.querySelector(elem);
	}

    // hex to rgba

    _this.hexToRgbA = function (hex){
        var c;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length== 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',0.85)';
        }
        //throw new Error('Bad Hex');
    }

	_this.toTitleCase = function (str)
	{
	    //return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	    str=true ? str.toLowerCase() : str;
	    return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
	    function(firstLetter){
	    return firstLetter.toUpperCase();
	    });
	}

	_this.strLang;
	_this.strSLang;
	_this.strULang;
	_this.strSep;
	_this.strPair;
	_this.strOnError;
	_this.strTypeLng;
	_this.strTypeBrLng;
	_this.strTypeSysLng;
	_this.strTypeUsrLng;
	_this.strOut;

	_this.checkLang =  function() {
	    "use strict";
	    _this.strSep = "|";
	    _this.strPair = "=";
	    _this.strOnError = "Error";
	    _this.strLang = null;
	    _this.strSLang = null;
	    _this.strULang = null;
	    _this.strTypeLng = null;
	    _this.strTypeBrLng = null;
	    _this.strTypeSysLng = null;
	    _this.strTypeUsrLng = null;
	    _this.strOut = null;

	    try {
	        _this.strTypeLng = typeof (navigator.language);
	        _this.strTypeBrLng = typeof (navigator.browserLanguage);
	        _this.strTypeSysLng = typeof (navigator.systemLanguage);
	        _this.strTypeUsrLng = typeof (navigator.userLanguage);

	        if (_this.strTypeLng !== "undefined") {
	            _this.strLang = navigator.language;
	        } else if (_this.strTypeBrLng !== "undefined") {
	            _this.strLang = navigator.browserLanguage;
	        } else {
	            _this.strLang = null;
	        }

	        if (_this.strTypeSysLng !== "undefined") {
	            _this.strSLang = navigator.systemLanguage;
	        } else {
	            _this.strSLang = null;
	        }

	        if (_this.strTypeUsrLng !== "undefined") {
	            _this.strULang = navigator.userLanguage;
	        } else {
	            _this.strULang = null;
	        }
	        _this.strOut = _this.strLang || _this.strSLang || _this.strULang;
	        return _this.strOut.toLowerCase();

	    } catch (err) {
	        return _this.strOnError;
	    }
	}

	_this.autoresizeText = function (el) {
		// If argument is not a DOMelement, return false
		if (el.nodeType !== 1) return false;
		var txt = el.innerHTML,
		// Get styles of original element
		styles = window.getComputedStyle(el, null),
		fontsize = parseInt(styles['font-size'], 10),
		padding = parseInt(styles['padding-left'], 10) + parseInt(styles['padding-right'], 10),
		indent = parseInt(styles['text-indent'], 10),
		fontfamily = styles['font-family'],
		// Set width of the original element
		elx = parseInt(el.offsetWidth, 10) - padding - indent,
		// New placeholder element
		placeholder = document.createElement('div'),
		newfontsize;
		// Set the placeholder to fit the text precisely
		placeholder.setAttribute('style', 'float:left;white-space:nowrap;visibility:hidden;font-size:' + fontsize + 'px;font-family:' + fontfamily);
		placeholder.innerHTML = txt;
		// And add to the current DOM
		document.body.appendChild(placeholder);
		if (placeholder.offsetWidth > elx) {
		// If the text is too big, decrease font-size until it fits
		while (placeholder.offsetWidth > elx) {
			placeholder.style.fontSize = parseInt(placeholder.style.fontSize, 10) - 1 + 'px';
		};
		} else {
		// If the text is too small, increase font-size until it fits
		while (placeholder.offsetWidth < elx) {
			placeholder.style.fontSize = parseInt(placeholder.style.fontSize, 10) + 1 + 'px';
		};
		}
		newfontsize = parseInt(placeholder.style.fontSize, 10) - 1;
		// Default the maximum fontsize is the initial fontsize.
		// If you want the text to grow bigger too, change the following line to
		// el.style.fontSize = newfontsize + 'px';
		el.style.fontSize = (newfontsize < fontsize ? newfontsize : fontsize) + 'px';
		// Clean up the placeholder
		placeholder.parentElement.removeChild(placeholder);

	}



    _this.applyAutoresize = function (eleId, options) {
        var settings = extend({
           maximum   : 9999,
           minimum   : 1,
           maxFont   : 9999,
           minFont   : 1,
           fontRatio : 35
        }, options),

        changes = function(el) {

             var el = _this.ele(eleId),
             elw = el.offsetWidth,
             width = elw > settings.maximum ? settings.maximum : elw < settings.minimum ? settings.minimum : elw,
             fontBase = width / settings.fontRatio,
             fontSize = fontBase > settings.maxFont ? settings.maxFont : fontBase < settings.minFont ? settings.minFont : fontBase;
             TweenMax.set(el,{fontSize:fontSize+'px'});

         };

        window.onresize = function(){changes(eleId);}
        changes(eleId);
    };

    var extend = function(out) {
      out = out || {};

      for (var i = 1; i < arguments.length; i++) {
        if (!arguments[i])
          continue;

        for (var key in arguments[i]) {
          if (arguments[i].hasOwnProperty(key))
            out[key] = arguments[i][key];
        }
      }

      return out;
    };

    _this.preloadImages = function(imgArray, callbackFunction) {
        var totalImages = imgArray.length,
        loadedImages = 0,
        img = null,
        i;
        for (i = 0; i < totalImages; i++) {
            img = document.createElement("img");
            img.src = imgArray[i];
            img.onload = function () {
                loadedImages++;
                if (loadedImages === totalImages) {
                    callbackFunction();
//                    console.log("images loaded!")
                }
            };
        }
    }

	return _this;

}());

//check if IE browser
/**
 * detect IE
 * returns version of IE or false, if browser is not Internet Explorer
 */
function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
       // Edge (IE 12+) => return version number
       return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}

var ExitsAndCounters = (function () {
	var hotspots = document.querySelectorAll('.hotspot');
	function init() {
		/** Exit works by targeting all divs with a class of '.hotspot'. */
		hotspots.forEach((hotspot) => hotspot.addEventListener('click', exitEvents));

		/** Counter works buy dispatching a custom event called 'counterevents'. */
		window.addEventListener('counterevents', counterEvents);
	}

	function exitEvents(e) {
		e.stopPropagation;
		switch (e.target.dataset.label) {
			case 'bg-exit':
				Enabler.exitOverride('BG_EXIT', bgExitUrL);
				break;
			case 'cta-exit':
			Enabler.exitOverride('CTA_EXIT', bgExitUrL);
			break;
		}
	}

	function counterEvents(e) {
		switch (
			e.detail
			// case 'left-arrow':
			// 	Enabler.counter('LEFT_ARROW');
			// 	break;
		) {
		}
	}

	return {
		init: init,
	};
})();

//
// ────────────────────────────────────────────────────────── I ──────────
//   :::::: U T I L I T I E S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────
//

var Utilities = ( function () {

	//
	// ─── QUERY SELECTOR ─────────────────────────────────────────────────────────────
	//

	function selector ( query ) {

		var t = document.querySelectorAll( query );
		return ( t.length === 0 ) ? false : ( t.length === 1 ) ? t[0] : t;

	}

	//
	// ─── TRIGGER CUSTOM EVENT ───────────────────────────────────────────────────────
	//

	function triggerEvent ( element, eventName, data ) {
		if ( document.createEvent ) {
			var event = document.createEvent( 'CustomEvent' );
			event.initCustomEvent( eventName, true, true, data );
		} else {
			// eslint-disable-next-line no-redeclare
			var event = new CustomEvent( eventName, { detail : data } );
		}

		element.dispatchEvent( event );
	}

	function normalizeJson ( str ) {
		return str.replace( /[\s\n\r\t]/gs, '' ).replace( /,([}\]])/gs, '$1' )
			.replace( /([,{\[]|)(?:("|'|)([\w_\- ]+)\2:|)("|'|)(.*?)\4([,}\]])/gs, ( str, start, q1, index, q2, item, end ) => {
				item = item.replace( /"/gsi, '' ).trim();
				if( index ) {index = '"' + index.replace( /"/gsi, '' ).trim() + '"';}
				if( !item.match( /^[0-9]+(\.[0-9]+|)$/ ) && ![ 'true', 'false' ].includes( item ) ) {item = '"' + item + '"';}
				if( index ) {return start + index + ':' + item + end;}
				return start + item + end;
			} );
	}

	/** Dynamically fit the text inside it's own width and height. */
	function fitText(textElement, minFontSize = 0, maxHeight = Infinity) {
		let containerStyle = window.getComputedStyle(textElement);
		let containerWidth = parseFloat(containerStyle.width);
		let containerHeight = textElement.clientHeight - parseFloat(containerStyle.paddingTop) - parseFloat(containerStyle.paddingBottom);

		let textWidth = textElement.scrollWidth;
		let textHeight = textElement.scrollHeight;

		let fontSize = parseFloat(containerStyle.fontSize);
		let fontSizeNum = fontSize;

		if (maxHeight !== Infinity) {
			textElement.style.maxHeight = maxHeight + 'px';
			containerHeight = textElement.clientHeight - parseFloat(containerStyle.paddingTop) - parseFloat(containerStyle.paddingBottom);
		}

		if ((textWidth > containerWidth || textHeight > containerHeight) && fontSizeNum > minFontSize) {
			function adjustFontSize() {
				textWidth = textElement.scrollWidth;
				textHeight = textElement.scrollHeight;

				if ((textWidth > containerWidth || textHeight > containerHeight) && fontSizeNum > minFontSize) {
					fontSizeNum--;
					textElement.style.fontSize = fontSizeNum + 'px';
					requestAnimationFrame(adjustFontSize);
				}
			}

			adjustFontSize();
		}

		textElement.style.height = 'auto';
	}


	return {

		selector : selector,
		triggerEvent : triggerEvent,
		normalizeJson : normalizeJson,
		fitText: fitText
	};

} )();
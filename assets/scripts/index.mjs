import { textToSpan } from "./utils.js";

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

// getting HTMLElement
const heroWrapper = document.querySelector('.hero__wrapper');

const heroImgElements = document.querySelectorAll('.hero__wrapper .img-set.dynamic');



// loading header animation

const header = document.querySelector('header');

const headerCenterLowerText = document.querySelector('.header__center p');
headerCenterLowerText.innerHTML = textToSpan(headerCenterLowerText.innerText,'lower-text');

gsap.set('body',{maxHeight: '100vh',overflow:'hidden'});
let tl1 = gsap.timeline();
// -----A.I sheep text anim
tl1.from('.header__center p .lower-text',{duration: 0.5,y:'100%',stagger: 0.4})
// ----header translate up to top of viewport 
tl1.from('header',{duration: 1, y: (window.innerHeight/2 - header.getBoundingClientRect().height/2)})
tl1.addLabel('startHeader','<');
// ----show Home, Contact and fade out a.i sheep text
tl1.from('.header__left',{duration: 0.3,opacity: 0});
tl1.from('.header__right',{duration: 0.3,opacity: 0},"<");
tl1.to('.header__center .sheep-text',{duration:0.3,opacity:0},"<");
// -----show enter screen
tl1.to('.enter-screen',{duration: 0.3, opacity:1},"<");
// ---- show main after click enter button
let tl2 = gsap.timeline({paused:true});
tl2.to('main',{duration: 0.5,opacity:1,ease:'linear',onstart:() => {
    document.querySelector('body').style.overflow = 'visible';
    document.querySelector('main').style.visibility = 'visible';
    document.querySelector('main').style.display = 'block';
    document.querySelector('html').style.overflow = 'visible';
}})
tl2.to('.header-overlay',{duration: 0.8,opacity:0,zIndex:0 },"<");
// ---- add click event to enter screen button
const enterBtn = document.querySelector('.enter-screen h2');
const enterScreenFadeOut = gsap.to('.enter-screen',{duration: 0.2,opacity:0,onend: () => {
    document.querySelector('.enter-screen').style.display = 'none';
    document.querySelector('.enter-screen').style.visibility = 'hidden';
},paused:true})
enterBtn.addEventListener('click',() => {
    enterScreenFadeOut.play();
    tl2.play();
})





gsap.to('.header',{paddingTop: '20px',scrollTrigger : {
    trigger: 'main',
    start: 'top 200px',
    toggleActions: 'play none none reverse'
}})


gsap.to('.header__logo-wrapper',{width: '12.5vw',paddingTop:'0px',scrollTrigger : {
    trigger: 'main',
    start: 'top 200px',
    toggleActions: 'play none none reverse'
}})

gsap.to('.header a',{width: '180px',fontSize: '1.5vw',scrollTrigger : {
    trigger: 'main',
    start: 'top 200px',
    toggleActions: 'play none none reverse'
}})




// Hero section clip path animation
const cursorPos_Hero = {
    x:0,
    y:0,
}
const heroClipPathArr = [];
class HeroClipPath {
    constructor(baseAngle){
        this.top = 0;
        this.left = 0;
        this.right = 0;
        this.bottom = 0;
        this.index = 0;
        this.element;
        this.radius = window.innerWidth/8;
        this.boxDimension = (this.radius * 0.8)*2;
        this.baseAngle = baseAngle;
    }
    
    setPosition(origin,angle){
        const heroBoundingRect = heroWrapper.getBoundingClientRect();
        angle += this.baseAngle;
        this.top = origin.y + this.radius * Math.sin(angle) - this.boxDimension/2;
        this.left = origin.x + this.radius * Math.cos(angle) - this.boxDimension/2;
        this.bottom =  heroBoundingRect.height - this.top - this.boxDimension;
        this.right =  heroBoundingRect.width - this.left - this.boxDimension;
        this.setElementProp();
    }

    setElementProp(){
        this.element.style.setProperty('--top',`${this.top}px`);
        this.element.style.setProperty('--right',`${this.right}px`);
        this.element.style.setProperty('--bottom',`${this.bottom}px`);
        this.element.style.setProperty('--left',`${this.left}px`);
    }

    resetBoxDimension() {
        this.radius = window.innerWidth/8;
        this.boxDimension = (this.radius * 0.8)*2;
    }

}



for (let i = 0 ; i < 3; i++){
    const heroClipPath = new HeroClipPath(Math.PI *2 /3 * i);
    heroClipPath.element = heroImgElements[i];
    heroClipPathArr.push(heroClipPath);
}

window.addEventListener('mousemove',(event) => {
    cursorPos_Hero.x = event.pageX - heroWrapper.offsetLeft;
    cursorPos_Hero.y = event.pageY - heroWrapper.offsetTop;
})


const scrollObj ={
    curr: 0,
    prev:0,
    delta:0
}

window.addEventListener('scroll',() => {
    scrollObj.curr = window.scrollY;
    scrollObj.delta = scrollObj.curr - scrollObj.prev;
    scrollObj.prev = scrollObj.curr;

    cursorPos_Hero.y = cursorPos_Hero.y + scrollObj.delta;
})

window.addEventListener('resize',() => {
    heroClipPathArr.forEach(clipPath => {
        clipPath.resetBoxDimension();
    })
})

let anim_var = {
    angle:0,
}

gsap.to(anim_var,{duration: 6, angle: Math.PI * 2,ease:'linear',repeat: -1,onUpdate: () => {
    heroClipPathArr.forEach(clipPath => {
        clipPath.setPosition(cursorPos_Hero, anim_var.angle);
    })
}})



// Comparison Image clip path Handle
gsap.registerPlugin(ScrollTrigger);

gsap.fromTo('.img-wrapper img.front',{'--right': '100%','--top':'0%'},{'--right': '-5%','--top': '20%',scrollTrigger : {
    trigger: '.comparison-img',
    pin:'.comparison-img',
    start: 'start 100px',
    end:'top -1500px',
    scrub: 2,

}})

gsap.fromTo('.img-wrapper img.back',{'--left': '105%','--bottom':'80%'},{'--left': '0%','--bottom':'100%',scrollTrigger : {
    trigger: '.comparison-img',
    start: 'start 100px',
    end:'top -1500px',
    scrub: 2,

}})

gsap.fromTo('.text-overlay',{x: 0},{x: '-35%',scrollTrigger : {
    trigger: '.comparison-img',
    start: 'start 100px',
    end:'top -1500px',
    scrub: 2,
}})


// theModels Section 

gsap.from('.theModels .bottom .right-text .line',{width: '0%',duration: 1.5,scrollTrigger : {
    trigger: '.theModels .bottom',
    start: 'start+=20% bottom-=20%',
    toggleActions: 'play none none reset'
}})

// feature section

let tl_feature_heading = gsap.timeline();

tl_feature_heading.fromTo('.feature .feature__heading .heading-wrapper',{x: '0%'},{x:'-100%',duration:10,ease:'linear'});

tl_feature_heading.repeat(-1);
// ---feature heading line anim
gsap.to('.feature .line',{duration: 0.8,width: '100%',scrollTrigger:{
    trigger: '.feature__heading',
    start: 'bottom+=50 bottom',
    toggleActions:'play none none reset'
}})

// showReel section
// -----Pin showreel section
let tl_ShowReel = gsap.timeline({
    scrollTrigger : {
        trigger: '.show-reel',
        start: 'start start',
        end: '+=4000',
        pin:true,
        scrub:1,
    }
})
// ---show reel image
let showReelBGSlide = gsap.to('.show-reel__bg',{duration: 1, left: '100%',paused:true,ease:'slow',paused:true});

let showVideo = gsap.to('.show-reel .movie',{duration: 1, '--right': '100%',paused:true,ease:'slow',paused:true});

const showReelVideo = document.querySelector('.show-reel .movie video');
// ----- combine 3 image into 1
gsap.to('.show-reel .show-reel__image',{'--black': '20%','--displacement':'-30%',duration:0.5,scrollTrigger:{
    trigger: '.show-reel',
    start: 'start start',
    end: '+=1500',
    scrub:1,
    toggleActions: "play complete reverse reset",

    onLeave : () => {
        showReelBGSlide.play();
        gsap.set('.show-reel .movie',{visibility:'visible',opacity:1});
        showVideo.play();
        showReelVideo.load();
        showReelVideo.play();
    },
    onEnterBack: () => {
        showReelBGSlide.reverse();
        gsap.set('.show-reel .movie',{visibility:'hidden',opacity:0});
        showVideo.reverse();
        showReelVideo.pause();
    }
}});

// -----clip path move up to hide image
tl_ShowReel.to('body',{duration: 0.375})
tl_ShowReel.to('.show-reel .show-reel__image',{'--bottom': '0%',duration:0.325});
tl_ShowReel.to('.show-reel__video-text',{'--top': '50%',duration:0.325},'<');
tl_ShowReel.to('body',{duration: 0.3})




// --- text Create

gsap.fromTo('.show-reel .text-create p span',{y:'500%'},{y:'-1200%',scrollTrigger:{
    trigger: '.show-reel',
    start: 'start start+=20%',
    end: '+=1500',
    scrub: 0.1,
}})


// Customize Section

const customizeText = document.querySelectorAll('.customize .top .customize__heading p');
for(let i = 0; i< customizeText.length; i++){
    gsap.from(customizeText[i],{y: `${i* -100}%`,opacity:0,duration:0.6,scrollTrigger:{
            trigger: '.customize',
            start:'center bottom',
            end:'<+=400',
            toggleActions:'play none none reverse',
        }
    })
}

// Dress up Section

let dressUpTL = gsap.timeline({
    scrollTrigger:{
        trigger: '.dress-up',
        pin:true,
        scrub:1,
        start:'start start',
        end:'+=3000'
    }
})
const dressUpImageArr = document.querySelectorAll('.dress-up .image-wrapper img');
const paramTextArr = document.querySelectorAll('.dress-up .param-text');

for(let i = 1; i < dressUpImageArr.length; i++){
    const paramObj = {
        count: 0,
    }
    const fraction = paramTextArr[i-1].querySelector('.fraction');
    const whole = paramTextArr[i-1].querySelector('.whole');
    dressUpTL.to(dressUpImageArr[i],{duration:0.2,'--top':'0%'});
    dressUpTL.to(paramTextArr[i-1],{duration:0.2,'--bottom':'100%'},'<');
    dressUpTL.to(paramObj,{duration: 0.2, count: 1,onUpdate:() => {
        if(paramObj.count < 1){
            fraction.innerText = paramObj.count.toFixed(6)*1000000;
            whole.innerText = 0;
            return;
        }
        whole.innerText = 1;
        fraction.innerText = '000000';
    }},'<')
}

let dressUpSlideUp = gsap.timeline({
    scrollTrigger:{
        trigger: '.dress-up',
        scrub:1,
        start:'start+=1 start',
        end : 'center start',
    }
});

dressUpSlideUp.to('.dress-up',{duration: 0.8,'--main-top':'50%'});
dressUpSlideUp.to('.dress-up .image-wrapper img',{duration: 0.8, scale: 1.4,y:'40%'},'<');
dressUpSlideUp.to('.dress-up',{duration: 0.2,'--main-top': '100%'});

// footer section

const career = document.querySelector('.careers');

career.addEventListener('mouseenter',()=>{
    gsap.fromTo('.careers .bg',{'--left': '0%','--right': '100%'},{'--left': '0%','--right': '0%',duration: 0.5,ease:'slow'})
})
career.addEventListener('mouseleave',() => {
    gsap.fromTo('.careers .bg',{'--left': '0%','--right': '0%'},{'--left': '100%','--right': '0%',duration: 0.6,ease:'slow'})
    console.log('mouseout');
})

// Ai card section

const cardRowsArr = document.querySelectorAll('.ai-cards .cards-list .row');
console.log(cardRowsArr);
cardRowsArr.forEach(row => {
    const tl = gsap.timeline({scrollTrigger : {
        trigger: row,
        start:'bottom-=20% bottom',
        end: '<',
        toggleActions:'play complete none reverse'
    }});
    tl.to(row.querySelectorAll('.card.modified'),{opacity:1,duration: 1});
})

cardRowsArr.forEach(row => {
    const tl2 = gsap.timeline({
        scrollTrigger: {
            trigger: row,
            start: 'bottom-=20% bottom',
            end:'<',
            toggleActions:'play none reset reset'
        }
    });
    tl2.fromTo(row.querySelectorAll('.card.modified .overlay'),{'--left': '0%','--right':'100%'},
    {'--left':'0%','--right': '0%',duration: 0.5,ease:'slow'});
    tl2.fromTo(row.querySelectorAll('.card.modified .overlay'),{'--left': '0%','--right':'0%'},
    {'--left':'100%','--right': '0%',duration: 0.5,ease:'slow'});
})





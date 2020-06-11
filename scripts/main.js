let client;
let page;

const BASE_IMAGE_URL = 'https://images.ctfassets.net/';
const ENTRIES = {
  'home': '3HNo4cZbc7eKortwfaOzOf',
  'business': '2d29rmKQNdknaC0MW7sDtf'
}

let hasScrolled = false; //first time this is true, play intro vid

const mainModule = (function(document) {

  init = function() {
    configureContent();
  }

  addVideoLoader = function(){
    const video = document.querySelector('.page-intro-video');
    video.addEventListener('canplaythrough', (event) => {
      setTimeout(()=>{
        console.log('can play through');
        document.querySelector('body').classList.toggle('loading',false);
      },1000);
    });
  }

  configureContent = function(){
    client = contentful.createClient({
      space: 'nbpmbu0iyv08',
      accessToken: 'wDINDuN3Vtyxq0orSCGfl7m3jFaJopZs3jCE5KNBPfk'
    });
    page = document.querySelector('body').id;
    if (page === 'home'){
      addVideoLoader();
    } else if (page === 'about'){
      getValuesData();
    }
    addSiteListeners();
    getBusinessData();
  }

  getValuesData = function(){
    client.getEntries({
      content_type: "values"
    }).then(function (response) {
      const valuesArr = response.items;
      let valuesMarkup = '';
      const sortedValues = [];
      valuesArr.forEach((valueItem) => {
        const valueObj = addValueItem(valueItem.fields);
        sortedValues.push(valueObj);
      });

      sortedValues.sort(function(a, b) {
        return a.order - b.order;
      });
      sortedValues.forEach((valueObj)=>{
        valuesMarkup += valueObj.valueMarkup;
      });

      document.querySelector('.home-values-list').innerHTML = valuesMarkup;
      
    });
  }

  addValueItem = function(fields,){
    const { valueTitle, valueDescription, valueIcon, order } = fields;
    
    if (valueTitle && valueDescription && valueIcon){
      const valueTemplate = 
      `<li class="value-item" data-id="${valueTitle}">
        <img src="${valueIcon.fields.file.url}" alt="${valueTitle}" class="value-image">
        <div class="value-content">
          <h4 class="value-title">${valueTitle}</h4>
          <p class="value-description">${valueDescription}</p>
        </div>
      </li>`;
      const valuesObj = {
        order: order,
        valueMarkup: valueTemplate,
      }
      return valuesObj;
    } else {
      console.error('DOM element does not exist',$selector);
    }
  }


  getBusinessData = function(){
    client.getEntry(ENTRIES.business)
    .then(function (entry) {
      const {addressLine1, addressLine2, email} = entry.fields;
      addContent(addressLine1,'.footer-address-line-1');
      addContent(addressLine2,'.footer-address-line-2');
      addEmailLink(email,'.footer-email');
      addCopyrightYear('.footer-copyright-year');
    });
  }

  addSiteListeners = function(){
    document.querySelector('.site-nav-toggle').addEventListener('click',onSiteNavToggleClick);
    
    if (page === 'home'){
      document.querySelector('.page-intro-video').onclick = (e)=>{
        playIntroVideo(e);
      };
      window.addEventListener("scroll",onScroll);
    }
  }

  onScroll = function(e){
    if (hasScrolled){
      window.removeEventListener("scroll",onScroll);
      return;
    }
    const isVideoPlaying = checkIfVideoPlaying(document.querySelector('.page-intro-video'));
    hasScrolled = true;
    if (!isVideoPlaying){
      playIntroVideo();
    }
  }

  checkIfVideoPlaying = (video)=>{
    return !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);
  }

  playIntroVideo = ()=>{
    document.querySelector('.page-intro-video').play();
  }

  onSiteNavToggleClick = (e)=>{
    const $mobileNav = e.currentTarget.parentElement;
    $mobileNav.classList.toggle('active');
    document.body.classList.toggle('nav-active');
  }

  addContent = function(content,$selector){
    if (content){
      const $el = document.querySelector($selector);
      if ($el){
        $el.innerHTML = content;
      } else {
        console.error('DOM element does not exist',$selector);
      }
    } else {
      console.error('data does not exist',content);
    }
    
  }

  addImage = function(imageData,$selector){
    if (imageData){
      const $el = document.querySelector($selector);
      if ($el){
        document.querySelector($selector).setAttribute("src",`https:${imageData.fields.file.url}`);
      } else {
        console.error('image element does not exist',$selector);
      }
    } else {
      console.error('data does not exist',imageData);
    }
  }

  addEmailLink = function(email,$selector){
    if (email){
      const $el = document.querySelector($selector);
      if ($el){
        $el.setAttribute("href",`mailto:${email}`);
        $el.innerHTML = email;
      } else {
        console.error('DOM element does not exist',$selector);
      }
    } else {
      console.error('data does not exist',content);
    }
  }

  addVideo = function(id,$selector){
    if (id){
      const $el = document.querySelector($selector);
      if ($el){
        $el.setAttribute("src",`https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0`);
      } else {
        console.error('video element does not exist',$selector);
      }
    } else {
      console.error('video data does not exist',id);
    }
  }

  addCopyrightYear = function($selector){
    const $el = document.querySelector($selector);
    if ($el){
      const today = new Date();
      document.querySelector($selector).innerHTML = today.getFullYear();
    } else {
      console.error('DOM element does not exist',$selector);
    }
  }

  return {
    init: init,
    page: page,
  };
})(document);

document.addEventListener("DOMContentLoaded", function(){
  mainModule.init();
});
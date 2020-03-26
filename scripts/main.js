let client;
let page;

const BASE_IMAGE_URL = 'https://images.ctfassets.net/';
const ENTRIES = {
  'home': '3HNo4cZbc7eKortwfaOzOf',
  'about': '6qePITHJIMvrh5C8zxusXU',
  'business': '2d29rmKQNdknaC0MW7sDtf'
}

const mainModule = (function(document) {

  init = function() {
    configureContent();
    addSiteListeners();
  }

  configureContent = function(){
    client = contentful.createClient({
      space: 'nbpmbu0iyv08',
      accessToken: 'wDINDuN3Vtyxq0orSCGfl7m3jFaJopZs3jCE5KNBPfk'
    });
    page = document.querySelector('body').id;
    switch(page){
      case 'home':
        getHomePageData();
        break;
      case 'about':
        getAboutPageData();
        getValuesData();
    }
    getBusinessData();
  }

  getHomePageData = function(){
    client.getEntry(ENTRIES.home)
    .then(function (entry) {
      console.log(entry.fields);
      const {introTitleLine1, introTitleLine2, introImage, introButtonText, bodyCopy,vimeoVideoId} = entry.fields;
      addStandardIntroData({introTitleLine1, introTitleLine2, introImage, introButtonText});
      

      addContent(bodyCopy,'.home-quote');
      addVideo(vimeoVideoId,'.video-iframe');

    });
  }

  getAboutPageData = function(){
    client.getEntry(ENTRIES.about)
    .then(function (entry) {
      const {introTitleLine1, introTitleLine2, introImage, introButtonText, valuesTitle} = entry.fields;
      addStandardIntroData({introTitleLine1, introTitleLine2, introImage, introButtonText});
      addContent(valuesTitle,'.content-section-title');
    });
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

      document.querySelector('.about-values-list').innerHTML = valuesMarkup;
      
    });
  }

  addValueItem = function(fields,){
    const { valueTitle, valueDescription, valueIcon, order } = fields;

    if (valueTitle && valueDescription && valueIcon){
      const valueTemplate = 
      `<li class="about-value-item" data-id="${valueTitle}">
        <img src="${valueIcon.fields.file.url}" alt="${valueIcon.fields.file.title}" class="about-value-image">
        <div class="about-value-content">
          <h4 class="about-value-title">${valueTitle}</h4>
          <p class="about-value-description">${valueDescription}</p>
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

  addStandardIntroData = function(fields){
    const {introTitleLine1, introTitleLine2, introImage, introButtonText} = fields;

    addContent(introTitleLine1,'.page-intro-line-one');
    addContent(introTitleLine2,'.page-intro-line-two');
    addContent(introButtonText,'.page-intro-button-link');
    addImage(introImage,'.page-intro-image');
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
  }

  onSiteNavToggleClick = (e)=>{
    const $mobileNav = e.currentTarget.parentElement;
    $mobileNav.classList.toggle('active');
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
        document.querySelector($selector).setAttribute("src",`https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0`);
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

window.onload = function(){
  mainModule.init();
}

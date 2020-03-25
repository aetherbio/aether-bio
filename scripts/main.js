let client;
let page;

const mainModule = (function(document) {

  init = function() {
    console.log(contentful);
    configureContentful();
    getData();
    addSiteListeners();
  }

  configureContentful = function(){
    client = contentful.createClient({
      space: '1lkiepv11wqc',
      accessToken: 'RwxLp1wT6n025alHYLR6Gtj1aDjyVzfHDw4tqbDHiXs'
    });
    page = document.querySelector('body').id;
  }

  getData = function(){
    client.getEntry('2EvEQlSrxwzhucJ3Jcn2eh')
    .then(function (entry) {
      console.log(entry.fields);
      document.querySelector('.page-intro-line-one').innerHTML = entry.fields.introTitleLineOne;
      document.querySelector('.page-intro-line-two').innerHTML = entry.fields.introTitleLineTwo;
    });
  }

  onSiteNavToggleClick = (e)=>{
    const $mobileNav = e.currentTarget.parentElement;
    $mobileNav.classList.toggle('active');
  }

  addSiteListeners = function(){
    document.querySelector('.site-nav-toggle').addEventListener('click',onSiteNavToggleClick);
  }

  return {
    init: init,
    page: page,
  };
})(document);

window.onload = function(){
  mainModule.init();
}

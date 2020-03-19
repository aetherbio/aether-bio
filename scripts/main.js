const mainModule = (function(document) {
  this.page = document.querySelector('body').id;

  init = function() {
    addSiteListeners();
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

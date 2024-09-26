var isMobile = window.matchMedia("(max-width: 850px)").matches;
var isIPad = window.matchMedia("(pointer: coarse)").matches && $(".safari.mac").length && !!navigator.maxTouchPoints;

var Theme = window.Theme || {
  $: {},
  init: function() {
    this.Turbolinks.init();
    this.bindEvents();
    this.reload();
  },
  reload: function() {
    Theme.$ = {
      html: $("html"),
      body: $("body"),
      header: $(".header"),
      menu: $(".menu-outer"),
      headerLogoWrap: $(".header-logo-container"),
      headerItemsWrap: $(".header-items-container"),
      container: $(".container"),
      zoomContainer: $(".gallery-zoom-container"),
      categoryLink: $(".category a"),
      menuToggle: $(".mobile-menu-trigger"),
      textWrap: $(".text-wrap"),
      assetsWrap: $(".assets-grid-wrapper"),
      assetsGrid: $(".assets-grid"),
      galleryScroll: $('.gallery-scroll'),
      asset: $(".asset"),
      logo: $(".logo"),
      logoImage: $(".logo img"),
      galleryElement: $(".gallery-element, .embed-container .preview, .embed-container .preview > *"),
      headerText: $(".gallery-element.text-element .text")
    };
    this.Menu.init();
    this.initJSForPageType();
  },
  initJSForPageType: function() {
    Theme.$.container.addClass("show-container");
    var pageType = this.normalizedPageType();
    if (window.Theme.hasOwnProperty(pageType)) {
      window.Theme[pageType].init();
    }
  },
  bindEvents: function() {
    $(window).on("resize", function() {
      isMobile = window.matchMedia("(max-width: 850px)").matches;
    });

    // call the resize event when changing
    // orientation on a mobile device
    window.addEventListener("orientationchange", function() {
      window.dispatchEvent(new Event("resize"));
    }, false);
  },
  normalizedPageType: function() {
    // this theme doesn't have nested pages, but in case we ever add them
    var pageType;
    if (_4ORMAT_DATA.page.hasOwnProperty("nested")) {
      pageType = _4ORMAT_DATA.page.nested.type.charAt(0).toUpperCase() + _4ORMAT_DATA.page.nested.type.slice(1);
    } else {
      pageType = _4ORMAT_DATA.page.type.charAt(0).toUpperCase() + _4ORMAT_DATA.page.type.slice(1);
    }
    return pageType;
  }
};

window.Theme.Turbolinks = window.Theme.Turbolinks || {
  init: function() {
    $(window).on("page:before-change", this.onBeforeChange.bind(this));
    $(window).on("page:load", this.onPageLoad.bind(this));
    $(window).on("page:update", this.onUpdate.bind(this));
  },
  onBeforeChange: function(e) {
    // fade out container on page change
    Theme.$.container.removeClass("show-container");
  },
  onUpdate: function(e) {
    window.Theme.reload();
  },
  onPageLoad: function(e) {
    Theme.$.container.addClass("show-container");
    setTimeout(function() {
      // fade in container on page load
      Theme.$.container.addClass("show-container");
    }, 500);
  }
};

window.Theme.Menu = window.Theme.Menu || {
  init: function() {
    this.bindEvents();
    this.toggleCategories();
    this.animateMenuLinks();
    this.mobileMenuInit();
    this.mobileMenuScroll();
    this.submenuStyleClasses();
    this.positionMenuUnderLogo();
    this.handleLogoOverflow();
    this.showHeader();
    this.contentOffset();
  },
  bindEvents: function() {
    $(window).on("resize", function() {
      window.Theme.Menu.mobileMenuInit();
      window.Theme.Menu.contentOffset();
      window.Theme.Menu.positionMenuUnderLogo();

      if (Theme.$.body.hasClass("menu-active")) {
        // close menu if it's open on resize
        window.Theme.Menu.mobileMenuToggle(Theme.$.menuToggle);
      }
    });

    Theme.$.menuToggle.off().on("click", function() {
      window.Theme.Menu.mobileMenuToggle($(this));
    });
  },
  contentOffset: function() {
    // position conent to the right of the menu
    // depending on its width
    var menuOffsetLeft = Theme.$.menu.position().left;
    var menuWidth = Theme.$.header.width();
    var rightOffset = menuOffsetLeft + menuWidth + 100;
    var windowHeight = $(window).height();
    var logoOffset = Theme.$.headerLogoWrap.position().top;
    if (!Theme.$.body.hasClass("gallery") && !Theme.$.body.hasClass("listing")) {
      if (!isMobile) {
        Theme.$.container.css({
          "margin-left": rightOffset,
          width: "",
          "padding-top": logoOffset,
          "min-height": "100vh"
        });
      } else {
        var headerHeight = Theme.$.headerLogoWrap.height();
        Theme.$.container.css({
          "margin-left": 0,
          width: "100vw",
          "padding-top": headerHeight,
          "min-height": windowHeight - headerHeight
        });
      }
    }
  },
  showHeader: function() {
    Theme.$.header.addClass("show-header");
  },
  positionMenuUnderLogo: function(){
    if (_4ORMAT_DATA.theme.logo_type_toggle == "image" && !isMobile) {
      var logoImageHeight = Theme.$.logoImage.height();
      Theme.$.headerItemsWrap.css("margin-top", logoImageHeight);
    }
    if (isMobile) {
      Theme.$.headerItemsWrap.css("margin-top", 0);
    }
  },
  handleLogoOverflow: function(){
    if (_4ORMAT_DATA.theme.logo_type_toggle == "image") {
      setTimeout(() => {
        if (Theme.$.logoImage.width() > Theme.$.logo.width()) {
          Theme.$.logo.addClass("overflow");
          window.Theme.Menu.positionMenuUnderLogo();
        };
        Theme.$.logoImage.css("opacity", "1");
      }, 0);
    }
  },
  mobileMenuInit: function() {
    if (isMobile) {
      if (!Theme.$.header.hasClass("mobile-menu")) {
        Theme.$.header.addClass("mobile-menu");
      }
    } else {
      Theme.$.header.removeClass("mobile-menu");
    }
  },
  mobileMenuScroll: function() {
    // hide header when scrolling down a page,
    // reveal it when scrolling back up
    if (isMobile) {
      $(window).on("scrolldelta", function(e) {
        var menuScrollThrottle = 10;
        var topDelta = e.scrollTopDelta;
        if (topDelta > 1 && topDelta >= menuScrollThrottle && e.scrollTop > Theme.$.headerLogoWrap.outerHeight()) {
          Theme.$.header.addClass("hidden");
        } else if (topDelta < 1 && topDelta <= menuScrollThrottle * -1) {
          Theme.$.header.removeClass("hidden");
        }
        if (e.scrollTop === 0) {
          Theme.$.header.removeClass("hidden");
        }
      });
    }
  },
  toggleCategories: function() {
    // hide and show submenus
    Theme.$.categoryLink.on("click", function() {
      var categoryList = $(this).siblings(".category-list");
      if (categoryList.hasClass("collapsed")) {
        var totalHeight = 0;
        categoryList.children().each(function() {
          totalHeight = totalHeight + $(this).outerHeight(true);
        });

        $(this).addClass("category-open");
        categoryList.removeClass("collapsed");
        categoryList.height(totalHeight);
      } else {
        $(this).removeClass("category-open");
        categoryList.addClass("collapsed");
        categoryList.height(0);
      }
    });
  },
  animateMenuLinks: function() {
    // variable to animate reveal of menu links
    // by fading them in in a cascade
    if (_4ORMAT_DATA.theme.animate_menu_links) {
      var navLinks = $(".menu-links").find("> li");
      for (var i = 0; i < navLinks.length; i++) {
        var toggleItemMove = getToggleItemMove(i);
        setTimeout(toggleItemMove, i * 100);
      }
      function getToggleItemMove(i) {
        var item = navLinks[i];
        return function() {
          $(item).addClass("show-link");
        };
      }
    }
  },
  mobileMenuToggle: function(toggle) {
    // hide and show mobile menu
    Theme.$.header.toggleClass("active");
    Theme.$.body.toggleClass("menu-active");
    toggle.toggleClass("is-active");

    var headerHeight = Theme.$.header.height();
    var windowHeight = $(window).height();
    if (toggle.hasClass("is-active")) {
      Theme.$.headerItemsWrap.height(windowHeight - headerHeight);
    } else {
      Theme.$.headerItemsWrap.height(0);
    }

    $(window).on("resize", function() {
      headerHeight = Theme.$.header.height();
    });
  },
  submenuStyleClasses: function() {
    // add border to last category in group
    $(".category").each(function() {
      if (
        !$(this)
          .next()
          .hasClass("category")
      ) {
        $(this)
          .find(".category-link")
          .addClass("list_end_cat");

        $(this)
          .next()
          .addClass("after-category");
      }
    });
  }
};

window.Theme.Gallery = window.Theme.Gallery || {
  init: function() {
    this.respVideo();
    this.galleryNavigation();
    this.galleryZoom();
    this.longTextElements();
    this.captionToggle();
    this.teaseScroll();
    this.contentOffset();
    this.setVideoHeight();
    this.captionHeight();
    this.bindMouseWheel();
    this.bindScrollbar();
    this.bindEvents();
    this.updateHashOnScroll();
    this.assetIndex = 0;
    this.scrollToAssetOnLoad();
    this.browserDependent();
    setTimeout(function(){lazySizes.autoSizer.checkElems()},100);
  },
  bindEvents: function() {
    $(window).on("resize", function() {
      window.Theme.Gallery.bindMouseWheel();
      window.Theme.Gallery.contentOffset();
      window.Theme.Gallery.captionHeight();
      setTimeout(() => {
        window.Theme.Gallery.setVideoHeight();
      }, 100);
    });

    Theme.$.assetsWrap.mousewheel(function(e, delta) {
      window.Theme.Gallery.scrollableText(e, delta);
    });
  },
  respVideo: function() {
    reframe(".asset iframe");
  },
  contentOffset: function() {
    if (Theme.$.body.hasClass("gallery")) {
      var windowHeight = $(window).height();
      if (!isMobile) {
        Theme.$.assetsGrid.css({
          "padding-left": Theme.$.menu[0].getBoundingClientRect().right + 50,
          height: isIPad ? windowHeight : "100vh",
          "margin-top": 0
        });
        Theme.$.galleryElement.css("height", "");
      } else {
        var headerHeight = Theme.$.headerLogoWrap.height();
        var isLandscape = window.innerHeight < window.innerWidth;
        var availableSpace = windowHeight - headerHeight - 10;
        Theme.$.assetsGrid.css({
          "padding-left": 0,
          height: availableSpace,
          "margin-top": headerHeight
        });
        if (!_4ORMAT_DATA.theme.vertical_mobile_gallery) {
          Theme.$.headerText.height(availableSpace);
          if (_4ORMAT_DATA.theme.gallery_full_height_mobile || isLandscape) {
            Theme.$.galleryElement.css("height", availableSpace);
          } else {
            Theme.$.galleryElement.css({
              "height": "",
              "max-height": availableSpace
            });
          }
        }
      }
      Theme.$.container.css("padding-top", 0);
    }
  },
  setVideoHeight: function() {
    $(".asset.video").each(function() {
      var placeholderHeight =  $(this).find(".image-placeholder").height();
      var previewContainer = $(this).find(".preview");
      var iframeLink = $(this).find(".load_iframe");
      var iframeVid = $(this).find("iframe");
      var windowWidth = $(window).width();
      if (isMobile && !window.matchMedia("(min-device-width: 767px) and (max-device-width: 1024px) and (orientation: landscape)").matches) {
        if (!previewContainer.hasClass("vimeo_cont") && !previewContainer.hasClass("youtube_cont")) {
          return;
        }
        if (_4ORMAT_DATA.theme.vertical_mobile_gallery) {
          previewContainer.width(windowWidth);
          iframeLink.width(windowWidth);
          previewContainer.height(placeholderHeight);
          iframeLink.height(placeholderHeight);
          iframeVid.height(placeholderHeight);
        } else {
          previewContainer.height(placeholderHeight);
          iframeLink.height(placeholderHeight);
        }
      } else {
        previewContainer.width('');
        iframeLink.width('');
        if (_4ORMAT_DATA.theme.gallery_image_height == "Full Browser Height") {
          previewContainer.css("height", "100vh");
          iframeLink.css("height", "100vh");
        } else {
          previewContainer.css("height", _4ORMAT_DATA.theme.gallery_image_height);
          iframeLink.css("height", _4ORMAT_DATA.theme.gallery_image_height);
        }
      }
    });
  },
  bindMouseWheel: function() {
    if (isMobile && _4ORMAT_DATA.theme.vertical_mobile_gallery) {
      Theme.$.assetsWrap.off("mousewheel");
    } else {
      Theme.$.assetsWrap.off("mousewheel").on("mousewheel", function(event, delta) {
        if (Theme.$.body.hasClass("image-zoomed")) {
          return;
        }
        if(!event.target.closest('.scroll-text')) {
          this.scrollLeft -= (delta * 40);
        }
      });

      Theme.$.galleryScroll.off("mousewheel").on("mousewheel", function(event, delta) {
        this.scrollLeft -= (delta * 40);
      });
    }
  },
  bindScrollbar: function() {
    if (!isIPad && !isMobile || !navigator.maxTouchPoints) {
      // set divs width
      var assetsWidth = Theme.$.assetsGrid[0].scrollWidth;
      Theme.$.assetsGrid.css("min-width", assetsWidth);
      $(".gallery-scroll-width").css("min-width", assetsWidth);

      // synchronizes scrolling of gallery and scrollbar div
      var timeout;
      var syncedDivs = $(".assets-grid-wrapper, .gallery-scroll").on("scroll", function callback() {
        clearTimeout(timeout);
        var scrolledElement = $(this);
        var targetElement = syncedDivs.not(this);
        targetElement.off("scroll").scrollLeft(scrolledElement.scrollLeft());
        timeout = setTimeout(function() {
            targetElement.on("scroll", callback);
        }, 100);
      });
    }
  },
  galleryNavigation: function() {
    // navigation arrow behaviour
    if (_4ORMAT_DATA.theme.nav_arrows_toggle & !isMobile) {
      enough_assets = $(".asset, .header-element").length > 1;
      if (enough_assets) {
        Theme.$.container.mousemove(this.customCursor);
        // set class so CSS knows which cursor it should use
        if (_4ORMAT_DATA.theme.nav_arrow_thickness === "Thin") {
          Theme.$.container.addClass("cursor_s");
        } else if (_4ORMAT_DATA.theme.nav_arrow_thickness === "Medium") {
          Theme.$.container.addClass("cursor_m");
        } else if (_4ORMAT_DATA.theme.nav_arrow_thickness === "Thick") {
          Theme.$.container.addClass("cursor_l");
        }

        if (_4ORMAT_DATA.theme.nav_arrow_style === "Light") {
          Theme.$.container.addClass("cursor_white");
        } else if (_4ORMAT_DATA.theme.nav_arrow_style === "Dark") {
          Theme.$.container.addClass("cursor_black");
        }
      }

      Theme.$.container.on("click", function(e) {
        var goodToMove = !isMobile
            && e.target.type !== "submit"
            && e.target.getAttribute("role") !== "button"
            && !$(e.target).is("a");
        if (goodToMove) {
          if ($(e.target).is("img") && _4ORMAT_DATA.theme.gallery_image_zoom) {
            // don't move when clicking on a zoomable image
            return false;
          }
          if (Theme.$.container.hasClass("cursor_right")) {
            // move right
            Theme.Gallery.assetIndex = Theme.Gallery.assetIndex + 1;
          } else {
            // move left
            Theme.Gallery.assetIndex = Theme.Gallery.assetIndex - 1;
          }
          Theme.Gallery.scrollToAsset(Theme.Gallery.assetIndex);
          return false;
        }
      });
    }
  },
  customCursor: function(e) {
    var _x = e.pageX - $(window).scrollLeft();
    var _w = $(window).width();
    var slideAssetsLength = $(".asset, .header-element").length - 1;
    // test if we are on the left or right
    if (_x > _w / 2) {
      Theme.$.container.addClass("cursor_right").removeClass("cursor_left");
    } else {
      Theme.$.container.addClass("cursor_left").removeClass("cursor_right");
    }
    // override if first or last slide
    var currentHash = parseInt(location.hash.slice(1));
    if (currentHash === 0) {
      Theme.$.container.addClass("cursor_right").removeClass("cursor_left");
    } else if (currentHash === slideAssetsLength) {
      Theme.$.container.addClass("cursor_left").removeClass("cursor_right");
    }
  },
  galleryZoom: function() {
    if (_4ORMAT_DATA.theme.gallery_image_zoom) {
      $(".assets-grid .image img").on("click", function(e) {
        var $self = $(e.target);
        var index = $($self).data("asset-index");
        if (!isMobile) {
          $(".gallery-zoomed-image").remove();
          // remove any current instances of zoomed image
          setTimeout(function() {
            $self
              .clone()
              .appendTo(Theme.$.zoomContainer)
              .addClass("gallery-zoomed-image");
            Theme.$.zoomContainer.addClass("active");
            // since we changed the size of the image, we need to tell lazySizes to revaluate it
            lazySizes.autoSizer.checkElems();
          }, 0);
          Theme.$.body.addClass("image-zoomed");
          Theme.Gallery.setHash(index);
        }
      });

      var hideZoomedImage = function(e) {
        Theme.$.zoomContainer.removeClass("active");
        Theme.$.body.removeClass("image-zoomed");
      };

      Theme.$.body.on("click", ".gallery-zoom-container", function() {
        hideZoomedImage();
      });
    }
  },
  longTextElements: function() {
    $(".text-element").each(function() {
      // if the text is longer than the height of the asset
      // container, add a class to make in scrollable
      var assetHeight = (!isMobile && parseInt(_4ORMAT_DATA.theme.gallery_image_height)) ? parseInt(_4ORMAT_DATA.theme.gallery_image_height) : window.innerHeight;
      var scrollHeight = this.querySelector(".text-wrap").scrollHeight - 1;
      if (scrollHeight > assetHeight) {
        $(this).addClass("scroll-text");
      }
    });
  },
  scrollableText: function(event, delta) {
    if (!(isMobile && _4ORMAT_DATA.theme.vertical_mobile_gallery)) {
      if (!event.target.closest('.scroll-text')) {
        this.scrollLeft -= delta * 40;
        return false;
      }
    }
  },
  teaseScroll: function() {
    // shows an animation on a mobile gallery page if the page hasn't been scrolled,
    // to indicate that the user should horizontally scroll.
    if (isMobile && !_4ORMAT_DATA.theme.vertical_mobile_gallery && _4ORMAT_DATA.theme.tease_mobile_scroll) {
      var teaseTimeout = setTimeout(function() {
        Theme.$.assetsGrid.addClass("tease-scroll");
        setTimeout(function() {
          Theme.$.assetsGrid.removeClass("tease-scroll");
        }, 500);
      }, 1500);

      Theme.$.assetsWrap.on("scroll", function() {
        clearTimeout(teaseTimeout);
      });
    }
  },
  captionHeight: function() {
    // when images are full height, and captions are below the image,
    // make sure the maxiumum height of the images are minus the height of
    // the tallest caption
    // when images has height limit, and captions are below the image,
    // set caption max height to available space below the image
    // and set assets-grid class if available height is too small
    if (
      !isMobile
      && _4ORMAT_DATA.theme.gallery_caption_position == "Below Image"
      && $(".caption").length
      ) {
        var windowHeight = $(window).height();

        if (_4ORMAT_DATA.theme.gallery_image_height == "Full Browser Height") {
          var tallestCaption = 0;
          var heightLimit = windowHeight * 0.1;
          $(".caption").each(function() {
            if ($(this).outerHeight(true) > tallestCaption) {
              tallestCaption = $(this).outerHeight(true);
              if (tallestCaption > heightLimit) {
                tallestCaption = heightLimit;
                if ($(this).outerHeight() > heightLimit) $(this).height(heightLimit).addClass('scroll-text');
              }
            }
          });
          $(".gallery-element:not(.header-element), .embed-container .preview, .embed-container .preview > *").css("height", windowHeight - tallestCaption - 50);
        } else {
          var availableHeight = windowHeight - (parseInt(_4ORMAT_DATA.theme.gallery_image_height) + $('.asset:not(.text)').offset().top + 15);
          if (availableHeight < 45) {
            $('.assets-grid').addClass('captions-cutoff');
          } else {
            $('.assets-grid').removeClass('captions-cutoff');
            $(".caption").each(function() {
              if (this.scrollHeight > availableHeight) {
                  $(this).addClass('scroll-text').css('max-height', availableHeight);
              }
            });
          }
        }
    }
  },
  captionToggle: function() {
    // on mobile, captions have a toggle button
    $(".caption-cta, .caption-close").on("click", function() {
      var $this = $(this);
      var $asset = $this.closest(".asset");

      $asset.toggleClass("show-caption");
    });
  },
  scrollToAsset: function(index) {
    if (index < 0) {
      // can't scroll to an asset with an index less than zero
      index = 0;
    }
    if (index > $(".asset, .header-element").length - 1) {
      // can't scroll to an asset with an index greater than the number of assets
      index = $(".asset, .header-element").length - 1;
    }
    var $targetAsset = $("[data-asset-index=" + index + "]");
    if (!$targetAsset.length) {
      // no asset found with that index
      return false;
    }

    // calculate the asset center
    var assetOffsetLeft = $targetAsset.offset().left;
    var assetWidth = $targetAsset.width();
    var windowWidth = window.innerWidth;
    var headerRectRight = Theme.$.header[0].getBoundingClientRect().right;
    var assetsScrollLeft = Theme.$.assetsWrap.scrollLeft();
    var assetToScreenRatio = $targetAsset.width() / window.innerWidth;

    var assetCenter;
    if (!isMobile) {
      if (assetToScreenRatio < 0.6) {
        assetCenter = assetsScrollLeft + (assetOffsetLeft + assetWidth / 2 - windowWidth / 2) + 1;
      } else {
        assetCenter = assetsScrollLeft + assetOffsetLeft - headerRectRight - _4ORMAT_DATA.theme.menu_position_from_left;
      }
    } else {
      assetCenter = assetsScrollLeft + assetOffsetLeft;
    }

    // set the transition speed based on the variable value
    if (_4ORMAT_DATA.theme.gallery_change_image_speed == "Slow") {
      imageSpeed = 800;
    } else if (_4ORMAT_DATA.theme.gallery_change_image_speed == "Normal") {
      imageSpeed = 550;
    } else if (_4ORMAT_DATA.theme.gallery_change_image_speed == "Fast") {
      imageSpeed = 400;
    }

    // scroll to that asset, baby
    Theme.$.assetsWrap.animate(
      {
        scrollLeft: assetCenter
      },
      imageSpeed,
      $.bez[(0, 0, 0.25, 1)]
    );
    Theme.Gallery.setHash(index);
  },
  updateHashOnScroll: function() {
    // when scrolling, update the url hash to reflect
    // where you are on the page
    if (!isMobile) {
      Theme.$.assetsWrap.bind(
        "mousewheel",
        $.debounce(250, function() {
          Theme.$.asset.each(function() {
            if (
              $(this).offset().left < window.pageXOffset + 10 &&
              $(this).offset().left + $(this).width() > window.pageXOffset + 10
            ) {
              Theme.Gallery.setHash($(this).data("asset-index"));
            }
          });
        })
      );
    }
  },
  scrollToAssetOnLoad: function() {
    // scroll to the asset if the url has a hash value on load
    var urlHash = parseInt(location.hash.substr(1), 10);
    if (urlHash > 0) {
      Theme.Gallery.scrollToAsset(urlHash);
    }
  },
  setHash: function(hash) {
    // set the value of the hash
    if (hash < 0) {
      hash = 0;
    }

    Theme.Gallery.assetIndex = hash;

    if (history.replaceState) {
      history.replaceState(null, null, "#" + hash);
    } else {
      location.hash = "#" + hash;
    }
  },
  browserDependent: function() {
    if (document.documentElement.className.indexOf("safari") !== -1) {
      // apply class to fix legacy iOS problems
      var match = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
      if (match !== undefined && match !== null && match[1] < 9) {
        document.body.className = document.body.className.concat(" legacy-ios")
      }

      // Safari glitchy scroll: apply lazysizes settings for MacOS Safari
      if (navigator.platform.includes("Mac") && _4ORMAT_DATA.theme.gallery_image_placeholder) {
        window.lazySizesConfig.expand = 1000;
      }
    }
  }
};

window.Theme.Listing = window.Theme.Listing || {
  init: function() {
    this.bindEvents();
    this.contentOffset();
  },
  bindEvents: function() {
    $(window).on("resize", function() {
      window.Theme.Listing.contentOffset();
    });
  },
  contentOffset: function() {
    if (Theme.$.body.hasClass("listing")) {
      if (!isMobile) {
        var menuOffsetLeft = Theme.$.menu.offset().left;
        var menuWidth = Theme.$.header.width();
        var rightOffset = menuOffsetLeft + menuWidth + 100;
        var windowWidth = $(window).width();
        var logoOffset = Theme.$.headerLogoWrap.position().top;
        Theme.$.container.css({
          "margin-left": rightOffset,
          width: windowWidth - rightOffset - 100,
          "padding-top": 0,
          "margin-top": logoOffset
        });
      } else {
        var headerHeight = Theme.$.headerLogoWrap.height();
        Theme.$.container.css({
          "margin-left": 0,
          width: "100vw",
          "padding-top": headerHeight,
          "margin-top": 0
        });
      }
    }
  }
};

window.Theme.Content = window.Theme.Content || {
  init: function() {
    this.fixSlideshowWidth();
  },
  fixSlideshowWidth: function() {
    if (document.querySelector('.format-image-set-items.slideshow')) window.dispatchEvent(new Event('resize'));
  },
};

window.Theme.Blog = window.Theme.Blog || {
  init: function() {
    $(" body.blog").fitVids();
  },
};


// Initialize object on DOM load

$(document).on("DOMContentLoaded", function() {
  Theme.init();
});

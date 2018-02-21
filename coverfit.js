const CoverFit = (($) => {

  /**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

  const NAME = 'coverFit';
  const DATA_KEY = 'cl.coverFit';
  const JQUERY_NO_CONFLICT = $.fn[NAME];

  const Default = {
    roundingPrecision: 4,
  };

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class CoverFit {
    constructor(element, config) {
      this._config = this._getConfig(config);
      this._element = element;
      this._$element = $(element);
      this._$parent = $(element).parent();
      this.init();
    }

    // getters
    static get Default() {
      return Default;
    }

    parentWidth() {
      return this._$parent.innerWidth();
    }

    parentHeight() {
      return this._$parent.innerHeight();
    }

    // public
    precisionRound(value) {
      const factor = Math.pow(10, this._config.roundingPrecision);
      return Math.round(value * factor) / factor;
    }

    getWidthWhenHeight(height) {
      return this.precisionRound(height * this._config.ratio, this._config.roundingFactor);
    }

    getHeightWhenWidth(width) {
      return this.precisionRound(width / this._config.ratio, this._config.roundingFactor);
    }

    width(width) {
      this._$element
        .css('width', width)
        .css('height', this.getHeightWhenWidth(width));
    }

    height(height) {
      this._$element
        .css('height', height)
        .css('width', this.getWidthWhenHeight(height));
    }

    alignCenterY() {
      const elHeight = this._$element.innerHeight();
      const parentHeight = this.parentHeight();
      this._$element.css({
        'margin-top': (parentHeight - elHeight) / 2,
        'margin-left': 0,
      });
    }

    alignCenterX() {
      const elWidth = this._$element.innerWidth();
      const parentWidth = this.parentWidth();
      this._$element.css({
        'margin-top': 0,
        'margin-left': (parentWidth - elWidth) / 2,
      });
    }

    render() {
      if (this.getHeightWhenWidth(this.parentWidth()) < this.parentHeight()) {
        this.height(this.parentHeight());
        this.alignCenterX();
      } else {
        this.width(this.parentWidth());
        this.alignCenterY();
      }
    }

    dispose() {
      $.removeData(this._element, DATA_KEY);
    }

    init() {
      this._$parent.css({
        position: 'relative',
        overflow: 'hidden',
      });
      this._$element.css({
        position: 'absolute',
        left: '0',
        top: '0',
      });
      this.render();
      const _self = this;
      const debouncedRender = this._debounce(_self.render.bind(_self), 100);
      $(window).resize(debouncedRender);
    }

    // private
    _getConfig(config) {
      config = $.extend({}, Default, config);
      return config;
    }

    _debounce(func, wait, immediate) {
      var timeout;
      return function () {
        var context = this, args = arguments;
        var later = function () {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    }

    // static
    static _jQueryInterface(config, relatedTarget) {
      return this.each(function () {
        let data = $(this).data(DATA_KEY);
        const _config = $.extend(
          {},
          CoverFit.Default,
          $(this).data(),
          typeof config === 'object' && config
        );

        if (!data) {
          data = new CoverFit(this, _config);
          $(this).data(DATA_KEY, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new Error(`No method named "${config}"`);
          }
          data[config](relatedTarget);
        } else if (_config.show) {
          data.show(relatedTarget);
        }
      });
    }
  }

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = CoverFit._jQueryInterface;
  $.fn[NAME].Constructor = CoverFit;
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return CoverFit._jQueryInterface;
  };

  return CoverFit;

})(jQuery);

export default CoverFit;

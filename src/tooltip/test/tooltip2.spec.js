describe('tooltip directive', function () {

  var $rootScope, $compile, $document, $timeout;

  beforeEach(module('mm.foundation.tooltip'));
  beforeEach(module('template/tooltip/tooltip-popup.html'));
  beforeEach(inject(function (_$rootScope_, _$compile_, _$document_, _$timeout_) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $document = _$document_;
    $timeout = _$timeout_;
  }));

  beforeEach(function(){
    jasmine.addMatchers({
      toHaveOpenTooltips: function(util, customEqualityTesters) {
        function compare(actual, noOfOpened){
          var ttipElements = angular.element(actual[0].querySelectorAll('span.tooltip'));
          noOfOpened = noOfOpened || 1;
          var passed = ttipElements.length === noOfOpened;
          return {
            pass: passed,
            message: "Expected '" + angular.mock.dump(ttipElements) + "' to have '" + ttipElements.length + "' opened tooltips."
          };
        }
        return {compare: compare};
      },
    });
  });

  function compileTooltip(ttipMarkup) {
    var fragment = $compile('<div>'+ttipMarkup+'</div>')($rootScope);
    $rootScope.$digest();
    return fragment;
  }

  function closeTooltip(hostEl, trigger, shouldNotFlush) {
    hostEl.triggerHandler(trigger || 'mouseout' );
    if (!shouldNotFlush) {
      $timeout.flush();
    }
  }

  describe('basic scenarios with default options', function () {

    it('shows default tooltip on mouse enter and closes on mouse leave', function () {
      var fragment = compileTooltip('<span tooltip="tooltip text">Trigger here</span>');

      fragment.find('span').triggerHandler( 'mouseover' );
      expect(fragment).toHaveOpenTooltips();

      closeTooltip(fragment.find('span'));
      expect(fragment).not.toHaveOpenTooltips();
    });

    it('should not show a tooltip when its content is empty', function () {
      var fragment = compileTooltip('<span tooltip=""></span>');
      fragment.find('span').triggerHandler( 'mouseover' );
      expect(fragment).not.toHaveOpenTooltips();
    });

    it('should not show a tooltip when its content becomes empty', function () {

      $rootScope.content = 'some text';
      var fragment = compileTooltip('<span tooltip="{{ content }}"></span>');

      fragment.find('span').triggerHandler( 'mouseover' );
      expect(fragment).toHaveOpenTooltips();

      $rootScope.content = '';
      $rootScope.$digest();
      $timeout.flush();
      expect(fragment).not.toHaveOpenTooltips();
    });

    it('should update tooltip when its content becomes empty', function () {
      $rootScope.content = 'some text';
      var fragment = compileTooltip('<span tooltip="{{ content }}"></span>');

      $rootScope.content = '';
      $rootScope.$digest();

      fragment.find('span').triggerHandler( 'mouseover' );
      expect(fragment).not.toHaveOpenTooltips();
    });
  });

  describe('option by option', function () {

    describe('placement', function () {

      it('can specify an alternative, valid placement', function () {
        var fragment = compileTooltip('<span tooltip="tooltip text" tooltip-placement="left">Trigger here</span>');
        fragment.find('span').triggerHandler( 'mouseover' );

        var ttipElement = angular.element(fragment[0].querySelector('span.tooltip'));
        expect(fragment).toHaveOpenTooltips();
        expect(ttipElement).toHaveClass('tip-left');

        closeTooltip(fragment.find('span'));
        expect(fragment).not.toHaveOpenTooltips();
      });

    });

  });
});

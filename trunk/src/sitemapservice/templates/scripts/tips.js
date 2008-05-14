// Copyright 2008 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// This is the top level setting class. It contains all the setting values for
// this application. Besides site specific settings, this class also includes
// application level configuration, like back-up duration, remote admin port,
// admin account, and etc. Especially, there is global setting field, which
// contains default values for site settings. Please see the member fields
// doc for details.
// Besides the xml setting load/save/validate functions, it provides functions
// to load values from file, as well as save value to a file.
// This class is not thread-safe.


/**
 * @fileoverview
 *
 * If mouse is over the component, show the tip.
 * If mouse is out of the component and not on the tip, hide the tip.
 * If mouse is out of the tip, hide it.
 *
 * TODO:
 * If mouse click the tip, hide it.
 * If mouse is in input, show the tip (add short key to trigger).
 * If mouse click the label, show the tip.
 * Add latency to show/hide action.
 *
 * @author chaiying@google.com (Ying Chai)
 */
var Tips = {
  object: '',
  isPopped: false,
  isMouseOnTip: false,
  popDiv: null,
  timer: null,
  X_OFFSET: 15,  // Pixels to the right of the mouse pointer
  Y_OFFSET: 15,  // Pixels below the mouse pointer
  SHOW_DELAY: 500,    // Milliseconds after mouseover
  HIDE_DELAY: 200
};

/**
 * Adds tip-related event handlers for the target element.
 * @param {HTMLElement} target  The element that has a tip
 */
Tips.schedule = function(target) {
  Util.event.add(target, 'mouseover', Tips.eventHandlers.onMouseOverComponent);
  Util.event.add(target, 'mouseout', Tips.eventHandlers.onMouseOutComponent);
};

/**
 * Copy from Geometry lib.
 * Initializes the Geometry lib.
 */
function Geometry() {
  if (window.innerWidth) {
    //All but IE
    Geometry.getViewportWidth = function(){
      return window.innerWidth;
    };
    Geometry.getViewportHeight = function(){
      return window.innerHeight;
    };
    Geometry.getHorizontalScroll = function(){
      return window.pageXOffset;
    };
    Geometry.getVerticalScroll = function(){
      return window.pageYOffset;
    };
  } else if (document.documentElement &&
             document.documentElement.clientWidth) {
    // IE6 w/ doctype
    Geometry.getViewportWidth = function(){
      return document.documentElement.clientWidth;
    };
    Geometry.getViewportHeight = function(){
      return document.documentElement.clientHeight;
    };
    Geometry.getHorizontalScroll = function(){
      return document.documentElement.scrollLeft;
    };
    Geometry.getVerticalScroll = function(){
      return document.documentElement.scrollTop;
    };
  } else if (document.body.clientWidth) {
    // IE4,5,6(w/o doctype)
    Geometry.getViewportWidth = function(){
      return document.body.clientWidth;
    };
    Geometry.getViewportHeight = function(){
      return document.body.clientHeight;
    };
    Geometry.getHorizontalScroll = function(){
      return document.body.scrollLeft;
    };
    Geometry.getVerticalScroll = function(){
      return document.body.scrollTop;
    };
  }
}

// Initializes the Geometry lib on loading page.
Util.event.add(window, 'load', Geometry);

/**
 * The event handlers for Tips.
 */
Tips.eventHandlers = {
  /**
   * If mouse is over the element, show the tip.
   * @param {Event} e  The event that occurs
   * @param {Element} target  The element the event belongs to
   */
  onMouseOverComponent: function(e, target) {
    Util.console.log('onMouseOverComponent');
    var event = e || window.event;
    var x = event.clientX + Geometry.getHorizontalScroll();
    var y = event.clientY + Geometry.getVerticalScroll();

    x += Tips.X_OFFSET;
    y += Tips.Y_OFFSET;

    Tips.object = target;
    Tips.showPopup(x, y);
  },

  /**
   * If mouse is out of the element and not on the tip, hide the tip.
   * @param {Event} e  The event that occurs
   * @param {Element} target  The element the event belongs to
   */
  onMouseOutComponent: function(e, target) {
    Util.console.log('onMouseOutComponent');

    Tips.object = target;
    Tips.hidePopup();
  },

  /**
   * User has put the mouse on the tip.
   */
  onMouseOverTip: function() {
    Util.console.log('onMouseOverTip');
    Tips.isMouseOnTip = true;
  },

  /**
   * User has put the mouse out of the tip.
   */
  onMouseOutTip: function() {
    Util.console.log('onMouseOutTip');
    Tips.isMouseOnTip = false;
  },

  /**
   * If mouse click the tip, hide it.
   */
  onMouseClick: function() {
    Util.console.log('onMouseOutComponent');
    //TODO
  }
};

/**
 * Shows the tip box.
 * @param {Number} x  The horizen postion of the box
 * @param {Number} y  The vertical postion of the box
 */
Tips.showPopup = function(x, y) {
  if (!Tips.popDiv) {
    var div = document.createElement('DIV');
    Util.CSS.addClass(div, POPUP_CLASS);
    div.onmouseover = Tips.eventHandlers.onMouseOverTip;
    div.onmouseout = Tips.eventHandlers.onMouseOutTip;
    Tips.popDiv = div;
    document.body.appendChild(Tips.popDiv);
  }

  // close old hide/show event
  if (Tips.timer)
    window.clearTimeout(Tips.timer);

  // if the tips is showing and is the same object, just ignore
  if (Tips.isPopped) {
    if (Tips.popDiv.object == Tips.object)
      return;
  }
  // schedule to show tips
  Tips.timer = window.setTimeout(function() {
    Tips.popDiv.object = Tips.object;
    Tips.popDiv.innerHTML = Tips.object.tip;
    var left = x;
    var top = y;
    Tips.moveTo_(Tips.popDiv, left, top);
    Util.CSS.removeClass(Tips.popDiv, HIDDEN_CLASS);
    Tips.isPopped = true;
  }, Tips.SHOW_DELAY);
};

/**
 * Hides the tip box.
 */
Tips.hidePopup = function() {
  // close old hide/show event
  if (Tips.timer)
    window.clearTimeout(Tips.timer);

  if (Tips.isMouseOnTip) {
    return;
  }

  Tips.timer = window.setTimeout(function() {
    Util.CSS.addClass(Tips.popDiv, HIDDEN_CLASS);
    Tips.isPopped = false;
  }, Tips.HIDE_DELAY);
};

/**
 * Moves the element to the position.
 * @param {Object} elem  The element to be moved
 * @param {Object} left  The left side destination position of the element
 * @param {Object} top  The top side destination position of the element
 * @private
 */
Tips.moveTo_ = function(elem, left, top) {
  elem.style.left = left;
  elem.style.top = top;
};


/* global define, document */
'use strict';

define(['jquery', 'utils/is-defined', 'web2d/font', 'web2d/peer/svg/element'], ($, $defined, Font, ElementPeer) => {
    class TextPeer extends ElementPeer {
        constructor() {
            let svgElement = document.createElementNS(ElementPeer.svgNamespace, 'text');
            super(svgElement);
            this._position = {'x': 0, 'y': 0};
            this._font = new Font('Arial', this);
        }

        append(element) {
            this._native.appendChild(element._native);
        }

        setTextAlignment(align) {
            this._textAlign = align;
        }

        getTextAlignment() {
            return $defined(this._textAlign) ? this._textAlign : 'left';
        }

        setText(text) {
            // Remove all previous nodes ...
            while (this._native.firstChild) {
                this._native.removeChild(this._native.firstChild);
            }

            this._text = text;
            if (text) {
                let lines = text.split('\n');
                //FIXME: we could use underscorejs here
                lines.forEach((line) => {
                    let tspan = document.createElementNS(ElementPeer.svgNamespace, 'tspan');
                    tspan.setAttribute('dy', '1em');
                    tspan.setAttribute('x', this.getPosition().x);

                    tspan.textContent = (line.length == 0) ? ' ' : line;
                    this._native.appendChild(tspan);
                });
            }
        }

        getText() {
            return this._text;
        }

        setPosition(x, y) {
            this._position = {x: x, y: y};
            this._native.setAttribute('y', y);
            this._native.setAttribute('x', x);

            // tspan must be positioned manually.
            $(this._native).children('tspan').attr('x', x);
        }

        getPosition() {
            return this._position;
        }

        getNativePosition() {
            return $(this._native).position();
        }

        setFont(font, size, style, weight) {
            if ($defined(font)) {
                this._font = new Font(font, this);
            }
            if ($defined(style)) {
                this._font.setStyle(style);
            }
            if ($defined(weight)) {
                this._font.setWeight(weight);
            }
            if ($defined(size)) {
                this._font.setSize(size);
            }
            this._updateFontStyle();
        }

        _updateFontStyle() {
            this._native.setAttribute('font-family', this._font.getFontFamily());
            this._native.setAttribute('font-size', this._font.getGraphSize());
            this._native.setAttribute('font-style', this._font.getStyle());
            this._native.setAttribute('font-weight', this._font.getWeight());
        }

        setColor(color) {
            this._native.setAttribute('fill', color);
        }

        getColor() {
            return this._native.getAttribute('fill');
        }

        setTextSize(size) {
            this._font.setSize(size);
            this._updateFontStyle();
        }

        setContentSize(width, height) {
            this._native.xTextSize = width.toFixed(1) + ',' + height.toFixed(1);
        }

        setStyle(style) {
            this._font.setStyle(style);
            this._updateFontStyle();
        }

        setWeight(weight) {
            this._font.setWeight(weight);
            this._updateFontStyle();
        }

        setFontFamily(family) {
            let oldFont = this._font;
            this._font = new Font(family, this);
            this._font.setSize(oldFont.getSize());
            this._font.setStyle(oldFont.getStyle());
            this._font.setWeight(oldFont.getWeight());
            this._updateFontStyle();
        }

        getFont() {
            return {
                'font': this._font.getFont(),
                'size': parseInt(this._font.getSize()),
                'style': this._font.getStyle(),
                'weight': this._font.getWeight()
            };
        }

        setSize(size) {
            this._font.setSize(size);
            this._updateFontStyle();
        }

        getWidth() {
            let computedWidth;
            // Firefox hack for this issue:http://stackoverflow.com/questions/6390065/doing-ajax-updates-in-svg-breaks-getbbox-is-there-a-workaround
            try {
                computedWidth = this._native.getBBox().width;
                // Chrome bug is producing this error, oly during page loading. Remove the hack if it works. The issue seems to be
                // caused when the element is hidden. I don't know why, but it works ...
                if (computedWidth == 0) {
                    let bbox = this._native.getBBox();
                    computedWidth = bbox.width;
                }
            } catch (e) {
                computedWidth = 10;
            }

            let width = parseInt(computedWidth);
            width = width + this._font.getWidthMargin();
            return width;
        }

        getHeight() {
            // Firefox hack for this issue:
            // http://stackoverflow.com/questions/6390065/doing-ajax-updates-in-svg-breaks-getbbox-is-there-a-workaround
            let computedHeight;
            try {
                computedHeight = this._native.getBBox().height;
            } catch (e) {
                computedHeight = 10;
            }
            return parseInt(computedHeight);
        }

        getHtmlFontSize() {
            return this._font.getHtmlSize();
        }
    }

    return TextPeer;
});

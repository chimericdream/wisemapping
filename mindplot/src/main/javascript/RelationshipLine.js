/*
 *    Copyright [2011] [wisemapping]
 *
 *   Licensed under WiseMapping Public License, Version 1.0 (the "License").
 *   It is basically the Apache License, Version 2.0 (the "License") plus the
 *   "powered by wisemapping" text requirement on every single page;
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the license at
 *
 *       http://www.wisemapping.org/license
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */
mindplot.RelationshipLine = new Class({
    Extends: mindplot.ConnectionLine,
    initialize:function(sourceNode, targetNode, lineType) {
        this.parent(sourceNode, targetNode, lineType);

        this._line2d.setIsSrcControlPointCustom(false);
        this._line2d.setIsDestControlPointCustom(false);
        this._isOnfocus = false;
        this._focusShape = this._createLine(this.getLineType(), mindplot.ConnectionLine.SIMPLE_CURVED);
        this._focusShape.setStroke(2, "solid", "#3f96ff");
        var ctrlPoints = this._line2d.getControlPoints();
        this._focusShape.setSrcControlPoint(ctrlPoints[0]);
        this._focusShape.setDestControlPoint(ctrlPoints[1]);
        this._focusShape.setVisibility(false);
        this._onFocus = false;
        this._isInWorkspace = false;
        this._controlPointsController = new mindplot.ControlPoint();

        var strokeColor = mindplot.RelationshipLine.getStrokeColor();
        this._startArrow = new web2d.Arrow();
        this._endArrow = new web2d.Arrow();
        this._startArrow.setStrokeColor(strokeColor);
        this._startArrow.setStrokeWidth(2);
        this._endArrow.setStrokeColor(strokeColor);
        this._endArrow.setStrokeWidth(2);
        this._line2d.setStroke(1, 'solid', strokeColor);

    },

    setStroke : function(color, style, opacity) {
        // @Todo: How this is supported in mootools ?
        mindplot.ConnectionLine.prototype.setStroke.call(this, color, style, opacity);
        this._startArrow.setStrokeColor(color);
    },

    redraw : function() {
        var line2d = this._line2d;
        var sourceTopic = this._sourceTopic;
        var sourcePosition = sourceTopic.getPosition();

        var targetTopic = this._targetTopic;
        var targetPosition = targetTopic.getPosition();

        var sPos,tPos;
        this._line2d.setStroke(2);
        var ctrlPoints = this._line2d.getControlPoints();
        if (!this._line2d.isDestControlPointCustom() && !this._line2d.isSrcControlPointCustom()) {
            var defaultPoints = core.Utils.calculateDefaultControlPoints(sourcePosition, targetPosition);
            ctrlPoints[0].x = defaultPoints[0].x;
            ctrlPoints[0].y = defaultPoints[0].y;
            ctrlPoints[1].x = defaultPoints[1].x;
            ctrlPoints[1].y = defaultPoints[1].y;
        }
        var spoint = new core.Point();
        spoint.x = parseInt(ctrlPoints[0].x) + parseInt(sourcePosition.x);
        spoint.y = parseInt(ctrlPoints[0].y) + parseInt(sourcePosition.y);
        var tpoint = new core.Point();
        tpoint.x = parseInt(ctrlPoints[1].x) + parseInt(targetPosition.x);
        tpoint.y = parseInt(ctrlPoints[1].y) + parseInt(targetPosition.y);
        sPos = core.Utils.calculateRelationShipPointCoordinates(sourceTopic, spoint);
        tPos = core.Utils.calculateRelationShipPointCoordinates(targetTopic, tpoint);

        line2d.setFrom(sPos.x, sPos.y);
        line2d.setTo(tPos.x, tPos.y);

        line2d.moveToFront();

        //Positionate Arrows
        this._positionateArrows();

        // Add connector ...
        this._positionateConnector(targetTopic);

        if (this.isOnFocus()) {
            this._refreshSelectedShape();
        }
        this._focusShape.moveToBack();
        this._controlPointsController.redraw();
    },

    _positionateArrows : function() {
        this._endArrow.setVisibility(this.isVisible() && this._showEndArrow);
        this._startArrow.setVisibility(this.isVisible() && this._showStartArrow);

        var tpos = this._line2d.getTo();
        this._endArrow.setFrom(tpos.x, tpos.y);
        var spos = this._line2d.getFrom();
        this._startArrow.setFrom(spos.x, spos.y);
        this._endArrow.moveToBack();
        this._startArrow.moveToBack();

        if (this._line2d.getType() == "CurvedLine") {
            var controlPoints = this._line2d.getControlPoints();
            this._startArrow.setControlPoint(controlPoints[0]);
            this._endArrow.setControlPoint(controlPoints[1]);
        } else {
            this._startArrow.setControlPoint(this._line2d.getTo());
            this._endArrow.setControlPoint(this._line2d.getFrom());
        }
    },

    addToWorkspace : function(workspace) {
        workspace.appendChild(this._focusShape);
        workspace.appendChild(this._controlPointsController);
        this._controlPointControllerListener = this._initializeControlPointController.bindWithEvent(this, workspace);
        this._line2d.addEventListener('click', this._controlPointControllerListener);
        this._isInWorkspace = true;

        workspace.appendChild(this._startArrow);
        workspace.appendChild(this._endArrow);

        mindplot.ConnectionLine.prototype.addToWorkspace.call(this, workspace);
    },

    _initializeControlPointController : function(event, workspace) {
        this.setOnFocus(true);
    },

    removeFromWorkspace : function(workspace) {
        workspace.removeChild(this._focusShape);
        workspace.removeChild(this._controlPointsController);
        this._line2d.removeEventListener('click', this._controlPointControllerListener);
        this._isInWorkspace = false;
        workspace.removeChild(this._startArrow);
        workspace.removeChild(this._endArrow);

        mindplot.ConnectionLine.prototype.removeFromWorkspace.call(this, workspace);
    },

    getType : function() {
        return mindplot.RelationshipLine.type;
    },

    setOnFocus : function(focus) {
        // Change focus shape
        if (focus) {
            this._refreshSelectedShape();
            this._controlPointsController.setLine(this);
        }
        this._focusShape.setVisibility(focus);

        this._controlPointsController.setVisibility(focus);
        this._onFocus = focus;
    },

    _refreshSelectedShape : function () {
        var sPos = this._line2d.getFrom();
        var tPos = this._line2d.getTo();
        var ctrlPoints = this._line2d.getControlPoints();
        this._focusShape.setFrom(sPos.x, sPos.y);
        this._focusShape.setTo(tPos.x, tPos.y);
        var shapeCtrlPoints = this._focusShape.getControlPoints();
        shapeCtrlPoints[0].x = ctrlPoints[0].x;
        shapeCtrlPoints[0].y = ctrlPoints[0].y;
        shapeCtrlPoints[1].x = ctrlPoints[1].x;
        shapeCtrlPoints[1].y = ctrlPoints[1].y;
        this._focusShape.updateLine();
        //this._focusShape.setSrcControlPoint(ctrlPoints[0]);
        //this._focusShape.setDestControlPoint(ctrlPoints[1]);
    },

    addEventListener : function(type, listener) {
        // Translate to web 2d events ...
        if (type == 'onfocus') {
            type = 'mousedown';
        }

        var line = this._line2d;
        line.addEventListener(type, listener);
    },

    isOnFocus : function() {
        return this._onFocus;
    },

    isInWorkspace : function() {
        return this._isInWorkspace;
    },

    setVisibility : function(value) {
        mindplot.ConnectionLine.prototype.setVisibility.call(this, value);
        this._endArrow.setVisibility(this._showEndArrow && value);
        this._startArrow.setVisibility(this._showStartArrow && value);
    },

    setOpacity : function(opacity) {
        mindplot.ConnectionLine.prototype.setOpacity.call(this, opacity);
        if (this._showEndArrow)
            this._endArrow.setOpacity(opacity);
        if (this._showStartArrow)
            this._startArrow.setOpacity(opacity);
    },

    setShowEndArrow : function(visible) {
        this._showEndArrow = visible;
        if (this._isInWorkspace)
            this.redraw();
    },

    setShowStartArrow : function(visible) {
        this._showStartArrow = visible;
        if (this._isInWorkspace)
            this.redraw();
    },

    isShowEndArrow : function() {
        return this._showEndArrow;
    },

    isShowStartArrow : function() {
        return this._showStartArrow;
    },

    setFrom : function(x, y) {
        this._line2d.setFrom(x, y);
        this._startArrow.setFrom(x, y);
    },

    setTo : function(x, y) {
        this._line2d.setTo(x, y);
        this._endArrow.setFrom(x, y);
    },

    setSrcControlPoint : function(control) {
        this._line2d.setSrcControlPoint(control);
        this._startArrow.setControlPoint(control);
    },

    setDestControlPoint : function(control) {
        this._line2d.setDestControlPoint(control);
        this._endArrow.setControlPoint(control);
    },

    getControlPoints : function() {
        return this._line2d.getControlPoints();
    },

    isSrcControlPointCustom : function() {
        return this._line2d.isSrcControlPointCustom();
    },

    isDestControlPointCustom : function() {
        return this._line2d.isDestControlPointCustom();
    },

    setIsSrcControlPointCustom : function(isCustom) {
        this._line2d.setIsSrcControlPointCustom(isCustom);
    },

    setIsDestControlPointCustom : function(isCustom) {
        this._line2d.setIsDestControlPointCustom(isCustom);
    }});


mindplot.RelationshipLine.type = "RelationshipLine";
mindplot.RelationshipLine.getStrokeColor = function() {
    return '#9b74e6';
}

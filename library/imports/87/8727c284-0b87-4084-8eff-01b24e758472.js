"use strict";
cc._RF.push(module, '8727cKEC4dAhI7/AbJOdYRy', 'favorManager');
// script/favorManager.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var favorItem_1 = require("./favorItem");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var favorManager = /** @class */ (function (_super) {
    __extends(favorManager, _super);
    function favorManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.itemPrefab = null;
        _this.content = null;
        _this.scrollTopY = 0;
        _this.scrollBottomY = 0;
        _this.itemList = [];
        _this.allItemStartY = -15; //item的第一個起始位置
        _this.itemHeight = 30; //一個item的高度
        _this.itemCount = 10; //item總數
        _this.startScrollUpBoundY = 0; //最上面的滾動Y邊界
        _this.startScrollDownBoundY = 0; //最下方的滾動Y邊界
        return _this;
    }
    favorManager.prototype.onLoad = function () {
        var _this = this;
        console.warn('ken666::onLoad');
        this.content.height = this.itemCount * this.itemHeight;
        this.startScrollUpBoundY = this.allItemStartY + this.itemHeight / 2;
        this.startScrollDownBoundY = -this.node.height + this.itemHeight / 2;
        var _loop_1 = function (i) {
            var item = cc.instantiate(this_1.itemPrefab);
            this_1.itemList.push(item);
            var itemComp = item.getComponent(favorItem_1.default);
            itemComp.itemIndex = i;
            itemComp.setCount();
            itemComp.editMoveBtn.on(cc.Node.EventType.TOUCH_START, function (e) {
                var scrollView = _this.content.getComponent(cc.ScrollView);
                scrollView.enabled = false;
                _this.nowTouchTargetNode = item;
                _this.scheduleOnce(_this.setItemOnTouchMove, 1);
                item.zIndex = 1;
                item.scale = 1.1;
            });
            itemComp.editMoveBtn.on(cc.Node.EventType.TOUCH_END, function () {
                item.y = _this.allItemStartY - (itemComp.itemIndex * _this.itemHeight);
                item.zIndex = 0;
                item.scale = 1;
                var scrollView = _this.content.getComponent(cc.ScrollView);
                _this.unschedule(_this.setItemOnTouchMove);
                itemComp.editMoveBtn.off(cc.Node.EventType.TOUCH_MOVE);
                scrollView.enabled = true;
            });
            itemComp.editMoveBtn.on(cc.Node.EventType.TOUCH_CANCEL, function () {
                item.y = _this.allItemStartY - (itemComp.itemIndex * _this.itemHeight);
                item.zIndex = 0;
                item.scale = 1;
                var scrollView = _this.content.getComponent(cc.ScrollView);
                _this.unschedule(_this.setItemOnTouchMove);
                itemComp.editMoveBtn.off(cc.Node.EventType.TOUCH_MOVE);
                scrollView.enabled = true;
            });
            item.parent = this_1.content;
            item.y = this_1.allItemStartY - this_1.itemHeight * i;
        };
        var this_1 = this;
        for (var i = 0; i < this.itemCount; i++) {
            _loop_1(i);
        }
    };
    favorManager.prototype.setItemOnTouchMove = function () {
        var _this = this;
        var itemComp = this.nowTouchTargetNode.getComponent(favorItem_1.default);
        if (itemComp) {
            itemComp.editMoveBtn.on(cc.Node.EventType.TOUCH_MOVE, function (e) {
                var touchPos = e.touch.getLocation();
                var convPos = _this.content.convertToNodeSpaceAR(touchPos);
                var itemSelfStartY = _this.allItemStartY - (itemComp.itemIndex * _this.itemHeight); //目標的起始Y
                var moveDeltaY = Math.abs(convPos.y - itemSelfStartY);
                var isMoveOverHelfHeight = moveDeltaY > _this.itemHeight / 2;
                if (isMoveOverHelfHeight) {
                    var nextItemIndex_1;
                    var nextItem = void 0;
                    //滑超過一半的物件高
                    if (convPos.y < itemSelfStartY) {
                        //下滑
                        nextItemIndex_1 = itemComp.itemIndex + 1;
                    }
                    else if (convPos.y > itemSelfStartY) {
                        //上滑
                        nextItemIndex_1 = itemComp.itemIndex - 1;
                    }
                    nextItem = _this.itemList.find(function (item) { return item.getComponent(favorItem_1.default).itemIndex === nextItemIndex_1; });
                    if (nextItem) {
                        cc.tween(nextItem)
                            .to(0.3, { y: itemSelfStartY })
                            .start();
                        nextItem.getComponent(favorItem_1.default).itemIndex = itemComp.itemIndex;
                        itemComp.itemIndex = nextItemIndex_1;
                    }
                }
                _this.nowTouchTargetNode.y = convPos.y; //移動按住的物件
                if (convPos.y < _this.startScrollDownBoundY) {
                    //超過content下緣, 往下scroll
                    if (_this.content.y >= _this.scrollBottomY) {
                        _this.content.y = _this.scrollBottomY;
                        return;
                    }
                    _this.content.y += 5;
                }
                else if (convPos.y + _this.content.y / 2 > _this.startScrollUpBoundY) {
                    //超過content上緣, 往上scroll
                    if (_this.content.y <= _this.scrollTopY) {
                        _this.content.y = _this.scrollTopY;
                        return;
                    }
                    _this.content.y -= 5;
                }
            });
        }
    };
    __decorate([
        property(cc.Prefab)
    ], favorManager.prototype, "itemPrefab", void 0);
    __decorate([
        property(cc.Node)
    ], favorManager.prototype, "content", void 0);
    __decorate([
        property({ type: cc.Integer, tooltip: 'content的起始Y座標' })
    ], favorManager.prototype, "scrollTopY", void 0);
    __decorate([
        property({ type: cc.Integer, tooltip: '整個Panel的高度,即可以滾動的最低Y座標' })
    ], favorManager.prototype, "scrollBottomY", void 0);
    favorManager = __decorate([
        ccclass
    ], favorManager);
    return favorManager;
}(cc.Component));
exports.default = favorManager;

cc._RF.pop();
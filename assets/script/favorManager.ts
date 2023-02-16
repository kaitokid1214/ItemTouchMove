import favorItem from "./favorItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class favorManager extends cc.Component {
    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null

    @property(cc.Node)
    content: cc.Node = null

    @property({type:cc.Integer, tooltip:'content的起始Y座標'})
    scrollTopY: number = 0

    @property({type:cc.Integer, tooltip:'整個Panel的高度,即可以滾動的最低Y座標'})
    scrollBottomY: number = 0

    itemList: Array<cc.Node> = []

    allItemStartY = -15 //item的第一個起始位置
    itemHeight = 30 //一個item的高度
    itemCount = 10 //item總數

    startScrollUpBoundY = 0 //最上面的滾動Y邊界
    startScrollDownBoundY = 0 //最下方的滾動Y邊界
    nowTouchTargetNode: cc.Node
    isStartMove = false
    onLoad() {
        console.warn('ken666::onLoad')

        this.content.height = this.itemCount * this.itemHeight
        this.startScrollUpBoundY = this.allItemStartY + this.itemHeight / 2
        this.startScrollDownBoundY = -this.node.height + this.itemHeight / 2
        for (let i = 0; i < this.itemCount; i++) {
            let item = cc.instantiate(this.itemPrefab)
            this.itemList.push(item)

            let itemComp = item.getComponent(favorItem)
            itemComp.itemIndex = i
            itemComp.setCount()
            itemComp.editMoveBtn.on(cc.Node.EventType.TOUCH_START, (e: cc.Event.EventTouch) => {
                let scrollView = this.content.getComponent(cc.ScrollView)
                scrollView.enabled = false
                this.nowTouchTargetNode = item
                this.scheduleOnce(this.setItemOnTouchMove, 1)

            })

            itemComp.editMoveBtn.on(cc.Node.EventType.TOUCH_END, () => {
                item.y = this.allItemStartY - (itemComp.itemIndex * this.itemHeight)
                item.zIndex = 0
                item.scale = 1
                let scrollView = this.content.getComponent(cc.ScrollView)
                this.unschedule(this.setItemOnTouchMove)
                if(!this.isStartMove) {
                    //TODO 按鈕的未達長按時間click效果
                }
                this.isStartMove = false
                itemComp.editMoveBtn.off(cc.Node.EventType.TOUCH_MOVE)
                scrollView.enabled = true
            })

            itemComp.editMoveBtn.on(cc.Node.EventType.TOUCH_CANCEL, () => {
                item.y = this.allItemStartY - (itemComp.itemIndex * this.itemHeight)
                item.zIndex = 0
                item.scale = 1
                let scrollView = this.content.getComponent(cc.ScrollView)
                this.unschedule(this.setItemOnTouchMove)
                this.isStartMove = false
                itemComp.editMoveBtn.off(cc.Node.EventType.TOUCH_MOVE)
                scrollView.enabled = true
            })


            item.parent = this.content
            item.y = this.allItemStartY - this.itemHeight * i
        }
    }

    setItemOnTouchMove() {
        let itemComp = this.nowTouchTargetNode.getComponent(favorItem)
        this.nowTouchTargetNode.zIndex = 1
        this.nowTouchTargetNode.scale = 1.1
        if (itemComp) {
            this.isStartMove = true
            itemComp.editMoveBtn.on(cc.Node.EventType.TOUCH_MOVE, (e: cc.Event.EventTouch) => {
                let touchPos = e.touch.getLocation()
                let convPos = this.content.convertToNodeSpaceAR(touchPos)
                let itemSelfStartY = this.allItemStartY - (itemComp.itemIndex * this.itemHeight)//目標的起始Y
                let moveDeltaY = Math.abs(convPos.y - itemSelfStartY)
                let isMoveOverHelfHeight = moveDeltaY > this.itemHeight / 2
                if (isMoveOverHelfHeight) {
                    let nextItemIndex: number
                    let nextItem: cc.Node
                    //滑超過一半的物件高
                    if (convPos.y < itemSelfStartY) {
                        //下滑
                        nextItemIndex = itemComp.itemIndex + 1
                    } else if (convPos.y > itemSelfStartY) {
                        //上滑
                        nextItemIndex = itemComp.itemIndex - 1
                    }

                    nextItem = this.itemList.find(item => item.getComponent(favorItem).itemIndex === nextItemIndex)
                    if (nextItem) {
                        cc.tween(nextItem)
                            .to(0.3, { y: itemSelfStartY })
                            .start()
                        nextItem.getComponent(favorItem).itemIndex = itemComp.itemIndex
                        itemComp.itemIndex = nextItemIndex
                    }
                }
                this.nowTouchTargetNode.y = convPos.y //移動按住的物件

                if (convPos.y < this.startScrollDownBoundY) {
                    //超過content下緣, 往下scroll
                    if (this.content.y >= this.scrollBottomY) {
                        this.content.y = this.scrollBottomY
                        return
                    }
                    this.content.y += 5
                } else if (convPos.y + this.content.y / 2 > this.startScrollUpBoundY) {
                    //超過content上緣, 往上scroll
                    if (this.content.y <= this.scrollTopY) {
                        this.content.y = this.scrollTopY
                        return
                    }
                    this.content.y -= 5
                }
            })
        }
    }





}

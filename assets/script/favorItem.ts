const { ccclass, property } = cc._decorator;

@ccclass
export default class favorItem extends cc.Component {
    @property(cc.Node)
    favorItem: cc.Node = null

    @property(cc.Node)
    editMoveBtn: cc.Node = null

    @property(cc.Label)
    countLabel: cc.Label = null

    _index: number = 0

    get itemIndex(): number {
        return this._index
    }

    set itemIndex(index: number) {
        this._index = index
    }

    setCount() {
        this.countLabel.string = `${this.itemIndex + 1}`
    }

    onLoad() {
        // this.editMoveBtn.on(cc.Node.EventType.TOUCH_START, () =>{
        //     console.log('ken666')
        // })
    }
}

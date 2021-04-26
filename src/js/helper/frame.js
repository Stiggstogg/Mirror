/**
 * Frame for the "How to Play"
 */
export default class Frame {

    /**
     * @constructor
     * @param {Phaser.Scene} scene - Scene where the block will be placed
     */
    constructor(scene, x, y, width, height, titleText, contentText, styles) {

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.styles = styles;

        this.pressText = 'Press [ENTER] or [SPACE] to Continue\nPress [BACKSPACE] to go back to Main Menu';
        this.titleOffsetY = 46;
        this.contentOffset = {x: 32, y: 70};
        this.pressOffsetY = 46;

        // create frames
        this.frames =[];
        this.frames.push(scene.add.rectangle(0, 0, 100, 100, 0x372134).setDepth(2));
        this.frames.push(scene.add.rectangle(0, 0, 100, 100, 0x474476).setDepth(2));
        this.frames.push(scene.add.rectangle(0, 0, 100, 100, 0x4888b7).setDepth(2));
        this.frames.push(scene.add.rectangle(0, 0,  100, 100, 0x6dbcb9).setDepth(2));
        this.frames.push(scene.add.rectangle(0, 0,  100, 100, 0x474476).setDepth(2));

        // create title text
        this.title = scene.add.text(0, 0, titleText, this.styles.get(0)).setOrigin(0.5, 0.5).setDepth(3);

        // create content text
        this.contentStyle = this.styles.get(4);
        this.contentStyle.wordWrap = {width: 100};

        this.content = scene.add.text(0, 0, contentText, this.contentStyle).setOrigin(0, 0).setDepth(3);

        // create press text
        this.press = scene.add.text(0, 0, this.pressText, this.styles.get(1)).setOrigin(0.5, 0.5).setDepth(3);

        // position and size the frame
        this.setPosition(this.x, this.y);
        this.setSize(this.width, this.height);

    }

    setPosition(x, y) {

        this.x = x;
        this.y = y;

        for (let i in this.frames) {
            this.frames[i].setPosition(x, y);
        }

        this.title.setPosition(x, y- this.height / 2 + this.titleOffsetY);

        this.content.setPosition(this.x - this.width/2 + this.contentOffset.x, this.y - this.height / 2 + this.contentOffset.y);

        this.press.setPosition(this.x, this.y + this.height / 2 - this.pressOffsetY);

    }

    setSize(width, height) {

        this.width = width;
        this.height = height;

        for (let i in this.frames) {
            this.frames[i].setSize(width - i*8, height - i*8).setOrigin(0.5);       // origin needs to be reset
        }

        this.title.setPosition(this.x, this.y - this.height / 2 + this.titleOffsetY);

        this.content.setPosition(this.x - this.width/2 + this.contentOffset.x, this.y - this.height / 2 + this.contentOffset.y);
        this.content.setWordWrapWidth(this.width - 2 * this.contentOffset.x);
        this.press.setPosition(this.x, this.y + this.height / 2 - this.pressOffsetY);

    }

    visible(value) {
        for (let i in this.frames) {
            this.frames[i].setVisible(value);
        }

        this.title.setVisible(value);
        this.content.setVisible(value);
        this.press.setVisible(value);

    }

    changeText(titleText, contentText) {
        this.title.setText(titleText);
        this.content.setText(contentText);
    }

    changePressText(text) {
        this.press.setText(text);
    }

}
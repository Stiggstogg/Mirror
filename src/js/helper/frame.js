/**
 * Frame object which creates a frame which can be used to create frames with text (and sprites) for the "How to Play"
 * section.
 */
export default class Frame {

    /**
     * Frame object which creates a frame which can be used to create frames with text (and sprites) for the "How to Play"
     * section. Every frame consists of a frame, a title, text and a instruction ('press') text.
     * @constructor
     * @param {Phaser.Scene} scene - scene where the frame is used ('How to play' scene)
     * @param {number} x - x coordinate of the frame (center of the frame)
     * @param {number} y - y coordinate of the frame (center of the frame)
     * @param {number} width - width of the frame
     * @param {number} height - height of the frame
     * @param {string} titleText - title text of the frame
     * @param {string} contentText - content text of the frame
     * @param {TextStyle} styles - text styles which are used in the frame
     */
    constructor(scene, x, y, width, height, titleText, contentText, styles) {

        // set properties of the frame
        this.x = x;                 // x coordinate (center of the frame)
        this.y = y;                 // y coordinate (center of the frame)
        this.width = width;         // frame width
        this.height = height;       // frame height
        this.styles = styles;       // text styles (array of text style objects)

        // add parameters
        this.pressText = 'Press [ENTER] or [SPACE] to Continue\nPress [BACKSPACE] to go back to Main Menu';     // default 'press' / instruction text which appears at the bottom of the frame
        this.titleOffsetY = 46;                     // y offset of the title (distance of the title center from the top frame)
        this.contentOffset = {x: 32, y: 70};        // content offset (distance of the content from the top and left corner), content starts in the top left
        this.pressOffsetY = 46;                     // y offset of the 'press' / instruction text from the bottom

        // create frames / outline of the whole frame and the background, which consists of four rectangles with different colors
        // for the outline and one rectangle for the background.
        this.frames =[];                                // frames array which contains all rectangles
        this.frames.push(scene.add.rectangle(0, 0, 100, 100, 0x372134).setDepth(2));    // add rectangle with depth 2 to be on top of all game elements,
        this.frames.push(scene.add.rectangle(0, 0, 100, 100, 0x474476).setDepth(2));    // position and size is not yet correct, will be set later
        this.frames.push(scene.add.rectangle(0, 0, 100, 100, 0x4888b7).setDepth(2));    // origin of rectangles is by default set to 0.5, 0.5
        this.frames.push(scene.add.rectangle(0, 0,  100, 100, 0x6dbcb9).setDepth(2));
        this.frames.push(scene.add.rectangle(0, 0,  100, 100, 0x474476).setDepth(2));

        // create title text (position is not correct yet)
        this.title = scene.add.text(0, 0, titleText, this.styles.get(0)).setOrigin(0.5, 0.5).setDepth(3);   // add text with style, origin and depth (to be on top of the frames)

        // create content text
        this.contentStyle = this.styles.get(4);                                     // set the style of the content text
        this.contentStyle.wordWrap = {width: 100};                                  // set the word wrap width (not yet final, will be dependent on the frame size)
        this.content = scene.add.text(0, 0, contentText, this.contentStyle).setOrigin(0, 0).setDepth(3);    // add the content with style, origin (top left) and depth (to be on top of the frames)

        // create 'press' / instruction text (which is shown at the bottom)
        this.press = scene.add.text(0, 0, this.pressText, this.styles.get(1)).setOrigin(0.5, 0.5).setDepth(3);  // add the 'press' text with style, origin and depth (to be on top of the frames)

        // position and size the frame
        this.setPosition(this.x, this.y);           // set the position (based on the coordinates of the center) of the whole frame including all elements (frames, title, content, press)
        this.setSize(this.width, this.height);      // set the size of the frame including all elements

    }

    /**
     * Sets the position of the frame (and all of it's elements based on x and y coordinates. The coordinates represent
     * the position based on the center of the frame
     * @param {number} x - x coordinate of the frame (center of the frame)
     * @param {number} y - y coordinate of the frame (center of the frame)
     */
    setPosition(x, y) {

        // set the x and y property to the new position
        this.x = x;
        this.y = y;

        // position all frames / outlines to the new position (as they all have the same center, only the height and width
        // is different, see setSize)
        for (let i in this.frames) {
            this.frames[i].setPosition(x, y);
        }

        // set the position of the title, content and press text
        this.title.setPosition(x, y - this.height / 2 + this.titleOffsetY);     // position the title: horizontally centered, vertically top + offset
        this.content.setPosition(this.x - this.width/2 + this.contentOffset.x, this.y - this.height / 2 + this.contentOffset.y); // position the content: top left corner + offset
        this.press.setPosition(this.x, this.y + this.height / 2 - this.pressOffsetY);   // position the 'press' text: horizontally centered, vertically bottom + offset

    }

    /**
     * Sets the size of the frame (and all of it's elements) based on x and y coordinates.
     * @param {number} width - width of the frame
     * @param {number} height - height of the frame
     */
    setSize(width, height) {

        // set the width and height property to the new size
        this.width = width;
        this.height = height;

        // set the width and height for each frame / outline. Every frame will be a little (8 px) smaller to create
        // outline with thickness of 4 px
        for (let i in this.frames) {
            this.frames[i].setSize(width - i*8, height - i*8).setOrigin(0.5);       // set the width and height of the frame every time a bit smaller than the whole frame, origin needs to be reset to be still in the center and create the outline effect
        }

        this.title.setPosition(this.x, this.y - this.height / 2 + this.titleOffsetY);   // reset the vertical position of the title based on the new height (horizontal position is independent of the width as title is horizontally centered)

        this.content.setPosition(this.x - this.width/2 + this.contentOffset.x, this.y - this.height / 2 + this.contentOffset.y);    // reset the position of the content based on the new width and height
        this.content.setWordWrapWidth(this.width - 2 * this.contentOffset.x);                // set the word wrap width of the content based on the new width (subtract horizontal offset from each side)
        this.press.setPosition(this.x, this.y + this.height / 2 - this.pressOffsetY);           // reset the vertical position of the 'press' text based on the new height (horizontal position is independent of the width as 'press' text is horizontally centered)

    }

    /**
     * Set the visibility (visible or not visible) of the frame and all of it's elements
     * @param {boolean} value - boolean for the visibility, true: frame is visible, false: frame is invisible
     */
    visible(value) {

        // set the visibility for all frames / outlines
        for (let i in this.frames) {
            this.frames[i].setVisible(value);
        }

        this.title.setVisible(value);       // set visibility of the title
        this.content.setVisible(value);     // set visibility of the content
        this.press.setVisible(value);       // set visibility of the 'press' text

    }

    /**
     * Change the title and content text in the frame.
     * @param {string} titleText - new title text of the frame
     * @param {string} contentText - new content text of the frame
     */
    changeText(titleText, contentText) {
        this.title.setText(titleText);      // set the title text to the new text
        this.content.setText(contentText);  // set the content text to the new text
    }

    /**
     * Change the 'press' / instruction text in the frame.
     * @param {string} text - new 'press' / instruction text of the frame
     */
    changePressText(text) {
        this.press.setText(text);       // set the new 'press' / instruction text
    }

}
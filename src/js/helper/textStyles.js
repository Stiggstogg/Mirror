export default class TextStyle {

    /**
     * Class which provides different text styles.
     */
    constructor() {

        this.styles = [];

        // style 0 ("Day x" in frame, general title in frame)
        this.styles.push({
            fontFamily: 'VT323',
            fontSize: '50px',
            color: '#8cefb6'
        });

        // style 1 ("Press" in frame)
        this.styles.push({
            fontFamily: 'VT323',
            fontSize: '22px',
            color: '#8cefb6'
        });

        // style 2 (game timer)
        this.styles.push({
            fontFamily: 'VT323',
            fontSize: '40px',
            color: '#8cefb6'
        });

        // style 3 (game over text)
        this.styles.push({
            fontFamily: 'VT323',
            fontSize: '20px',
            color: '#6dbcb9',
            wordWrap: {width: 406}
        });

        // style 4 (text in "How to Play" frame)
        this.styles.push({
            fontFamily: 'VT323',
            fontSize: '16px',
            color: '#6dbcb9'
        });

        // style 5 (instruction text in music composer)
        this.styles.push({
            fontFamily: 'VT323',
            fontSize: '30px',
            color: '#6dbcb9'
        });

        // style 6 (Time table in frame;)
        this.styles.push({
            fontFamily: 'VT323',
            fontSize: '25px',
            color: '#6dbcb9'
        });

        // style 7 (menu title)
        this.styles.push({
            fontFamily: 'VT323',
            fontSize: '50px',
            color: '#372134'
        });

        // style 8 (menu inactive)
        this.styles.push({
            fontFamily: 'VT323',
            fontSize: '40px',
            color: '#474476'
        });

        // style 9 (menu active)
        this.styles.push({
            fontFamily: 'VT323',
            fontSize: '50px',
            color: '#8cefb6'
        });

    }

    /**
     * Provides the text style with the corresponding number
     * @param number - text style number
     */
    get(number) {
        return this.styles[number];
    }
}
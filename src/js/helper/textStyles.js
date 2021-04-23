export default class TextStyle {

    /**
     * Class which provides different text styles.
     */
    constructor() {

        this.styles = [];

        // style 0
        this.styles.push({
            fontFamily: 'VT323',
            fontSize: '50px',
            color: '#8cefb6'
        });

        // style 1
        this.styles.push({
            fontFamily: 'VT323',
            fontSize: '22px',
            color: '#8cefb6'
        });

        // style 2
        this.styles.push({
            fontFamily: 'VT323',
            fontSize: '40px',
            color: '#8cefb6'
        });

        // style 3
        this.styles.push({
            fontFamily: 'VT323',
            fontSize: '70px',
            color: '#474476'
        });

        // style 4
        this.styles.push({
            fontFamily: 'VT323',
            fontSize: '50px',
            color: '#474476'
        });

        // style 5
        this.styles.push({
            fontFamily: 'VT323',
            fontSize: '40px',
            color: '#6dbcb9'
        });

        // style 6
        this.styles.push({
            fontFamily: 'VT323',
            fontSize: '25px',
            color: '#6dbcb9'
        });

        // style 7 (menu title)
        this.styles.push({
            fontFamily: 'VT323',
            fontSize: '60px',
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
import WebFontLoader from 'webfontloader'

export default class WebFontFile extends Phaser.Loader.File {
    /**
     * WebFont Loader from: https://blog.ourcade.co/posts/2020/phaser-3-google-fonts-webfontloader/
     * Loads web fonts before text is created (in 'Loading' scene preload) by using 'Web Font Loader' library and
     * Phasers 'File' class
     * @param {Phaser.Loader.LoaderPlugin} loader - loader which handles loading all external content
     * @param {string | string[]} fontNames - name of the font(s) we want to load
     * @param {string} [service] - source / service from where we want to load the font
     */
    constructor(loader, fontNames, service = 'google')
    {
        super(loader, {
            type: 'webfont',            // types of the file we are loading
            key: fontNames.toString()   // unique (within its file type) key
        })

        this.fontNames = Array.isArray(fontNames) ? fontNames : [fontNames] // add the font names as array (create an array if it is only a single font name)
        this.service = service              // add the service
    }

    /**
     * Loads the font(s).
     */
    load()
    {
        // create the configuration for the WebFontLoader
        const config = {
            active: () => {                                         // 'active' function which is triggered when the fonts have rendered (are loaded)
                this.loader.nextFile(this, true)             // tell phaser that it is loaded
            }
        }

        // add the fonts (based on the service chosen)
        switch (this.service)
        {
            case 'google':                                          // loading of google fonts
                config['google'] = {
                    families: this.fontNames                        // add fonts to the 'google' config
                }
                break
            default:
                throw new Error('Unsupported font service')         // throw error if the service is not supported
        }

        WebFontLoader.load(config);                                 // load the web font(s) using the Web Font Loader
    }
}
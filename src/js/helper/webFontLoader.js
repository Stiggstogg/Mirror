import WebFontLoader from 'webfontloader'

export default class WebFontFile extends Phaser.Loader.File {
    /**
     * WebFont Loader from: https://blog.ourcade.co/posts/2020/phaser-3-google-fonts-webfontloader/
     * @param {Phaser.Loader.LoaderPlugin} loader
     * @param {string | string[]} fontNames
     * @param {string} [service]
     */
    constructor(loader, fontNames, service = 'google')
    {
        super(loader, {
            type: 'webfont',
            key: fontNames.toString()
        })

        this.fontNames = Array.isArray(fontNames) ? fontNames : [fontNames]
        this.service = service
    }

    load()
    {
        const config = {
            active: () => {
                this.loader.nextFile(this, true)        // tell phaser that it is loaded
            }
        }

        switch (this.service)
        {
            case 'google':
                config['google'] = {
                    families: this.fontNames
                }
                break

            default:
                throw new Error('Unsupported font service')
        }

        WebFontLoader.load(config)
    }
}
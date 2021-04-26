export default class MusicPlayer {

    /**
     * Music player class which manages the chrod sequence of the music and plays it.
     * @constructor
     * @param {Phaser.Scene} scene - scene in which the music should be played
     * @param {string[][]} trackNames - string of keys for the tracks, every track can have multiple modes (e.g. normal and fast)
     * @param {number[]} sequence - chord / track sequence of the music, numbers of the tracks are in the order of how the tracknames are provided
     */
    constructor(scene, trackNames, sequence){

        this.scene = scene;                                 // scene
        this.sequence = sequence;                           // chord / track sequence
        this.tracks = this.createTracks(trackNames);        // create the tracks
        this.allTracks = this.allTracksArray(this.tracks)   // create array with all tracks (not sorted by mode!)

        this.playing = 0;                                   // set the currently playing chord / track to 0 (beginning)
        this.mode = 0;                                      // set the current mode to mode 0

        this.isPlaying = false;

    }

    /**
     * Creates the separate tracks based on the track names provided
     * @param {string[][]} trackNames - string of keys for the tracks, every track can have multiple modes (e.g. normal and fast)
     * @returns {Phaser.Sound.BaseSound[][]} - tracks in a multidimensional array, first dimension: chord / track, second dimension: mode
     */
    createTracks(trackNames) {

        let numTracks = trackNames.length;      // number of tracks
        let numModes = trackNames[0].length;    // number of modes

        let tracks = [];                        // empty track array
        let singleTrack = [];                   // temporary single track array which contains all modes of one track
        let sound;                              // temporary sound object which is created for every track and mode

        // go through all the tracks and their mode and create a track array
        for (let i = 0; i < numTracks; i++) {

            singleTrack = [];                                                           // empty the temporary single track array

            for (let j = 0; j < numModes; j++) {

                sound = this.scene.sound.add(trackNames[i][j]);                             // add a sound for a specific mode of a track
                sound.on('complete', function() { this.playNext() }, this);         // add an event to the sound so that the next sound starts playing immediately after one is finished

                singleTrack.push(sound);                                                // add the sound to the temporary single track array

            }

            tracks.push(singleTrack);                                                   // add all modes of one track to the track array

        }

        return tracks;

    }

    /**
     * Play the next chord / track of the sequence
     */
    playNext() {

        // if it is the last chord of the sequence start again from the first one, otherwise go to the next one
        if (this.playing >= this.sequence.length - 1) {
            this.playing = 0;
        }
        else {
            this.playing++;
        }

        this.playCurrent();         // play the currently selected track

    }

    /**
     * Plays the currently selected track / chord
     */
    playCurrent() {

        let chord = this.sequence[this.playing];    // get the current chord / track

        this.tracks[chord][this.mode].play();       // play the track

    }

    /**
     * Change the mode.
     * @param {number} mode - number of the mode
     */
    changeMode(mode) {
        this.mode = mode;
    }

    /**
     * Fade out (including stop)
     */
    fadeOut(scene) {

        scene.tweens.add({
            targets: this.allTracks,
            volume: {from: 1, to: 0},
            duration: 1000,
            callbackScope: this,
            onComplete: function() {
                this.stop();
            }
        });

    }

    /**
     * Fade in
     */
    fadeIn(scene) {
        this.start();                   // start the sound

        scene.tweens.add({
            targets: this.allTracks,
            volume: {from: 0, to: 1},
            duration: 1000,
        });

    }

    /**
     * Takes the track array (two dimensional) and puts all elements in one single array. This is needed for the tweens
     * (as targets)
     * @param {Phaser.Sound.BaseSound[][]} tracks - tracks in a multidimensional array, first dimension: chord / track, second dimension: mode
     * @returns {Phaser.Sound.BaseSound[]} - single array (one dimensional) with all tracks
     */
    allTracksArray(tracks) {

        let allTracks = [];

        // create a single array out of all tracks
        for (let i = 0; i < this.tracks.length; i++) {
            for (let j = 0; j < this.tracks[0].length; j++) {

                allTracks.push(this.tracks[i][j]);

            }
        }

        return allTracks

    }

    /**
     * Stops the currently playing track (and also all others)
     */
    stop() {

        this.isPlaying = false;

        for (let i in this.allTracks) {
            this.allTracks[i].stop();
        }

        this.playing = 0;       // reset to the beginning
    }

    /**
     * Starts the music (from beginning)
     */
    start() {

        this.isPlaying = true;

        this.playing = 0;       // reset to the beginning
        this.playCurrent();
    }

    /**
     * Change the sequecne
     * @param {number[]} seq - sequence of tracks / chords
     */
    changeSequence(seq) {
        this.sequence = seq;
    }

    getSequence(){
        return this.sequence;
    }

    changeChord(position, number) {
        this.sequence[position] = number;
    }

}
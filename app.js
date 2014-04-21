var SynthPad = (function()
{
    var c;
    var frequencyLabel;
    var volumeLabel;

    var myAudioContext;
    var oscillator;
    var gainNode;

    // Notes
    var lowNote = 261.63;
    // C4
    var highNote = 493.88;
    // B4

    // Constructor
    var SynthPad = function()
    {
        c = document.getElementById('synth-pad');
        frequencyLabel = document.getElementById('frequency');
        volumeLabel = document.getElementById('volume');

        // Context
        myAudioContext = new webkitAudioContext();

        SynthPad.setupEventListeners();
    };

    SynthPad.setupEventListeners = function()
    {
        // Disable scroll
        document.body.addEventListener('touchmove', function(event)
        {
            event.preventDefault();
        }, false);

        c.addEventListener('mousedown', SynthPad.playSound);
        c.addEventListener('touchstart', SynthPad.playSound);

        c.addEventListener('mouseup', SynthPad.stopSound);
        document.addEventListener('mouseleave', SynthPad.stopSound);
        c.addEventListener('touchend', SynthPad.stopSound);
        
        c.addEventListener('mousedown', SynthPad.startGlow);
        c.addEventListener('mouseup', SynthPad.stopGlow);
        document.addEventListener('mouseleave', SynthPad.stopGlow);
    };

    SynthPad.playSound = function(event)
    {
        oscillator = myAudioContext.createOscillator();
        // src
        gainNode = myAudioContext.createGainNode();
        // fx

        oscillator.type = 'triangle';
        //sine, square, sawtooth, triangle, and custom.

        gainNode.connect(myAudioContext.destination);
        // dst
        oscillator.connect(gainNode);

        SynthPad.updateFrequency(event);

        oscillator.start(0);

        c.addEventListener('mousemove', SynthPad.updateFrequency);
        c.addEventListener('touchmove', SynthPad.updateFrequency);

        c.addEventListener('mousemove', SynthPad.updateGlow);

        c.addEventListener('mouseout', SynthPad.stopSound);
        
        //c.addEventListener('mouseout', SynthPad.stopGlow);
    };

    SynthPad.stopSound = function(event)
    {
        oscillator.stop(0);

        c.removeEventListener('mousemove', SynthPad.updateFrequency);
        c.removeEventListener('touchmove', SynthPad.updateFrequency);
        c.removeEventListener('mouseout', SynthPad.stopSound);
    };

    SynthPad.calculateNote = function(posX)
    {
        var noteDifference = highNote - lowNote;

        // freq val represented by 1 pixel on the pad
        var noteOffset = (noteDifference / c.offsetWidth) * (posX - c.offsetLeft);
        return lowNote + noteOffset;
    };

    SynthPad.calculateVolume = function(posY)
    {
        var volumeLevel = 1 - (((100 / c.offsetHeight) * (posY - c.offsetTop)) / 100);
        return volumeLevel;
    };

    SynthPad.calculateFrequency = function(x, y)
    {
        oscillator.frequency.value = SynthPad.calculateNote(x);
        gainNode.gain.value = SynthPad.calculateVolume(y);

        frequencyLabel.innerHTML = Math.floor(SynthPad.calculateNote(x)) + ' Hz';
        volumeLabel.innerHTML = Math.floor(SynthPad.calculateVolume(y) * 100) + '%';
    };

    SynthPad.updateFrequency = function(event)
    {
        if(event.type == 'mousedown' || event.type == 'mousemove')
        {
            SynthPad.calculateFrequency(event.x, event.y);
        }
        else if(event.type == 'touchstart' || event.type == 'touchmove')
        {
            SynthPad.calculateFrequency(event.touches[0].pageX, event.touches[0].pageY);
        }
    };

    SynthPad.startGlow = function(event)
    {
        document.getElementById("cursorglow").style.display = "block";
    };

    SynthPad.updateGlow = function(event)
    {
        var cursorx = event.clientX;
        var cursory = event.clientY;
        document.getElementById("cursorglow").style.left = cursorx + "px";
        document.getElementById("cursorglow").style.top = cursory + "px";
    };
    
    SynthPad.stopGlow = function(event)
    {
        document.getElementById("cursorglow").style.display = "none";
    };

    return SynthPad;

})();

// Initialize the page.
window.onload = function()
{
    var synthPad = new SynthPad();
};

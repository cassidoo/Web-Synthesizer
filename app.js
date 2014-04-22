var SynthPad = (function()
{
    var c;
    var frequencyLabel;
    var volumeLabel;
    var waveType;
    
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
        waveType = document.getElementById('sounds');

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
        
        waveType.addEventListener('onchange', SynthPad.updateSound);
        
        c.addEventListener('mousedown', SynthPad.playSound);
        c.addEventListener('touchstart', SynthPad.playSound);

        c.addEventListener('mouseup', SynthPad.stopSound);
        document.addEventListener('mouseleave', SynthPad.stopSound);
        c.addEventListener('touchend', SynthPad.stopSound);
    };

    SynthPad.playSound = function(event)
    {
        oscillator = myAudioContext.createOscillator();
        // src
        gainNode = myAudioContext.createGainNode();
        // fx

        oscillator.type = document.getElementById('sounds').value;
        //sine, square, sawtooth, triangle, and custom.

        gainNode.connect(myAudioContext.destination);
        // dst
        oscillator.connect(gainNode);

        SynthPad.updateFrequency(event);

        oscillator.start(0);

        //SynthPad.startGlow(event);

        c.addEventListener('mousemove', SynthPad.updateFrequency);
        c.addEventListener('touchmove', SynthPad.updateFrequency);

        c.addEventListener('mouseout', SynthPad.stopSound);

    };

    SynthPad.stopSound = function(event)
    {
        oscillator.stop(0);

        //SynthPad.stopGlow(event);

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
            //SynthPad.updateGlow(event);
        }
        else if(event.type == 'touchstart' || event.type == 'touchmove')
        {
            SynthPad.calculateFrequency(event.touches[0].pageX, event.touches[0].pageY);
        }
    };
    
    SynthPad.updateSound = function(event)
    {
        oscillator.type = document.getElementById('sounds').value;
    };

    /*SynthPad.startGlow = function(event)
     {
     if(event.type == 'mousedown' || event.type == 'mousemove')
     {
     document.getElementById("cursorglow").style.display = "block";
     }
     };

     SynthPad.updateGlow = function(event)
     {
     if(event.type == 'mousedown' || event.type == 'mousemove')
     {
     var cursorx = event.clientX;
     var cursory = event.clientY;
     document.getElementById("cursorglow").style.left = cursorx + "px";
     document.getElementById("cursorglow").style.top = cursory + "px";
     }
     };

     SynthPad.stopGlow = function(event)
     {
     if(event.type == 'mouseup' || event.type == 'mouseout')
     {
     document.getElementById("cursorglow").style.display = "none";
     }
     };*/

    return SynthPad;

})();

// Initialize the page.
window.onload = function()
{
    var synthPad = new SynthPad();
};

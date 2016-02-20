var ProgressBar = function(options){

    var progressbarwrapper = document.createElement("div");
    progressbarwrapper.classList.add("progressbarWrapper");

    var progressbartitle = document.createElement("div");
    progressbartitle.classList.add("progressbarTitle");

    var progresstext = document.createElement("div");
    progresstext.classList.add("progresstext");
    progresstext.innerHTML = "0%";
    this.progressTextDiv = progresstext;

    var progresstitleandtextwrapper = document.createElement("div");
    progresstitleandtextwrapper.classList.add("progresstitleandtextwrapper");

    progresstitleandtextwrapper.appendChild(progressbartitle);
    progresstitleandtextwrapper.appendChild(progresstext);


    var progressbar = document.createElement("div");
    progressbar.classList.add("progressbar");
    this.progressbarDiv = progressbar;



    progressbarwrapper.appendChild(progresstitleandtextwrapper);
    progressbarwrapper.appendChild(progressbar);

    this.domNode = progressbarwrapper;

    if(options.step){
        this.step = options.step;
    }

    if(options.title){
        progressbartitle.innerHTML = options.title;
    }

    this.progress = 0;
}

ProgressBar.prototype = {

    constructor: ProgressBar,

    startProgress: function(){
        if(this.step){
            this.updateProgressHandler = setInterval(function(){
                if(this.progress === 100){
                    clearInterval(this.updateProgressHandler);
                }
                this.progress ++;
                this.updateProgress();
            }.bind(this), this.step);
        }else{
            this.updateProgress();
        }

    },

    updateProgress: function(currentProgress){
        if(currentProgress){
            this.progress = currentProgress;
        }
        this.updateProgressbarDiv();
    },

    updateProgressbarDiv: function(){
        this.progressbarDiv.style.width = this.progress + "%";
        this.progressTextDiv.innerHTML = this.progress + "%";
    }
};

    var progressbar = new ProgressBar({
        title: "Downloading data..."
    });

    document.getElementById("progressBarContainer").appendChild(progressbar.domNode);

    var count = 0;
    var intervalHandler = setInterval(function(){
        if(count <= 100){
            progressbar.updateProgress(count++);
        }else{
            clearInterval(intervalHandler);
        }
    }, 100);

    progressbar.startProgress();

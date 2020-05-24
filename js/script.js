const htmlVue = new Vue(
    {
        el: '#vueContainer',

        data:  {
            started: false,
            interval: null,

            retracted: {
                x: false,
                y: false
            },
            expanded: {
                x: false,
                y: false
            },
            
            lineDataCSS: [{
                    x1: 320,
                    y1: 240
                }, 
                {
                    x1: 320,
                    y1: 240
                }, 
                {
                    x1: 320,
                    y1: 240
                }, 
                {
                    x1: 320,
                    y1: 240
                }, 
                {
                    x1: 320,
                    y1: 240
                } 
            ],

            bigBallCenter: {
                x2: 320,
                y2: 240,
            },
            
            smallBallDataCSS: [
                {
                    top: '200px',
                    left: '280px',
                },
                {
                    top: '200px',
                    left: '280px',
                },
                {
                    top: '200px',
                    left: '280px',
                },
                {
                    top: '200px',
                    left: '280px',
                },
                {
                    top: '200px',
                    left: '280px',
                },
                
            ],

            smallBallData: [
                'PEM',
                'SMS',
                'Security',
                'IT Ops',
                'Finance'
            ]
        },

        methods: {
            generateRandPos: function () {
                let lineDataCSS = [];
                let smallBallDataCSS = [];

                let rand1=0;
                let rand2=0;

                
                for(let i=0; i<this.lineDataCSS.length; i++) {
                    rand1 = Math.floor(Math.random()*400);
                    rand2 = Math.floor(Math.random()*560);

                    let x1 = rand2+40;
                    let y1 = rand1+40;
                    let x2 = this.bigBallCenter.x2;
                    let y2 = this.bigBallCenter.y2;

                    // get length of line for collision detection
                    const lineLength = (x2-=x1)*x2 + (y2-=y1) * y2;
                    
                    if(lineLength<10000) {
                        i--;
                    } else {
                        smallBallDataCSS.push({
                            top: rand1 + 'px',
                            left: rand2 + 'px',
                        });

                        lineDataCSS.push({
                            x1: x1,
                            y1: y1,
                        });
                    }
                }

                // check if small balls have too little distance
                const smallBalls = [...smallBallDataCSS];

                
                // check if balls are too close to each other
                const ballProximityCheck = checkForSmallBallCrashes(smallBalls);

                if(ballProximityCheck===false) {
                    smallBallDataCSS = [];
                    lineDataCSS = [];    
                    return this.generateRandPos();
                } else {
                    return {
                        smallBallDataCSS: smallBallDataCSS,
                        lineDataCSS: lineDataCSS
                    }
                }
            },

            retractSvg: function(targetLineDataCSS) {
                for(let i=0; i<this.lineDataCSS.length; i++) {
                    let retractInterval = {
                        x: null,
                        y: null,
                    };
    
                    let retractCounter = {
                        x: null,
                        y: null,
                    };

                    retractInterval.x = setInterval(() => {
                        if(this.lineDataCSS[i].x1>320) {
                            this.lineDataCSS[i].x1-=10;
                        } else {
                            this.lineDataCSS[i].x1+=10;
                        }

                        retractCounter.x++;

                        if(this.lineDataCSS[i].x1>305 && this.lineDataCSS[i].x1<335 || retractCounter.x >= 20) {
                            this.lineDataCSS[i].x1 = 320;
                            clearInterval(retractInterval.x);
                            setTimeout(() => {
                                this.expandSvg(targetLineDataCSS, true, undefined);
                            }, 1000);
                        }
                    }, 50);
                    
                    retractInterval.y = setInterval(() => {
                        if(this.lineDataCSS[i].y1>240) {
                            this.lineDataCSS[i].y1-=10;
                        } else {
                            this.lineDataCSS[i].y1+=10;
                        }

                        retractCounter.y++;

                        if(this.lineDataCSS[i].y1>225 && this.lineDataCSS[i].y1<255 || retractCounter.y >= 20) {
                            this.lineDataCSS[i].y1 = 240;
                            clearInterval(retractInterval.y);
                            setTimeout(() => {
                                this.expandSvg(targetLineDataCSS, undefined, true);
                            }, 1000);
                        }
                    }, 50);
                }
            },

            expandSvg: function(targetLineDataCSS, retractX, retractY) {
                if(retractX!==undefined) {
                    this.retracted.x = true;
                }
                if(retractY!==undefined) {
                    this.retracted.y = true;
                }

                if(this.retracted.x && this.retracted.y) {
                    for(let i=0; i<targetLineDataCSS.length; i++) {
                        let expandInterval = {
                            x: null,
                            y: null,
                        };
        
                        let expandCounter = {
                            x: null,
                            y: null,
                        };

                        expandInterval.x = setInterval(() => {
                            if(this.lineDataCSS[i].x1>targetLineDataCSS[i].x1) {
                                this.lineDataCSS[i].x1-=10;
                            } else {
                                this.lineDataCSS[i].x1+=10;
                            }

                            expandCounter.x++;

                            if(this.lineDataCSS[i].x1>(targetLineDataCSS[i].x1-15) && this.lineDataCSS[i].x1<(targetLineDataCSS[i].x1+15) || expandCounter.x >= 20) {
                                this.lineDataCSS[i].x1 = targetLineDataCSS[i].x1;
                                clearInterval(expandInterval.x);
                            }
                        }, 50);
                        
                        expandInterval.y = setInterval(() => {
                            if(this.lineDataCSS[i].y1>targetLineDataCSS[i].y1) {
                                this.lineDataCSS[i].y1-=10;
                            } else {
                                this.lineDataCSS[i].y1+=10;
                            }
                            expandCounter.y++;

                            if(this.lineDataCSS[i].y1>(targetLineDataCSS[i].y1-15) && this.lineDataCSS[i].y1<(targetLineDataCSS[i].y1+15) || expandCounter.y >= 20) {
                                this.lineDataCSS[i].y1 = targetLineDataCSS[i].y1;
                                clearInterval(expandInterval.y);
                            }
                        }, 50);
                    }

                }

            },


            timerAndIntervalFunc: function(startOrStop) {
                if(startOrStop==='start') {
                    this.started = true;
                    let randPosResult = this.generateRandPos();

                    if(randPosResult) {
                        this.lineDataCSS = [...randPosResult.lineDataCSS];
                        this.smallBallDataCSS = [...randPosResult.smallBallDataCSS];
                    }
                    
                    this.interval = setInterval(() => {
                        let randPosResult = this.generateRandPos();
    
                        if(randPosResult) {
                            this.retractSvg([...randPosResult.lineDataCSS]);
                            this.smallBallDataCSS = [...randPosResult.smallBallDataCSS];
                        }
                    }, 5000);
                } else {
                    this.started = false;
                    clearInterval(this.interval);
                }
            }
        },



        template: 
        `
        <div class="container">
            <div id="mainrow" class="row h-100 text-center">
                <div class="col-12 text-center">
                    <div class="textContainer">
                        <h4>Vue floating orbs application.</h4>

                        <p>This small application was a little sidestep by myself into Vue, and I have to say - for simple projects like this I really like it. However, Angular is still remaining lonely at the top.
                        Taken out of a bigger application, which is not yet launched, this project was to dabble in some Vue animation, SVG path animation, etc.
                        Some challenges and features:</p>

                        <ul>
                            <li>Some asynchronous computing issues due to Vue and CSS animations (retracting and expanding motions).</li>
                            <li>Some algorithmic thinking and implementing, which I haven't used before.</li>
                            <li>Ended up not using it, but developed a small little function for calculating the binomial coefficient. It's still attached but commented out.</li>
                        </ul>
                    </div>
                    <div class="buttonContainer">
                        <button class="btn btn-dark btn-block" v-on:click="timerAndIntervalFunc('start')" v-if="!started">start</button>
                        <button class="btn btn-dark btn-block" v-on:click="timerAndIntervalFunc('stop')" v-if="started">stop</button>
                    </div>

                    <div class="ballContainerBorder"></div>
                    <div class="ballContainer">
                        <div class="mainBall">Department</div>

                        <div class="smallBall" v-bind:style="smallBallItem" v-for="(smallBallItem, index) in smallBallDataCSS">{{smallBallData[index]}}</div>

                        <div class="lineContainer">
                            <svg class="svgLineContainer">
                                <line v-bind:x1="lineItem.x1" v-bind:y1="lineItem.y1" v-bind:x2="bigBallCenter.x2" v-bind:y2="bigBallCenter.y2" v-for="lineItem in lineDataCSS"/>
                            </svg>
                        </div>
                        </div>
                    </div>

                </div>
            </div>
        `

    }
);



function checkForSmallBallCrashes(ballsArr) {
    noOfLoops = ballsArr.length-1;
    let svgArr=[];

    for(let i=0; i<noOfLoops; i++) {
        const result = putFirstElAndOthersInArr(ballsArr);
        svgArr = [...svgArr, ...result.arr];
        ballsArr = [...result.ballsArr];
    }

    // get distances and recalc balls if too close
    let lineLength = 0;

    for(let j=0; j<svgArr.length; j++) {
        lineLength = (svgArr[j].x2-=svgArr[j].x1)*svgArr[j].x2 + (svgArr[j].y2-=svgArr[j].y1) * svgArr[j].y2;
        
        if(lineLength<7500) {
            return false;
        }
    }

    return true;
}

function putFirstElAndOthersInArr(ballsArr) {
    const arr=[];
    
    for(let j=1; j<ballsArr.length; j++) {
        arr.push({
            x1: +ballsArr[0].top.replace('px', '')+40,
            y1: +ballsArr[0].left.replace('px', '')+40,
            x2: +ballsArr[j].top.replace('px', '')+40,
            y2: +ballsArr[j].left.replace('px', '')+40,
        });
    }

    // remove first value, so next round only el2 (el3, etc.) are on first place
    ballsArr.shift();

    return {arr, ballsArr}
}



// helper function
function getBinomialCoefficient(n, k)  {
    if (k < 0) { 
        return 0;
    } else if (k > n/2) { 
        k = n - k;
    }

    let res = 1;
    let kIncrement=0;

    do {
        kIncrement++;
        res = res*(n-(kIncrement-1)) / kIncrement;
    } while(kIncrement<k)

    return res;
  }
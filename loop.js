// Pseudo code to explain event loop in node

// node myFile.js

const pendingTimers = [];
const pendingOSTasks = [];
const pendingOperations = [];

// new timers, tasks, operations are recorded from myFile running
myFile.runContents();

function shouldContinue() {
    // check one: Any pending setTimeout, setInterval, setImmediate?
    // check two: Any pending OS tasks? (e.g. server listening to port - OS helpers do the work, e.g. async helpers, left to OS so not using thread pool)
    // check three: Any pending long running operations? (e.g. fs module - stuff that's part of libuv C++ using thread pool)
    return pendingTimers.length || pendingOSTasks.length || pendingOperations.length;
}

// Event loop: Entire body executes in one 'tick'
while(shouldContinue()) {
    // 1) Node looks at pendingTimers and sees if any functions are ready to be called, i.e. setTimeout and setInterval

    // 2) Node looks at pendingOSTasks and pendingOperations and calls relevant callbacks

    // 3) Pause execution. Continue when...
    //      - a new pendingOSTask is done
    //      - a new pendingOperation is done
    //      - a timer is about to complete

    // 4) Look at pendingTimers. i.e. call any setImmediate

    // 5) Handle any 'close' events - clean up code
}


// exit back to terminal
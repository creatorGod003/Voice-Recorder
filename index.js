const record = document.getElementById("record")
const microphone = document.getElementById("record-setup").firstElementChild
const stop = document.getElementById("stop")
const soundClips = document.getElementById("sound-clips")


let chunks = [];

if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){

    console.log("getUserMedia supported")
    navigator.mediaDevices.getUserMedia({
        audio:true
    })
    .then((stream)=>{
        const mediaRecorder = new MediaRecorder(stream)
        
        record.onclick = ()=>{
            mediaRecorder.start()
            console.log(mediaRecorder.state)
            console.log("recorder started");
            microphone.classList.remove("shadow-gray-300")
            microphone.classList.add("shadow-red-300")
            toggleSwitch(record)
        }
        mediaRecorder.ondataavailable = (e)=>{
            chunks.push(e.data)
        }
        stop.onclick = ()=>{
            mediaRecorder.stop();
            console.log(mediaRecorder.state);
            console.log("recorder stopped");
            microphone.classList.remove("shadow-red-300")
            microphone.classList.add("shadow-gray-300")
            toggleSwitch(stop)
        }
        mediaRecorder.onstop= (e)=>{
            console.log("recorder stopped");
            const clipName = prompt("enter your sound file name")
            const clipContainer = document.createElement("article");
            const clipLabel = document.createElement("p");
            const audio = document.createElement("audio");
            const deleteButton = document.createElement("button");
            clipContainer.classList.add("clip")
            audio.setAttribute("controls", "");
            deleteButton.innerHTML = "delete"
            clipLabel.innerHTML = clipName
            clipContainer.appendChild(audio)
            clipContainer.appendChild(clipLabel)
            clipContainer.appendChild(deleteButton);
            soundClips.appendChild(clipContainer);

            const blob = new Blob(chunks, { type:"audio/ogg; codecs=opus"});
            chunks = [];
            const audioURL = window.URL.createObjectURL(blob);
            audio.src = audioURL;
            console.log(audioURL)

            deleteButton.onclick = (e)=>{
                let evtTgt = e.target;
                evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
            }

        }
    })
    .catch((err)=>{
        console.error("The following getUserMedia error occured: "+err)
    })

}
else{
    console.log("getUserMedia is not supported by browser");
}


function toggleSwitch(obj){
    setTimeout(()=>{
        obj.classList.remove("bg-blue-400");
        obj.classList.add("bg-red-400")
        setTimeout(()=>{
            obj.classList.remove("bg-red-400");
            obj.classList.add("bg-blue-400")
        }, 500, obj)
    }, 0, obj)
}
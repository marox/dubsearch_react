import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import openImage from './assets/open_small.png';
import closeImage from './assets/close_small.png';
import insta from './assets/dubsearch_insta.svg';
import contact from './assets/contact.png'; e.target.setAttribute('src', openImage);
import playIcon from './assets/play.png';
import pauseIcon from './assets/pause.png';
import nextIcon from './assets/next.png';
import previousIcon from './assets/previous.png';
import downloadIcon from './assets/download.png';
import sendIcon from './assets/send.png';


function Swaper({onSwap, doOpen}){
    function swap(e){
        if(doOpen) {

        }else{
            e.target.setAttribute('src', closeImage);
        }
        onSwap();
    }
    return(
        <img onClick={(event)=>swap(event)} src={openImage}/>
    )
}

function Controls({onPlay, onPause, onPrevious, onNext, onDownload, paused}){
    return (
        <div className="controls">
            <span className={paused ? 'show' : 'hide'}><img src={playIcon} onClick={onPlay} /></span>
            <span className={!paused ? 'show' : 'hide'}><img src={pauseIcon} onClick={onPause} /></span>
            <span><img src={previousIcon} onClick={onPrevious}/></span>
            <span><img src={nextIcon} onClick={onNext}/></span>
            <span><img src={downloadIcon} onClick={onDownload}/></span>
        </div>
        );
}

function Song({song, onSong, currentData}){
    return(
        <li className="left">
            <div className="number">
                {song.number}
            </div>
            <div className="info">
                <span onClick={onSong} className="play-song">{song.interpret} {song.title}</span>
            </div>
            <div className="time">
                {currentData && song === currentData.track ? currentData.trackTime + ' <' : ''}
            </div>
        </li>
    )
}

function Mix({mix, openMix, currentData, onOpen, onPlay, onPause, onSong}){

    let show = openMix === mix;
    let paused = !currentData ||(currentData.paused && currentData.mixNumber === mix.number) || currentData.mixNumber !== mix.number;

    function download(){
        window.open(process.env.REACT_APP_DOWNLOAD_URL+mix.file);
        return false;
    }

    function nextSong(){
        let songIndex = currentData.track.number;
        mix.songs.length === songIndex ?  onSong(mix.songs[0]) : onSong(mix.songs[songIndex]);
    }

    function previousSong(){
        let songIndex = currentData.track.number-2;
        songIndex < 0 ? onSong(mix.songs[data.songs.length -1]) : onSong(mix.songs[songIndex]);
    }

    return (
        <div className={'panel clear'}>
            <h1>numero {mix.number}<Swaper onSwap={onOpen} doOpen={show}/></h1>
            <ul className="mix">
                <li>title: {mix.title} - {mix.subtitle}</li>
                <li>track: {currentData && currentData.mixNumber === mix.number ? currentData.track.interpret: ''}</li>
                <li>length: {mix.duration} / {currentData && currentData.mixNumber === mix.number  ? currentData.time: '0:00'}</li>
            </ul>
            <div className={show ? 'show' : 'hide'}>
                <Controls onPlay={onPlay} onPause={onPause} onPrevious={previousSong} onNext={nextSong} onDownload={()=>download()} paused={paused}/>
                <ul className="playlist-container left">
                {mix.songs.map(song =>(
                        <Song song={song} onSong={() => onSong(song)} currentData={currentData} key={song.number}/>
                    ))}
                </ul>
            </div>
        </div>
    )
}

function EmailForm()
{
    const [successMessage, setSuccessMessage] = useState(null);
    const { register, handleSubmit, formState: { errors }} = useForm({mode: "onChange"});

    async function onSubmit(data){
        const result = await fetch(process.env.REACT_APP_SUBSCRIBE_URL, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        const responseData = await result.json();
        setSuccessMessage(responseData.message);
        resetEmail();
    }

    function resetEmail(){
        let inputEmail = document.getElementById("email");
        inputEmail.value = '';
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="email"> subscribe</label>
            <input id={'email'}{...register("email",{required: true, pattern: /^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/i })} />
            <input type="image" name="submit" src={sendIcon} className={!errors.email ?'submit': 'hide'}/>
            <div className="maillist_report"><span className="error">
                {errors.email && 'incorrect E-Mail'}</span>
                <span className="success">
                {successMessage}</span>
            </div>
        </form>
    )
}

function MailTo(){
    const mailToLink= 'mailto:'+ process.env.REACT_APP_EMAIL;
    return(
        <a href={mailToLink}>
            <img src={contact} className="email_svg" style={{verticalAlign: 'bottom'}} /> contact
        </a>
    )
}

function Insta(){
    return(
        <a href={process.env.REACT_APP_INSTA_LINK} target="blank">
            <img src={insta} className="email_svg" style={{verticalAlign: 'bottom'}} /> instagram
        </a>
    )
}

function About({text}){
    const [show, setShow] = useState(false);
    function showMe(){
        setShow(!show);
    }

    return (
        <div className={'clear bottom-line'}>
            <h1>About<Swaper onSwap={()=>showMe()} doOpen={show}/></h1>
            <div className={show ? 'show' : 'hide'}>
                <div className={'text'}>
                    {text}
                </div>
                <div className={'email'}>
                    <MailTo />
                </div>
                <div className="subscribe">
                    <EmailForm />
                </div>
                <div className={'email'}>
                    <Insta />
                </div>
                <div className="clear" style={{margin:0}}></div>
            </div>
        </div>
    )
}


export default function Radio(){
    const [data, setData] = useState({mixes:[], about:''});
    const [activeMix, setActiveMix] = useState(null);
    const [openMix, setOpenMix] = useState(null);
    const [currentData, setCurrentData] = useState(null);
    const [audio] = useState(new Audio());

    const secToMin = function(s){
        var minutes = Math.floor(s / 60);
        var seconds = s - (minutes * 60);
        seconds = Math.round(seconds);
        if(seconds < 10){ seconds = '0'+seconds;}
        return minutes+':'+seconds;
    }

    function doOpenMix(mix)
    {
        mix === openMix ? setOpenMix(null) : setOpenMix(mix);
    }

    function setPlayerData(){
        if(activeMix) {
            let s = audio.currentTime.toFixed(0);
            console.log(s);
            let myCurrentData = {};
            myCurrentData.time = secToMin(s);
            myCurrentData.paused = audio.paused;
            myCurrentData.file = activeMix.file;
            myCurrentData.track = activeMix.songs.filter((song, index, songs) => song.position < s ).pop();
            if(myCurrentData.track !== undefined) {
                myCurrentData.mixNumber = activeMix.number;
                myCurrentData.trackTime = secToMin(s - Number(myCurrentData.track.position));
                setCurrentData(myCurrentData);
            }

        }
    }

    function jumpToSong(song){

        const songIsInMix = (mix, song)  => mix.songs.filter((mySong) => mySong === song).length === 1;

        if(!activeMix){
            let firstActiveMix = data.mixes.filter((mix) => songIsInMix(mix, song))[0];
            play(firstActiveMix);
        }else if(!songIsInMix(activeMix, song)) {
            let nextMix = data.mixes.filter((mix) => mix !== activeMix)[0];
            play(nextMix);
        }
        audio.currentTime = song.position;
        setPlayerData();
    }


    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {setPlayerData();}, 1000);
        return () => clearInterval(timer);
    }, [activeMix]);


    async function getData() {
        const response = await fetch(process.env.REACT_APP_DATA_URL);
        const myData = await response.json();
        setData(myData);
    }

    function    play(mix)
    {
        if(mix !== activeMix){
            switchMix(mix);

        }
        audio.play();
        setPlayerData()
    }
    function pause()
    {
        audio.pause();
        setPlayerData()
    }

    function switchMix(mix){
        audio.src = process.env.REACT_APP_STREAM_URL+mix.file;
        setActiveMix(mix);
    }

    return (
        <div className={'content'}>
            <div className={'player'}>
                {data.mixes.map(mix =>(<Mix mix={mix} openMix={openMix} currentData={currentData} onOpen={()=>doOpenMix(mix)} onPlay={()=>play(mix)} onPause={()=>pause()} onSong={jumpToSong} key={mix.number}/>))}
                <About text={data.about} />
            </div>
        </div>
    );
}
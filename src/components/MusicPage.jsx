import React, { useState, useRef, useEffect } from 'react';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import { IconButton, Card, CardMedia, Typography, Box, Slider } from '@mui/material';
import { useAudio } from '../Context/MusicProvider';
import { motion, AnimatePresence } from 'framer-motion';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import CloseIcon from '@mui/icons-material/Close';
// import Musics from './Musics';

const MusicPage = () => {
    const { musicData } = useAudio();
    const [view, setView] = useState('grid');
    const [currentMusic, setCurrentMusic] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(new Audio());

    useEffect(() => {
        if (currentMusic) {
            audioRef.current.src = currentMusic.url;
            audioRef.current.play();
            setIsPlaying(true);
        }
    }, [currentMusic]);

    useEffect(() => {
        const updateProgress = () => {
            if (audioRef.current) {
                setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
            }
        };

        const updateDuration = () => {
            if (audioRef.current) {
                setDuration(audioRef.current.duration);
            }
        };

        audioRef.current.addEventListener("timeupdate", updateProgress);
        audioRef.current.addEventListener("loadedmetadata", updateDuration);
        audioRef.current.addEventListener("ended", () => setIsPlaying(false));

        return () => {
            audioRef.current.removeEventListener("timeupdate", updateProgress);
            audioRef.current.removeEventListener("loadedmetadata", updateDuration);
            audioRef.current.removeEventListener("ended", () => setIsPlaying(false));
        };
    }, []);

    const handlePlayMusic = (music) => {
        setCurrentMusic(music);
        setProgress(0);
    };

    const handleTogglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleProgressChange = (event, newValue) => {
        if (audioRef.current) {
            audioRef.current.currentTime = (newValue / 100) * audioRef.current.duration;
            setProgress(newValue);
        }
    };

    const formatTime = (time) => {
        if (!time || isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    return (
        <>
        {/* <Musics/> */}
        <Box sx={{ textAlign: "center", mt: 5 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#2E7D32", mb: 3 }}>
                🎵 Browse Your Music Collection
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4 }}>
                <IconButton 
                    onClick={() => setView('grid')} 
                    sx={{ bgcolor: view === 'grid' ? "#2E7D32" : "white", color: view === 'grid' ? "white" : "#2E7D32" }}
                >
                    <GridViewIcon />
                </IconButton>
                <IconButton 
                    onClick={() => setView('list')} 
                    sx={{ bgcolor: view === 'list' ? "#2E7D32" : "white", color: view === 'list' ? "white" : "#2E7D32" }}
                >
                    <ViewListIcon />
                </IconButton>
            </Box>

            <AnimatePresence mode="wait">
                {view === 'grid' && (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                        className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6 mx-auto px-5"
                    >
                        {musicData.map((music) => (
                            <motion.div 
                                key={music.id} 
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card 
                                    className="w-full cursor-pointer rounded-lg"
                                    onClick={() => handlePlayMusic(music)}
                                    sx={{ p: 2, bgcolor: "#2E7D32", color: "white" }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={music.thumbnail}
                                        alt={music.title}
                                        sx={{ height: 180, borderRadius: 2 }}
                                    />
                                    <Typography 
                                        variant="h6" 
                                        sx={{ textAlign: "center", mt: 2, fontWeight: "bold", color: "white" }}
                                    >
                                        {music.title}
                                    </Typography>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Music Player */}
            <AnimatePresence>
                {currentMusic && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ duration: 0.5 }}
                        style={{
                            position: "fixed",
                            bottom: 0,
                            left: 0,
                            width: "100%",
                            backgroundColor: "green",
                            color: "white",
                            padding: "15px",
                            boxShadow: "0px -5px 10px rgba(0,0,0,0.2)",
                            borderTopLeftRadius: "15px",
                            borderTopRightRadius: "15px"
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <img
                                    src={currentMusic.thumbnail}
                                    alt={currentMusic.title}
                                    style={{ width: 50, height: 50, borderRadius: "8px" }}
                                />
                                <Typography variant="h6">{currentMusic.title}</Typography>
                            </Box>

                            <IconButton onClick={handleTogglePlay} sx={{ color: "white" }}>
                                {isPlaying ? <PauseIcon sx={{ fontSize: 40 }} /> : <PlayArrowIcon sx={{ fontSize: 40 }} />}
                            </IconButton>

                            <IconButton onClick={() => setCurrentMusic(null)} sx={{ color: "white" }}>
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        {/* Progress Bar */}
                        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                            <Typography sx={{ fontSize: "14px", color: "white" }}>{formatTime(audioRef.current?.currentTime)}</Typography>
                            <Slider value={progress} onChange={handleProgressChange} sx={{ color: "white", mx: 2 }} />
                            <Typography sx={{ fontSize: "14px", color: "white" }}>{formatTime(duration)}</Typography>
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>
        </Box>
        </>
    );
};

export default MusicPage;

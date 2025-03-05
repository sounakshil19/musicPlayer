import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';
import { useAudio } from '../Context/MusicProvider';
import { Button, Input, Paper, Typography, Box, CircularProgress, Card } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import jsmediatags from "jsmediatags/dist/jsmediatags.min.js";
import { motion } from "framer-motion";
import MusicPage from './MusicPage';

const Musics = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [musicPreview, setMusicPreview] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false); 
    const { addmusic } = useAudio();

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file && file.type.startsWith("audio/")) {
            setMusicPreview(URL.createObjectURL(file));
            setValue("musicFile", file, { shouldValidate: true });
            setValue("musicName", file.name.split(".")[0]);

            setLoading(true);
            jsmediatags.read(file, {
                onSuccess: (tag) => {
                    const picture = tag.tags.picture;
                    if (picture) {
                        const base64String = picture.data.map((byte) => String.fromCharCode(byte)).join("");
                        const imageUrl = `data:${picture.format};base64,${btoa(base64String)}`;
                        setImagePreview(imageUrl);
                    } else {
                        setImagePreview("https://i.pinimg.com/736x/26/30/35/263035ac32db539bde41ed51f766ea18.jpg");
                    }
                    setLoading(false);
                },
                onError: () => {
                    setImagePreview("https://i.pinimg.com/736x/26/30/35/263035ac32db539bde41ed51f766ea18.jpg");
                    setLoading(false);
                },
            });
        } else {
            alert("Please upload a valid music file.");
            setMusicPreview(null);
            setImagePreview(null);
            setValue("musicFile", null);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'audio/*' });

    const onSubmit = (data) => {
        setLoading(true);
        setTimeout(() => {
            const uploadmusic = {
                id: uuidv4(),
                url: URL.createObjectURL(data.musicFile),
                thumbnail: imagePreview || "https://i.pinimg.com/736x/26/30/35/263035ac32db539bde41ed51f766ea18.jpg",
                title: data.musicName,
            };
            addmusic(uploadmusic);
            navigate("/musicpage");
            setLoading(false);
            setIsOpen(false); 
        }, 1500);
    };

    return (
        <>
        <Box sx={{ textAlign: "center", mt: 5 }}>
        
            <Button 
                variant="contained" 
                sx={{ bgcolor: "green", fontSize: "16px", fontWeight: "bold", px: 4, py: 1 }}
                onClick={() => setIsOpen(true)}
            >
                Upload Here
            </Button>

            {/* Animated Card */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Card sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 4, bgcolor: "green", borderRadius: 3, boxShadow: 4 }}>
                        <Typography variant="h5" sx={{ textAlign: "center", color: "white", fontWeight: "bold", mb: 3 }}>
                            🎵 Upload & Edit Your Music
                        </Typography>

                        <Paper component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 4, borderRadius: 3, bgcolor: "rgb(74, 217, 117)", boxShadow: 2 }}>
                            
                            {/* Rectangle Dropzone Box */}
                            <div
                                {...getRootProps()}
                                style={{
                                    width: "100%",
                                    height: "180px",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    border: "3px dashed rgb(28, 210, 25)",
                                    borderRadius: "12px",
                                    backgroundColor: isDragActive ? "#e3f2fd" : "white",
                                    transition: "all 0.3s ease",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                <input {...getInputProps()} />
                                <CloudUploadIcon sx={{ fontSize: 60, color: "#1976d2" }} />
                                <Typography variant="h6" sx={{ mt: 1, color: "#1976d2", fontWeight: "bold" }}>
                                    {isDragActive ? 'Drop your music here' : 'Drag & drop or click to select'}
                                </Typography>
                            </div>

                            {/* Thumbnail Preview */}
                            {imagePreview && (
                                <Box sx={{ textAlign: "center", mt: 3 }}>
                                    <Typography variant="h6">Thumbnail Preview:</Typography>
                                    <motion.img
                                        src={imagePreview}
                                        alt="Thumbnail Preview"
                                        style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "8px" }}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </Box>
                            )}

                            {/* Music Name Input */}
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="h6" sx={{color:"white"}}
                                >Edit Music Name:</Typography>
                                <Input
                                    type="text"
                                    {...register("musicName")}
                                    sx={{
                                        width: "100%",
                                        mt: 1,
                                        p: 1,
                                        borderRadius: "8px",
                                        border: "2px solid red",
                                        fontSize: "16px",
                                        bgcolor: "white",
                                        color:"orange"
                                    }}
                                />
                            </Box>

                            {/* Buttons */}
                            <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
                                <Button type="submit" variant="contained" sx={{ bgcolor: "green",color: "white", px: 3 }}>
                                    {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Upload"}
                                </Button>
                                <Button variant="outlined"  sx={{bgcolor:"red",color:"white"}} onClick={() => setIsOpen(false)}>
                                    Cancel
                                </Button>
                            </Box>
                        </Paper>
                    </Card>
                </motion.div>
            )}
        </Box>
        <MusicPage/>
        </>
    );
};

export default Musics;

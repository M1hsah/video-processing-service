// Google Cloud Service Interactions
import { Storage } from "@google-cloud/storage";
import fs from 'fs';
import ffmpeg from "fluent-ffmpeg";

const storage = new Storage();

const rawVideoBucketName = "hkb-yt-raw-videos";
const processedVideoBucketName = "hkb-yt-processed-videos"

const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";

// Create Local directories for raw and processed videos
export function setupDirectories(){
    ensureDirectoryExistence(localRawVideoPath);
    ensureDirectoryExistence(localProcessedVideoPath);
}

export function convertVideo(rawVideoName: string, processedVideoName: string){
    return new Promise<void>((resolve,reject) => {
        ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
        .outputOptions('-vf', 'scale=-1:360') // 360p
        .on('end', function() {
            console.log('Processing finished successfully');
            resolve();
        })
        .on('error', function(err: any) {
            console.log('An error occurred: ' + err.message);
            reject(err);
        })
        .save(`${localProcessedVideoPath}/${processedVideoName}`);
    })  
}

export async function downloadRawVideo(filename : string){
    await storage.bucket(rawVideoBucketName)
        .file(filename)
        .download({ destination: `${localRawVideoPath}/${filename}`})
    console.log(
        `gs://${rawVideoBucketName}/${filename} downloaded to ${localRawVideoPath}/${filename}.`
    );
}

export async function uploadProcessedVideo(filename: string){
    const bucket = storage.bucket(processedVideoBucketName);

    await bucket.upload(`${localProcessedVideoPath}/${filename}`,{
        destination: filename
    });
    console.log(
        `${localProcessedVideoPath}/${filename} uploaded to gs://${processedVideoBucketName}/${filename}.`
      );
    await bucket.file(filename).makePublic();
}

export function deleteRawVideo(filename: string){
    return deleteFile(`${localRawVideoPath}/${filename}`)
}

export function deleteProcessedVideo(filename: string){
    return deleteFile(`${localProcessedVideoPath}/${filename}`)
}

function deleteFile(filePath: string): Promise<void>{
    return new Promise((resolve,reject)=>{
        if (fs.existsSync(filePath)){
            fs.unlink(filePath, (err) =>{
                if (err){
                    console.log(`Failed to delete file at ${filePath}`, err);
                    reject(err);
                }
                else{
                    console.log(`File deleted at ${filePath}`);
                    resolve();
                }
            })
        }
        else{
            console.log(`File not found at ${filePath},skipping the delete`)
            resolve();
        }
    })
}

function ensureDirectoryExistence(dirPath: string){
    if (!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath, {recursive: true});
        console.log(`Directory create at ${dirPath}`);
    }
}
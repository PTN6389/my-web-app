const { S3Client, ListObjectsV2Command, PutObjectCommand } = require('@aws-sdk/client-s3');
const express = require('express');
const fs = require('fs');
const fileupload = require('express-fileupload');

const app = express();

const s3Client = new S3Client({
    region: 'us-east-2'
});

const listObjectsParams = {
    Bucket: 'myflix-client-aws-images'
}

listObjectsCmd = new ListObjectsV2Command(listObjectsParams);

s3Client.send(listObjectsCmd)

//endpoint in Express to list objects from s3 bucket
app.get('/images', (req, res) => {
    listObjectsParams = {
        Bucket: 'myflix-client-aws-images'
    }
    s3Client.send(new ListObjectsV2Command(listObjectsParams))
    .then((listObjectsResponse) => {
        res.send(listObjectsResponse)
    })
})

//endpoint in Express to upload file using the Node.js fs module
app.post('/images', (req, res) => {
    const file = req.files.image 
    const fileName = req.files.image.name 
    const tempPath = `${UPLOAD_TEMP_PATH}/${fileName}`
    file.mv(tempPath, (err) => { res.status(500) })
})

const params = {
    Bucket: 'myflix-client-aws-images',
    Key: 'cinema.jpg'
}

const run = async () => {
    try {
        const results = await s3Client.send(new PutObjectCommand(params));
        console.log('Successfully uploaded');
        return results;
    } catch (err) {
        console.log('Error', err);
    }  
};

run();


